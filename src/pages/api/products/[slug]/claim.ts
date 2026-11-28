/**
 * Free products (price 0, not hidden): POST { firstName, email, consent, website } and get the
 * access link right away, plus the same link by email (Brevo).
 *
 * Consent follows src/lib/consent.ts: the free product is sent either way; only an explicit
 * `consent: true` (an unticked box the person ticked) adds them to the nurture list, and we record
 * exactly what they agreed to. `website` is a honeypot: bots fill it, people don't.
 */
import type { APIRoute } from 'astro';
import { PRODUCTS } from '../../../../data/product-config';
import { serverEnv } from '../../../../lib/server-env';
import { brevo } from '../../../../lib/brevo-api';
import { productLink, deliverPurchase } from '../../../../lib/purchase-emails';
import { CONSENT_TEXT, CONSENT_VERSION } from '../../../../lib/consent';

export const prerender = false;

/** Brevo list for free downloads (the same one the other lead magnets use). */
const RESOURCE_LIST_ID = 3;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ params, request, url }) => {
  const slug = String(params.slug || '');
  const product = PRODUCTS[slug];
  if (!product || product.price !== 0 || product.hidden || product.retired) return json({ error: 'Not found' }, 404);

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }
  if (body.website) return json({ ok: true }); // honeypot

  const email = String(body.email || '').trim().toLowerCase();
  const firstName = String(body.firstName || '').trim().slice(0, 60);
  const consent = body.consent === true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return json({ error: 'Please enter a valid email address.' }, 400);

  const env = serverEnv();
  const origin = env.PUBLIC_SITE_ORIGIN || url.origin;
  const link = await productLink(slug, email, env, origin);

  if (env.BREVO_API_KEY) {
    const nurture = Number(env.BREVO_NURTURE_LIST_ID) || 0;
    const attributes: Record<string, unknown> = {
      ...(firstName ? { FIRSTNAME: firstName } : {}),
      SOURCE: slug,
      MARKETING_CONSENT: consent,
      ...(consent ? { CONSENT_DATE: new Date().toISOString(), CONSENT_SOURCE: slug, CONSENT_VERSION, CONSENT_WORDING: CONSENT_TEXT } : {}),
    };
    await brevo(env.BREVO_API_KEY).upsert(email, attributes, consent && nurture ? [RESOURCE_LIST_ID, nurture] : [RESOURCE_LIST_ID]);
    // The email with their link. Not "recorded" as a purchase, so free claims never land on the Customers list.
    await deliverPurchase(
      env,
      { ref: `claim:${slug}:${email}`, email, firstName: firstName || undefined, lines: [{ product: slug, amount: 0, url: link }], subtotal: 0, tax: 0, total: 0 },
      { record: false },
    );
  }
  return json({ ok: true, url: link });
};
