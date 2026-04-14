"use client";

import type { BrokerRemovalResult } from "@/types/broker";
import { BROKER_LIST } from "@/lib/brokers/constants";

interface Props {
  completedBrokers: BrokerRemovalResult[];
  totalBrokers: number;
}

export function BrokerList({ completedBrokers, totalBrokers }: Props) {
  const completedIds = new Set(completedBrokers.map((b) => b.id));
  const allBrokers = BROKER_LIST.slice(0, Math.max(totalBrokers, BROKER_LIST.length));
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
              className="flex items-center justify-between px-5 py-3"
            >
              <div className="flex items-center gap-3">
                {status === "done" && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal/15">
                    <svg className="h-2.5 w-2.5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                {status === "active" && (
                  <span className="h-4 w-4 rounded-full border border-warning/50 bg-warning/10 animate-pulse" />
                )}
                {status === "queued" && (
                  <span className="h-4 w-4 rounded-full border border-border" />
                )}
                <span className={`text-[14px] ${status === "done" ? "text-foreground" : "text-muted-foreground"}`}>
                  {broker.name}
                </span>
              </div>
              <span className={`text-[12px] ${
                status === "done"
                  ? "text-teal"
                  : status === "active"
                    ? "text-warning"
                    : "text-muted-foreground/50"
              }`}>
                {status === "done" ? "Removed" : status === "active" ? "Removing..." : "Queued"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
