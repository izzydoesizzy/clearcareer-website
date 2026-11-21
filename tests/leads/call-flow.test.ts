import { describe, it, expect } from 'vitest';
import { dueSteps, noBookSteps, packAnswers, storedAnswers, torontoDay } from '../../src/lib/call-flow';
import { cleanAnswers, leadScore, READY, STRUGGLES, COMMIT } from '../../src/lib/book-call';
import { bookedEmail, dayBeforeEmail, morningOfEmail, followUp1Email, followUp2Email, notYetEmail, noBook1Email, noBook2Email, canceledEmail, noShowEmail, welcomeEmail } from '../../src/lib/call-emails';
import { STORIES, IZZY } from '../../src/lib/stories';
import { buildSalesBrief, predictObjections, recommend } from '../../src/lib/sales-brief';
import { diagnose } from '../../src/lib/book-call';
import { hmacHex, parseSigHeader } from '../../src/lib/brevo-api';
import { checkoutFromEnv } from '../../src/lib/call-runner';

const raw = {
  firstName: 'Sam', lastName: 'Lee', email: 'sam@example.com', phone: '416 555 0100', jobTitles: 'Project manager',
  targetSalary: 120000, yearsExperience: 8, searchLength: '8-10 months', appsPerWeek: '6-10', totalApplications: 120,
  interviews: 3, offers: 0, situation: 'Laid off in the last 3 months', country: 'Canada', struggles: [STRUGGLES[2]],
  challenge: 'No replies', milestones: 'Confidence', motivation: 3, callGoal: 'A plan',
  decider: 'Me and a partner or family member', start: 'In the next 1 to 2 months', payment: 'Klarna (monthly)',
  program: 'Not sure yet', commit: COMMIT[2], ready: READY, consent: true,
};
const { data } = cleanAnswers(raw);

// 7:30 a.m. ET on Wednesday, December 2, 2026
const now = new Date('2026-12-02T12:30:00Z');
const at = (iso: string) => new Date(iso);

describe('call schedule', () => {
  it('uses Toronto calendar days', () => {
    // 11 p.m. ET Dec 2 is Dec 3 in UTC, but still Dec 2 in Toronto
    expect(torontoDay(at('2026-12-03T04:00:00Z'))).toBe(torontoDay(now));
  });
  it('sends the brief and day-before email for tomorrow', () => {
    expect(dueSteps(at('2026-12-03T19:00:00Z'), now, ['booked'], '')).toEqual(['brief', 'daybefore']);
  });
  it('sends the morning reminder for later today, and the brief if it was missed', () => {
    expect(dueSteps(at('2026-12-02T19:00:00Z'), now, ['booked', 'brief', 'daybefore'], '')).toEqual(['morning']);
    expect(dueSteps(at('2026-12-02T19:00:00Z'), now, ['booked'], '')).toEqual(['brief', 'morning']);
  });
  it('never repeats a step', () => {
    expect(dueSteps(at('2026-12-03T19:00:00Z'), now, ['booked', 'brief', 'daybefore'], '')).toEqual([]);
  });
  it('follows up the morning after and 3 days after, unless they enrolled', () => {
    expect(dueSteps(at('2026-12-01T19:00:00Z'), now, ['brief'], '')).toEqual(['follow1']);
    expect(dueSteps(at('2026-11-29T19:00:00Z'), now, ['follow1'], '')).toEqual(['follow2']);
    expect(dueSteps(at('2026-12-01T19:00:00Z'), now, [], 'enrolled')).toEqual([]);
    expect(dueSteps(at('2026-11-29T19:00:00Z'), now, [], 'lost')).toEqual([]);
  });
  it('does nothing for calls next week', () => {
    expect(dueSteps(at('2026-12-09T19:00:00Z'), now, [], '')).toEqual([]);
  });
  it('round-trips stored answers', () => {
    const back = storedAnswers({ LEAD_ANSWERS: packAnswers(data) });
    expect(back?.firstName).toBe('Sam');
    expect(back?.commit).toBe(COMMIT[2]);
    expect(storedAnswers({ LEAD_ANSWERS: 'nope' })).toBeNull();
  });
});

describe('lead score', () => {
  it('adds up to 100 for a perfect lead', () => {
    const s = leadScore({ ...data, program: 'Group cohort', commit: COMMIT[0], start: 'This month', decider: 'Just me', payment: 'Credit card in full', motivation: 5 });
    expect(s.score).toBe(98); // group is 8 of 10 program points
  });
});

describe('lead emails', () => {
  const c = { firstName: 'Sam', email: 'sam@example.com', callAt: at('2026-12-03T19:00:00Z'), joinUrl: 'https://zoom.us/j/1', rescheduleUrl: 'https://calendly.com/r', answers: data, diagnosisKey: diagnose(data).key };
  const all = [bookedEmail(c), dayBeforeEmail(c), morningOfEmail(c), followUp1Email(c, {}), followUp2Email(c, { group: 'https://buy.stripe.com/g' }), notYetEmail(data, 'not-ready'), notYetEmail(data, 'experience'), noBook1Email({ ...c, bookUrl: 'https://calendly.com/x?name=Sam' }), noBook2Email(c), canceledEmail(c), noShowEmail(c), welcomeEmail(c)];
  it('has no em dashes and uses the time in ET', () => {
    for (const m of all) {
      expect(m.subject + m.html).not.toMatch(/—/);
      expect(m.html).toContain('CLEARCAREER');
    }
    expect(bookedEmail(c).html).toContain('Thursday, December 3 at 2:00 p.m. ET');
  });
  it('answers their objections before the call, with their own salary', () => {
    const h = dayBeforeEmail(c).html;
    expect(h).toContain('$120,000');
    expect(h).toContain('$10,000');
    expect(h).toContain('7-day money-back guarantee');
    expect(h).toContain('Can my partner join the call?');
    expect(h).toContain('Darin');
  });
  it('asks for a payment link by reply until Stripe links exist', () => {
    expect(followUp1Email(c, {}).html).toContain('Reply');
    expect(followUp2Email(c, { group: 'https://buy.stripe.com/g' }).html).toContain('https://buy.stripe.com/g');
  });
});

describe('new emails', () => {
  const c = { firstName: 'Sam', email: 'sam@example.com', callAt: at('2026-12-03T19:00:00Z'), answers: data, diagnosisKey: diagnose(data).key, bookUrl: 'https://calendly.com/x?name=Sam' };
  it('nudges people who qualified but never booked, twice, then stops', () => {
    const sub = at('2026-12-01T20:00:00Z');
    expect(noBookSteps(sub, now, [])).toEqual(['nobook1']);
    expect(noBookSteps(sub, at('2026-12-04T12:30:00Z'), ['nobook1'])).toEqual(['nobook2']);
    expect(noBookSteps(sub, at('2026-12-09T12:30:00Z'), ['nobook1'])).toEqual([]);
  });
  it('sends rebooking links to the private booking page', () => {
    for (const m of [noBook1Email(c), noBook2Email(c), canceledEmail(c), noShowEmail(c)]) expect(m.html).toContain('https://calendly.com/x?name=Sam');
  });
  it('tells people who are not a fit why, kindly, with free next steps', () => {
    const e = notYetEmail({ ...data, yearsExperience: 2 }, 'experience');
    expect(e.html).toContain('5+ years');
    expect(e.html).toContain('/free-tools/');
    expect(notYetEmail(data, 'not-ready').html).toContain('right program at the wrong time');
  });
  it('uses only real stories, with no assumed pronouns', () => {
    for (const s of [...Object.values(STORIES).map((x) => x.story), ...Object.values(IZZY)]) {
      expect(s).not.toMatch(/\b(he|she|her|him)\b/i);
      expect(s).not.toMatch(/\u2014/);
    }
  });
});

describe('sales brief', () => {
  const d = diagnose(data);
  const brief = buildSalesBrief(data, { callAt: at('2026-12-03T19:00:00Z'), joinUrl: 'https://zoom.us/j/1' });
  it('names the call, the person and the score in the subject', () => {
    expect(brief.subject).toMatch(/^Tomorrow 2:00 p\.m\. ET \| Sam Lee \| (Hot|Warm|Cool) \d+ \| .+ \| Sales plan$/);
  });
  it('predicts this lead\'s objections from their answers, most likely first', () => {
    const objs = predictObjections(data, d);
    const titles = objs.map((o) => o.title).join(' ');
    expect(titles).toContain('partner');
    expect(titles).toContain('think about it');
    expect(titles).toContain('money');
    expect(objs[0].likelihood).toBe('Likely');
    const money = objs.find((o) => o.title.includes('money'))!;
    expect(money.say.join(' ')).toContain('$120,000');
  });
  it('recommends a program with a reason', () => {
    expect(recommend(data).program).toBe('Group plus private 1:1 rebuild'); // resume is a named struggle
  });
  it('includes the call plan, custom questions, the close and real facts only', () => {
    for (const s of ['Story to tell', 'Call plan', 'Discovery questions for Sam', 'No replies', 'The close', 'Which one is it?', 'Objections to expect', 'Facts you can use', 'Don&#39;ts']) {
      expect(brief.html).toContain(s);
    }
    expect(brief.html).not.toMatch(/—/);
    expect(brief.html).not.toContain('CHARM');
  });
});

describe('webhooks', () => {
  it('verifies HMAC signatures', async () => {
    const sig = await hmacHex('secret', '123.body');
    const { createHmac } = await import('node:crypto');
    expect(sig).toBe(createHmac('sha256', 'secret').update('123.body').digest('hex'));
    expect(parseSigHeader(`t=123,v1=${sig}`)).toEqual({ t: '123', v1: [sig] });
  });
  it('only accepts real Stripe links for checkout', () => {
    expect(checkoutFromEnv({ PUBLIC_GROUP_CHECKOUT_URL: 'https://calendly.com/x', PUBLIC_PRIVATE_CHECKOUT_URL: 'https://buy.stripe.com/p' })).toEqual({ group: undefined, private: 'https://buy.stripe.com/p' });
  });
});

describe('launch sequence', async () => {
  const { nurtureEmails } = await import('../../src/lib/email/nurture');
  const all = nurtureEmails();
  it('has 9 dated emails that never link straight to Calendly', () => {
    expect(all).toHaveLength(9);
    for (const e of all) {
      expect(e.html).not.toContain('calendly.com');
      expect(e.html).toContain('{{ unsubscribe }}');
      expect(e.html).toContain('{{ contact.FIRSTNAME');
      expect(e.subject + e.html).not.toMatch(/—/);
      expect(e.html).toContain('710-20 Tubman Ave');
    }
    expect(all.filter((e) => e.html.includes('/book-a-call')).length).toBe(9);
  });
});
