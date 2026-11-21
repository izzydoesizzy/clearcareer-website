/**
 * Daily just after midnight ET (Vercel Cron, see vercel.json). Once Black Friday ends,
 * rebuilds the site so /land-and-level-up switches to regular prices on its own.
 * Needs VERCEL_DEPLOY_HOOK_URL (Vercel > Project > Settings > Git > Deploy Hooks) and CRON_SECRET.
 */
import type { APIRoute } from 'astro';
import { dealIsLive } from '../../../lib/email/deal.js';

export const prerender = false;

const env = import.meta.env;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

async function deal() {
  if (dealIsLive()) return { deal: 'still live' };
  if (!env.VERCEL_DEPLOY_HOOK_URL) return { deal: 'over, but VERCEL_DEPLOY_HOOK_URL is not set' };
  // Only rebuild if the live page still shows the Black Friday bar.
  const page = await fetch('https://joinclearcareer.com/land-and-level-up').then((r) => (r.ok ? r.text() : '')).catch(() => '');
  if (!page.includes('llu-dealbar')) return { deal: 'over, page already updated' };
  const r = await fetch(env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });
  return { deal: r.ok ? 'over, rebuild started' : `rebuild failed (${r.status})` };
}

export const GET: APIRoute = async ({ request }) => {
  if (!env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${env.CRON_SECRET}`) return json({ error: 'unauthorised' }, 401);
  return json(await deal());
};
