/**
 * Daily just after midnight ET (Vercel Cron, see vercel.json). Once Black Friday ends,
 * rebuilds the site so /land-and-level-up switches to regular prices on its own.
 * Also switches off the Black Friday payment links in Stripe (STRIPE_DEAL_LINK_IDS, comma-separated plink_ IDs;
 * the restricted STRIPE_SECRET_KEY needs write access to Payment Links).
 * Needs VERCEL_DEPLOY_HOOK_URL (Vercel > Project > Settings > Git > Deploy Hooks) and CRON_SECRET.
 */
import type { APIRoute } from 'astro';
import { dealIsLive } from '../../../lib/email/deal.js';

export const prerender = false;

const env = import.meta.env;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Turn off the Black Friday payment links so an old link can't be used after the deadline. */
async function closeDealLinks(): Promise<string> {
  const ids = String(env.STRIPE_DEAL_LINK_IDS || '').split(',').map((s) => s.trim()).filter((s) => /^plink_/.test(s));
  if (!ids.length || !env.STRIPE_SECRET_KEY) return 'no Black Friday link IDs or STRIPE_SECRET_KEY set';
  const out: string[] = [];
  for (const id of ids) {
    const r = await fetch(`https://api.stripe.com/v1/payment_links/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'active=false',
    });
    out.push(`${id}: ${r.ok ? 'off' : `failed (${r.status})`}`);
  }
  return out.join(', ');
}

async function deal() {
  if (dealIsLive()) return { deal: 'still live' };
  const links = await closeDealLinks();
  if (!env.VERCEL_DEPLOY_HOOK_URL) return { deal: 'over, but VERCEL_DEPLOY_HOOK_URL is not set', links };
  // Only rebuild if the live page still shows the Black Friday bar.
  const page = await fetch('https://joinclearcareer.com/land-and-level-up').then((r) => (r.ok ? r.text() : '')).catch(() => '');
  if (!page.includes('llu-dealbar')) return { deal: 'over, page already updated', links };
  const r = await fetch(env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });
  return { deal: r.ok ? 'over, rebuild started' : `rebuild failed (${r.status})`, links };
}

export const GET: APIRoute = async ({ request }) => {
  if (!env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${env.CRON_SECRET}`) return json({ error: 'unauthorised' }, 401);
  return json(await deal());
};
