import { describe, it, expect, vi, afterEach } from 'vitest';
import { makeAccessToken, readAccessToken, accessUrl } from '../../src/lib/access';
import { purchaseEmail, purchaseSubject, deliverPurchase, orderFromSession, productLink, catalogItem } from '../../src/lib/purchase-emails';
import { cartSubtotal, FUNNEL } from '../../src/lib/career-funnel-test';

const SECRET = 'test-secret';
const order = {
  firstName: 'Sam',
  email: 'sam@example.com',
  lines: [
    { product: 'vault', amount: 900, url: 'https://joinclearcareer.com/tools/career-prompt-vault/access?t=abc' },
    { product: 'salary-generator', amount: 900, url: 'https://joinclearcareer.com/products/salary-generator/access/abc' },
    { product: 'script-vault', amount: 2900, url: 'https://joinclearcareer.com/products/script-vault/access/abc' },
  ],
  subtotal: 4700,
  tax: 611,
  total: 5311,
};

describe('access tokens', () => {
  it('opens only the product and email it was made for', async () => {
    const t = await makeAccessToken('vault', 'Sam@Example.com ', SECRET);
    expect(await readAccessToken('vault', t, SECRET)).toBe('sam@example.com');
    expect(await readAccessToken('script-vault', t, SECRET)).toBeNull();
    expect(await readAccessToken('vault', t, 'other-secret')).toBeNull();
    expect(await readAccessToken('vault', t.replace(/.$/, (c) => (c === 'a' ? 'b' : 'a')), SECRET)).toBeNull();
    expect(await readAccessToken('vault', 'cs_test_123', SECRET)).toBeNull();
    expect(await readAccessToken('vault', t, '')).toBeNull();
  });
  it('points each product at its access page', () => {
    expect(accessUrl('vault', 'x.y')).toBe('https://joinclearcareer.com/tools/career-prompt-vault/access?t=x.y');
    expect(accessUrl('layoff-survival-kit', 'x.y')).toBe('https://joinclearcareer.com/layoff-survival-kit/access/x.y');
    expect(accessUrl('script-vault', 'x.y', 'https://preview.example')).toBe('https://preview.example/products/script-vault/access/x.y');
  });
  it('falls back to the Checkout Session link without a secret', async () => {
    expect(await productLink('vault', 'a@b.co', {}, undefined, 'cs_1')).toContain('session_id=cs_1');
    expect(await productLink('script-vault', 'a@b.co', {}, undefined, 'cs_1')).toBe('https://joinclearcareer.com/products/script-vault/access/cs_1');
    expect(await productLink('vault', 'a@b.co', { ACCESS_SECRET: SECRET })).toContain('?t=');
  });
});

describe('purchase email', () => {
  const { subject, html } = purchaseEmail(order);
  it('lists every item with its own button, the tax and the total', () => {
    expect(subject).toBe('Your ClearCareer order is ready (3 items)');
    for (const l of order.lines) expect(html).toContain(l.url.replace(/&/g, '&amp;'));
    expect(html).toContain('Open the Prompt Vault');
    expect(html).toContain('Open the Script Vault');
    expect(html).toContain('$6.11');
    expect(html).toContain('$53.11');
    expect(html).toContain('Hey Sam,');
    expect(html).toContain('Reply to this email');
  });
  it('reads naturally for one item, and has no em dashes', () => {
    expect(purchaseSubject({ ...order, lines: [order.lines[0]] })).toBe('Your Career Prompt Vault is ready');
    const one = purchaseEmail({ ...order, lines: [order.lines[0]], tax: 0, subtotal: 900, total: 900 }).html;
    expect(one).toContain("Your link is below");
    expect(one).not.toContain('>Tax<');
    expect(html.includes('—') || one.includes('—')).toBe(false);
    expect(html).not.toMatch(/CHARM/i);
  });
  it('knows shop products from the product catalog', () => {
    expect(catalogItem('cold-outreach-pack')).not.toBeUndefined();
    expect(catalogItem('adhd-cheat-sheet')).toBeNull(); // free, nothing to deliver
    expect(catalogItem('land-and-level-up')).toBeNull();
  });
});

describe('orders from Stripe', () => {
  it('turns a paid Checkout Session into an order', async () => {
    const o = await orderFromSession(
      { id: 'cs_1', metadata: { product: 'vault' }, customer_details: { email: 'Sam@Example.com', name: 'Sam Lee' }, amount_subtotal: 900, amount_total: 1017, total_details: { amount_tax: 117 }, currency: 'cad' },
      { ACCESS_SECRET: SECRET },
    );
    expect(o?.email).toBe('sam@example.com');
    expect(o?.firstName).toBe('Sam');
    expect(o?.tax).toBe(117);
    expect(o?.lines[0].url).toContain('/tools/career-prompt-vault/access?t=');
    expect(await orderFromSession({ id: 'cs_2', metadata: { product: 'land-and-level-up' }, customer_details: { email: 'a@b.co' } }, {})).toBeNull();
  });
});

describe('funnel catalog', () => {
  it('prices the order box and the upsell', () => {
    expect(cartSubtotal(false)).toBe(900);
    expect(cartSubtotal(true)).toBe(1800);
    expect(FUNNEL.upsell.amount).toBe(2900);
    expect(FUNNEL.main.product).toBe('vault');
  });
});

describe('Brevo delivery', () => {
  afterEach(() => vi.unstubAllGlobals());
  const mock = (refs = '') => {
    const calls: { url: string; body?: any }[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : undefined });
      if (url.includes('/contacts/') && !init?.method) return new Response(JSON.stringify({ email: 'sam@example.com', attributes: { PURCHASE_REFS: refs, PURCHASES: 'Layoff Survival Kit' } }), { status: 200 });
      return new Response('{}', { status: 201 });
    }));
    return calls;
  };
  const env = { BREVO_API_KEY: 'k', BREVO_CUSTOMERS_LIST_ID: '9', EMAIL_MODE: 'live' };

  it('sends once and records the order on the contact', async () => {
    const calls = mock();
    expect(await deliverPurchase(env, { ...order, ref: 'cs_1', name: 'Sam Lee' }, { record: true })).toBe('sent');
    const sent = calls.find((c) => c.url.endsWith('/smtp/email'))!;
    expect(sent.body.to[0].email).toBe('sam@example.com');
    const up = calls.find((c) => c.url.endsWith('/contacts') && c.body)!;
    expect(up.body.listIds).toEqual([9]);
    expect(up.body.attributes.PURCHASE_REFS).toBe('cs_1');
    expect(up.body.attributes.PURCHASES).toContain('Layoff Survival Kit');
    expect(up.body.attributes.PURCHASES).toContain('Job Search Script Vault');
  });
  it('skips an order that was already emailed', async () => {
    const calls = mock('cs_0,cs_1');
    expect(await deliverPurchase(env, { ...order, ref: 'cs_1' }, { record: true })).toBe('duplicate');
    expect(calls.some((c) => c.url.endsWith('/smtp/email'))).toBe(false);
  });
  it('test mode only ever emails the test inbox', async () => {
    const calls = mock();
    await deliverPurchase(env, { ...order, ref: 'cs_3' }, { record: false, mode: { mode: 'test', testTo: 'izzy@joinclearcareer.com' } });
    const sent = calls.find((c) => c.url.endsWith('/smtp/email'))!;
    expect(sent.body.to[0].email).toBe('izzy@joinclearcareer.com');
    expect(sent.body.subject).toMatch(/^\[TEST for sam@example.com\]/);
    expect(calls.some((c) => c.url.endsWith('/contacts') && c.body)).toBe(false);
  });
});
