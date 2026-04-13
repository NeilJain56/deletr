import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { redis } from "@/lib/redis";
import { inngest } from "@/inngest/client";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency check
  const idempotencyKey = `stripe-event:${event.id}`;
  const processed = await redis.get(idempotencyKey);
  if (processed) {
    return NextResponse.json({ received: true });
  }
  await redis.set(idempotencyKey, "1", { ex: 86400 });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { reportId, plan } = session.metadata || {};

    if (reportId) {
      const jobId = crypto.randomUUID();

      // Store jobId mapping AND initial job state BEFORE firing Inngest
      // This prevents the race condition where the user's redirect arrives
      // before the job exists in Redis
      await redis.set(`checkout-job:${session.id}`, jobId, { ex: 172800 });
      await redis.set(`job:${jobId}`, JSON.stringify({
        status: "running",
        total: 0,
        completed: 0,
        brokers: [],
      }), { ex: 172800 });

      await inngest.send({
        name: "deletr/deletion.requested",
        data: {
          jobId,
          reportId,
          plan: plan || "individual",
          customerEmail: session.customer_details?.email || null,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
