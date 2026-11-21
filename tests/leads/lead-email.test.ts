import { describe, it, expect } from 'vitest';
import { buildLeadEmail, insights } from '../../src/lib/lead-email';
import { cleanAnswers, scoreLead, diagnose, READY, NOT_READY, STRUGGLES } from '../../src/lib/book-call';

const raw = {
  firstName: 'Sam', lastName: 'Lee', email: 'sam@example.com', phone: '416 555 0100', jobTitles: 'Project manager',
  targetSalary: 120000, yearsExperience: 8, searchLength: '6-7 months', appsPerWeek: '6-10', totalApplications: 120,
  interviews: 3, offers: 0, situation: 'Laid off in the last 3 months', country: 'Canada', struggles: [STRUGGLES[2]],
  challenge: 'No replies <script>alert(1)</script>', milestones: 'Confidence', motivation: 2, callGoal: 'A plan',
  decider: 'Me and a partner or family member', start: 'This month', payment: 'Klarna (monthly)', program: "Group cohort", commit: "Yes, I'll have my card ready", ready: READY, consent: true,
};

describe('lead brief email', () => {
  const { data } = cleanAnswers(raw);
  const v = scoreLead(data);
  const d = diagnose(data);
  const { subject, html } = buildLeadEmail(data, v, d, new Date('2026-11-21T15:00:00Z'));

  it('puts the verdict, diagnosis and name in the subject', () => {
    expect(subject).toMatch(/^(Hot|Warm|Cool) \d+ \| Qualified \| \$[\d,]+ \| Sam Lee$/);
  });

  it('includes the diagnosis, key numbers, call plan and every section', () => {
    for (const s of ['Lead score', 'Interested in', 'Investment value', 'Group cohort', 'Diagnosis', 'Focus the call on', 'interview rate', 'Insights', 'Open the call with', 'In their words', 'Their search', 'Where they are', 'Readiness']) {
      expect(html).toContain(s);
    }
    expect(html).toContain('2.5%');
    expect(html).toContain('$10,000');
  });

  it('escapes what people type', () => {
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('flags the things to watch', () => {
    const text = insights(data, v).map((i) => `${i.tone}:${i.text}`).join('\n');
    expect(text).toContain('flag:Low motivation (2 of 5)');
    expect(text).toContain('flag:Not deciding alone');
    expect(text).toContain('Payment preference: Klarna');
    expect(text).toContain('good:Opted in to emails');
  });

  it('labels people who were not approved', () => {
    const { data: n } = cleanAnswers({ ...raw, ready: NOT_READY });
    expect(buildLeadEmail(n, scoreLead(n), diagnose(n)).subject).toContain('| Not yet |');
  });

  it('scores leads and prices programs', async () => {
    const { leadScore, programValue } = await import('../../src/lib/book-call');
    const top = { ready: READY, yearsExperience: 10, start: 'This month', decider: 'Just me', payment: 'Credit card in full', motivation: 5, program: 'Group plus private 1:1 rebuild', commit: "Yes, I'll have my card ready" };
    expect(leadScore(top)).toEqual({ score: 100, grade: 'Hot' });
    expect(leadScore({ ...top, ready: NOT_READY })).toEqual({ score: 49, grade: 'Cool' });
    expect(programValue('Group cohort', new Date('2026-11-25T12:00:00Z')).label).toBe('$949');
    expect(programValue('Group cohort', new Date('2026-12-02T12:00:00Z')).label).toBe('$1,200');
    expect(programValue('Not sure yet', new Date('2026-11-25T12:00:00Z')).label).toBe('$949 to $1,797');
  });
});
