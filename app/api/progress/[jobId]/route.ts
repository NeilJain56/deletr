import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import type { DeletionJob } from "@/types/job";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  // If jobId looks like a Stripe checkout session, resolve to actual jobId
  let actualJobId = jobId;
  if (jobId.startsWith("cs_")) {
    const mapped = await redis.get<string>(`checkout-job:${jobId}`);
    if (!mapped) {
      return NextResponse.json(
        { error: "Job not found. Payment may still be processing." },
        { status: 404 }
      );
    }
    actualJobId = mapped;
  }

  const job = await redis.get<DeletionJob | string>(`job:${actualJobId}`);
  if (!job) {
    return NextResponse.json(
      { error: "Job not found." },
      { status: 404 }
    );
  }

  const parsed: DeletionJob = typeof job === "string" ? JSON.parse(job) : job;
  return NextResponse.json({ jobId: actualJobId, ...parsed });
}
