/**
 * Stripe webhook: when someone pays, mark them enrolled in Brevo so the follow-up emails stop.
 * Set up (once): Stripe > Developers > Webhooks > Add endpoint
 *   URL: https://joinclearcareer.com/api/stripe   Event: checkout.session.completed
 *   Then copy the signing secret into Vercel as STRIPE_WEBHOOK_SECRET.
 */
import type { APIRoute } from 'astro';
import { brevo, hmacHex, parseSigHeader, safeEqual } from '../../lib/brevo-api.js';
import { welcomeEmail, welcomeReady } from '../../lib/call-emails.js';

export const prerender = false;

const env = import.meta.env;
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
  if (event.type !== 'checkout.session.completed') return json({ ok: true, ignored: event.type });
  const s = event.data?.object || {};
  const email = String(s.customer_details?.email || s.customer_email || '').toLowerCase();
  if (!email || !env.BREVO_API_KEY) return json({ ok: true, skipped: 'no email or key' });

  const api = brevo(env.BREVO_API_KEY);
  const existing = await api.getContact(email);
  const first = String(existing?.attributes?.FIRSTNAME || s.customer_details?.name || '').split(' ')[0] || 'there';
  const amount = Math.round(Number(s.amount_total || 0)) / 100;
  await api.upsert(email, { CALL_OUTCOME: 'enrolled', ENROLLED_AT: new Date().toISOString().slice(0, 10), ENROLLED_AMOUNT: amount });

  if (welcomeReady()) {
    const w = welcomeEmail({ firstName: first });
    await api.send({ to: email, toName: first, subject: w.subject, html: w.html, tags: ['welcome'] });
  } else {
    await api.send({
      to: env.BOOK_CALL_NOTIFY_EMAIL || 'izzy@joinclearcareer.com', senderName: 'ClearCareer Bookings', tags: ['enrolled'],
      subject: `New enrolment: ${first} (${email}), $${amount}. Send the welcome yourself`,
      html: `<p style="font-family:Arial,sans-serif;font-size:15px;">${first} (${email}) just paid $${amount}. The automatic welcome email is off until the welcome details in src/data/llu.ts are filled in, so please send them the community link and the Wednesday call link yourself.</p>`,
      replyTo: { email },
    });
  }
  return json({ ok: true });
};
