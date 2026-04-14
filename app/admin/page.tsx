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
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6">
        <h1 className="font-heading text-2xl tracking-tight">Admin</h1>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Secret key"
          className="w-64 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-muted-foreground/40"
        />
        <button
          onClick={() => setAuthed(true)}
          className="rounded-xl bg-teal px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-teal-dark"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-danger">{error}</p>
      </div>
    );
  }

  function statusDot(rate: number, lastSuccess: string | null) {
    if (!lastSuccess) return { color: "bg-muted-foreground/30", label: "No data" };
    const hoursSinceSuccess =
      (Date.now() - new Date(lastSuccess).getTime()) / (1000 * 60 * 60);
    if (hoursSinceSuccess > 48) return { color: "bg-danger", label: "Stale" };
    if (rate >= 95) return { color: "bg-teal", label: "Healthy" };
    if (rate >= 80) return { color: "bg-warning", label: "Degraded" };
    return { color: "bg-danger", label: "Failing" };
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-8 font-heading text-2xl tracking-tight">Broker Health</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left font-normal text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-left font-normal text-muted-foreground">Broker</th>
              <th className="px-5 py-3 text-left font-normal text-muted-foreground">7d Rate</th>
              <th className="px-5 py-3 text-left font-normal text-muted-foreground">Runs</th>
              <th className="px-5 py-3 text-left font-normal text-muted-foreground">Last OK</th>
              <th className="px-5 py-3 text-left font-normal text-muted-foreground">Last Fail</th>
            </tr>
          </thead>
          <tbody>
            {data.map((broker) => {
              const s = statusDot(broker.successRate, broker.lastSuccess);
              return (
                <tr key={broker.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50">
                  <td className="px-5 py-3" title={s.label}>
                    <span className={`inline-block h-2 w-2 rounded-full ${s.color}`} />
                  </td>
                  <td className="px-5 py-3 text-foreground">{broker.name}</td>
                  <td className="px-5 py-3 text-foreground">{broker.successRate}%</td>
                  <td className="px-5 py-3 text-muted-foreground">{broker.total}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {broker.lastSuccess
                      ? new Date(broker.lastSuccess).toLocaleString()
                      : "\u2014"}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {broker.lastFailure
                      ? new Date(broker.lastFailure).toLocaleString()
                      : "\u2014"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[12px] text-muted-foreground/50">
        Auto-refreshes every 60s
      </p>
    </div>
  );
}
