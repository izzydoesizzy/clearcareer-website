import type { APIRoute } from "astro";
import Stripe from "stripe";

export const prerender = false;
const site = "https://joinclearcareer.com";
const failure = () => new Response(null, { status: 303, headers: { Location: site + "/career-funnel-preview?checkout=unavailable", "Cache-Control": "no-store" } });

export const POST: APIRoute = async ({ request, url }) => {
  if (url.origin !== site || request.headers.get("origin") !== site) return new Response("Use the production ClearCareer website.", { status: 403 });
  const secret = import.meta.env.STRIPE_SECRET_KEY;
  const priceId = import.meta.env.STRIPE_VAULT_PRICE_ID;
  if (!secret || !priceId) return failure();
  try {
    const stripe = new Stripe(secret);
    const price = await stripe.prices.retrieve(priceId);
    if (!price.livemode || !price.active || price.currency !== "cad" || price.unit_amount !== 900 || price.type !== "one_time") return failure();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { product: "vault", funnel: "career-funnel-v1" },
      success_url: site + "/career-funnel-preview?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: site + "/career-funnel-preview?checkout=cancelled",
    });
    if (!session.livemode || !session.url) return failure();
    return new Response(null, { status: 303, headers: { Location: session.url, "Cache-Control": "no-store" } });
  } catch {
    return failure();
  }
};
