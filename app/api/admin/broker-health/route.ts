import { NextRequest, NextResponse } from "next/server";
import { BROKER_LIST } from "@/lib/brokers/constants";
import { getBrokerHealth } from "@/lib/monitoring/broker-log";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.ADMIN_SECRET_KEY}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const brokers = await Promise.all(
    BROKER_LIST.map(async (broker) => {
      const entries = await getBrokerHealth(broker.id);
      const total = entries.length;
      const successes = entries.filter(
        (e: { status: string }) => e.status === "success"
      ).length;
      const successRate = total > 0 ? Math.round((successes / total) * 100) : 0;

      const lastSuccess =
        entries.find((e: { status: string }) => e.status === "success")
          ?.timestamp || null;
      const lastFailure =
        entries.find((e: { status: string }) => e.status === "failure")
          ?.timestamp || null;

      return {
        id: broker.id,
        name: broker.name,
        successRate,
        total,
        lastSuccess,
        lastFailure,
      };
    })
  );

  return NextResponse.json({ brokers });
}
