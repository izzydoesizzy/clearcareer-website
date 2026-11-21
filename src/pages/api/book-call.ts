import type { APIRoute } from 'astro';
import { cleanAnswers, scoreLead, bookingUrl, diagnose, leadScore, programValue, PROGRAMS } from '../../lib/book-call.js';
import { packAnswers } from '../../lib/call-flow.js';
import { checkoutFromEnv } from '../../lib/call-runner.js';
import { consentAttributes } from '../../lib/brevo.js';
import { buildLeadEmail } from '../../lib/lead-email.js';
import { dealIsLive } from '../../lib/email/deal.js';

export const prerender = false;

const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
const NURTURE_LIST_ID = Number(import.meta.env.BREVO_NURTURE_LIST_ID) || 0;
const LEADS_LIST_ID = Number(import.meta.env.BREVO_LEADS_LIST_ID) || 0;
const NOTIFY_TO = import.meta.env.BOOK_CALL_NOTIFY_EMAIL || 'izzy@joinclearcareer.com';
/** The private Calendly event only approved leads see. Falls back to the public one until it's set. */
const QUALIFIED_URL = import.meta.env.CALENDLY_QUALIFIED_URL || undefined;
const CHECKOUT = checkoutFromEnv(import.meta.env);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Light per-instance rate limit. Not perfect on serverless, but stops casual spam.
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

/** Hot leads who picked a program can skip the call and pay now, once the Stripe links are set. */
function hotCheckoutFor(program: string, grade: string) {
  if (grade !== 'Hot') return {};
  const live = dealIsLive();
  const fmt = (n: number) => `$${n.toLocaleString('en-CA')}`;
  if (program === PROGRAMS.group.name && CHECKOUT.group)
    return { checkout: { url: CHECKOUT.group, program: PROGRAMS.group.name.toLowerCase(), price: fmt(live ? PROGRAMS.group.price : PROGRAMS.group.regular) } };
  if (program === PROGRAMS.private.name && CHECKOUT.private)
    return { checkout: { url: CHECKOUT.private, program: PROGRAMS.private.name.toLowerCase(), price: fmt(live ? PROGRAMS.private.price : PROGRAMS.private.regular) } };
  return {};
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.json().catch(() => ({}));

    // Honeypot: bots fill this hidden field. Pretend it worked.
    if (body && typeof body.website === 'string' && body.website.trim()) return json({ qualified: false, reason: 'not-ready' });

    if (limited(clientAddress || request.headers.get('x-forwarded-for') || 'unknown')) {
      return json({ error: 'Too many tries. Please wait a few minutes.' }, 429);
    }

    const { data, errors } = cleanAnswers(body || {});
    if (Object.keys(errors).length) return json({ error: 'Please check your answers.', errors }, 400);

    const verdict = scoreLead(data);
    const diagnosis = diagnose(data);
    const score = leadScore(data);
    const value = programValue(data.program);
    const submittedAt = new Date().toISOString();
    let saved = false;
    let notified = false;

    if (BREVO_API_KEY) {
      const headers = { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' };

      // 1. Save the lead on the Brevo contact. Retry without custom fields if one isn't set up yet.
      const attributes: Record<string, string | boolean | number> = {
        FIRSTNAME: data.firstName,
        LASTNAME: data.lastName || '',
        LEAD_STATUS: verdict.qualified ? 'qualified' : `not-yet:${verdict.reason}`,
        LEAD_SUBMITTED_AT: submittedAt,
        LEAD_PHONE: data.phone || '',
        LEAD_COUNTRY: data.country,
        LEAD_SITUATION: data.situation,
        LEAD_YEARS_EXP: data.yearsExperience,
        LEAD_SEARCH_LENGTH: data.searchLength,
        LEAD_APPS_TOTAL: data.totalApplications,
        LEAD_INTERVIEWS: data.interviews,
        LEAD_OFFERS: data.offers,
        LEAD_DIAGNOSIS: diagnosis.key,
        LEAD_SCORE: score.score,
        LEAD_PROGRAM: data.program,
        LEAD_VALUE: value.high,
        LEAD_TARGET_SALARY: data.targetSalary,
        LEAD_STRUGGLES: data.struggles.join(', '),
        LEAD_CHALLENGE: data.challenge,
        LEAD_CALL_GOAL: data.callGoal,
        LEAD_START: data.start,
        LEAD_PAYMENT: data.payment,
        LEAD_READY: data.ready,
        LEAD_COMMIT: data.commit,
        LEAD_ANSWERS: packAnswers(data),
        ...(data.consent ? consentAttributes('book-a-call') : { MARKETING_CONSENT: false }),
      };
      const listIds = [data.consent && NURTURE_LIST_ID ? NURTURE_LIST_ID : 0, LEADS_LIST_ID].filter(Boolean);
      const post = (withAttributes: boolean) =>
        fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            email: data.email,
            updateEnabled: true,
            ...(listIds.length ? { listIds } : {}),
            ...(withAttributes ? { attributes } : {}),
          }),
        });
      let res = await post(true);
      if (!res.ok && res.status !== 204) {
        const t = await res.text();
        if (res.status === 400 && t.toLowerCase().includes('attribute')) {
          console.error('Brevo attribute error (run scripts/brevo-setup.mjs):', t);
          res = await post(false);
        } else if (!(res.status === 400 && t.includes('already exist'))) {
          console.error('Brevo contact error:', res.status, t);
        }
      }
      saved = res.ok || res.status === 204;

      // 2. Email Izzy a lead brief with every answer. This is the record that can never be lost.
      const brief = buildLeadEmail(data, verdict, diagnosis, new Date(submittedAt), score, value);
      const mail = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sender: { name: 'ClearCareer Bookings', email: 'izzy@joinclearcareer.com' },
          to: [{ email: NOTIFY_TO }],
          replyTo: { email: data.email, name: `${data.firstName} ${data.lastName}`.trim() },
          subject: brief.subject,
          htmlContent: brief.html,
          tags: ['book-a-call'],
        }),
      });
      notified = mail.ok;
      if (!mail.ok) console.error('Notify email failed:', mail.status, await mail.text());
    } else {
      console.error('BREVO_API_KEY not set: lead was not saved');
    }

    if (!saved && !notified) return json({ error: 'We could not save your answers. Please try again in a minute.' }, 502);

    return json({
      qualified: verdict.qualified,
      reason: verdict.reason,
      diagnosis: { key: diagnosis.key, title: diagnosis.title, text: diagnosis.text },
      ...(verdict.qualified ? { bookingUrl: bookingUrl(data, QUALIFIED_URL) } : {}),
      ...(verdict.qualified ? hotCheckoutFor(data.program, score.grade) : {}),
    });
  } catch (err) {
    console.error('book-call error:', err);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
};

