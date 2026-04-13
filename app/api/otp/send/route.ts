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
          <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
            <h2 style="color: #1D9E75; font-size: 20px; margin-bottom: 8px;">deletr</h2>
            <p style="color: #555; font-size: 14px;">Your verification code is:</p>
            <p style="font-size: 32px; font-weight: 600; letter-spacing: 4px; color: #1D9E75; margin: 16px 0;">${code}</p>
            <p style="color: #999; font-size: 12px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
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
