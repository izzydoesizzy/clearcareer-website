import type { APIRoute } from "astro";
import Stripe from "stripe";

export const prerender = false;

export const POST: APIRoute = async ({ url }) => {
  const stripeKey = import.meta.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return new Response(JSON.stringify({ error: "Stripe is not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const stripe = new Stripe(stripeKey);
    const baseUrl = url.origin;

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      // $9 CAD, set here so the charge always matches the page (the old Stripe price was $67).
      line_items: [{ price_data: { currency: "cad", unit_amount: 900, product_data: { name: "Layoff Survival Kit" } }, quantity: 1 }],
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
