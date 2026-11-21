import { describe, it, expect } from 'vitest';
import { cleanAnswers, scoreLead, bookingUrl, QUALIFY, READY, NOT_READY, STRUGGLES } from '../../src/lib/book-call';

const good = {
  firstName: 'Sam', lastName: 'Lee', email: 'sam@example.com', yearsExperience: 8,
  searchLength: '3-5 months', appsPerWeek: '4-5', totalApplications: 60, interviews: 3,
  situation: 'Laid off in the last 3 months', country: 'Canada', struggles: [STRUGGLES[5]],
  challenge: 'No replies', milestones: 'Confidence', callGoal: 'See if it fits', decider: 'Just me',
  start: 'This month', payment: 'Credit card in full', ready: READY,
};

describe('book-a-call gate', () => {
  it('accepts a complete, ready, experienced lead', () => {
    const { data, errors } = cleanAnswers(good);
    expect(errors).toEqual({});
    expect(scoreLead(data)).toEqual({ qualified: true, reason: 'ok' });
  });

  it('blocks people who are not ready to invest', () => {
    const { data } = cleanAnswers({ ...good, ready: NOT_READY });
    expect(scoreLead(data)).toEqual({ qualified: false, reason: 'not-ready' });
  });

  it('blocks people under the minimum experience', () => {
    const { data } = cleanAnswers({ ...good, yearsExperience: QUALIFY.minYears - 1 });
    expect(scoreLead(data)).toEqual({ qualified: false, reason: 'experience' });
  });

  it('rejects missing or invalid answers', () => {
    const { errors } = cleanAnswers({ ...good, email: 'nope', struggles: [], ready: 'maybe' });
    expect(Object.keys(errors)).toEqual(expect.arrayContaining(['email', 'struggles', 'ready']));
  });

  it('refuses more than 3 struggles', () => {
    const { errors } = cleanAnswers({ ...good, struggles: [STRUGGLES[0], STRUGGLES[1], STRUGGLES[2], STRUGGLES[3]] });
    expect(errors.struggles).toBeTruthy();
  });

  it('only counts an explicit true as email consent', () => {
    expect(cleanAnswers({ ...good, consent: 'yes' }).data.consent).toBe(false);
    expect(cleanAnswers({ ...good, consent: true }).data.consent).toBe(true);
  });

  it('prefills Calendly with name and email', () => {
    const url = bookingUrl({ firstName: 'Sam', lastName: 'Lee', email: 'sam@example.com' });
    expect(url).toContain('calendly.com/clearcareer/discovery-call');
    expect(url).toContain('name=Sam+Lee');
    expect(url).toContain('email=sam%40example.com');
  });
});
