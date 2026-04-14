"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleCheckout() {
    const reportId = sessionStorage.getItem("reportId");
    if (!reportId) {
      router.push("/");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed.");
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-8 px-6">
      {/* Price */}
      <div className="w-full text-center">
        <p className="font-heading text-6xl tracking-tight text-foreground">
          $10
        </p>
        <p className="mt-2 text-[13px] text-muted-foreground">
          One-time payment &middot; Not a subscription
        </p>
      </div>

      {/* Features */}
      <div className="w-full space-y-3">
        {[
          "Removed from all brokers found",
          "Full deletion proof report emailed",
          "Deletion starts within 60 seconds",
          "No account or password needed",
          "Your data is never stored",
        ].map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal/10">
              <svg className="h-3 w-3 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-[14px] text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>

      {error && <p className="text-center text-sm text-danger">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-xl bg-teal py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-teal-dark disabled:opacity-50"
      >
        {loading ? "Redirecting..." : "Pay with Stripe"}
      </button>

      <p className="text-center text-[12px] text-muted-foreground/60">
        Powered by Stripe &middot; Card details never touch our servers
      </p>
    </div>
  );
}
