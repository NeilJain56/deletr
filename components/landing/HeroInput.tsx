"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroInput() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      const encodedId = encodeURIComponent(identifier.trim());
      router.push(`/verify?identifier=${encodedId}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Phone number or email address"
          className="flex-1 rounded-full border border-border bg-white px-5 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/20"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="whitespace-nowrap rounded-full bg-teal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
        >
          {loading ? "Sending..." : "Scan free \u2192"}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-danger">{error}</p>
      )}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        No account required &middot; We don&apos;t store your data &middot; Free to scan
      </p>
    </div>
  );
}
