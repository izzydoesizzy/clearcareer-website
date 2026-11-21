/**
 * Land and Level Up launch sequence, for people who opted in to emails.
 * Source of truth for the Brevo templates (see scripts/brevo-nurture.mjs and the email audit).
 *
 * These are DATED emails, sent as scheduled Brevo campaigns to the "Nurture: Land and Level Up
 * (opted in)" list, so every reader sees the right deadline. Don't put them in an evergreen
 * automation: the dates would be wrong for anyone who joins late.
 *
 * Brevo fills in {{ contact.FIRSTNAME }} and {{ unsubscribe }}. Real stories only (src/lib/stories.ts).
 */
import { COLORS, FONTS, SITE_URL } from './constants.js';
import { wrapDocument, outerTable, footer } from './components.js';
import { offer, RESULTS_VARY, VIDEO_URL } from '../../data/llu.js';
import { STORIES, IZZY } from '../stories.js';

const NAME = '{{ contact.FIRSTNAME | default : "there" }}';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const page = (n: number, hash = '') => `${SITE_URL}/land-and-level-up?utm_source=email&utm_medium=nurture&utm_campaign=launch-${n}${hash}`;
const form = (n: number) => `${SITE_URL}/book-a-call?utm_source=email&utm_medium=nurture&utm_campaign=launch-${n}`;

const P = (h: string) => `<p style="margin:0 0 16px;font-family:${FONTS.body};font-size:16px;line-height:1.7;color:${COLORS.text};" class="email-text">${h}</p>`;
const BIG = (h: string) => `<p style="margin:8px 0 18px;font-family:${FONTS.heading};font-size:24px;line-height:1.3;color:${COLORS.heading};" class="email-heading">${h}</p>`;
const QUOTE = (q: string, who: string) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 20px;"><tr><td style="border-left:4px solid ${COLORS.blue};padding:6px 0 6px 18px;">
<p style="margin:0 0 6px;font-family:${FONTS.heading};font-size:19px;line-height:1.45;color:${COLORS.heading};" class="email-heading">&ldquo;${esc(q)}&rdquo;</p>
<p style="margin:0;font-family:${FONTS.body};font-size:13px;color:${COLORS.slate500};">${esc(who)}</p></td></tr></table>`;
const LIST = (items: string[]) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">${items
  .map((it) => `<tr><td style="width:26px;vertical-align:top;padding:4px 0;font-family:${FONTS.body};font-size:16px;font-weight:700;color:${COLORS.blue};">&#10003;</td><td style="padding:4px 0;font-family:${FONTS.body};font-size:16px;line-height:1.6;color:${COLORS.text};" class="email-text">${it}</td></tr>`)
  .join('')}</table>`;
const BTN = (t: string, u: string) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 22px;"><tr><td style="border-radius:8px;background:${COLORS.blue};"><a href="${u}" style="display:inline-block;padding:14px 24px;font-family:${FONTS.body};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">${esc(t)}</a></td></tr></table>`;
const A = (t: string, u: string) => `<a href="${u}" style="color:${COLORS.blue};font-weight:600;text-decoration:underline;">${esc(t)}</a>`;
const SMALL = (h: string) => `<p style="margin:0 0 16px;font-family:${FONTS.body};font-size:13px;line-height:1.6;color:${COLORS.slate500};">${h}</p>`;
const SIGN = (close = 'Chat soon,') => P(`${close}<br><strong>Izzy</strong>`);
const PS = (h: string) => `<p style="margin:8px 0 16px;font-family:${FONTS.body};font-size:16px;line-height:1.65;color:${COLORS.text};" class="email-text"><strong>P.S.</strong> ${h}</p>`;
const tool = (slug: string, n: number) => `${SITE_URL}/free-tools/${slug}?utm_source=email&utm_medium=nurture&utm_campaign=launch-${n}`;
const CALL = (n: number) => P(`Rather talk it through? ${A('Answer a few questions (about 5 minutes) and grab a time with me', form(n))}. I read every answer before we talk.`);

export interface NurtureEmail {
  n: number;
  /** Brevo template id this replaces, if any. */
  templateId?: number;
  name: string;
  subject: string;
  preheader: string;
  /** Send date and time, Toronto. */
  sendAt: string;
  html: string;
}

function shell(n: number, preheader: string, eyebrow: string, headline: string, body: string): string {
  return wrapDocument(
    `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f8fafc;opacity:0;">${esc(preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>` +
      outerTable(`<tr><td>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.white};border-radius:12px;overflow:hidden;" class="email-card">
<tr><td style="background-color:${COLORS.blue};padding:36px 40px;" class="email-padding">
<p style="margin:0 0 16px;color:#ffffff;font-size:15px;font-weight:700;letter-spacing:1.5px;font-family:${FONTS.body};">CLEARCAREER</p>
<p style="margin:0 0 6px;color:rgba(255,255,255,0.85);font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:${FONTS.body};">${esc(eyebrow)}</p>
<h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:400;line-height:1.2;font-family:${FONTS.heading};">${esc(headline)}</h1>
</td></tr>
<tr><td style="padding:32px 40px 8px;" class="email-padding">${P(`Hey ${NAME},`)}${body}</td></tr>
${footer('{{ unsubscribe }}', { reason: "You're getting this because you asked for a free ClearCareer resource and agreed to get emails from me." })}
</table></td></tr>`),
  );
}

const g = offer.group;
const p = offer.private;

export function nurtureEmails(): NurtureEmail[] {
  const list: Omit<NurtureEmail, 'html'>[] & { body: string; eyebrow: string; headline: string }[] = [
    {
      n: 1, templateId: 2, name: 'LLU Launch 1 - My story', sendAt: '2026-11-22 09:12',
      subject: "I was between jobs, and I didn't have money to burn",
      preheader: 'Quick story, so you know who is emailing you.',
      eyebrow: 'Quick story', headline: 'The room I wish I had',
      body: `
${P("Quick story, so you know who's emailing you.")}
${P(esc(IZZY.zigzag))}
${P("If you've ever refreshed your inbox for the fourth time before lunch, or rewritten the same resume bullet until it stopped meaning anything, I know that feeling. It's lonely in a way that's hard to explain to people with jobs.")}
${P(esc(IZZY.click))}
${P(esc(IZZY.mission))}
${BIG("Land and Level Up is the newest version of that room.")}
${P(`It's small on purpose: ${offer.seatsTotal} founding seats. We rebuild your resume and LinkedIn together, then we work your actual search live, every Wednesday. We start ${offer.startDateLong}.`)}
${P("Over the next week I'll show you what's inside, the people who've been where you are, and the honest math on what it costs.")}
${BTN('See what it is', page(1))}
${CALL(1)}
${P("And I'd love to know: <strong>what's the hardest part of your search right now?</strong> Hit reply and tell me. One line is plenty. I read every one.")}
${SIGN()}`,
    },
    {
      n: 2, templateId: 3, name: 'LLU Launch 2 - The math', sendAt: '2026-11-23 09:12',
      ps: `Black Friday pricing ends Monday, November 30 at 11:59 pm ET. After that, the group cohort goes back to ${g.regular}.`,
      subject: 'Divide your target salary by 12',
      preheader: "That's what every month of searching costs. Let's do the math together.",
      eyebrow: 'The math', headline: 'What one more month costs',
      body: `
${P("Money is tight when you're between roles. I've been there. So let's do the math together, with your number, not mine.")}
${P('Grab your target salary. Divide it by 12.')}
${BIG('At $100,000, that\'s $8,333. Every month.')}
${P("That's what one more month of searching costs. Not in theory. In groceries, in rent, in the quiet stress of watching your savings go down a little more every time you check.")}
${P(`Now put the price next to it. The group cohort is <strong>${g.price} plus HST</strong> for your first 3 months${offer.dealLive ? ` (the Black Friday price, regular ${g.regular})` : ''}. If it helps you land even a few weeks sooner, it pays for itself.`)}
${QUOTE(STORIES.annie.quote, STORIES.annie.who)}
${P(`${esc(STORIES.annie.story)} I get that. That's exactly why the price is what it is, and why there's a guarantee.`)}
${LIST([esc(offer.paying), esc(offer.guarantee)])}
${P("I'm not promising you'll land fast. Nobody honest can promise you a job. But a month is expensive, and spending fewer of them stuck is the whole point.")}
${BTN('See the prices', page(2, '#pricing'))}
${CALL(2)}
${SIGN()}`,
    },
    {
      n: 3, templateId: 4, name: 'LLU Launch 3 - 600 applications', sendAt: '2026-11-24 09:12',
      ps: `Want to test one thing today? Paste a resume bullet into my free ${A('Resume Bullet Scorer', tool('resume-bullet-scorer', 3))}. If it describes your job instead of proving your value, that's the first thing we'd fix.`,
      subject: '600 applications. 3 interviews.',
      preheader: "Darin did everything right, and it wasn't working. Here's what changed.",
      eyebrow: 'A real story', headline: '600 applications. 3 interviews.',
      body: `
${P('Let me tell you about Darin.')}
${P(esc(STORIES.darin.story))}
${QUOTE(STORIES.darin.quote, STORIES.darin.who)}
${P("Here's what I want you to take from that. Darin wasn't lazy. Six hundred applications is the opposite of lazy. The problem was the hamster wheel: apply, hear nothing, apply harder. More effort pointed at the same wall.")}
${P(`${esc(STORIES.blake.story)} Same pattern.`)}
${QUOTE(STORIES.blake.quote, STORIES.blake.who)}
${P("If that's you right now, you don't need to try harder. You need to aim differently. That's the first thing we fix in Land and Level Up: your targeting, your resume and LinkedIn, and how you reach real people.")}
${SMALL(`Public LinkedIn reviews from my earlier coaching and programs. Land and Level Up is new. ${esc(RESULTS_VARY)}`)}
${BTN('Read more stories like this', page(3, '#results'))}
${CALL(3)}
${SIGN()}`,
    },
    {
      n: 4, templateId: 6, name: "LLU Launch 4 - What's inside", sendAt: '2026-11-25 09:12',
      ps: `The group is capped at ${offer.seatsTotal} people on purpose, so everyone gets airtime on Wednesdays.`,
      subject: 'What actually happens on a Wednesday',
      preheader: 'The live call, the rebuild workshop, and the room that kept Sparsh going.',
      eyebrow: "What's inside", headline: 'What happens on a Wednesday',
      body: `
${P("Today's Wednesday, so let me show you what a Wednesday looks like inside Land and Level Up.")}
${P("You log on. Small group, 16 people at most, everyone working on their next role. You bring what happened this week: the interview that went sideways, the recruiter who ghosted you, the offer you're scared to negotiate. We work it out, live. For 60 minutes, you're not doing this alone.")}
${QUOTE(STORIES.sparsh.quote, STORIES.sparsh.who)}
${P("Here's everything you get:")}
${LIST([
  `<strong>A live group call every Wednesday</strong>, 60 minutes. First one is ${offer.firstCallLong}.`,
  '<strong>A resume and LinkedIn rebuild workshop</strong>, with hot seats. We rework real resumes line by line, so you see exactly what to change.',
  '<strong>The AI Achievement Interviewer.</strong> It asks you one question at a time until your work has numbers on it. Most people undersell their work. This makes that a lot harder to do.',
  `<strong>The community</strong> for 3 months: people in the same spot, plus me. ${esc(offer.afterThreeMonths)}`,
  `<strong>${p.seatsTotal} seats also include a 1:1 rebuild with me</strong>, 2 to 3 hours, just the two of us.`,
])}
${P(`What does a rebuild do? ${esc(STORIES.victor.story)}`)}
${QUOTE(STORIES.victor.quote, STORIES.victor.who)}
${P(`Want to hear it from a past client directly? ${A('Watch this short video', VIDEO_URL)}.`)}
${BTN('See everything inside', page(4, '#inside'))}
${CALL(4)}
${SIGN()}`,
    },
    {
      n: 5, templateId: 5, name: 'LLU Launch 5 - Negotiation', sendAt: '2026-11-26 09:12',
      ps: `Want to know your number before the offer lands? Try my free ${A('Salary Negotiation Calculator', tool('salary-negotiation-calculator', 5))}.`,
      subject: '$22,000 more, from one conversation',
      preheader: 'Landing the offer is half the job. Here is the other half.',
      eyebrow: 'The other half', headline: '$22,000 from one conversation',
      body: `
${P("Landing the offer is half the job. The other half is what you do in the next ten minutes.")}
${P("Most people say yes to the first number. They're so relieved the search is over that they'd sign anything. I get it. When you've been in the black hole for months, the first yes feels like oxygen.")}
${P(`${esc(STORIES.laura.story)}`)}
${QUOTE(STORIES.laura.quote, STORIES.laura.who)}
${P('And Laura is not alone:')}
${QUOTE(STORIES.septembre.quote, STORIES.septembre.who)}
${QUOTE(STORIES.chris.quote, STORIES.chris.who)}
${P("Think about that for a second. A $10,000 difference in your first year is a $10,000 difference in every raise that follows. It compounds.")}
${P("In the group, you bring the offer to Wednesday and we work out what to say, live, together. No guessing alone at 11 p.m.")}
${SMALL(`Not typical, not promised. ${esc(RESULTS_VARY)}`)}
${BTN('See how it works', page(5, '#inside'))}
${CALL(5)}
${SIGN()}`,
    },
    {
      n: 6, templateId: 7, name: 'LLU Launch 6 - Black Friday, honest version', sendAt: '2026-11-27 09:12',
      ps: `${esc(offer.dealLine)} Black Friday pricing ends Monday at 11:59 pm ET. ${A('See the prices', page(6, '#pricing'))}.`,
      subject: "It's Black Friday. Here's the honest version.",
      preheader: 'The doubts I hear most, answered straight. Plus the price.',
      eyebrow: 'Black Friday', headline: 'The honest version',
      body: `
${P("Your inbox is full of Black Friday right now. Mine too. So I'll keep this honest and useful.")}
${BIG(`Group cohort: ${g.price}, regular ${g.regular}.<br>Group plus private rebuild: ${p.price}, regular ${p.regular}.`)}
${P(`CAD plus HST, for your first 3 months. ${esc(offer.dealLine)} It ends ${offer.dealEndsLong}.`)}
${P("But price isn't really the question, is it? The question is whether this will actually work for you. Here are the doubts I hear most:")}
${P('<strong>"I already paid for a coach. It went nowhere."</strong>')}
${P(`${esc(STORIES.andrew.story)} Then, after joining: &ldquo;${esc(STORIES.andrew.quote)}&rdquo; Most coaching hands you advice and leaves. Here we build it together, every week.`)}
${QUOTE('After experiencing layoffs, I invested in other career coaches but didn\'t even receive the bare minimum of support that Izzy has provided.', 'ClearCareer member, anonymous survey, December 2024')}
${P('<strong>"What if it\'s not for me?"</strong>')}
${P(`You have 7 days. Email me and I'll refund you, no awkward conversation. One condition: the guarantee ends once your rebuild work starts, because I can't take that work back.`)}
${P('<strong>"Can you promise me a job?"</strong>')}
${P("No. Nobody honest can. What I can promise is that you won't be doing this alone, and you'll know exactly what to do each week.")}
${BTN('Claim my founding seat', page(6, '#pricing'))}
${CALL(6)}
${SIGN()}`,
    },
    {
      n: 7, templateId: 8, name: 'LLU Launch 7 - Who it is for', sendAt: '2026-11-28 09:12',
      ps: "Not sure which option fits? The form asks which one you're leaning toward. Pick 'Not sure yet' and we'll figure it out together on the call.",
      subject: "Who this is for (and who it isn't)",
      preheader: 'I would rather tell you now than take your money for the wrong room.',
      eyebrow: 'Straight talk', headline: "Who this is for, and who it isn't",
      body: `
${P("I'd rather tell you now than take your money for the wrong room.")}
${P('<strong>Land and Level Up is for you if:</strong>')}
${LIST([
  'You have 5+ years of experience and a resume that undersells it.',
  "You're applying and hearing little, or interviewing and not landing.",
  "You're between roles, or quietly searching while employed.",
  'You want people in your corner every week, not another course you never finish.',
])}
${P("<strong>It's not for you if</strong> you're early in your career (my free tools fit better right now), or if you want someone to apply to jobs for you. We do the work together. You still do the work.")}
${P(`${esc(STORIES.raunika.story)}`)}
${QUOTE(STORIES.raunika.quote, STORIES.raunika.who)}
${P(`If you see yourself in that list and you're not sure which option fits, let's talk. Answer a few questions (about 5 minutes) so I can see where your search is stuck, then pick a time. If it's a fit, you can join on the call. If it isn't, I'll tell you straight.`)}
${BTN('Answer a few questions and book a call', form(7))}
${P(`Or ${A('see the prices and what is included', page(7, '#pricing'))}. Black Friday pricing ends ${offer.dealEndsLong}.`)}
${SIGN()}`,
    },
    {
      n: 8, name: 'LLU Launch 8 - Last day', sendAt: '2026-11-30 09:12',
      subject: 'Tonight at 11:59 pm',
      preheader: 'Black Friday pricing on Land and Level Up ends tonight. No extensions.',
      eyebrow: 'Last day', headline: 'Black Friday pricing ends tonight',
      body: `
${P("Short one, because you've got a life.")}
${P(`Black Friday pricing on Land and Level Up ends <strong>tonight at 11:59 pm ET</strong>. Tomorrow the group cohort goes from ${g.price} to ${g.regular}, and the private rebuild from ${p.price} to ${p.regular}. No extensions, not even for my friends. (Sorry, friends.)`)}
${P(`We start ${offer.startDateLong}. ${offer.seatsTotal} founding seats.`)}
${P("Let me ask you something. How are you doing with this job search madness? Really?")}
${P("If the honest answer is \"tired\", that's exactly who this room is for. You don't need more grit. You need a plan, a better resume, and people in your corner on Wednesday.")}
${QUOTE(STORIES.kristin.quote, STORIES.kristin.who + ', after a year of searching')}
${BTN('Claim my founding seat', page(8, '#pricing'))}
${LIST([esc(offer.paying), esc(offer.guarantee)])}
${P(`Still deciding? ${A('Answer a few questions and grab a call today', form(8))}.`)}
${SMALL(esc(RESULTS_VARY))}
${SIGN('Fortune favours the bold,')}`,
    },
    {
      n: 9, name: 'LLU Launch 9 - We start Monday', sendAt: '2026-12-04 09:12',
      subject: 'We start Monday',
      preheader: 'Last call for founding seats before the first Wednesday.',
      eyebrow: 'Monday', headline: 'We start Monday',
      body: `
${P(`Land and Level Up starts this Monday, ${offer.startDateShort}. Our first Wednesday call is ${offer.firstCallLong}.`)}
${P("This is the last email I'll send you about it. After Monday, the founding group is closed and we get to work.")}
${P('Picture next Wednesday. Your resume has numbers on it. Your LinkedIn says what you actually do. And you have a room full of people who get it, plus me, helping you figure out what to do next. Every week.')}
${P(`The group cohort is ${g.regular} plus HST for your first 3 months, or ${p.regular} with the private 1:1 rebuild. ${esc(offer.paying)} ${esc(offer.guarantee)}`)}
${BTN('Join before Monday', page(9, '#pricing'))}
${P(`Questions? ${A('Answer a few questions and grab a call', form(9))}, or just hit reply.`)}
${P("And if now isn't the time, that's okay. My free tools and guides are always there for you on the site. Keep showing up for yourself.")}
${SIGN('All the best,')}`,
    },
  ];
  return list.map((e: any) => ({
    n: e.n, templateId: e.templateId, name: e.name, subject: e.subject, preheader: e.preheader, sendAt: e.sendAt,
    html: shell(e.n, e.preheader, e.eyebrow, e.headline, e.body + (e.ps ? PS(e.ps) : '')),
  }));
}
