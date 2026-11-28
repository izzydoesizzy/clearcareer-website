/**
 * The $9 product funnel, in Stripe test mode only (STRIPE_FUNNEL_TEST_SECRET_KEY, sk_/rk_test_).
 *
 *   1. Offer page with the order box: Prompt Vault $9, optional Salary Number Generator +$9,
 *      paid in an embedded Stripe Checkout on the same page (card, wallets, Link; tax; card saved).
 *   2. Upsell: upgrade to the Complete Job Search Toolkit ($49 minus what they paid), one click on the
 *      saved card (tax added, 3D Secure finished on the page). If they say no, a downsell: the $19
 *      Outreach and Email Templates, same one click.
 *   3. Done: every item with an "Open it now" link, the Brevo email, then Land and Level Up and the form.
 *
 * Nothing here can touch live Stripe: every check refuses livemode objects.
 */
import Stripe from "stripe";
import { isPreviewHost } from "./access";
import { serverEnv } from "./server-env";

export const COOKIE = "cc_funnel_sandbox";
export const FLOW = "career-funnel-sandbox-v3";

export const FUNNEL = {
  main: { product: "vault", name: "Career Prompt Vault", amount: 900 },
  bump: { product: "salary-generator", name: "Salary Number Generator", amount: 900 },
  /** Upsell: the whole toolkit, minus what they've already paid. */
  upsell: { product: "complete-toolkit", name: "Complete Job Search Toolkit", amount: 4900 },
  /** If they say no to the toolkit: just the outreach templates. */
  downsell: { product: "outreach-templates", name: "Outreach and Email Templates", amount: 1900 },
} as const;

export type Offer = "upsell" | "downsell";

export const cartSubtotal = (bump: boolean) => FUNNEL.main.amount + (bump ? FUNNEL.bump.amount : 0);

/** What the toolkit upgrade costs after what they paid at checkout (the Vault, and the add-on if taken). */
export const upgradePrice = (bump: boolean) => FUNNEL.upsell.amount - cartSubtotal(bump);

export const offerAmount = (offer: Offer, bump: boolean) => (offer === "upsell" ? upgradePrice(bump) : FUNNEL.downsell.amount);

export const format = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 2 }).format(n / 100);

type Env = Record<string, string | undefined>;
const ENV: Env = serverEnv();

export function sandbox(env: Env = ENV) {
  const secret = env.STRIPE_FUNNEL_TEST_SECRET_KEY || "";
  return /^(sk|rk)_test_/.test(secret) ? new Stripe(secret) : null;
}

/** Test publishable key for the embedded checkout. Without it, the funnel falls back to Stripe's hosted page. */
export function publishableKey(env: Env = ENV): string | null {
  const pk = env.STRIPE_FUNNEL_TEST_PUBLISHABLE_KEY || env.PUBLIC_STRIPE_FUNNEL_TEST_PUBLISHABLE_KEY || "";
  return /^pk_test_/.test(pk) ? pk : null;
}

export const allowedOrigin = isPreviewHost;

/** Same-origin JSON only, from a preview deployment. */
export function guard(request: Request, url: URL): boolean {
  const site = request.headers.get("sec-fetch-site");
  return (
    allowedOrigin(url) &&
    request.headers.get("origin") === url.origin &&
    (!site || site === "same-origin") &&
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() === "application/json"
  );
}

export const id = (v: string | { id: string } | null | undefined) => (typeof v === "string" ? v : v?.id);

type Address = Stripe.Address | null | undefined;
const addr = (a: Address) =>
  a?.country
    ? {
        country: a.country,
        ...(a.postal_code ? { postal_code: a.postal_code } : {}),
        ...(a.state ? { state: a.state } : {}),
        ...(a.city ? { city: a.city } : {}),
        ...(a.line1 ? { line1: a.line1 } : {}),
        ...(a.line2 ? { line2: a.line2 } : {}),
      }
    : null;

/** Tax on a one-click offer, from Stripe Tax, at the buyer's billing address. 0 if Stripe Tax isn't on. */
export async function offerTax(stripe: Stripe, s: Stripe.Checkout.Session, offer: Offer): Promise<{ tax: number; calc?: string }> {
  const bump = s.metadata?.bump === "yes";
  if (s.metadata?.tax !== "auto") return { tax: 0 };
  const address = addr(s.customer_details?.address);
  if (!address) return { tax: 0 };
  try {
    const c = await stripe.tax.calculations.create({
      currency: "cad",
      line_items: [{ amount: offerAmount(offer, bump), reference: FUNNEL[offer].product, tax_behavior: "exclusive" }],
      customer_details: { address, address_source: "billing" },
    });
    return { tax: c.tax_amount_exclusive, calc: c.id || undefined };
  } catch (e) {
    console.error("funnel: tax calculation failed", e);
    return { tax: 0 };
  }
}

export interface FunnelLine { product: string; name: string; amount: number }

export async function state(stripe: Stripe, sessionId: string | undefined) {
  if (!sessionId || !/^cs_test_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  const s = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent.payment_method"] });
  if (
    s.livemode ||
    s.status !== "complete" ||
    s.payment_status !== "paid" ||
    s.metadata?.funnel !== FLOW ||
    s.currency !== "cad" ||
    Date.now() / 1000 - s.created > 86400
  )
    return null;
  const bump = s.metadata.bump === "yes";
  if (s.amount_subtotal !== cartSubtotal(bump)) return null;

  const customer = id(s.customer);
  const pi = s.payment_intent;
  if (!customer || !pi || typeof pi === "string" || pi.livemode || pi.status !== "succeeded" || id(pi.customer) !== customer) return null;
  const pm = pi.payment_method;
  const method = id(pm);
  if (!method) return null;
  const card = typeof pm === "object" && pm ? pm.card : null;
  const cardLabel = card ? `${card.brand === "amex" ? "Amex" : card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} ending in ${card.last4}` : "the card you just used";

  const intents = (await stripe.paymentIntents.list({ customer, limit: 20 })).data.filter(
    (p) => !p.livemode && p.metadata.funnel === FLOW && p.metadata.session === s.id && p.currency === "cad",
  );
  const find = (offer: Offer) => intents.find((p) => p.metadata.stage === offer && p.status !== "canceled");
  const paid = (offer: Offer, p?: Stripe.PaymentIntent) => p?.status === "succeeded" && Number(p.metadata.base) === offerAmount(offer, bump);
  const upsell = find("upsell");
  const downsell = find("downsell");
  const upsellPaid = paid("upsell", upsell);
  const downsellPaid = paid("downsell", downsell);
  const upsellDone = upsellPaid || s.metadata.upsell_skipped === "yes";
  const downsellDone = upsellPaid || downsellPaid || s.metadata.downsell_skipped === "yes";
  /** Which one-click offer is showing now, if any. */
  const offer: Offer | null = !upsellDone ? "upsell" : !downsellDone ? "downsell" : null;
  const current = offer === "upsell" ? upsell : offer === "downsell" ? downsell : undefined;

  const lines: FunnelLine[] = [
    { ...FUNNEL.main },
    ...(bump ? [{ ...FUNNEL.bump }] : []),
    ...(upsellPaid ? [{ product: FUNNEL.upsell.product, name: `${FUNNEL.upsell.name} (upgrade)`, amount: upgradePrice(bump) }] : []),
    ...(downsellPaid ? [{ ...FUNNEL.downsell }] : []),
  ];
  const tax =
    Number(s.total_details?.amount_tax || 0) +
    (upsellPaid ? Number(upsell!.metadata.tax || 0) : 0) +
    (downsellPaid ? Number(downsell!.metadata.tax || 0) : 0);
  const subtotal = lines.reduce((n, l) => n + l.amount, 0);

  const email = String(s.customer_details?.email || "").trim().toLowerCase();
  const name = String(s.customer_details?.name || "").trim();
  return {
    s, bump, customer, method, cardLabel, upsell, downsell, upsellPaid, downsellPaid, upsellDone, downsellDone, offer, current,
    lines, subtotal, tax, total: subtotal + tax,
    email, name, firstName: name.split(/\s+/)[0] || "",
  };
}

export type FunnelState = NonNullable<Awaited<ReturnType<typeof state>>>;
