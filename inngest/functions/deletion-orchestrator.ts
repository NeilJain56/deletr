import { inngest } from "../client";
import { redis } from "@/lib/redis";
import { logBrokerHealth } from "@/lib/monitoring/broker-log";
import type { ExposureReport } from "@/types/scan";
import type { DeletionJob } from "@/types/job";
import type { BrokerRemovalResult } from "@/types/broker";

async function removeBroker(
  brokerId: string,
  brokerName: string,
  jobId: string
): Promise<BrokerRemovalResult> {
  // Mock removal — simulate realistic delay
  const delay = 1000 + Math.random() * 4000;
  await new Promise((r) => setTimeout(r, delay));

  // ~90% success rate for mock
  const success = Math.random() > 0.1;

  if (!success) {
    await logBrokerHealth(brokerId, "failure", "Mock: simulated failure");
    throw new Error(`Failed to remove from ${brokerName}`);
  }

  const result: BrokerRemovalResult = {
    id: brokerId,
    name: brokerName,
    status: "removed",
    timestamp: new Date().toISOString(),
  };

  // Update job progress in Redis
  const jobRaw = await redis.get(`job:${jobId}`);
  if (jobRaw) {
    const jobData: DeletionJob = typeof jobRaw === "string" ? JSON.parse(jobRaw) : jobRaw as DeletionJob;
    jobData.completed += 1;
    jobData.brokers.push(result);
    await redis.set(`job:${jobId}`, JSON.stringify(jobData), { ex: 172800 });
  }

  await logBrokerHealth(brokerId, "success");
  return result;
}

export const deletionOrchestrator = inngest.createFunction(
  {
    id: "deletion-orchestrator",
    concurrency: { limit: 10 },
    triggers: [{ event: "deletr/deletion.requested" }],
  },
  async ({ event, step }) => {
    const { jobId, reportId, customerEmail } = event.data as {
      jobId: string;
      reportId: string;
      plan: string;
      customerEmail: string | null;
    };

    // Get report from Redis
    const reportStr = await step.run("get-report", async () => {
      return await redis.get(`report:${reportId}`) as string | null;
    });

    if (!reportStr) {
      throw new Error(`Report ${reportId} not found`);
    }

    const report: ExposureReport =
      typeof reportStr === "string" ? JSON.parse(reportStr) : reportStr;

    const brokersToRemove = report.brokersFound.filter((b) => b.hasData);

    // Initialize job state
    await step.run("init-job", async () => {
      const job: DeletionJob = {
        status: "running",
        total: brokersToRemove.length,
        completed: 0,
        brokers: [],
      };
      await redis.set(`job:${jobId}`, JSON.stringify(job), { ex: 172800 });
    });

    // Fan out — one step per broker
    const results = await Promise.allSettled(
      brokersToRemove.map((broker) =>
        step.run(`remove-${broker.id}`, async () => {
          return await removeBroker(broker.id, broker.name, jobId);
        })
      )
    );

    const successes = results
      .filter(
        (r): r is PromiseFulfilledResult<BrokerRemovalResult> =>
          r.status === "fulfilled"
      )
      .map((r) => r.value);

    // Finalize job
    await step.run("finalize", async () => {
      const job: DeletionJob = {
        status: "complete",
        total: brokersToRemove.length,
        completed: successes.length,
        brokers: successes,
      };
      await redis.set(`job:${jobId}`, JSON.stringify(job), { ex: 172800 });
    });

    // Generate and email proof report
    if (customerEmail) {
      await step.run("send-proof", async () => {
        const { generateAndEmailProofReport } = await import(
          "@/lib/proof-report"
        );
        await generateAndEmailProofReport(
          jobId,
          successes,
          customerEmail,
          report
        );
      });
    }
  }
);
