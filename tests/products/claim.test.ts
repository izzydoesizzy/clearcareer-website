/** The free product signup: consent decides the nurture list; the product is sent either way. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../../src/pages/api/products/[slug]/claim';

const call = (slug: string, body: Record<string, unknown>) =>
  POST({
    params: { slug },
    request: new Request(`https://example.test/api/products/${slug}/claim`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }),
    url: new URL(`https://example.test/api/products/${slug}/claim`),
  } as never) as Promise<Response>;

describe('free claim', () => {
  let calls: { url: string; body?: any }[] = [];
  beforeEach(() => {
    calls = [];
    process.env.BREVO_API_KEY = 'k';
    process.env.BREVO_NURTURE_LIST_ID = '7';
    process.env.ACCESS_SECRET = 'test-secret';
    process.env.EMAIL_MODE = 'live';
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : undefined });
      return new Response('{}', { status: 201 });
    }));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    for (const k of ['BREVO_API_KEY', 'BREVO_NURTURE_LIST_ID', 'ACCESS_SECRET', 'EMAIL_MODE']) delete process.env[k];
  });

  it('sends the audit and returns the link; no consent means no nurture list', async () => {
    const r = await call('career-clarity-audit', { email: 'Sam@Example.com', firstName: 'Sam', consent: false });
    expect(r.status).toBe(200);
    const data = await r.json();
    expect(data.url).toContain('/products/career-clarity-audit/access/');
    const upsert = calls.find((c) => c.url.endsWith('/contacts') && c.body)!;
    expect(upsert.body.listIds).toEqual([3]);
    expect(upsert.body.attributes.MARKETING_CONSENT).toBe(false);
    const mail = calls.find((c) => c.url.endsWith('/smtp/email'))!;
    expect(mail.body.to[0].email).toBe('sam@example.com');
    expect(mail.body.htmlContent).toContain('free copy');
    expect(mail.body.htmlContent).not.toContain('Your order');
  });

  it('adds them to the nurture list only with consent, and records what they agreed to', async () => {
    await call('career-clarity-audit', { email: 'sam@example.com', consent: true });
    const upsert = calls.find((c) => c.url.endsWith('/contacts') && c.body)!;
    expect(upsert.body.listIds).toEqual([3, 7]);
    expect(upsert.body.attributes.CONSENT_WORDING).toBeTruthy();
    expect(upsert.body.attributes.CONSENT_VERSION).toBeTruthy();
  });

  it('ignores bots, refuses bad emails and paid products', async () => {
    expect((await call('career-clarity-audit', { email: 'sam@example.com', website: 'spam' })).status).toBe(200);
    expect(calls.length).toBe(0);
    expect((await call('career-clarity-audit', { email: 'nope' })).status).toBe(400);
    expect((await call('interview-dossier', { email: 'sam@example.com' })).status).toBe(404);
    expect((await call('adhd-cheat-sheet', { email: 'sam@example.com' })).status).toBe(404); // hidden
  });
});
