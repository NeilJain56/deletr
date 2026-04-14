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
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Phone number or email"
          className="w-full rounded-xl border border-border bg-secondary py-4 pl-5 pr-32 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-muted-foreground/40"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-teal px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-teal-dark disabled:opacity-50"
        >
          {loading ? "..." : "Scan free"}
        </button>
      </form>
      {error && (
        <p className="mt-3 text-center text-sm text-danger">{error}</p>
      )}
      <p className="mt-5 text-center text-[13px] text-muted-foreground">
        No account needed &middot; Free scan &middot; Data never stored
      </p>
    </div>
  );
}
