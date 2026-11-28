/**
 * Older Stripe webhook for the Prompt Vault, Layoff Survival Kit and shop products.
 * Delivery now goes through Brevo (src/lib/purchase-emails.ts), the same as /api/stripe.
 *
 * Prefer pointing Stripe at /api/stripe only: it handles these products and Land and Level Up.
 * Each Stripe endpoint has its own signing secret, so two endpoints can't share STRIPE_WEBHOOK_SECRET.
 * If you keep this one, give it STRIPE_VAULT_WEBHOOK_SECRET. Sending twice is safe: Brevo remembers
 * which orders were emailed.
 */
import type { APIRoute } from "astro";
import { serverEnv } from "../../../lib/server-env";
import Stripe from "stripe";
import { orderFromSession, deliverPurchase } from "../../../lib/purchase-emails";

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export const POST: APIRoute = async ({ request }) => {
  const env = serverEnv();
  const stripeKey = env.STRIPE_SECRET_KEY;
  const webhookSecret = env.STRIPE_VAULT_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) return json({ error: "Stripe not configured" }, 500);

  const sig = request.headers.get("stripe-signature");
  if (!sig) return json({ error: "No signature" }, 400);

  const stripe = new Stripe(stripeKey);
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return json({ error: "Invalid signature" }, 400);
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      const order = await orderFromSession(session as never, env);
      if (order) {
        const result = await deliverPurchase(env, order, { record: true });
        if (result === "failed") return json({ error: "email failed, retry" }, 500);
        return json({ received: true, delivery: result });
      }
    }
  }
  return json({ received: true });
};
