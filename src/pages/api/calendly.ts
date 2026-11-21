/**
 * Calendly webhook: runs when someone books, reschedules or cancels.
 *
 * Set up (once): in Calendly, Integrations > Webhooks (paid plan), or with Zapier.
 *   URL: https://www.joinclearcareer.com/api/calendly   (www: the bare domain redirects, and webhooks won't follow it)
 *   Events: invitee.created, invitee.canceled
 * Security: set CALENDLY_WEBHOOK_SIGNING_KEY (Calendly's signing key), or for Zapier set
 * CALL_WEBHOOK_SECRET and add ?key=<that secret> to the URL.
 *
 * Zapier can also post a simple body: { "event": "created" | "canceled", "email", "name", "start_time", "join_url", "reschedule_url" }
 */
import type { APIRoute } from 'astro';
import { brevo, hmacHex, parseSigHeader, safeEqual } from '../../lib/brevo-api.js';
import { dueSteps, torontoDay, type Step } from '../../lib/call-flow.js';
import { runSteps, runnerEnv } from '../../lib/call-runner.js';

export const prerender = false;

const env = import.meta.env;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

async function authorised(request: Request, raw: string): Promise<boolean> {
  const signingKey = env.CALENDLY_WEBHOOK_SIGNING_KEY;
  const header = request.headers.get('calendly-webhook-signature');
  if (signingKey && header) {
    const { t, v1 } = parseSigHeader(header);
    if (!t || !v1.length) return false;
    if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false; // 5 minute replay window
    const expected = await hmacHex(signingKey, `${t}.${raw}`);
    return v1.some((s) => safeEqual(s, expected));
  }
  const secret = env.CALL_WEBHOOK_SECRET;
  const key = new URL(request.url).searchParams.get('key') || '';
  return !!secret && safeEqual(key, secret);
}

export const POST: APIRoute = async ({ request }) => {
  const raw = await request.text();
  if (!(await authorised(request, raw))) return json({ error: 'unauthorised' }, 401);
  if (!env.BREVO_API_KEY) return json({ error: 'BREVO_API_KEY not set' }, 503);

  let body: any;
  try { body = JSON.parse(raw); } catch { return json({ error: 'bad json' }, 400); }

  // Normalise Calendly's payload and the simple Zapier shape.
  const p = body.payload || body;
  const ev = String(body.event || '');
  const event = ev.includes('no_show') || ev.includes('no-show') ? 'no-show' : ev.includes('cancel') ? 'canceled' : 'created';
  let email = String(p.email || '').trim().toLowerCase();
  // Calendly's no-show payload only points at the invitee. Look up their email with an API token.
  if (!email && typeof p.invitee === 'string' && env.CALENDLY_API_TOKEN) {
    const r = await fetch(p.invitee, { headers: { Authorization: `Bearer ${env.CALENDLY_API_TOKEN}` } }).catch(() => null);
    const j: any = r && r.ok ? await r.json() : null;
    email = String(j?.resource?.email || '').trim().toLowerCase();
  }
  const start = p.scheduled_event?.start_time || p.start_time;
  const joinUrl = p.scheduled_event?.location?.join_url || p.join_url || '';
  const rescheduleUrl = p.reschedule_url || '';
  const name = String(p.first_name || p.name || '').split(' ')[0];
  if (!email) return json({ error: 'no email' }, 400);

  const api = brevo(env.BREVO_API_KEY);
  const listId = Number(env.BREVO_CALL_LIST_ID) || 0;

  if (event === 'canceled' || event === 'no-show') {
    // A reschedule sends a cancel and then a new booking. Ignore the cancel half.
    if (event === 'canceled' && p.rescheduled) return json({ ok: true, ignored: 'rescheduled' });
    await api.upsert(email, { CALL_OUTCOME: event });
    const contact = await api.getContact(email);
    const done = contact ? await runSteps(runnerEnv(env), contact, [event === 'canceled' ? 'canceled' : 'noshow']) : [];
    return json({ ok: true, sent: done });
  }

  const callAt = new Date(start);
  if (Number.isNaN(callAt.getTime())) return json({ error: 'no start time' }, 400);

  const existing = await api.getContact(email);
  const wasRescheduled = !!existing?.attributes?.CALL_AT && String(existing.attributes.CALL_AT) !== callAt.toISOString() && !existing.attributes.CALL_OUTCOME;

  await api.upsert(
    email,
    {
      ...(name && !existing?.attributes?.FIRSTNAME ? { FIRSTNAME: name } : {}),
      CALL_AT: callAt.toISOString(),
      CALL_BOOKED_AT: new Date().toISOString().slice(0, 10),
      CALL_JOIN_URL: joinUrl,
      CALL_RESCHEDULE_URL: rescheduleUrl,
      CALL_EMAILS_SENT: '',
      CALL_OUTCOME: '',
    },
    listId ? [listId] : [],
  );

  const contact = (await api.getContact(email)) || { email, attributes: { FIRSTNAME: name, CALL_AT: callAt.toISOString(), CALL_JOIN_URL: joinUrl, CALL_RESCHEDULE_URL: rescheduleUrl } };

  // Booked email now. If the call is today or tomorrow, the daily job may already have run,
  // so send Izzy's brief now too, and skip the lead's day-before and morning emails (the booked one covers it).
  const now = new Date();
  const soon = torontoDay(callAt) - torontoDay(now) <= 1;
  const steps: Step[] = ['booked', ...(soon ? dueSteps(callAt, now, [], '').filter((s) => s === 'brief') : [])];
  const done = await runSteps(runnerEnv(env), contact, steps);
  if (soon) {
    await api.upsert(email, { CALL_EMAILS_SENT: [...new Set([...done, 'daybefore', 'morning'])].join(',') });
  }
  return json({ ok: true, rescheduled: wasRescheduled, sent: done });
};
