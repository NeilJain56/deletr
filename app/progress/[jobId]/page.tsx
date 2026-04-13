"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import type { DeletionJob } from "@/types/job";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { BrokerList } from "@/components/progress/BrokerList";

interface ProgressData extends DeletionJob {
  jobId: string;
}

export default function ProgressPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const [data, setData] = useState<ProgressData | null>(null);
  const [error, setError] = useState("");
  const startedAt = useRef(Date.now());

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch(`/api/progress/${jobId}`);
      if (!res.ok) {
        // Give the webhook up to 20 seconds to fire before showing error
        const elapsed = Date.now() - startedAt.current;
        if (elapsed > 20000) {
          const err = await res.json();
          setError(err.error || "Failed to load progress.");
        }
        return;
      }
      setError("");
      const json: ProgressData = await res.json();
      setData(json);
    } catch {
      // Silently retry on network errors
    }
  }, [jobId]);

  useEffect(() => {
    fetchProgress();
    const interval = setInterval(fetchProgress, 2000);
    return () => clearInterval(interval);
  }, [fetchProgress]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">{error}</p>
        <p className="text-sm text-muted-foreground">
          If you just completed payment, please wait a moment and refresh.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal border-t-transparent" />
        <p className="text-sm text-muted-foreground">Processing your payment...</p>
      </div>
    );
  }

  const isComplete = data.status === "complete";

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-8 px-4 py-12">
      <div className="text-center">
        {isComplete ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-light">
              <svg className="h-8 w-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-medium">You&apos;ve been deleted.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {data.completed} of {data.total} brokers cleared. We&apos;ll email your full deletion report.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-medium">Deleting your data</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Submitting opt-out requests to data brokers on your behalf
            </p>
          </>
        )}
      </div>

      <ProgressBar completed={data.completed} total={data.total} />

      <p className="text-center text-sm font-medium">
        {data.completed} of {data.total} brokers cleared
      </p>

      <BrokerList
        completedBrokers={data.brokers}
        totalBrokers={data.total}
      />

      {!isComplete && (
        <p className="text-center text-xs text-muted-foreground">
          We&apos;ll email you your full deletion report when complete.
        </p>
      )}
    </div>
  );
}
