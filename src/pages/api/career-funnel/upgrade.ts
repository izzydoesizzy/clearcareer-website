import type { APIRoute } from "astro";
import { sandbox, publishableKey, guard, state, upsellTax, FUNNEL, COOKIE, FLOW } from "../../../lib/career-funnel-test";

export const prerender = false;

const out = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const next = (reason = "") => out({ next: "/career-funnel-preview" + (reason ? "?notice=" + reason : "") });

/**
 * The one-click upsell. Choices:
 *   upsell          charge the saved card for the Script Vault (+ tax). If the bank asks for
 *                   3D Secure, returns { action, publishableKey } and the page finishes it.
 *   upsell-confirm  after 3D Secure: check the payment and record the tax.
 *   skip            no thanks
 *   restart         forget this test purchase
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
    if (x.upsellPaid || x.s.metadata?.upsell_skipped === "yes") return next();

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
      if (x.upsell && x.upsell.status !== "succeeded" && x.upsell.status !== "processing") await stripe.paymentIntents.cancel(x.upsell.id);
      await stripe.checkout.sessions.update(x.s.id, { metadata: { upsell_skipped: "yes" } });
      return next();
    }

    if (choice === "upsell-confirm") {
      if (!x.upsell) return next("payment-failed");
      if (x.upsell.status === "succeeded") { await recordTax(x.upsell); return next(); }
      return next(x.upsell.status === "processing" ? "pending" : "payment-failed");
    }

    if (choice !== "upsell") return next("invalid");

    // Already tried: don't charge again. Pick up where it left off.
    let pi = x.upsell;
    if (!pi) {
      const { tax, calc } = await upsellTax(stripe, x.s);
      try {
        pi = await stripe.paymentIntents.create(
          {
            amount: FUNNEL.upsell.amount + tax,
            currency: "cad",
            customer: x.customer,
            payment_method: x.method,
            confirm: true,
            automatic_payment_methods: { enabled: true, allow_redirects: "never" },
            description: `${FUNNEL.upsell.name} (test)`,
            metadata: { funnel: FLOW, session: x.s.id, stage: "upsell", product: FUNNEL.upsell.product, base: String(FUNNEL.upsell.amount), tax: String(tax), tax_calc: calc || "" },
          },
          { idempotencyKey: `${FLOW}:${x.s.id}:upsell` },
        );
      } catch (e) {
        console.error("funnel: upsell charge failed", e instanceof Error ? e.message : e);
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
