import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { redis } from "@/lib/redis";
import { resend, FROM_EMAIL } from "@/lib/resend";
import twilio from "twilio";

const schema = z.object({
  identifier: z.string().min(1, "Phone number or email is required"),
});

function hashIdentifier(id: string): string {
  return crypto.createHash("sha256").update(id).digest("hex");
}

function isPhone(id: string): boolean {
  const cleaned = id.replace(/[\s\-\(\)]/g, "");
  return /^\+?\d{10,15}$/.test(cleaned);
}

function normalizePhone(id: string): string {
  const cleaned = id.replace(/[\s\-\(\)]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.length === 10) return `+1${cleaned}`;
  return `+${cleaned}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { identifier } = parsed.data;
    const hash = hashIdentifier(identifier);

    // Rate limiting: max 3 per identifier per 10 minutes
    const rateLimitKey = `ratelimit:otp:${hash}`;
    const currentCount = (await redis.get<number>(rateLimitKey)) || 0;
    if (currentCount >= 3) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }
    await redis.incr(rateLimitKey);
    if (currentCount === 0) {
      await redis.expire(rateLimitKey, 600);
    }

    if (isPhone(identifier)) {
      // Use Twilio Verify
      const phone = normalizePhone(identifier);
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );
      await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verifications.create({ to: phone, channel: "sms" });
    } else {
      // Email — generate 6-digit code, store in Redis
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await redis.set(
        `otp:${hash}`,
        JSON.stringify({ code, attempts: 0 }),
        { ex: 600 }
      );
      await resend.emails.send({
        from: FROM_EMAIL,
        to: identifier,
        subject: "Your Deletr verification code",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 420px; margin: 0 auto; padding: 40px 32px; background-color: #0C0C0C; color: #EDEDED;">
            <p style="font-size: 16px; font-weight: 500; margin: 0 0 24px 0; color: #EDEDED;">deletr</p>
            <p style="font-size: 14px; color: #878787; margin: 0 0 16px 0;">Here's your verification code:</p>
            <p style="font-size: 36px; font-weight: 600; letter-spacing: 6px; color: #34D399; margin: 0 0 24px 0;">${code}</p>
            <p style="font-size: 13px; color: #878787; margin: 0 0 8px 0;">This code expires in 10 minutes.</p>
            <p style="font-size: 12px; color: #555; margin: 0;">If you didn't request this code, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #1E1E1E; margin: 32px 0 16px 0;" />
            <p style="font-size: 11px; color: #555; margin: 0;">Deletr &middot; Data broker removal &middot; deletr.vercel.app</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
