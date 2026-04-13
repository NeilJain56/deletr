import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { redis } from "@/lib/redis";
import { scanBrokers, buildExposureReport } from "@/lib/brokers";

const schema = z.object({
  scanToken: z.string().min(1),
  identifier: z.string().min(1),
});

function verifyScanToken(token: string): { sub: string } | null {
  try {
    const [header, payload, signature] = token.split(".");
    const expectedSig = crypto
      .createHmac("sha256", process.env.ADMIN_SECRET_KEY!)
      .update(`${header}.${payload}`)
      .digest("base64url");

    if (signature !== expectedSig) return null;

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;

    return { sub: decoded.sub };
  } catch {
    return null;
  }
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

    const { scanToken, identifier } = parsed.data;

    // Verify token
    const tokenData = verifyScanToken(scanToken);
    if (!tokenData) {
      return NextResponse.json(
        { error: "Invalid or expired scan token." },
        { status: 401 }
      );
    }

    // Consume token (one-time use)
    const tokenKey = `scanToken:${tokenData.sub}`;
    const exists = await redis.get(tokenKey);
    if (!exists) {
      return NextResponse.json(
        { error: "Scan token already used." },
        { status: 401 }
      );
    }
    await redis.del(tokenKey);

    // Scan brokers
    const brokerResults = await scanBrokers(identifier);
    const reportId = crypto.randomUUID();
    const report = buildExposureReport(identifier, brokerResults, reportId);

    // Store report in Redis with 2hr TTL
    await redis.set(`report:${reportId}`, JSON.stringify(report), { ex: 7200 });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Scan failed. Please try again." },
      { status: 500 }
    );
  }
}
