import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  try {
    const stripe = new Stripe(stripeKey);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "The Career Prompt Vault",
              description:
                "50 AI career frameworks + setup guide + 3 bonus resources. Lifetime access.",
            },
            unit_amount: 900, // $9.00
            tax_behavior: "exclusive" as const,
          },
          quantity: 1,
        },
      ],
      metadata: { product: "nova" },
      return_url: `${baseUrl}/tools/career-prompt-vault/access?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err: any) {
    console.error("Stripe checkout error:", err.message);
    return NextResponse.json(
      { error: err.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
