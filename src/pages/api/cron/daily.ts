/**
 * Daily job at 7:30 a.m. ET (Vercel Cron, see vercel.json): Izzy's sales briefs for
 * tomorrow's calls, the lead's day-before and morning-of emails, and the follow-ups after calls.
 * Vercel sends "Authorization: Bearer <CRON_SECRET>" automatically when CRON_SECRET is set.
 */
import type { APIRoute } from 'astro';
import { brevo } from '../../../lib/brevo-api.js';
import { dueSteps } from '../../../lib/call-flow.js';
import { runSteps, checkoutFromEnv } from '../../../lib/call-runner.js';

export const prerender = false;

const env = import.meta.env;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

async function calls() {
  const listId = Number(env.BREVO_CALL_LIST_ID) || 0;
  if (!env.BREVO_API_KEY || !listId) return { error: 'BREVO_API_KEY or BREVO_CALL_LIST_ID not set' };
  const api = brevo(env.BREVO_API_KEY);
  const now = new Date();
  const results: Record<string, string[]> = {};
  for (const c of await api.listContacts(listId)) {
    const a = c.attributes || {};
    if (!a.CALL_AT || a.CALL_OUTCOME === 'canceled') continue;
    const callAt = new Date(String(a.CALL_AT));
    if (Number.isNaN(callAt.getTime())) continue;
    const sent = String(a.CALL_EMAILS_SENT || '').split(',').filter(Boolean);
    const steps = dueSteps(callAt, now, sent, String(a.CALL_OUTCOME || ''));
    if (!steps.length) continue;
    results[c.email] = await runSteps(
      { apiKey: env.BREVO_API_KEY, notifyTo: env.BOOK_CALL_NOTIFY_EMAIL || 'izzy@joinclearcareer.com', checkout: checkoutFromEnv(env) },
      c,
      steps,
    );
  }
  return { sent: results };
}

export const GET: APIRoute = async ({ request }) => {
  const secret = env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) return json({ error: 'unauthorised' }, 401);
  try {
    return json(await calls());
  } catch (err) {
    console.error('cron error:', err);
    return json({ error: 'failed' }, 500);
  }
};
