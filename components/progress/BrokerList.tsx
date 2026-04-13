"use client";

import type { BrokerRemovalResult } from "@/types/broker";
import { BROKER_LIST } from "@/lib/brokers/constants";

interface Props {
  completedBrokers: BrokerRemovalResult[];
  totalBrokers: number;
}

export function BrokerList({ completedBrokers, totalBrokers }: Props) {
  const completedIds = new Set(completedBrokers.map((b) => b.id));

  // Show all brokers from the known list, limited to totalBrokers
  const allBrokers = BROKER_LIST.slice(0, Math.max(totalBrokers, BROKER_LIST.length));

  // First completed (in order), then one "in progress", rest queued
  const hasActiveSlot = completedBrokers.length < totalBrokers;
  let activeAssigned = false;

  return (
    <div className="rounded-xl border border-border">
      <div className="divide-y divide-border">
        {allBrokers.map((broker) => {
          const completed = completedIds.has(broker.id);
          let status: "done" | "active" | "queued" = "queued";

          if (completed) {
            status = "done";
          } else if (hasActiveSlot && !activeAssigned) {
            status = "active";
            activeAssigned = true;
          }

          return (
            <div
              key={broker.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {status === "done" && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                {status === "active" && (
                  <span className="h-5 w-5 rounded-full border-2 border-warning bg-warning/20 animate-pulse" />
                )}
                {status === "queued" && (
                  <span className="h-5 w-5 rounded-full border-2 border-border" />
                )}
                <span className="text-sm font-medium">{broker.name}</span>
              </div>
              <span
                className={`text-xs ${
                  status === "done"
                    ? "text-teal"
                    : status === "active"
                      ? "text-warning"
                      : "text-muted-foreground"
                }`}
              >
                {status === "done"
                  ? "Removed"
                  : status === "active"
                    ? "In progress..."
                    : "Queued"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
