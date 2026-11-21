/** GET /api/onboarding/session?session_id=cs_...: after Stripe checkout, hand back the private onboarding link. */
import type { APIRoute } from 'astro';
import { env, json } from '../../../lib/onboarding-api.js';
import { makeToken, onboardingUrl } from '../../../lib/onboarding.js';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('session_id') || '';
  if (!/^cs_[A-Za-z0-9_]+$/.test(id) || !env.STRIPE_SECRET_KEY || !env.ONBOARD_SECRET) return json({ url: null });
  try {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${id}`, { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } });
    if (!r.ok) return json({ url: null });
    const s = (await r.json()) as { payment_status?: string; customer_details?: { email?: string; name?: string } };
    const email = s.customer_details?.email;
    if (s.payment_status !== 'paid' || !email) return json({ url: null, status: s.payment_status });
    return json({ url: onboardingUrl(await makeToken(email, env.ONBOARD_SECRET)), firstName: (s.customer_details?.name || '').split(' ')[0] });
  } catch (e) {
    console.error('session lookup error:', e);
    return json({ url: null });
  }
};
