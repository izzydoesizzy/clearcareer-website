/**
 * Emails a lead gets around their call with Izzy.
 *
 *   booked     right after they book in Calendly
 *   dayBefore  the morning before the call: FAQs and objections, answered before they come up
 *   morningOf  the morning of the call: short reminder
 *   followUp1  the morning after the call, if they haven't enrolled
 *   followUp2  3 days after the call, if they still haven't enrolled. The last one.
 *
 * Only real facts, all from src/data/llu.ts and src/lib/book-call.ts. No em dashes. Canadian English.
 */
import { COLORS, FONTS, SITE_URL } from './email/constants.js';
import { wrapDocument, outerTable, footer } from './email/components.js';
import { dealIsLive } from './email/deal.js';
import { PROGRAMS, ALTERNATIVE } from './book-call.js';
import type { BookCallAnswers, DiagnosisKey } from './book-call.js';
import { offer, objections } from '../data/llu.js';

export interface CallInfo {
  firstName: string;
  email: string;
  callAt: Date;
  joinUrl?: string;
  rescheduleUrl?: string;
  answers?: Partial<BookCallAnswers>;
  diagnosisKey?: DiagnosisKey;
}

export interface Checkout { group?: string; private?: string }

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const money = (n: number) => `$${Math.round(n).toLocaleString('en-CA')}`;

/** "Tuesday, December 1 at 2:00 p.m. ET" */
export function callTime(d: Date, withDay = true): string {
  const day = d.toLocaleDateString('en-CA', { timeZone: 'America/Toronto', weekday: 'long', month: 'long', day: 'numeric' });
  const time = d.toLocaleTimeString('en-CA', { timeZone: 'America/Toronto', hour: 'numeric', minute: '2-digit' });
  return withDay ? `${day} at ${time} ET` : `${time} ET`;
}

const price = (p: { price: number; regular: number }) => money(dealIsLive() ? p.price : p.regular);

/** One-line read of their numbers, in plain words. */
const DIAGNOSIS_LINE: Record<DiagnosisKey, string> = {
  clarity: "the next step isn't clear yet. Which roles, which industry, and what story to tell. That's where we'll start.",
  positioning: "you're putting in the work, but the applications aren't landing. That usually means the targeting, the resume, or both. We'll test both.",
  interviewing: "you're getting interviews, so your resume is doing its job. The gains are in how the interviews go. That's where we'll dig in.",
  tuning: "your numbers look healthy. The gains from here are in fine-tuning, and in negotiating well when the offer comes.",
};

// ── Building blocks ───────────────────────────────────────────────────────────
const P = (html: string, extra = '') =>
  `<p style="margin:0 0 16px;font-family:${FONTS.body};font-size:16px;line-height:1.65;color:${COLORS.text};${extra}" class="email-text">${html}</p>`;
const H = (text: string) =>
  `<p style="margin:28px 0 8px;font-family:${FONTS.body};font-size:13px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${COLORS.blue};">${esc(text)}</p>`;
const list = (items: string[], ordered = false) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">${items
    .map(
      (it, i) => `<tr><td style="width:28px;vertical-align:top;padding:4px 0;font-family:${FONTS.body};font-size:16px;font-weight:700;color:${COLORS.blue};">${ordered ? `${i + 1}.` : '&bull;'}</td>
<td style="padding:4px 0;font-family:${FONTS.body};font-size:16px;line-height:1.6;color:${COLORS.text};" class="email-text">${it}</td></tr>`,
    )
    .join('')}</table>`;
const button = (text: string, url: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;"><tr><td style="border-radius:8px;background:${COLORS.blue};">
<a href="${esc(url)}" style="display:inline-block;padding:14px 24px;font-family:${FONTS.body};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;" class="email-btn">${esc(text)}</a></td></tr></table>`;
const link = (text: string, url: string) => `<a href="${esc(url)}" style="color:${COLORS.blue};font-weight:600;text-decoration:underline;">${esc(text)}</a>`;
const qa = (q: string, a: string) =>
  `<tr><td style="padding:14px 0;border-top:1px solid ${COLORS.grey200};" class="email-border">
<p style="margin:0 0 6px;font-family:${FONTS.body};font-size:16px;font-weight:700;color:${COLORS.heading};" class="email-heading">${q}</p>
<p style="margin:0;font-family:${FONTS.body};font-size:15px;line-height:1.6;color:${COLORS.grey600};" class="email-text-muted">${a}</p></td></tr>`;

const REASON = "You're getting this because you booked a call with ClearCareer. Reply \"stop\" and I won't email you about it again.";
const UNSUB = 'mailto:izzy@joinclearcareer.com?subject=Stop%20call%20emails';

function shell(eyebrow: string, headline: string, body: string): string {
  return wrapDocument(
    outerTable(`<tr><td>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.white};border-radius:12px;overflow:hidden;" class="email-card">
<tr><td style="background-color:${COLORS.blue};padding:36px 40px;" class="email-padding">
<p style="margin:0 0 16px;color:#ffffff;font-size:15px;font-weight:700;letter-spacing:1.5px;font-family:${FONTS.body};">CLEARCAREER</p>
<p style="margin:0 0 6px;color:rgba(255,255,255,0.85);font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:${FONTS.body};">${esc(eyebrow)}</p>
<h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:400;line-height:1.2;font-family:${FONTS.heading};">${esc(headline)}</h1>
</td></tr>
<tr><td style="padding:32px 40px 8px;" class="email-padding">${body}</td></tr>
${footer(UNSUB, { reason: REASON })}
</table></td></tr>`),
  );
}

const sign = P('Talk soon,<br><strong>Izzy</strong>');
const joinLine = (c: CallInfo) => (c.joinUrl ? button('Join the call', c.joinUrl) : '');
const partnerLine = (c: CallInfo) =>
  c.answers?.decider && c.answers.decider !== 'Just me'
    ? P("You mentioned someone else is part of this decision. Bring them along, same link. That way you both hear the same answers and nobody has to play telephone after.")
    : '';
const payLine = `Card, Klarna (monthly, up to 12 months), or up to 3 payments with me.`;

// ── 1. Booked ────────────────────────────────────────────────────────────────
export function bookedEmail(c: CallInfo) {
  const subject = `You're booked, ${c.firstName}. Here's how to get the most from our call`;
  const read = c.diagnosisKey ? P(`I've already read your answers. From what you shared, ${esc(DIAGNOSIS_LINE[c.diagnosisKey])}`) : P("I've already read your answers, so we can skip the small talk and get right into it.");
  const html = shell('Call booked', `See you ${callTime(c.callAt)}`, `
${P(`Hey ${esc(c.firstName)},`)}
${P(`We're on for <strong>${esc(callTime(c.callAt))}</strong>.`)}
${joinLine(c)}
${read}
${H('Have these open')}
${list(['Your resume', 'Your LinkedIn profile', '2 or 3 job posts you would love to land'])}
${H("Here's how the call goes")}
${list([
  'Where you are stuck, in your own words.',
  "What I'd change first, and why.",
  "If Land and Level Up fits, how to join. If it doesn't, I'll tell you straight, and point you somewhere better.",
], true)}
${P(`If it's a fit, you can join right on the call. ${payLine}`)}
${partnerLine(c)}
${P(`Want to see both programs and the common questions before we talk? ${link('Everything is on one page', `${SITE_URL}/booked`)}.`)}
${c.rescheduleUrl ? P(`Need a different time? ${link('Reschedule here', c.rescheduleUrl)}.`) : ''}
${sign}`);
  return { subject, html };
}

// ── 2. The day before: FAQs and objections ─────────────────────────────────────
export function dayBeforeEmail(c: CallInfo) {
  const a = c.answers || {};
  const subject = `Before tomorrow: the questions people ask me most`;
  const live = dealIsLive();
  const salary = Number(a.targetSalary) || 0;
  const g = PROGRAMS.group;
  const p = PROGRAMS.private;
  const proof = (i: number) => esc(objections[i]?.proof || '').replace(/[“”]/g, '"');

  const worth = salary > 0
    ? `You told me you're aiming for ${money(salary)}. That's about ${money(salary / 12)} a month before tax. The group cohort is ${price(g)} plus HST for 3 months. If we get you hired even a few weeks sooner, it pays for itself.`
    : `Think about what one month of your target salary is worth. The group cohort is ${price(g)} plus HST for 3 months. If we get you hired even a few weeks sooner, it pays for itself.`;

  const rows = [
    qa("Is it worth the money?", worth),
    qa("Can I pay over time?", `Yes. ${payLine} Pick whichever works for your budget.`),
    qa("What if it's not for me?", `${esc(offer.guarantee)}`),
    qa("How much time does it take?", `One live hour every Wednesday with the group. The rest is your search, which you're already doing. We just point that time at what works.`),
    qa("I've already tried a coach. Why would this be different?", `Most coaching gives you advice, then leaves you to do it alone. Here we build it together: your resume and LinkedIn in a live workshop, then your real search on the call every Wednesday. ${proof(0)}`),
    qa("Will this work in my field?", `Yes. The work is the same in every field: a clear story, proof with numbers, and conversations with real people. ${proof(4)}`),
    qa("Group cohort or the private rebuild?", `<strong>${esc(g.name)}</strong> (${price(g)}): ${esc(offer.group.forWho)}<br><strong>${esc(p.name)}</strong> (${price(p)}): ${esc(offer.private.forWho)} We'll pick the right one together tomorrow.`),
    qa("What if I land a job in the first month?", `Then we celebrate. You keep your seat for the full 3 months, and we use that time to negotiate the offer and start the new role well.`),
    qa("When does it start?", `${esc(offer.startDateLong)}. Our first Wednesday call is ${esc(offer.firstCallLong)}. ${offer.seatsTotal} seats in total.${live ? ` Black Friday pricing ends ${esc(offer.dealEndsLong)}.` : ''}`),
  ].join('');

  const html = shell('Tomorrow', 'Straight answers before we talk', `
${P(`Hey ${esc(c.firstName)},`)}
${P(`We're on for <strong>${esc(callTime(c.callAt))}</strong>. Quick one before then.`)}
${P("These are the questions people ask me most before they join. Here are the straight answers, so tomorrow we can spend the whole call on you. If yours isn't here, hit reply.")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">${rows}</table>
${P(`If you already know you're in, tell me at the start and we'll use every minute on your plan. Have your card or Klarna handy.`)}
${partnerLine(c)}
${joinLine(c)}
${P(`<span style="font-size:13px;color:${COLORS.slate500};">Results vary. They depend on your effort, your field and the market. No one can promise you a job, and I won't.</span>`)}
${sign}`);
  return { subject, html };
}

// ── 3. Morning of ──────────────────────────────────────────────────────────────
export function morningOfEmail(c: CallInfo) {
  const subject = `Today at ${callTime(c.callAt, false)}`;
  const html = shell('Today', `See you at ${callTime(c.callAt, false)}`, `
${P(`Hey ${esc(c.firstName)},`)}
${P(`Looking forward to it. Quick checklist:`)}
${list(['Your resume and LinkedIn open', '2 or 3 job posts you would love to land', 'Your card or Klarna handy, in case we decide it fits'])}
${joinLine(c)}
${c.rescheduleUrl ? P(`Something came up? ${link('Pick another time', c.rescheduleUrl)}. No stress.`) : ''}
${sign}`);
  return { subject, html };
}

// ── 4 and 5. Follow-ups after the call (skipped once they enrol) ─────────────────
function joinLinks(k: Checkout): string {
  const items: string[] = [];
  if (k.group) items.push(`${link(`${PROGRAMS.group.name}, ${price(PROGRAMS.group)}`, k.group)}`);
  if (k.private) items.push(`${link(`${PROGRAMS.private.name}, ${price(PROGRAMS.private)}`, k.private)}`);
  return items.length ? list(items) : P("Reply \"I'm in\" and I'll send your payment link right away.");
}

export function followUp1Email(c: CallInfo, k: Checkout = {}) {
  const subject = `Your plan from yesterday, ${c.firstName}`;
  const html = shell('Following up', 'Thanks for yesterday', `
${P(`Hey ${esc(c.firstName)},`)}
${P("Thanks for the time yesterday. I really enjoyed digging into your search with you.")}
${P("If you're ready to go, here's where to claim your seat:")}
${joinLinks(k)}
${P(`${payLine} ${esc(offer.guarantee)}${dealIsLive() ? ` Black Friday pricing ends ${esc(offer.dealEndsLong)}.` : ''}`)}
${P('If something is still holding you back, reply with one word: <strong>money</strong>, <strong>timing</strong>, or <strong>fit</strong>. I\'ll answer that one thing, honestly.')}
${sign}`);
  return { subject, html };
}

export function followUp2Email(c: CallInfo, k: Checkout = {}) {
  const subject = `Last note from me on this`;
  const html = shell('One last thing', "I won't keep chasing you", `
${P(`Hey ${esc(c.firstName)},`)}
${P("This is my last email about the program. I'm not going to keep chasing you.")}
${P(`We start ${esc(offer.startDateLong)}.${dealIsLive() ? ` Black Friday pricing ends ${esc(offer.dealEndsLong)}, and I won't extend it.` : ''} If you want in, here's the link:`)}
${joinLinks(k)}
${P(`If now isn't the time, that's okay. The right program at the wrong time isn't the right program. Here's something to keep you moving: ${link(ALTERNATIVE.label, ALTERNATIVE.url)}.`)}
${P('Either way, keep showing up for yourself. My inbox stays open.')}
${sign}`);
  return { subject, html };
}
