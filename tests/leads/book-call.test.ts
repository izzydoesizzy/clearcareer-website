import { describe, it, expect } from 'vitest';
import { cleanAnswers, scoreLead, bookingUrl, diagnose, QUALIFY, READY, NOT_READY, STRUGGLES } from '../../src/lib/book-call';

const good = {
  firstName: 'Sam', lastName: 'Lee', email: 'sam@example.com', phone: '416 555 0100', jobTitles: 'PM', targetSalary: 100000, motivation: 4, offers: 0, yearsExperience: 8,
  searchLength: '3-5 months', appsPerWeek: '4-5', totalApplications: 60, interviews: 3,
  situation: 'Laid off in the last 3 months', country: 'Canada', struggles: [STRUGGLES[5]],
  challenge: 'No replies', milestones: 'Confidence', callGoal: 'See if it fits', decider: 'Just me',
  start: 'This month', payment: 'Credit card in full', program: 'Group cohort', ready: READY,
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

  it('requires the fields that used to be optional', () => {
    const { errors } = cleanAnswers({ ...good, lastName: '', phone: '12', jobTitles: '', targetSalary: '', motivation: undefined });
    expect(Object.keys(errors)).toEqual(expect.arrayContaining(['lastName', 'phone', 'jobTitles', 'targetSalary', 'motivation']));
  });

  it('rejects more offers than interviews', () => {
    expect(cleanAnswers({ ...good, interviews: 1, offers: 2 }).errors.offers).toBeTruthy();
  });
});

describe('diagnosis', () => {
  const d = (o: object) => diagnose({ appsPerWeek: '4-5', totalApplications: 60, interviews: 0, offers: 0, ...o }).key;
  it('low volume means clarity', () => {
    expect(d({ appsPerWeek: '0-1', totalApplications: 5, interviews: 0 })).toBe('clarity');
    expect(d({ appsPerWeek: 'None', totalApplications: 0 })).toBe('clarity');
  });
  it('high volume with few interviews means targeting or resume', () => {
    expect(d({ appsPerWeek: '6-10', totalApplications: 120, interviews: 3 })).toBe('positioning');
    expect(d({ appsPerWeek: '2-3', totalApplications: 200, interviews: 2 })).toBe('positioning');
  });
  it('interviews without offers means interviewing', () => {
    expect(d({ totalApplications: 60, interviews: 6, offers: 0 })).toBe('interviewing');
    expect(d({ appsPerWeek: '0-1', totalApplications: 10, interviews: 4, offers: 0 })).toBe('interviewing');
  });
  it('healthy numbers mean fine-tuning', () => {
    expect(d({ totalApplications: 40, interviews: 8, offers: 3 })).toBe('tuning');
  });
});
