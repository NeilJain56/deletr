import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";

const schema = z.object({
  reportId: z.string().uuid(),
  plan: z.enum(["individual", "family"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { reportId, plan } = parsed.data;
    const priceId =
      plan === "individual"
        ? process.env.STRIPE_PRICE_INDIVIDUAL!
        : process.env.STRIPE_PRICE_FAMILY!;

    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { reportId, plan },
      success_url: `${APP_URL}/progress/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
