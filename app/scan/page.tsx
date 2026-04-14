"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ExposureReport } from "@/types/scan";
import { PrivacyScoreRing } from "@/components/scan/PrivacyScoreRing";
import { ExposureCategories } from "@/components/scan/ExposureCategories";
import { BrokerGrid } from "@/components/scan/BrokerGrid";
import { SpamEstimate } from "@/components/scan/SpamEstimate";

export default function ScanPage() {
  const [report, setReport] = useState<ExposureReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function runScan() {
      const scanToken = sessionStorage.getItem("scanToken");
      const identifier = sessionStorage.getItem("identifier");

      if (!scanToken || !identifier) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scanToken, identifier }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Scan failed.");
          return;
        }

        const data: ExposureReport = await res.json();
        setReport(data);
        sessionStorage.setItem("reportId", data.reportId);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    runScan();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
        <div className="text-center">
          <h2 className="font-heading text-xl">Scanning brokers</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Checking 10+ databases for your information
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6">
        <p className="text-sm text-danger">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-lg bg-secondary px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!report) return null;

  const brokersWithData = report.brokersFound.filter((b) => b.hasData).length;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-16">
      <div className="text-center">
        <p className="mb-2 text-[13px] tracking-wide text-muted-foreground uppercase">
          Exposure report
        </p>
        <h1 className="font-heading text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.1] tracking-[-0.02em]">
          We found your data on {brokersWithData} broker{brokersWithData !== 1 ? "s" : ""}
        </h1>
      </div>

      <div className="mt-2 space-y-4">
        <PrivacyScoreRing score={report.privacyScore} />
        <ExposureCategories categories={report.categories} />
        <BrokerGrid brokers={report.brokersFound} />
        <SpamEstimate estimate={report.spamEstimate} />
      </div>

      <button
        onClick={() => router.push("/checkout")}
        className="mt-4 w-full rounded-xl bg-teal py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-teal-dark"
      >
        Remove all &mdash; $10
      </button>
    </div>
  );
}
