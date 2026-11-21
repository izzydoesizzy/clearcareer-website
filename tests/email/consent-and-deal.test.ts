import { describe, it, expect } from 'vitest';
import { buildEmail as buildBoldConversion } from '../../src/lib/email/templates/bold-conversion';
import { dealIsLive, dealPostscript } from '../../src/lib/email/deal';
import { CONSENT_TEXT, NEWSLETTER_CONSENT_TEXT } from '../../src/lib/consent';
import type { EmailData } from '../../src/lib/email/types';

const base: EmailData = {
  productName: 'Test resource',
  primaryCta: { text: 'Open', url: 'https://joinclearcareer.com/resources/x' },
  quickTip: { label: 'Quick tip', text: 'Tip text.' },
  upsell: { headline: 'Headline', description: 'Description', bullets: ['One'], buttonText: 'Go', buttonUrl: 'https://joinclearcareer.com' },
  testimonial: { quote: 'Quote.', name: 'Name', outcome: 'Outcome' },
  discoveryCall: { text: 'Talk?', url: 'https://calendly.com/clearcareer/discovery-call' },
  unsubscribeUrl: '{{unsubscribe}}',
};

describe('Black Friday P.S. and opt-in rules', () => {
  it('adds the P.S. only when the person opted in', () => {
    const withIt = buildBoldConversion({ ...base, dealPostscript: true });
    const without = buildBoldConversion({ ...base, dealPostscript: false });
    if (dealIsLive()) {
      expect(withIt).toContain('/land-and-level-up?utm_source=email');
      expect(withIt).toContain('Black Friday pricing ends Monday, November 30');
    }
    expect(without).not.toContain('/land-and-level-up');
  });

  it('always includes the mailing address and an unsubscribe link', () => {
    const html = buildBoldConversion(base);
    expect(html).toContain('710-20 Tubman Ave');
    expect(html).toContain('{{unsubscribe}}');
  });

  it('stops advertising after the deal ends', () => {
    expect(dealIsLive(new Date('2026-11-30T23:00:00-05:00'))).toBe(true);
    expect(dealIsLive(new Date('2026-12-01T00:30:00-05:00'))).toBe(false);
    if (!dealIsLive()) expect(dealPostscript()).toBe('');
  });

  it('keeps the wording free of em dashes', () => {
    expect(CONSENT_TEXT).not.toMatch(/[—–]/);
    expect(NEWSLETTER_CONSENT_TEXT).not.toMatch(/[—–]/);
  });
});
