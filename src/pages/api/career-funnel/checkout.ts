import type { APIRoute } from "astro";
import Stripe from "stripe";

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  const site = url.origin;
  const allowed = site === "https://joinclearcareer.com" || (url.protocol === "https:" && /^clearcareer-website-[a-z0-9-]+-izzydoesizzys-projects\.vercel\.app$/.test(url.hostname));
  if (!allowed || request.headers.get("origin") !== site) return new Response("Use the ClearCareer website.", { status: 403 });
  const failure = () => new Response(null, { status: 303, headers: { Location: site + "/career-funnel-preview?checkout=unavailable", "Cache-Control": "no-store" } });
  const secret = import.meta.env.STRIPE_FUNNEL_TEST_SECRET_KEY || import.meta.env.STRIPE_SECRET_KEY || "";
  // Never accept a live key, even if a production environment is configured.
  if (!/^(sk|rk)_test_/.test(secret)) return failure();
  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "cad", unit_amount: 900, product_data: { name: "Career Prompt Vault (sandbox test)" } }, quantity: 1 }],
      metadata: { product: "vault_test", funnel: "career-funnel-v1" },
      success_url: site + "/career-funnel-preview?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: site + "/career-funnel-preview?checkout=cancelled",
    });
    if (session.livemode || !session.url) return failure();
    return new Response(null, { status: 303, headers: { Location: session.url, "Cache-Control": "no-store" } });
  } catch {
    return failure();
  }
};
