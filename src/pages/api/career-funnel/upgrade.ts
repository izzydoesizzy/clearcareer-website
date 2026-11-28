import type { APIRoute } from "astro";
import { sandbox, publishableKey, guard, state, offerTax, offerAmount, FUNNEL, COOKIE, FLOW, type Offer } from "../../../lib/career-funnel-test";

export const prerender = false;

const out = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const next = (reason = "") => out({ next: "/career-funnel-preview" + (reason ? "?notice=" + reason : "") });

/**
 * The one-click offers. Choices:
 *   buy       charge the saved card for the offer showing now (toolkit upgrade, then the downsell),
 *             tax added. If the bank asks for 3D Secure, returns { action, publishableKey } and the
 *             page finishes it.
 *   confirm   after 3D Secure: check the payment and record the tax.
 *   skip      no thanks (the toolkit skip leads to the downsell; the downsell skip to the downloads)
 *   restart   forget this test purchase
 */
export const POST: APIRoute = async ({ request, url, cookies }) => {
  if (!guard(request, url)) return new Response("Preview only", { status: 403 });
  const stripe = sandbox();
  if (!stripe) return next("unavailable");
  try {
    const choice = String((await request.json()).choice || "");
    if (choice === "restart") {
      cookies.delete(COOKIE, { path: "/" });
      return next();
    }
    const x = await state(stripe, cookies.get(COOKIE)?.value);
    if (!x) return next("unavailable");
    const offer: Offer | null = x.offer;
    if (!offer) return next();
    const pi0 = x.current;

    const recordTax = async (pi: { id: string; metadata: Record<string, string> }) => {
      if (!pi.metadata.tax_calc || pi.metadata.tax_recorded === "yes") return;
      try {
        await stripe.tax.transactions.createFromCalculation({ calculation: pi.metadata.tax_calc, reference: pi.id });
        await stripe.paymentIntents.update(pi.id, { metadata: { tax_recorded: "yes" } });
      } catch (e) {
        console.error("funnel: tax transaction failed", e);
      }
    };

    if (choice === "skip") {
      if (pi0 && pi0.status !== "succeeded" && pi0.status !== "processing") await stripe.paymentIntents.cancel(pi0.id);
      await stripe.checkout.sessions.update(x.s.id, { metadata: offer === "upsell" ? { upsell_skipped: "yes" } : { downsell_skipped: "yes" } });
      return next();
    }

    if (choice === "confirm") {
      if (!pi0) return next("payment-failed");
      if (pi0.status === "succeeded") { await recordTax(pi0); return next(); }
      return next(pi0.status === "processing" ? "pending" : "payment-failed");
    }

    if (choice !== "buy") return next("invalid");

    // Already tried this offer: don't charge again. Pick up where it left off.
    let pi = pi0;
    if (!pi) {
      const base = offerAmount(offer, x.bump);
      const { tax, calc } = await offerTax(stripe, x.s, offer);
      try {
        pi = await stripe.paymentIntents.create(
          {
            amount: base + tax,
            currency: "cad",
            customer: x.customer,
            payment_method: x.method,
            confirm: true,
            automatic_payment_methods: { enabled: true, allow_redirects: "never" },
            description: `${FUNNEL[offer].name}${offer === "upsell" ? " (upgrade)" : ""} (test)`,
            metadata: { funnel: FLOW, session: x.s.id, stage: offer, product: FUNNEL[offer].product, base: String(base), tax: String(tax), tax_calc: calc || "" },
          },
          { idempotencyKey: `${FLOW}:${x.s.id}:${offer}` },
        );
      } catch (e) {
        console.error("funnel: offer charge failed", e instanceof Error ? e.message : e);
        return next("payment-failed");
      }
    }
    if (pi.livemode) return next("unavailable");
    if (pi.status === "succeeded") { await recordTax(pi); return next(); }
    if (pi.status === "requires_action") {
      const pk = publishableKey();
      return pk && pi.client_secret ? out({ action: pi.client_secret, publishableKey: pk }) : next("payment-failed");
    }
    return next(pi.status === "processing" ? "pending" : "payment-failed");
  } catch (e) {
    console.error("funnel: upgrade failed", e);
    return next("payment-failed");
  }
};
