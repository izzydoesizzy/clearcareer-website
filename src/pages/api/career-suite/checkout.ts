import type { APIRoute } from "astro";
import Stripe from "stripe";
import { CAREER_SUITE_PRODUCT, CAREER_SUITE_STRIPE_PRICE_ID } from "../../../data/career-suite";

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export const POST: APIRoute = async ({ url }) => {
  const stripeKey = import.meta.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return json({ error: "Stripe is not configured" }, 500);

  const priceId = import.meta.env.STRIPE_CAREER_SUITE_PRICE_ID || CAREER_SUITE_STRIPE_PRICE_ID;
  if (!priceId) return json({ error: "Career Suite price is not configured" }, 500);

  try {
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      payment_method_types: ["card"],
      // Land and Level Up members get a 100% promo code, so they check out for free.
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { product: CAREER_SUITE_PRODUCT },
      return_url: `${url.origin}/tools/career-suite/access?session_id={CHECKOUT_SESSION_ID}`,
    });
    return json({ clientSecret: session.client_secret });
  } catch (err: any) {
    console.error("Career Suite checkout error:", err.message);
    return json({ error: err.message || "Checkout failed" }, 500);
  }
};
