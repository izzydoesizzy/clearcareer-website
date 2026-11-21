import type { APIRoute } from 'astro';
import { cleanAnswers, scoreLead, bookingUrl, type BookCallAnswers } from '../../lib/book-call.js';
import { consentAttributes } from '../../lib/brevo.js';

export const prerender = false;

const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
const NURTURE_LIST_ID = Number(import.meta.env.BREVO_NURTURE_LIST_ID) || 0;
const LEADS_LIST_ID = Number(import.meta.env.BREVO_LEADS_LIST_ID) || 0;
const NOTIFY_TO = import.meta.env.BOOK_CALL_NOTIFY_EMAIL || 'izzy@joinclearcareer.com';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

// Light per-instance rate limit. Not perfect on serverless, but stops casual spam.
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

function rows(a: BookCallAnswers, qualified: boolean, reason: string): string {
  const r = (label: string, value: unknown) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top;white-space:nowrap;">${esc(label)}</td><td style="padding:6px 0;color:#0f172a;">${esc(value) || '-'}</td></tr>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">
${r('Verdict', qualified ? 'QUALIFIED. Booking link shown.' : `Not yet (${reason}). No booking link shown.`)}
${r('Name', `${a.firstName} ${a.lastName || ''}`)}${r('Email', a.email)}${r('Phone', a.phone)}
${r('Email permission', a.consent ? 'Yes, ticked' : 'No')}
${r('Country', a.country)}${r('Situation', a.situation)}${r('Job titles', a.jobTitles)}${r('Target salary', a.targetSalary)}
${r('Years of experience', a.yearsExperience)}${r('Searching for', a.searchLength)}${r('Applications per week', a.appsPerWeek)}
${r('Total applications', a.totalApplications)}${r('Interviews', a.interviews)}
${r('Biggest struggles', a.struggles.join(', '))}${r('Biggest challenge', a.challenge)}${r('Success besides a job', a.milestones)}
${r('Motivation (0-5)', a.motivation)}${r('Wants from the call', a.callGoal)}${r('Who decides', a.decider)}
${r('Could start', a.start)}${r('Would pay by', a.payment)}${r('Ready to invest', a.ready)}
</table>`;
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
        LEAD_TARGET_SALARY: data.targetSalary ?? '',
        LEAD_STRUGGLES: data.struggles.join(', '),
        LEAD_CHALLENGE: data.challenge,
        LEAD_CALL_GOAL: data.callGoal,
        LEAD_START: data.start,
        LEAD_PAYMENT: data.payment,
        LEAD_READY: data.ready,
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

      // 2. Email every answer to Izzy. This is the record that can never be lost.
      const mail = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sender: { name: 'ClearCareer Bookings', email: 'izzy@joinclearcareer.com' },
          to: [{ email: NOTIFY_TO }],
          replyTo: { email: data.email, name: `${data.firstName} ${data.lastName || ''}`.trim() },
          subject: `${verdict.qualified ? 'QUALIFIED' : 'Not yet'}: ${data.firstName} ${data.lastName || ''} wants a call`.trim(),
          htmlContent: rows(data, verdict.qualified, verdict.reason),
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
      ...(verdict.qualified ? { bookingUrl: bookingUrl(data) } : {}),
    });
  } catch (err) {
    console.error('book-call error:', err);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
};

