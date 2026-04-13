"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [plan, setPlan] = useState<"individual" | "family">("individual");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    const reportId = sessionStorage.getItem("reportId");
    if (!reportId) {
      router.push("/");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, plan }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  const price = plan === "individual" ? 10 : 25;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-8 px-4">
      <div className="w-full text-center">
        <p className="text-5xl font-medium text-teal">${price}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          One-time payment. Not a subscription.
        </p>
      </div>

      <div className="w-full rounded-xl border border-teal/20 bg-teal-light/50 px-4 py-3 text-center text-sm text-teal-dark">
        Others charge $100&ndash;$200/year. We charge once.
      </div>

      {/* Feature list */}
      <ul className="w-full space-y-3">
        {[
          "Removed from all brokers found",
          "Full deletion proof report emailed",
          "Deletion starts within 60 seconds",
          "No account. No password. No subscription.",
          "Your data is never stored on our servers",
        ].map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Plan toggle */}
      <div className="w-full rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="family"
            checked={plan === "family"}
            onChange={(e) => setPlan(e.target.checked ? "family" : "individual")}
            className="h-4 w-4 rounded accent-teal"
          />
          <label htmlFor="family" className="text-sm">
            <span className="font-medium">Adding family?</span>{" "}
            <span className="text-muted-foreground">
              Up to 4 more people &mdash; $25 total
            </span>
          </label>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-full bg-teal py-4 text-base font-medium text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
      >
        {loading ? "Redirecting to Stripe..." : "Pay with card \u2014 powered by Stripe"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        30-day money-back guarantee &middot; We never see your card details
      </p>
    </div>
  );
}
