import { redis } from "@/lib/redis";

export async function logBrokerHealth(
  brokerId: string,
  status: "success" | "failure",
  reason?: string
) {
  const key = `broker-health:${brokerId}`;
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    status,
    reason,
  });

  await redis.lpush(key, entry);
  await redis.ltrim(key, 0, 99); // keep last 100 entries
}

export async function getBrokerHealth(brokerId: string) {
  const key = `broker-health:${brokerId}`;
  const entries = await redis.lrange(key, 0, -1);
  return entries.map((e) => (typeof e === "string" ? JSON.parse(e) : e));
}
