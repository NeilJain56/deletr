"use client";

import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (
    typeof window === "undefined" ||
    initialized ||
    !process.env.NEXT_PUBLIC_POSTHOG_KEY
  )
    return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: true,
    persistence: "memory", // no cookies — privacy-first
  });

  initialized = true;
}

type EventName =
  | "scan_started"
  | "scan_completed"
  | "checkout_started"
  | "payment_completed"
  | "deletion_completed";

export function track(
  event: EventName,
  properties?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  posthog.capture(event, properties);
}
