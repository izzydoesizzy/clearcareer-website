import type { APIRoute } from "astro";
import Stripe from "stripe";

export const prerender = false;

export const POST: APIRoute = async () => {
  const stripeKey = import.meta.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return new Response(JSON.stringify({ error: "Stripe is not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const stripe = new Stripe(stripeKey);
    const baseUrl = import.meta.env.SITE || "http://localhost:4321";

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "The Layoff Survival Kit (Complete Edition)",
              description:
                "Severance calculator, lawyer directory, 10 guides, negotiation scripts, tax strategies. Lifetime access.",
            },
            unit_amount: 6700,
            tax_behavior: "exclusive" as const,
          },
          quantity: 1,
        },
      ],
      metadata: { product: "layoff-survival-kit" },
      return_url: `${baseUrl}/layoff-survival-kit/access/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Stripe checkout error:", err.message);
    return new Response(JSON.stringify({ error: err.message || "Checkout failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
