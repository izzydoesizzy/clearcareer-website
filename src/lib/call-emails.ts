/**
 * Every email a lead gets from the book-a-call form onward.
 *
 *   notYet     right after the form, if they don't qualify (not ready, or under the experience minimum)
 *   noBook1    the morning after they qualified, if they haven't booked yet
 *   noBook2    3 days after they qualified, if they still haven't booked. The last one.
 *   booked     right after they book in Calendly
 *   dayBefore  the morning before the call: their story, and straight answers to what they'll ask
 *   morningOf  the morning of the call: short reminder
 *   canceled   right after they cancel (not a reschedule)
 *   noShow     right after Izzy marks them as a no-show in Calendly
 *   followUp1  the morning after the call, if they haven't enrolled
 *   followUp2  3 days after the call, if they still haven't enrolled. The last one.
 *
 * Rules: real facts and real stories only (src/data/llu.ts, src/lib/stories.ts). No em dashes.
 * Canadian English. Never promise a job.
 */
import { COLORS, FONTS, SITE_URL } from './email/constants.js';
import { wrapDocument, outerTable, footer } from './email/components.js';
import { dealIsLive } from './email/deal.js';
import { PROGRAMS, ALTERNATIVE, QUALIFY, diagnose } from './book-call.js';
import type { BookCallAnswers, DiagnosisKey } from './book-call.js';
import { offer, RESULTS_VARY } from '../data/llu.js';
import { storyFor, recommend, IZZY, STORIES, type Story } from './stories.js';
import { roi, daysLabel, multipleLabel, NEGOTIATION_EXAMPLES } from './roi.js';

export interface CallInfo {
  firstName: string;
  email: string;
  callAt: Date;
  joinUrl?: string;
  rescheduleUrl?: string;
  /** Their personal booking link (prefilled), for rebooking. */
  bookUrl?: string;
  answers?: Partial<BookCallAnswers>;
  diagnosisKey?: DiagnosisKey;
}

export interface Checkout { group?: string; private?: string }

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const money = (n: number) => `$${Math.round(n).toLocaleString('en-CA')}`;
const utm = (url: string, campaign: string) => `${url}${url.includes('?') ? '&' : '?'}utm_source=email&utm_medium=call-journey&utm_campaign=${campaign}`;
const PAGE = `${SITE_URL}/land-and-level-up`;

/** "Tuesday, December 1 at 2:00 p.m. ET" */
export function callTime(d: Date, withDay = true): string {
  const day = d.toLocaleDateString('en-CA', { timeZone: 'America/Toronto', weekday: 'long', month: 'long', day: 'numeric' });
  const time = d.toLocaleTimeString('en-CA', { timeZone: 'America/Toronto', hour: 'numeric', minute: '2-digit' });
  return withDay ? `${day} at ${time} ET` : `${time} ET`;
}

const priceOf = (p: { price: number; regular: number }) => money(dealIsLive() ? p.price : p.regular);
const deadlineLine = () => (dealIsLive() ? ` Black Friday pricing ends ${offer.dealEndsLong}, and I won't extend it.` : '');

/** What their numbers say, in plain words, written to them. */
const DIAGNOSIS_LINE: Record<DiagnosisKey, string> = {
  clarity: "the next step isn't clear yet. Which roles, which industry, what story to tell. That's not a motivation problem. It's a clarity problem, and clarity comes first, then volume.",
  positioning: "you're putting in the work, but the applications aren't landing. When that happens, it's almost always the targeting, the resume, or both. Not you.",
  interviewing: "your resume is doing its job. You're getting in the room. The gains are in what happens once you're there: your stories, your answers, your follow-up.",
  tuning: "your numbers look healthy. The gains from here are in fine-tuning, and in negotiating well when the offer comes, so you don't leave money on the table.",
};

/**
 * What the PROGRAM does about it, by diagnosis. Deliberately not do-it-yourself steps: the call is a
 * fit call, not free coaching, and half-advice taken away and tried alone rarely works.
 */
const PROGRAM_FIX: Record<DiagnosisKey, string> = {
  clarity: 'Inside Land and Level Up, we pin down the roles that actually fit you and build a weekly rhythm you can stick to. Together, not alone.',
  positioning: 'Inside Land and Level Up, we fix the targeting, rebuild how your resume and LinkedIn show your value, and get you talking to real people. Together, not alone.',
  interviewing: "Inside Land and Level Up, we build your interview stories and practise them live, so the interviews you're already getting turn into offers.",
  tuning: 'Inside Land and Level Up, we sharpen what is already working and get you ready to negotiate before the offer lands.',
};

/** What the call is, said plainly, so nobody shows up expecting a free coaching session. */
const FIT_CALL = "This call has one job: to help you decide whether Land and Level Up is right for you. It isn't a coaching session, so there are no documents to bring. We'll talk about where you are, where you want to be, what's in the way, and whether this program is the right way to close that gap.";

/**
 * Why we decide on the call, said softly. Both answers are good; the cost is the limbo.
 * Used in the booked and day-before emails.
 */
const DECIDE_ON_CALL = "By the end, you'll have a clear answer: yes or no. Both are great outcomes. What I want to save you from is \"let me think about it\" turning into three more weeks of wondering, while the search keeps costing you time and energy.";

const HOW_TO_PREPARE = [
  "<strong>Write down your questions and doubts.</strong> All of them, especially the awkward ones: money, timing, \"will this actually work for me?\" I'd much rather hear them on the call than have them nag at you after.",
  "<strong>Bring anyone who's part of the decision.</strong> A partner, a family member. Same link. Big decisions are easier when everyone hears the same answers.",
  "<strong>Know how you'd pay if it's a yes.</strong> Card, or Klarna monthly for up to 12 months. Both at checkout.",
];

/** Free next steps for people who aren't a fit right now. */
const FREE_STEPS: Record<DiagnosisKey, [string, string, string][]> = {
  clarity: [
    ['Weekly Job Search Planner', `${SITE_URL}/free-tools/weekly-job-search-planner`, 'Turn "I should apply more" into a plan you can actually stick to.'],
    ['LinkedIn Job Search Builder', `${SITE_URL}/free-tools/linkedin-job-search-builder`, 'Find the roles that fit, without the doom scrolling.'],
  ],
  positioning: [
    ['Resume Bullet Scorer', `${SITE_URL}/free-tools/resume-bullet-scorer`, 'Paste a bullet, see if it proves your value or just describes your job.'],
    ['LinkedIn Recruiter Finder', `${SITE_URL}/free-tools/linkedin-recruiter-finder`, 'Find the actual humans hiring for your role, so you stop shouting into the black hole.'],
  ],
  interviewing: [
    ['Free playbooks and guides', `${SITE_URL}/resources`, 'Interview stories, achievement mining, and the stuff I teach every week.'],
    ['Resume Bullet Scorer', `${SITE_URL}/free-tools/resume-bullet-scorer`, 'The same numbers that make a strong bullet make a strong interview story.'],
  ],
  tuning: [
    ['Salary Negotiation Calculator', `${SITE_URL}/free-tools/salary-negotiation-calculator`, 'Know your number before the offer lands.'],
    ['Free playbooks and guides', `${SITE_URL}/resources`, 'Everything I teach, free.'],
  ],
};

// ── Building blocks ───────────────────────────────────────────────────────────
const P = (html: string, extra = '') =>
  `<p style="margin:0 0 16px;font-family:${FONTS.body};font-size:16px;line-height:1.65;color:${COLORS.text};${extra}" class="email-text">${html}</p>`;
const H = (text: string) =>
  `<p style="margin:28px 0 8px;font-family:${FONTS.body};font-size:13px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${COLORS.blue};">${esc(text)}</p>`;
const list = (items: string[], ordered = false) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">${items
    .map(
      (it, i) => `<tr><td style="width:28px;vertical-align:top;padding:4px 0;font-family:${FONTS.body};font-size:16px;font-weight:700;color:${COLORS.blue};">${ordered ? `${i + 1}.` : '&#10003;'}</td>
<td style="padding:4px 0;font-family:${FONTS.body};font-size:16px;line-height:1.6;color:${COLORS.text};" class="email-text">${it}</td></tr>`,
    )
    .join('')}</table>`;
const button = (text: string, url: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="border-radius:8px;background:${COLORS.blue};">
<a href="${esc(url)}" style="display:inline-block;padding:14px 24px;font-family:${FONTS.body};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;" class="email-btn">${esc(text)}</a></td></tr></table>`;
const link = (text: string, url: string) => `<a href="${esc(url)}" style="color:${COLORS.blue};font-weight:600;text-decoration:underline;">${esc(text)}</a>`;
const qa = (q: string, a: string) =>
  `<tr><td style="padding:14px 0;border-top:1px solid ${COLORS.grey200};" class="email-border">
<p style="margin:0 0 6px;font-family:${FONTS.body};font-size:16px;font-weight:700;color:${COLORS.heading};" class="email-heading">${q}</p>
<p style="margin:0;font-family:${FONTS.body};font-size:15px;line-height:1.6;color:${COLORS.grey600};" class="email-text-muted">${a}</p></td></tr>`;
/** A real client story, set apart so it reads like one. */
const storyBlock = (s: Story, lead = '') =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 20px;background:${COLORS.blueBg};border-radius:10px;" class="email-tip-bg"><tr><td style="padding:20px 22px;">
${lead ? `<p style="margin:0 0 8px;font-family:${FONTS.body};font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${COLORS.blue};">${esc(lead)}</p>` : ''}
<p style="margin:0 0 12px;font-family:${FONTS.body};font-size:16px;line-height:1.65;color:${COLORS.text};" class="email-text">${esc(s.story)}</p>
<p style="margin:0 0 6px;font-family:${FONTS.heading};font-size:19px;line-height:1.45;color:${COLORS.heading};" class="email-heading">&ldquo;${esc(s.quote)}&rdquo;</p>
<p style="margin:0;font-family:${FONTS.body};font-size:13px;color:${COLORS.slate500};">${esc(s.who)}</p>
</td></tr></table>`;
const small = (html: string) => P(`<span style="font-size:13px;color:${COLORS.slate500};">${html}</span>`);

const REASON = "You're getting this because you asked about a call with ClearCareer. Reply \"stop\" and I won't email you about it again.";
const UNSUB = 'mailto:izzy@joinclearcareer.com?subject=Stop%20call%20emails';

/** Izzy's headshot for the signature. JPG, because Outlook can't show WebP. */
export const IZZY_PHOTO = `${SITE_URL}/images/email/izzy-144.jpg`;

/** The hidden line inboxes show next to the subject. */
const preheader = (text: string) =>
  `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f8fafc;opacity:0;">${esc(text)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>`;

/**
 * One-to-one emails look like a note from Izzy, not a newsletter: no banner, a small wordmark,
 * and a signature with his photo. People reply to these, and they're more likely to land in
 * the main inbox. (The launch campaign keeps the branded banner: see src/lib/email/nurture.ts.)
 * `headline` becomes the preview text inboxes show next to the subject.
 */
function shell(_eyebrow: string, headline: string, body: string, reason = REASON, unsub = UNSUB): string {
  return wrapDocument(
    preheader(headline) +
    outerTable(`<tr><td>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.white};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.grey200};" class="email-card email-border">
<tr><td style="padding:28px 40px 0;" class="email-padding">
<p style="margin:0 0 24px;font-family:${FONTS.body};font-size:13px;font-weight:700;letter-spacing:1.5px;color:${COLORS.blue};">CLEARCAREER</p>
</td></tr>
<tr><td style="padding:0 40px 4px;" class="email-padding">${body}</td></tr>
<tr><td style="padding:4px 40px 28px;" class="email-padding">
<table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid ${COLORS.grey200};padding-top:16px;" class="email-border"><tr>
<td style="padding:16px 14px 0 0;vertical-align:middle;"><img src="${IZZY_PHOTO}" width="56" height="56" alt="Izzy Piyale-Sheard" style="display:block;width:56px;height:56px;border-radius:28px;"></td>
<td style="padding:16px 0 0;vertical-align:middle;font-family:${FONTS.body};">
<p style="margin:0;font-size:15px;font-weight:700;color:${COLORS.heading};" class="email-heading">Izzy Piyale-Sheard</p>
<p style="margin:2px 0 0;font-size:13px;color:${COLORS.slate500};" class="email-text-muted">Career coach, ClearCareer &middot; <a href="${SITE_URL}" style="color:${COLORS.blue};text-decoration:none;">joinclearcareer.com</a></p>
</td></tr></table>
</td></tr>
${footer(unsub, { reason })}
</table></td></tr>`),
  );
}

const sign = (close = 'Chat soon,') => P(`${close}<br><strong>Izzy</strong>`);
const hey = (c: { firstName: string }) => P(`Hey ${esc(c.firstName)},`);
const joinLine = (c: CallInfo) => (c.joinUrl ? button('Join the call', c.joinUrl) : '');
const payLine = 'Pay by card, or spread it out monthly with Klarna (up to 12 months). Both at checkout.';

/** "120 applications, 3 interviews and 0 offers over 6-7 months." Only the numbers they gave us. */
function numbers(a?: Partial<BookCallAnswers>): string {
  if (!a || a.totalApplications === undefined) return '';
  const n = (x: number | undefined, one: string, many: string) => `${x ?? 0} ${x === 1 ? one : many}`;
  return `${n(a.totalApplications, 'application', 'applications')}, ${n(a.interviews, 'interview', 'interviews')} and ${n(a.offers, 'offer', 'offers')}${a.searchLength ? ` over ${a.searchLength.toLowerCase()}` : ''}.`;
}
const numbersBlock = (a?: Partial<BookCallAnswers>) => {
  const s = numbers(a);
  return s ? `<p style="margin:0 0 16px;padding:14px 18px;border-left:4px solid ${COLORS.blue};background:${COLORS.blueBg};font-family:${FONTS.body};font-size:17px;font-weight:700;color:${COLORS.heading};" class="email-tip-bg email-heading">${esc(s)}</p>` : '';
};
const keyOf = (c: CallInfo): DiagnosisKey | undefined =>
  c.diagnosisKey || (c.answers && c.answers.totalApplications !== undefined ? diagnose(c.answers as BookCallAnswers).key : undefined);

/** Their own numbers: what one week, one month and three months of their target pay are worth, next to the price. */
function roiBlock(a: Partial<BookCallAnswers>, campaign: string): string {
  const salary = Number(a.targetSalary) || 0;
  const g = PROGRAMS.group;
  const p = PROGRAMS.private;
  const isPrivate = a.program === p.name;
  const price = dealIsLive() ? (isPrivate ? p.price : g.price) : (isPrivate ? p.regular : g.regular);
  const r = roi(salary, price);
  const calc = `${SITE_URL}/roi?salary=${Math.round(salary) || ''}&program=${isPrivate ? 'private' : 'group'}&utm_source=email&utm_medium=call-journey&utm_campaign=${campaign}`;
  if (!r) return P(`Want to see what landing sooner is worth for you? ${link('Plug your target salary into this calculator', calc)}.`);
  const row = (label: string, value: string, extra = '', bold = false) =>
    `<tr><td style="padding:10px 14px;border-top:1px solid ${COLORS.grey200};font-family:${FONTS.body};font-size:15px;color:${COLORS.text};${bold ? 'font-weight:700;' : ''}" class="email-text email-border">${label}</td>
<td style="padding:10px 14px;border-top:1px solid ${COLORS.grey200};font-family:${FONTS.body};font-size:15px;color:${COLORS.heading};font-weight:700;text-align:right;white-space:nowrap;" class="email-heading email-border">${value}${extra ? `<span style="display:block;font-size:12px;font-weight:600;color:${COLORS.green};">${extra}</span>` : ''}</td></tr>`;
  return `${P(`You told me you're aiming for <strong>${money(salary)}</strong>. Here's what that means in plain numbers:`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;border:1px solid ${COLORS.grey200};border-radius:10px;border-collapse:separate;overflow:hidden;" class="email-border">
<tr><td colspan="2" style="padding:14px;background:${COLORS.blueBg};font-family:${FONTS.body};font-size:16px;line-height:1.5;color:${COLORS.heading};" class="email-tip-bg email-heading"><strong>${money(price)}</strong> is ${daysLabel(r.daysOfPay)} of your target pay.</td></tr>
${row('One working day of your target pay', money(r.perDay))}
${row('One month', money(r.perMonth))}
${r.rows.map((x) => row(`Land ${x.label}`, money(x.value), `${multipleLabel(x.multiple)} the cost`)).join('')}
${row(`${esc(r.raise.perYear.label)} in your next offer`, `${money(r.raise.perYear.value)}/yr`, `${multipleLabel(r.raise.perYear.multiple)} the cost, every year`)}
${row(esc(r.raise.threeYears.label), money(r.raise.threeYears.value), `${multipleLabel(r.raise.threeYears.multiple)} the cost`)}
${row(`<strong>${esc(r.both.label)}</strong>`, money(r.both.value), `${multipleLabel(r.both.multiple)} the cost, in year one`, false)}
</table>
${P(`Why negotiation counts: a raise isn't paid once. It's paid every year, and every future raise builds on it. We prepare for that moment together in the program. Clients have done far better than 5%: ${NEGOTIATION_EXAMPLES.map((e) => `${esc(e.name.split(' ')[0])} got ${esc(e.result)}`).join('; ')}.`)}
${small(`Before tax, at 260 working days a year. The 5% is an example, not a promise, and the client results above are not typical. Price is ${isPrivate ? `the ${esc(p.name.toLowerCase())}` : 'the group cohort'} plus HST. ${esc(RESULTS_VARY)} ${link('Try your own numbers', calc)}.`)}`;
}

// ── Not yet (form, not qualified) ───────────────────────────────────────────────
export function notYetEmail(a: BookCallAnswers, reason: 'not-ready' | 'experience') {
  const key = diagnose(a).key;
  const steps = FREE_STEPS[key];
  const subject = reason === 'experience' ? `Thanks, ${a.firstName}. An honest answer, and a few free tools` : `Thanks, ${a.firstName}. Something to keep you moving`;
  const opener =
    reason === 'experience'
      ? `Land and Level Up is built for people with ${QUALIFY.minYears}+ years of experience, and you shared ${a.yearsExperience} so far. I'd rather tell you that now than take your money for a room that wasn't built for where you are. That's not a knock on you. It's just not the right fit yet, and the free tools below will do more for you right now.`
      : "You told me you're not ready to invest right now. Honestly? Thank you for saying it. The right program at the wrong time isn't the right program, and I'd never want you stretching for something that adds stress to an already stressful search.";
  const html = shell('Thank you', 'Not quite yet. Here\'s what I\'d do.', `
${hey(a)}
${P("Thanks for taking five minutes to fill out the form. I read the answers, and I don't take that lightly. It's not easy to put your search into numbers.")}
${P(opener)}
${P('Here\'s what your answers told me:')}
${numbersBlock(a)}
${P(`That pattern usually means ${esc(DIAGNOSIS_LINE[key])}`)}
${H('Two free things I\'d start with')}
${list(steps.map(([t, u, d]) => `${link(t, utm(u, 'not-yet'))}. ${esc(d)}`))}
${P(`And one more: ${link(ALTERNATIVE.label, ALTERNATIVE.url)}. Prompts I use with clients to tighten their resume, LinkedIn and outreach.`)}
${P(`If things change, the door's open. ${link('Fill out the form again', utm(`${SITE_URL}/book-a-call`, 'not-yet'))} any time.`)}
${P('Keep showing up for yourself. Seriously. The people who come out the other side of this are the ones who keep going.')}
${sign('Rooting for you,')}`);
  return { subject, html };
}

// ── Qualified, but didn't book ────────────────────────────────────────────────────
export function noBook1Email(c: CallInfo) {
  const key = keyOf(c);
  const subject = `Your call link, ${c.firstName}`;
  const html = shell('Your link', 'You\'re in. Just pick a time.', `
${hey(c)}
${P("Thanks for filling out the form. I read your answers, and I'd really like to talk. You just didn't grab a time yet. Totally fine. Job searching is a full-time job with no pay, and things slip.")}
${P('Here\'s what you shared:')}
${numbersBlock(c.answers)}
${key ? P(`From what I see, ${esc(DIAGNOSIS_LINE[key])} That's what we'd dig into.`) : ''}
${c.bookUrl ? button('Pick a time', c.bookUrl) : button('Pick a time', `${SITE_URL}/book-a-call`)}
${P('Something holding you back? Hit reply and ask me. Sometimes the question you\'d bring to the call I can answer in two lines by email.')}
${dealIsLive() ? small(`Heads up: Black Friday pricing ends ${esc(offer.dealEndsLong)}.`) : ''}
${sign()}`);
  return { subject, html };
}

export function noBook2Email(c: CallInfo) {
  const key = keyOf(c) || 'positioning';
  const s = storyFor(key, c.answers);
  const subject = `Still want to talk, ${c.firstName}?`;
  const html = shell('Last nudge', 'One story, then I\'ll stop nudging', `
${hey(c)}
${P("Last nudge from me about the call, promise. I'll leave you with a story, because I think you'll see yourself in it.")}
${storyBlock(s, 'Someone who was where you are')}
${P(`Results vary, and I can't promise you the same thing. But the pattern matters. ${esc(PROGRAM_FIX[key])}`)}
${P("If you want to talk about whether that's the right move for you, here's your link:")}
${c.bookUrl ? button('Pick a time', c.bookUrl) : button('Pick a time', `${SITE_URL}/book-a-call`)}
${P(`Not the right time? All good. Here's something to keep you moving: ${link(ALTERNATIVE.label, ALTERNATIVE.url)}.`)}
${sign()}`);
  return { subject, html };
}

// ── 1. Booked ────────────────────────────────────────────────────────────────
export function bookedEmail(c: CallInfo) {
  const key = keyOf(c);
  const s = key ? storyFor(key, c.answers) : null;
  const subject = `You're booked, ${c.firstName}. Here's what our call is for`;
  const html = shell('Call booked', `See you ${callTime(c.callAt)}`, `
${hey(c)}
${P(`We're on for <strong>${esc(callTime(c.callAt))}</strong>. Looking forward to it.`)}
${joinLine(c)}
${c.answers?.totalApplications !== undefined ? P("I've got your answers in front of me. Here's what jumped out:") : ''}
${numbersBlock(c.answers)}
${key ? P(`That pattern tells me ${esc(DIAGNOSIS_LINE[key])}`) : P("We'll skip the small talk and go straight to your search.")}
${c.answers?.challenge ? P(`And you wrote that your biggest challenge is: <em>&ldquo;${esc(c.answers.challenge.replace(/[.!?]+$/, ''))}.&rdquo;</em> I've got that written down. We'll get to it.`) : ''}
${H('What this call is for')}
${P(FIT_CALL)}
${P(DECIDE_ON_CALL)}
${H("Here's how the call goes")}
${list([
  'Where you are now, and where you want to be.',
  "What's in the way, and what it's costing you to stay stuck.",
  "Whether Land and Level Up closes that gap. If it's a yes, we get you set up before we hang up. If it's a no, I'll tell you straight and point you somewhere better.",
], true)}
${H('How to get the most out of it')}
${list(HOW_TO_PREPARE)}
${P("And if one question is already on your mind, hit reply and send it now. I'll make sure we cover it.")}
${P(`Want to look around first? ${link('Both programs and the common questions are on one page', utm(`${SITE_URL}/booked`, 'booked'))}.`)}
${c.rescheduleUrl ? P(`Need a different time? ${link('Reschedule here', c.rescheduleUrl)}, no stress. It frees the slot for someone else.`) : ''}
${sign()}
${s ? P(`<strong>P.S.</strong> ${esc(s.who.split(',')[0])} was in a similar spot. Ask me about that story on the call.`) : ''}`);
  return { subject, html };
}

// ── 2. The day before: their story, then FAQs and objections ─────────────────────
export function dayBeforeEmail(c: CallInfo) {
  const a = c.answers || {};
  const key = keyOf(c) || 'positioning';
  const s = storyFor(key, a);
  const subject = `Before tomorrow: ${s.who.split(',')[0]}'s story, and your questions answered`;
  const g = PROGRAMS.group;
  const p = PROGRAMS.private;
  const employed = String(a.situation || '').startsWith('Still employed');


  const partner = a.decider && a.decider !== 'Just me'
    ? qa('Can my partner join the call?', 'Yes, please. Same link. Big decisions are easier when you both hear the same answers.')
    : '';
  const pick = a.program && a.program !== 'Not sure yet' ? ` You leaned toward the ${esc(String(a.program).toLowerCase())} on the form. We'll check that's still the right call.` : " We'll pick the right one together tomorrow.";

  const rows = [
    partner,
    qa('Can I pay over time?', `Yes. ${payLine} Pick whatever works for your budget. No judgement, I've been between jobs too.`),
    qa("What if it's not for me?", `${esc(offer.guarantee)} Email me inside those 7 days and I'll refund you, no awkward conversation.`),
    qa('How much time does it take?', employed
      ? 'One live hour a week with the group, for 6 weeks. The rest is your search, done smarter. You told me you\'re still employed, so we\'ll build a plan that fits around your job, not on top of it.'
      : 'One live hour a week with the group, for 6 weeks. The rest is your search, which you\'re already doing. We just point that time at what works.'),
    qa("I've already tried a coach. Why would this be different?", `Most coaching hands you advice, then leaves you alone with it. Here we build it together: your resume and LinkedIn in a live workshop, then your real search on the call every Wednesday. ${esc(STORIES.andrew.story)} In Andrew's words: &ldquo;${esc(STORIES.andrew.quote)}&rdquo;`),
    qa('Will this work in my field?', 'Yes. The work is the same in every field: a clear story, proof with numbers, and conversations with real people. Laura works in reproductive health. Raunika landed a director role at a large Canadian payments company. Darin is a project manager.'),
    qa('Group cohort or the private rebuild?', `<strong>${esc(g.name)}</strong> (${priceOf(g)}): ${esc(offer.group.forWho)}<br><strong>${esc(p.name)}</strong> (${priceOf(p)}): ${esc(offer.private.forWho)}${pick}`),
    qa('What if I land a job in the first month?', 'Then we celebrate (loudly). You keep your seat for the full 6 weeks, and we use that time to negotiate the offer and start the new role strong.'),
    qa('When does it start, and how long is it?', `We start ${esc(offer.startDateLong)}. Six live Wednesday calls: ${esc(offer.callDates)}. ${esc(offer.holidayBreak)} ${esc(offer.afterProgram)} ${offer.seatsTotal} seats in total.${dealIsLive() ? ` Black Friday pricing ends ${esc(offer.dealEndsLong)}.` : ''}`),
  ].join('');

  const html = shell('Tomorrow', 'A story, then straight answers', `
${hey(c)}
${P(`We're on for <strong>${esc(callTime(c.callAt))}</strong>. Before then, let me tell you about someone.`)}
${storyBlock(s)}
${P(`Why this story? Because your numbers look a lot like this. Tomorrow we'll talk about what's in the way for you, and what changing it would be worth.`)}
${small(esc(RESULTS_VARY))}
${H('Is it worth it? Your numbers')}
${roiBlock(a, 'day-before')}
${H('Tomorrow is decision day')}
${P("Tomorrow's call is where we decide together whether this is right for you. So tonight, take ten minutes and write down every question or doubt that's still in your head. If something below doesn't answer it, hit reply, or bring it tomorrow.")}
${P(DECIDE_ON_CALL)}
${H('Questions people ask me before they join')}
${P("Here are the straight answers, so tomorrow we can spend the whole call on you. If yours isn't here, hit reply.")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">${rows}</table>
${P("If you already know you're in, tell me at the start and we'll go straight to getting you set up. Either way, have your card or Klarna handy, so a yes doesn't have to wait.")}
${joinLine(c)}
${sign('See you tomorrow,')}`);
  return { subject, html };
}

// ── 3. Morning of ──────────────────────────────────────────────────────────────
export function morningOfEmail(c: CallInfo) {
  const subject = `Today at ${callTime(c.callAt, false)}`;
  const html = shell('Today', `See you at ${callTime(c.callAt, false)}`, `
${hey(c)}
${P("Today's the day. I'm genuinely looking forward to this one. Today we decide together whether Land and Level Up is right for you, so bring:")}
${list(['Your list of questions and doubts (all of them)', "Anyone who's part of the decision", 'Your card or Klarna handy, so a yes can happen right away'])}
${joinLine(c)}
${c.rescheduleUrl ? P(`Something came up? ${link('Pick another time', c.rescheduleUrl)}. Life happens, no stress.`) : ''}
${sign('See you soon,')}`);
  return { subject, html };
}

// ── Canceled and no-show ─────────────────────────────────────────────────────────
export function canceledEmail(c: CallInfo) {
  const subject = `No problem, ${c.firstName}. Want a new time?`;
  const html = shell('Call canceled', "No explanation needed. Here's a link to pick a new time.", `
${hey(c)}
${P("I saw you canceled our call. No problem at all, and no explanation needed. Job searching pulls you in fifty directions at once.")}
${P('If you still want to talk about your search, grab a new time here:')}
${button('Pick a new time', c.bookUrl || `${SITE_URL}/book-a-call`)}
${P("If you decided it's not the right time, that's okay too. Hit reply and tell me what changed. Maybe I can point you to something that fits better.")}
${sign()}`);
  return { subject, html };
}

export function noShowEmail(c: CallInfo) {
  const subject = 'We missed each other today';
  const html = shell('Missed call', "Zero guilt. Here's a link to pick a new time.", `
${hey(c)}
${P("Looks like we missed each other today. Zero guilt here. I've been the person juggling ten things and losing track of the eleventh.")}
${P("If you still want to talk, pick a new time. Same call, same answers.")}
${button('Pick a new time', c.bookUrl || `${SITE_URL}/book-a-call`)}
${dealIsLive() ? P(`One honest heads up: Black Friday pricing ends ${esc(offer.dealEndsLong)}, so sooner is better if you want it.`) : ''}
${P('And if something bigger is going on, hit reply. I mean it.')}
${sign()}`);
  return { subject, html };
}

/**
 * Their own definition of success, from the form. Said as "on your form" (not "you told me"), because
 * the call may have gone somewhere else. Left out when the answer won't read well in the sentence.
 */
export function goalLine(raw?: unknown): string {
  const g = String(raw ?? '').trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
  if (g.length < 10 || g.length > 200 || g.split(' ').length < 2) return '';
  return P(`On your form, you said that besides a new job, success would look like <em>&ldquo;${esc(g)}.&rdquo;</em> That's exactly what the next 6 weeks are built for.`);
}

// ── Follow-ups after the call (skipped once they enrol, cancel, or no-show) ──────────
function joinLinks(k: Checkout, a?: Partial<BookCallAnswers>): string {
  const rec = a && a.totalApplications !== undefined ? recommend(a as BookCallAnswers).program : '';
  const items: { label: string; url: string; first: boolean }[] = [];
  if (k.group) items.push({ label: `${PROGRAMS.group.name}, ${priceOf(PROGRAMS.group)} plus HST`, url: k.group, first: rec === PROGRAMS.group.name });
  if (k.private) items.push({ label: `${PROGRAMS.private.name}, ${priceOf(PROGRAMS.private)} plus HST`, url: k.private, first: rec === PROGRAMS.private.name });
  if (!items.length) return P("Reply \"I'm in\" and I'll send your payment link right away.");
  items.sort((x, y) => Number(y.first) - Number(x.first));
  // Short button text fits on a phone. The program name goes on the line above.
  return items
    .map((i, n) => (n === 0 ? P(`<strong>${esc(i.label)}</strong>`, 'margin-bottom:4px;') + button('Claim my seat', i.url) : P(`Or the ${link(i.label.replace(/^[^,]+/, (n) => n.toLowerCase()), i.url)}.`)))
    .join('');
}

export function followUp1Email(c: CallInfo, k: Checkout = {}) {
  const key = keyOf(c);
  const subject = `Your plan from yesterday, ${c.firstName}`;
  const html = shell('Following up', "The math from yesterday, and your link to join.", `
${hey(c)}
${P("Thanks for the chat yesterday. It was really great getting to know you and your search.")}
${goalLine(c.answers?.milestones)}
${key ? P(esc(PROGRAM_FIX[key])) : ''}
${(() => { const sal = Number(c.answers?.targetSalary) || 0; const isP = (c.answers && c.answers.totalApplications !== undefined ? recommend(c.answers as BookCallAnswers).program : c.answers?.program) === PROGRAMS.private.name; const pr = dealIsLive() ? (isP ? PROGRAMS.private.price : PROGRAMS.group.price) : (isP ? PROGRAMS.private.regular : PROGRAMS.group.regular); const r = roi(sal, pr); return r ? P(`And the math from yesterday: at ${money(sal)}, the ${isP ? esc(PROGRAMS.private.name.toLowerCase()) : 'group cohort'} costs ${daysLabel(r.daysOfPay)} of your target pay. Landing even 2 weeks sooner is worth ${money(r.rows[0].value)}, and negotiating ${r.raise.pct}% more in your next offer is worth ${money(r.raise.perYear.value)} every year after.`) : ''; })()}
${P("If you're ready, here's where to claim your seat:")}
${joinLinks(k, c.answers)}
${P(`${payLine} ${esc(offer.guarantee)}${deadlineLine()}`)}
${P('Still on the fence? Reply with one word: <strong>money</strong>, <strong>timing</strong>, or <strong>fit</strong>. I\'ll answer that one thing, honestly. If the answer is "not now", I\'ll tell you that too.')}
${sign()}`);
  return { subject, html };
}

export function followUp2Email(c: CallInfo, k: Checkout = {}) {
  const subject = 'Last note from me on this';
  const html = shell('One last thing', "I won't keep chasing you", `
${hey(c)}
${P("This is my last email about the program. I'm not going to keep chasing you. That's not how I want to run this.")}
${P(IZZY.selling)}
${P(`So here's the plain version. We start ${esc(offer.startDateLong)}.${deadlineLine()} If you want in:`)}
${joinLinks(k, c.answers)}
${P(`If now isn't the time, that's okay. The right program at the wrong time isn't the right program. Here's something to keep you moving: ${link(ALTERNATIVE.label, ALTERNATIVE.url)}.`)}
${P('Either way, keep showing up for yourself. My inbox stays open.')}
${sign('All the best,')}`);
  return { subject, html };
}

/** Shared building blocks, reused by the onboarding emails. */
export const ui = { shell, P, H, list, button, link, small, sign, hey, esc, payLine };
