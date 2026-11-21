/**
 * Stripe webhook: someone paid.
 *   1. Marks them enrolled in Brevo (stops the sales follow-ups) and adds them to the clients list
 *   2. Creates their Google Drive folder and roster row
 *   3. Sends the welcome email with their private agreement + intake link
 *   4. Emails Izzy
 *
 * Set up (once): Stripe > Developers > Webhooks > Add endpoint
 *   URL: https://www.joinclearcareer.com/api/stripe   (www: the bare domain redirects, and Stripe won't follow it)
 *
 * Only Land and Level Up payment links are handled: they carry metadata product=land-and-level-up
 * and program=group|private. Every other Stripe sale (Prompt Vault, Layoff Survival Kit, invoices) is ignored.
 *   Events: checkout.session.completed, checkout.session.async_payment_succeeded
 *   Then copy the signing secret into Vercel as STRIPE_WEBHOOK_SECRET.
 */
import type { APIRoute } from 'astro';
import { brevo, hmacHex, parseSigHeader, safeEqual } from '../../lib/brevo-api.js';
import { programFromAmount, makeToken } from '../../lib/onboarding.js';
import { PROGRAMS } from '../../lib/book-call.js';
import { getClient, ensureFolder, seatsSold, type ServerEnv } from '../../lib/clients.js';
import { welcomeEmail, enrolmentNotice } from '../../lib/onboarding-emails.js';

export const prerender = false;

const env = import.meta.env as unknown as ServerEnv & { STRIPE_WEBHOOK_SECRET?: string };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  const raw = await request.text();
  const secret = env.STRIPE_WEBHOOK_SECRET;
  const header = request.headers.get('stripe-signature') || '';
  if (!secret || !header) return json({ error: 'unauthorised' }, 401);
  const { t, v1 } = parseSigHeader(header);
  if (!t || Math.abs(Date.now() / 1000 - Number(t)) > 300) return json({ error: 'stale' }, 401);
  const expected = await hmacHex(secret, `${t}.${raw}`);
  if (!v1.some((s) => safeEqual(s, expected))) return json({ error: 'bad signature' }, 401);

  const event = JSON.parse(raw);
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) return json({ ok: true, ignored: event.type });
  const s = event.data?.object || {};
  if (s.metadata?.product !== 'land-and-level-up') return json({ ok: true, ignored: 'not a Land and Level Up purchase' });
  if (s.payment_status !== 'paid') return json({ ok: true, waiting: s.payment_status }); // async methods finish later
  const email = String(s.customer_details?.email || s.customer_email || '').trim().toLowerCase();
  if (!email || !env.BREVO_API_KEY) return json({ ok: true, skipped: 'no email or key' });

  const api = brevo(env.BREVO_API_KEY);
  const existing = await api.getContact(email);
  if (existing?.attributes?.ENROLLED_AT && existing.attributes.STRIPE_SESSION === s.id) return json({ ok: true, duplicate: true });

  const fullName = String(s.customer_details?.name || '').trim();
  const first = String(existing?.attributes?.FIRSTNAME || fullName.split(' ')[0] || '').trim();
  const last = String(existing?.attributes?.LASTNAME || fullName.split(' ').slice(1).join(' ') || '').trim();
  const program = s.metadata?.program === 'private' ? PROGRAMS.private.name : s.metadata?.program === 'group' ? PROGRAMS.group.name : programFromAmount(Number(s.amount_subtotal ?? s.amount_total ?? 0));
  const amount = Math.round(Number(s.amount_total || 0)) / 100;
  const clientsList = Number(env.BREVO_CLIENTS_LIST_ID) || 0;

  await api.upsert(
    email,
    {
      FIRSTNAME: first, LASTNAME: last,
      CALL_OUTCOME: 'enrolled',
      ENROLLED_AT: new Date().toISOString(),
      ENROLLED_AMOUNT: amount,
      ENROLLED_PROGRAM: program,
      STRIPE_SESSION: s.id,
      ONBOARD_SENT: '',
    },
    clientsList ? [clientsList] : [],
  );

  const client = await getClient(env, email);
  let folderUrl = '';
  if (client) {
    try { folderUrl = (await ensureFolder(env, client)).folderUrl; } catch (e) { console.error('folder setup failed:', e); }
  }

  const token = env.ONBOARD_SECRET ? await makeToken(email, env.ONBOARD_SECRET) : '';
  if (token) {
    const w = welcomeEmail({ firstName: first || 'there', program, token });
    await api.send({ to: email, toName: first, subject: w.subject, html: w.html, tags: ['welcome'] });
  } else {
    console.error('ONBOARD_SECRET not set: welcome email not sent');
  }

  const n = enrolmentNotice({ name: `${first} ${last}`.trim() || email, email, program, amount, folderUrl, seats: await seatsSold(env) });
  await api.send({
    to: env.BOOK_CALL_NOTIFY_EMAIL || 'izzy@joinclearcareer.com', senderName: 'ClearCareer Bookings',
    subject: token ? n.subject : `${n.subject} (welcome NOT sent: set ONBOARD_SECRET)`, html: n.html, replyTo: { email }, tags: ['enrolled'],
  });
  return json({ ok: true });
};
