import { describe, it, expect } from 'vitest';
import { brevoPayload, emailMode } from '../../src/lib/brevo-api';
import { checkoutLinks } from '../../src/lib/checkout';

const mail = { to: 'sam@example.com', toName: 'Sam', subject: 'Hello', html: '<p>Hi</p>', bcc: 'izzy@joinclearcareer.com', tags: ['x'] };

describe('email switch', () => {
  it('sends normally when live (the default)', () => {
    const p = brevoPayload(mail, emailMode({}))!;
    expect(p.to).toEqual([{ email: 'sam@example.com', name: 'Sam' }]);
    expect(p.subject).toBe('Hello');
    expect(p.bcc).toEqual([{ email: 'izzy@joinclearcareer.com' }]);
  });
  it('sends nothing when off, so no credits are used', () => {
    expect(brevoPayload(mail, emailMode({ EMAIL_MODE: 'off' }))).toBeNull();
  });
  it('sends only to the test inbox when testing, and says who it was for', () => {
    const p = brevoPayload(mail, emailMode({ EMAIL_MODE: 'test', EMAIL_TEST_TO: 'ipiyale@gmail.com' }))!;
    expect(p.to).toEqual([{ email: 'ipiyale@gmail.com' }]);
    expect(p.subject).toBe('[TEST for sam@example.com] Hello');
    expect(p.bcc).toBeUndefined();
  });
  it('adds the Brevo sandbox header in sandbox mode', () => {
    expect(brevoPayload(mail, emailMode({ EMAIL_MODE: 'sandbox' }))!.headers).toEqual({ 'X-Sib-Sandbox': 'drop' });
  });
});

describe('checkout links', () => {
  const env = {
    PUBLIC_GROUP_CHECKOUT_URL: 'https://buy.stripe.com/bf-group', PUBLIC_PRIVATE_CHECKOUT_URL: 'https://buy.stripe.com/bf-private',
    PUBLIC_GROUP_CHECKOUT_URL_REGULAR: 'https://buy.stripe.com/reg-group', PUBLIC_PRIVATE_CHECKOUT_URL_REGULAR: 'https://buy.stripe.com/reg-private',
  };
  it('uses the Black Friday links until the deadline, then the regular ones', () => {
    expect(checkoutLinks(env, new Date('2026-11-30T23:00:00-05:00')).group).toBe('https://buy.stripe.com/bf-group');
    expect(checkoutLinks(env, new Date('2026-12-01T00:30:00-05:00')).group).toBe('https://buy.stripe.com/reg-group');
    expect(checkoutLinks({}, new Date('2026-12-02T00:00:00Z'))).toEqual({ group: undefined, private: undefined });
  });
});
