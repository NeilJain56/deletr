import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { redis } from "@/lib/redis";
import twilio from "twilio";

const schema = z.object({
  identifier: z.string().min(1),
  code: z.string().length(6),
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

function generateScanToken(hash: string): string {
  const payload = {
    sub: hash,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 1800, // 30 min
  };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", process.env.ADMIN_SECRET_KEY!)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
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

    const { identifier, code } = parsed.data;
    const hash = hashIdentifier(identifier);

    if (isPhone(identifier)) {
      const phone = normalizePhone(identifier);
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );
      const check = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verificationChecks.create({ to: phone, code });

      if (check.status !== "approved") {
        return NextResponse.json(
          { error: "Invalid verification code." },
          { status: 400 }
        );
      }
    } else {
      // Email verification
      const stored = await redis.get<{ code: string; attempts: number }>(`otp:${hash}`);
      if (!stored) {
        return NextResponse.json(
          { error: "Code expired. Please request a new one." },
          { status: 400 }
        );
      }

      if (stored.attempts >= 5) {
        await redis.del(`otp:${hash}`);
        return NextResponse.json(
          { error: "Too many failed attempts. Please request a new code." },
          { status: 400 }
        );
      }

      if (stored.code !== code) {
        await redis.set(
          `otp:${hash}`,
          JSON.stringify({ ...stored, attempts: stored.attempts + 1 }),
          { ex: 600 }
        );
        return NextResponse.json(
          { error: "Invalid verification code." },
          { status: 400 }
        );
      }

      await redis.del(`otp:${hash}`);
    }

    // Generate scan token
    const scanToken = generateScanToken(hash);
    await redis.set(`scanToken:${hash}`, "1", { ex: 1800 });

    return NextResponse.json({ verified: true, scanToken });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
