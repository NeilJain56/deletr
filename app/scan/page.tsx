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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal border-t-transparent" />
        <h2 className="text-lg font-medium">Scanning data brokers...</h2>
        <p className="text-sm text-muted-foreground">
          Checking 10+ databases for your personal information
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-danger">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-teal px-6 py-3 text-sm font-medium text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!report) return null;

  const brokersWithData = report.brokersFound.filter((b) => b.hasData).length;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-medium">Your Exposure Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We found your data on {brokersWithData} broker{brokersWithData !== 1 ? "s" : ""}
        </p>
      </div>

      <PrivacyScoreRing score={report.privacyScore} />
      <ExposureCategories categories={report.categories} />
      <BrokerGrid brokers={report.brokersFound} />
      <SpamEstimate estimate={report.spamEstimate} />

      {/* CTA */}
      <button
        onClick={() => router.push("/checkout")}
        className="w-full rounded-full bg-teal py-4 text-base font-medium text-white transition-colors hover:bg-teal-dark"
      >
        Remove all of this &mdash; $10
      </button>
    </div>
  );
}
