import type { APIRoute } from "astro";
import type Stripe from "stripe";
import { sandbox, publishableKey, guard, FUNNEL, COOKIE, FLOW } from "../../../lib/career-funnel-test";

export const prerender = false;

const out = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Creates the Checkout Session for the order box. Embedded on the page when the test publishable
 * key is set, otherwise Stripe's hosted page. Called again whenever the add-on is ticked or unticked.
 */
export const POST: APIRoute = async ({ request, url, cookies }) => {
  if (!guard(request, url)) return new Response("Preview only", { status: 403 });
  const stripe = sandbox();
  if (!stripe) return out({ error: "Checkout isn't set up on this preview." }, 503);
  try {
    const bump = (await request.json()).bump === true;
    const pk = publishableKey();
    const line = (i: { name: string; amount: number }) => ({
      price_data: { currency: "cad", unit_amount: i.amount, tax_behavior: "exclusive" as const, product_data: { name: i.name } },
      quantity: 1,
    });
    const base: Parameters<Stripe["checkout"]["sessions"]["create"]>[0] = {
      mode: "payment",
      customer_creation: "always",
      billing_address_collection: "required",
      payment_intent_data: { setup_future_usage: "off_session", metadata: { funnel: FLOW } },
      line_items: [line(FUNNEL.main), ...(bump ? [line(FUNNEL.bump)] : [])],
      metadata: { funnel: FLOW, bump: bump ? "yes" : "no" },
      ...(pk
        ? { ui_mode: "embedded_page" as const, return_url: `${url.origin}/career-funnel-preview?paid=1` }
        : { success_url: `${url.origin}/career-funnel-preview?paid=1`, cancel_url: `${url.origin}/career-funnel-preview` }),
    };
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create({ ...base, automatic_tax: { enabled: true }, metadata: { ...base.metadata, tax: "auto" } });
    } catch (e) {
      // Stripe Tax isn't set up on this account yet: sell without tax rather than not at all.
      console.error("funnel: automatic tax unavailable, continuing without tax", e instanceof Error ? e.message : e);
      session = await stripe.checkout.sessions.create({ ...base, metadata: { ...base.metadata, tax: "none" } });
    }
    if (session.livemode) return out({ error: "Refused a live session." }, 500);
    cookies.set(COOKIE, session.id, { path: "/", httpOnly: true, secure: true, sameSite: "lax", maxAge: 86400 });
    return pk && session.client_secret
      ? out({ clientSecret: session.client_secret, publishableKey: pk })
      : out({ next: session.url });
  } catch (e) {
    console.error("funnel: checkout failed", e);
    return out({ error: "Stripe didn't start the checkout. Refresh and try again." }, 502);
  }
};
