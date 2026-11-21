/**
 * Daily job at 7:30 a.m. ET (Vercel Cron, see vercel.json). In order:
 *   1. Calls: Izzy's sales briefs, the lead's day-before and morning-of emails, follow-ups after calls
 *   2. Leads who qualified but never booked: two nudges
 *   3. Clients: onboarding reminders at 2 and 4 days, and the week-11 renewal email
 *   4. Izzy's morning digest: everything that needs a look, in one email
 * Vercel sends "Authorization: Bearer <CRON_SECRET>" automatically when CRON_SECRET is set.
 */
import type { APIRoute } from 'astro';
import { brevo, type BrevoContact } from '../../../lib/brevo-api.js';
import { dueSteps, noBookSteps, torontoDay } from '../../../lib/call-flow.js';
import { runSteps, runnerEnv } from '../../../lib/call-runner.js';
import { onboardingDue, renewalDue, makeToken } from '../../../lib/onboarding.js';
import { toClient } from '../../../lib/clients.js';
import { reminderEmail, renewalEmail, digestEmail, type DigestData } from '../../../lib/onboarding-emails.js';
import { setupGaps } from '../../../lib/setup-check.js';

export const prerender = false;

const env = import.meta.env;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const nameOf = (c: BrevoContact) => `${c.attributes?.FIRSTNAME || ''} ${c.attributes?.LASTNAME || ''}`.trim() || c.email;
const gradeOf = (n: unknown) => (n === undefined || n === null || n === '' ? undefined : Number(n) >= 75 ? `Hot ${n}` : Number(n) >= 50 ? `Warm ${n}` : `Cool ${n}`);
const sentOf = (v: unknown) => String(v || '').split(',').filter(Boolean);

async function run() {
  if (!env.BREVO_API_KEY) return { error: 'BREVO_API_KEY not set' };
  const api = brevo(env.BREVO_API_KEY);
  const now = new Date();
  const today = torontoDay(now);
  const results: Record<string, string[]> = {};
  const digest: DigestData = { now, callsToday: [], unconfirmed: [], newLeads: [], notBooked: [], enrolled: [], onboarding: [], seats: { group: 0, private: 0 }, setup: setupGaps(env) };

  // 1. Calls
  const callList = Number(env.BREVO_CALL_LIST_ID) || 0;
  for (const c of callList ? await api.listContacts(callList) : []) {
    const a = c.attributes || {};
    if (!a.CALL_AT || a.CALL_OUTCOME === 'canceled') continue;
    const callAt = new Date(String(a.CALL_AT));
    if (Number.isNaN(callAt.getTime())) continue;
    const outcome = String(a.CALL_OUTCOME || '');
    const day = torontoDay(callAt);
    if (day === today && !outcome) digest.callsToday.push({ name: nameOf(c), email: c.email, at: callAt, grade: gradeOf(a.LEAD_SCORE) });
    if (day === today - 1 && !outcome) digest.unconfirmed.push({ name: nameOf(c), email: c.email, at: callAt });
    const steps = dueSteps(callAt, now, sentOf(a.CALL_EMAILS_SENT), outcome);
    if (steps.length) results[c.email] = await runSteps(runnerEnv(env), c, steps);
  }
  digest.callsToday.sort((x, y) => x.at.getTime() - y.at.getTime());

  // 2. Leads
  const leadsList = Number(env.BREVO_LEADS_LIST_ID) || 0;
  for (const c of leadsList ? await api.listContacts(leadsList) : []) {
    const a = c.attributes || {};
    const submitted = new Date(String(a.LEAD_SUBMITTED_AT || ''));
    if (Number.isNaN(submitted.getTime())) continue;
    if (now.getTime() - submitted.getTime() < 86_400_000) digest.newLeads.push({ name: nameOf(c), email: c.email, status: String(a.LEAD_STATUS || ''), score: a.LEAD_SCORE === undefined ? undefined : Number(a.LEAD_SCORE) });
    if (a.LEAD_STATUS !== 'qualified' || a.CALL_AT || a.CALL_OUTCOME) continue;
    const days = today - torontoDay(submitted);
    if (days >= 1 && days <= 7) digest.notBooked.push({ name: nameOf(c), email: c.email, days });
    const steps = noBookSteps(submitted, now, sentOf(a.CALL_EMAILS_SENT));
    if (steps.length) results[c.email] = await runSteps(runnerEnv(env), c, steps);
  }

  // 3. Clients
  const clientsList = Number(env.BREVO_CLIENTS_LIST_ID) || 0;
  for (const raw of clientsList ? await api.listContacts(clientsList) : []) {
    const c = toClient(raw);
    if (!raw.attributes?.ENROLLED_AT) continue;
    if (c.program.includes('private')) digest.seats.private++;
    else digest.seats.group++;
    if (now.getTime() - c.enrolledAt.getTime() < 86_400_000) digest.enrolled.push({ name: c.name, email: c.email, program: c.program });
    const done = { agreement: !!c.agreementSignedAt, intake: !!c.intakeDoneAt };
    const days = today - torontoDay(c.enrolledAt);
    if (!done.agreement || !done.intake) digest.onboarding.push({ name: c.name, email: c.email, ...done, days });

    const sent = sentOf(raw.attributes?.ONBOARD_SENT);
    const newly: string[] = [];
    if (!raw.emailBlacklisted && env.ONBOARD_SECRET) {
      const token = await makeToken(c.email, env.ONBOARD_SECRET);
      for (const step of onboardingDue(c.enrolledAt, now, done, sent)) {
        const m = reminderEmail({ firstName: c.firstName, token, ...done }, step === 'remind2');
        if (await api.send({ to: c.email, toName: c.firstName, subject: m.subject, html: m.html, tags: [`onboarding-${step}`] })) newly.push(step);
      }
    }
    if (!raw.emailBlacklisted && renewalDue(now, sent)) {
      const m = renewalEmail({ firstName: c.firstName, renewalUrl: env.PUBLIC_RENEWAL_URL || undefined });
      if (await api.send({ to: c.email, toName: c.firstName, subject: m.subject, html: m.html, tags: ['renewal'] })) newly.push('renewal');
    }
    if (newly.length) {
      await api.upsert(c.email, { ONBOARD_SENT: [...new Set([...sent, ...newly])].join(',') });
      results[c.email] = [...(results[c.email] || []), ...newly];
    }
  }

  // 4. Digest
  const d = digestEmail(digest);
  await api.send({ to: env.BOOK_CALL_NOTIFY_EMAIL || 'izzy@joinclearcareer.com', senderName: 'ClearCareer Digest', subject: d.subject, html: d.html, tags: ['digest'] });
  return { sent: results, digest: d.subject };
}

export const GET: APIRoute = async ({ request }) => {
  const secret = env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) return json({ error: 'unauthorised' }, 401);
  try {
    return json(await run());
  } catch (err) {
    console.error('cron error:', err);
    return json({ error: 'failed' }, 500);
  }
};
