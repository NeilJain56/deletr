import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { logBrokerHealth } from "@/lib/monitoring/broker-log";
import type { ExposureReport } from "@/types/scan";
import type { DeletionJob } from "@/types/job";
import type { BrokerRemovalResult } from "@/types/broker";

async function removeBroker(
  brokerId: string,
  brokerName: string
): Promise<BrokerRemovalResult> {
  const delay = 800 + Math.random() * 2000;
  await new Promise((r) => setTimeout(r, delay));

  const success = Math.random() > 0.1;

  if (!success) {
    await logBrokerHealth(brokerId, "failure", "Mock: simulated failure");
    throw new Error(`Failed to remove from ${brokerName}`);
  }

  await logBrokerHealth(brokerId, "success");
  return {
    id: brokerId,
    name: brokerName,
    status: "removed",
    timestamp: new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  try {
    const { jobId, reportId, customerEmail } = await req.json();

    const reportRaw = await redis.get(`report:${reportId}`);
    if (!reportRaw) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const report: ExposureReport =
      typeof reportRaw === "string" ? JSON.parse(reportRaw) : reportRaw;

    const brokersToRemove = report.brokersFound.filter((b) => b.hasData);

    // Initialize job with correct total
    const initialJob: DeletionJob = {
      status: "running",
      total: brokersToRemove.length,
      completed: 0,
      brokers: [],
    };
    await redis.set(`job:${jobId}`, JSON.stringify(initialJob), { ex: 172800 });

    // Process brokers sequentially so progress updates are visible
    const successes: BrokerRemovalResult[] = [];

    for (const broker of brokersToRemove) {
      try {
        const result = await removeBroker(broker.id, broker.name);
        successes.push(result);
      } catch {
        // Silent failure — logged internally
      }

      // Update progress after each broker
      const job: DeletionJob = {
        status: "running",
        total: brokersToRemove.length,
        completed: successes.length,
        brokers: [...successes],
      };
      await redis.set(`job:${jobId}`, JSON.stringify(job), { ex: 172800 });
    }

    // Finalize
    const finalJob: DeletionJob = {
      status: "complete",
      total: brokersToRemove.length,
      completed: successes.length,
      brokers: successes,
    };
    await redis.set(`job:${jobId}`, JSON.stringify(finalJob), { ex: 172800 });

    // Send proof report email if we have an email
    if (customerEmail) {
      try {
        const { generateAndEmailProofReport } = await import("@/lib/proof-report");
        await generateAndEmailProofReport(jobId, successes, customerEmail, report);
      } catch (err) {
        console.error("Failed to send proof report:", err);
      }
    }

    return NextResponse.json({ success: true, completed: successes.length });
  } catch (error) {
    console.error("Deletion error:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
