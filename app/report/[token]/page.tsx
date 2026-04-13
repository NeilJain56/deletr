"use client";

import { useState, useEffect, use } from "react";

export default function ReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUrl() {
      try {
        const res = await fetch(`/api/progress/${token}`);
        if (!res.ok) {
          setError("Report not found or expired.");
          return;
        }
        // The token here is the jobId — fetch the signed URL
        const progressRes = await fetch(`/api/report/${token}`);
        if (progressRes.ok) {
          const data = await progressRes.json();
          setReportUrl(data.url);
        } else {
          setError("Report not available yet. Please check back later.");
        }
      } catch {
        setError("Failed to load report.");
      }
    }
    fetchUrl();
  }, [token]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!reportUrl) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-medium text-teal">deletr</h1>
        <p className="mt-2 text-muted-foreground">Your deletion report is ready.</p>
      </div>
      <a
        href={reportUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-teal px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-dark"
      >
        View Full Report
      </a>
    </div>
  );
}
