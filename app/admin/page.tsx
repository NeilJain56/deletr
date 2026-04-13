"use client";

import { useState, useEffect } from "react";

interface BrokerHealth {
  id: string;
  name: string;
  successRate: number;
  total: number;
  lastSuccess: string | null;
  lastFailure: string | null;
}

export default function AdminPage() {
  const [data, setData] = useState<BrokerHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);

  async function fetchHealth() {
    try {
      const res = await fetch("/api/admin/broker-health", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("Unauthorized");
        return;
      }
      const json = await res.json();
      setData(json.brokers);
      setLoading(false);
    } catch {
      setError("Failed to fetch broker health.");
    }
  }

  useEffect(() => {
    if (!authed) return;
    fetchHealth();
    const interval = setInterval(fetchHealth, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  if (!authed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-xl font-medium">Admin Dashboard</h1>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Admin secret key"
          className="w-64 rounded-lg border border-border px-4 py-2 text-sm"
        />
        <button
          onClick={() => setAuthed(true)}
          className="rounded-full bg-teal px-6 py-2 text-sm font-medium text-white"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  function statusEmoji(rate: number, lastSuccess: string | null) {
    if (!lastSuccess) return { emoji: "\uD83D\uDD34", label: "No data" };
    const hoursSinceSuccess =
      (Date.now() - new Date(lastSuccess).getTime()) / (1000 * 60 * 60);
    if (hoursSinceSuccess > 48)
      return { emoji: "\uD83D\uDD34", label: "Stale (>48h)" };
    if (rate >= 95) return { emoji: "\uD83D\uDFE2", label: "Healthy" };
    if (rate >= 80) return { emoji: "\uD83D\uDFE1", label: "Degraded" };
    return { emoji: "\uD83D\uDD34", label: "Failing" };
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-medium">Broker Health Dashboard</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Broker</th>
              <th className="px-4 py-3 text-left font-medium">7d Success Rate</th>
              <th className="px-4 py-3 text-left font-medium">Total Runs</th>
              <th className="px-4 py-3 text-left font-medium">Last Success</th>
              <th className="px-4 py-3 text-left font-medium">Last Failure</th>
            </tr>
          </thead>
          <tbody>
            {data.map((broker) => {
              const s = statusEmoji(broker.successRate, broker.lastSuccess);
              return (
                <tr key={broker.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3" title={s.label}>
                    {s.emoji}
                  </td>
                  <td className="px-4 py-3 font-medium">{broker.name}</td>
                  <td className="px-4 py-3">{broker.successRate}%</td>
                  <td className="px-4 py-3">{broker.total}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {broker.lastSuccess
                      ? new Date(broker.lastSuccess).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {broker.lastFailure
                      ? new Date(broker.lastFailure).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Auto-refreshes every 60 seconds
      </p>
    </div>
  );
}
