/**
 * Delivery for every digital product: one Brevo email with an "Open" button per item, the order
 * total, and a reply-to-Izzy line. Used by the Stripe webhooks (live) and the test funnel.
 *
 * Idempotent two ways:
 *   - live: the Brevo contact keeps the last 20 order refs in PURCHASE_REFS, so a Stripe retry,
 *     or both webhooks firing, never sends twice
 *   - test funnel: the caller marks the Checkout Session `delivered` (no contact is written)
 *
 * Contact fields (create once with scripts/brevo-setup.mjs): PURCHASES, LAST_PURCHASE_AT, PURCHASE_REFS.
 * List: BREVO_CUSTOMERS_LIST_ID ("Customers: digital products").
 */
import { brevo, emailMode, type EmailMode } from './brevo-api.js';
import { ui } from './call-emails.js';
import { makeAccessToken, accessSecret, accessUrl, type AccessProduct } from './access.js';
import { PRODUCTS } from '../data/product-config.js';
import { LLU_PITCH, LLU_URL } from '../data/llu-pitch.js';

const { shell, P, H, button, link, small, sign, esc } = ui;

export interface CatalogItem { name: string; blurb: string; open: string; start: string }

/** What each product is, and where to start. Only facts from the product pages. */
export const CATALOG: Record<AccessProduct, CatalogItem> = {
  vault: {
    name: 'Career Prompt Vault',
    blurb: '50 AI prompts for your resume, LinkedIn, interviews, outreach, salary research and negotiation.',
    open: 'Open the Prompt Vault',
    start: "Start with the Career Highlights Extractor. Upload your resume, run it, and you'll have a list of achievements with numbers that every other prompt can use.",
  },
  'salary-generator': {
    name: 'Salary Number Generator',
    blurb: 'Your anchor, target and walk-away numbers, with word-for-word scripts.',
    open: 'Open the Salary Number Generator',
    start: 'Work out your numbers before the first salary conversation, not after the offer lands.',
  },
  'script-vault': {
    name: 'Job Search Script Vault',
    blurb: '100+ copy-paste scripts for outreach, follow-ups, interviews, negotiation and more.',
    open: 'Open the Script Vault',
    start: 'Start with the cold outreach scripts. Pick one person at a company you want, and send one today.',
  },
  'layoff-survival-kit': {
    name: 'Layoff Survival Kit',
    blurb: 'Severance calculator, lawyer directory and 10 complete guides.',
    open: 'Open the Layoff Survival Kit',
    start: 'Run the severance calculator first. It takes 2 minutes and tells you whether your package is fair before you sign anything.',
  },
};

export function catalogItem(product: string): CatalogItem | null {
  if (product in CATALOG) return CATALOG[product as AccessProduct];
  const p = PRODUCTS[product];
  if (!p || p.price <= 0) return null;
  return { name: p.name.replace(/^The /, ''), blurb: p.description, open: `Open ${p.name.replace(/^The /, 'the ')}`, start: '' };
}

export interface PurchaseLine { product: string; amount: number; url: string }
export interface Order {
  firstName?: string;
  email: string;
  lines: PurchaseLine[];
  /** Cents, before tax. */
  subtotal: number;
  tax: number;
  total: number;
  currency?: string;
}

export const money = (cents: number, currency = 'CAD') =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(cents / 100);

export function purchaseSubject(o: Order): string {
  const names = o.lines.map((l) => catalogItem(l.product)?.name).filter(Boolean) as string[];
  return names.length === 1 ? `Your ${names[0]} is ready` : `Your ClearCareer order is ready (${names.length} items)`;
}

const REASON = "You're getting this because you bought something from ClearCareer. It's your receipt and your access links, so it's sent even if you're not on my email list.";
const UNSUB = 'mailto:izzy@joinclearcareer.com?subject=Question%20about%20my%20order';

export function purchaseEmail(o: Order): { subject: string; html: string } {
  const cur = o.currency || 'CAD';
  const items = o.lines
    .map((l) => ({ l, c: catalogItem(l.product) }))
    .filter((x): x is { l: PurchaseLine; c: CatalogItem } => !!x.c);
  const one = items.length === 1;

  const blocks = items
    .map(({ l, c }) =>
      `${one ? '' : H(c.name)}${P(esc(c.blurb))}${button(c.open, l.url)}${c.start ? small(`<strong>Where to start:</strong> ${esc(c.start)}`) : ''}`,
    )
    .join('');

  const row = (label: string, value: string, bold = false) =>
    `<tr><td style="padding:8px 0;border-top:1px solid #e5e7eb;font-size:15px;color:#334155;${bold ? 'font-weight:700;' : ''}">${label}</td><td align="right" style="padding:8px 0;border-top:1px solid #e5e7eb;font-size:15px;color:#334155;white-space:nowrap;${bold ? 'font-weight:700;' : ''}">${value}</td></tr>`;
  const summary =
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;">` +
    items.map(({ l, c }) => row(esc(c.name), money(l.amount, cur))).join('') +
    (o.tax > 0 ? row('Tax', money(o.tax, cur)) : '') +
    row(`Total (${cur})`, money(o.total, cur), true) +
    `</table>`;

  const body =
    (o.firstName ? P(`Hey ${esc(o.firstName)},`) : P('Hey there,')) +
    P(
      one
        ? "Thanks for your order. Your link is below. It doesn't expire, so keep this email somewhere you can find it."
        : "Thanks for your order. Your links are below. They don't expire, so keep this email somewhere you can find it.",
    ) +
    blocks +
    H('Your order') +
    summary +
    P("Something not working, or not sure how to use it? Reply to this email. It comes straight to me.") +
    sign('Happy searching,') +
    P(`P.S. ${esc(LLU_PITCH.headline)} ${esc(LLU_PITCH.description)} ${link(LLU_PITCH.button, LLU_URL)}`, 'font-size:15px;');

  const headline = one ? 'Your link is inside, and it never expires.' : 'Your links are inside, and they never expire.';
  return { subject: purchaseSubject(o), html: shell('', headline, body, REASON, UNSUB) };
}

/** The signed "open it" link for one product, or a Checkout Session link when no secret is set. */
export async function productLink(
  product: string,
  email: string,
  env: Record<string, unknown>,
  origin = 'https://joinclearcareer.com',
  sessionId?: string,
): Promise<string> {
  const secret = accessSecret(env);
  if (secret) return accessUrl(product, await makeAccessToken(product, email, secret), origin);
  if (!sessionId) return `${origin}/tools`;
  return product === 'vault'
    ? `${origin}/tools/career-prompt-vault/access?session_id=${encodeURIComponent(sessionId)}`
    : accessUrl(product, sessionId, origin);
}

export type DeliverResult = 'sent' | 'duplicate' | 'failed' | 'skipped';

/**
 * Sends the order email. With `record`, the Brevo contact is updated (PURCHASES, LAST_PURCHASE_AT,
 * PURCHASE_REFS, Customers list) and used to skip an order that was already emailed.
 */
export async function deliverPurchase(
  env: Record<string, unknown>,
  o: Order & { ref: string; name?: string },
  opts: { record: boolean; mode?: { mode: EmailMode; testTo: string } },
): Promise<DeliverResult> {
  const key = String(env.BREVO_API_KEY || '');
  if (!key || !o.email || !o.lines.length) return 'skipped';
  const api = brevo(key);
  const email = o.email.trim().toLowerCase();

  let refs: string[] = [];
  let had: string[] = [];
  if (opts.record) {
    const c = await api.getContact(email);
    refs = String(c?.attributes?.PURCHASE_REFS || '').split(',').filter(Boolean);
    had = String(c?.attributes?.PURCHASES || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (refs.includes(o.ref)) return 'duplicate';
  }

  const { subject, html } = purchaseEmail(o);
  const ok = await api.send(
    { to: email, toName: o.name || undefined, subject, html, tags: ['purchase', ...o.lines.map((l) => l.product)], replyTo: { email: 'izzy@joinclearcareer.com', name: 'Izzy Piyale-Sheard' } },
    opts.mode || emailMode(env),
  );
  if (!ok) return 'failed';

  if (opts.record) {
    const names = o.lines.map((l) => catalogItem(l.product)?.name).filter(Boolean) as string[];
    const listId = Number(env.BREVO_CUSTOMERS_LIST_ID) || 0;
    const [first, ...rest] = String(o.name || '').trim().split(/\s+/);
    await api.upsert(
      email,
      {
        ...(o.firstName || first ? { FIRSTNAME: o.firstName || first } : {}),
        ...(rest.length ? { LASTNAME: rest.join(' ') } : {}),
        PURCHASES: [...new Set([...had, ...names])].join(', '),
        LAST_PURCHASE_AT: new Date().toISOString().slice(0, 10),
        PURCHASE_REFS: [...refs, o.ref].slice(-20).join(','),
      },
      listId ? [listId] : [],
    );
  }
  return 'sent';
}

/** A paid Checkout Session for a digital product (metadata.product), as an order. Null if it isn't one. */
export async function orderFromSession(
  s: {
    id: string;
    metadata?: Record<string, string> | null;
    customer_details?: { email?: string | null; name?: string | null } | null;
    customer_email?: string | null;
    amount_subtotal?: number | null;
    amount_total?: number | null;
    total_details?: { amount_tax?: number | null } | null;
    currency?: string | null;
  },
  env: Record<string, unknown>,
  origin = 'https://joinclearcareer.com',
): Promise<(Order & { ref: string; name?: string }) | null> {
  const product = String(s.metadata?.product || '');
  if (!catalogItem(product)) return null;
  const email = String(s.customer_details?.email || s.customer_email || '').trim().toLowerCase();
  if (!email) return null;
  const name = String(s.customer_details?.name || '').trim();
  const subtotal = Number(s.amount_subtotal ?? s.amount_total ?? 0);
  return {
    ref: s.id,
    email,
    name,
    firstName: name.split(/\s+/)[0] || undefined,
    currency: String(s.currency || 'cad').toUpperCase(),
    lines: [{ product, amount: subtotal, url: await productLink(product, email, env, origin, s.id) }],
    subtotal,
    tax: Number(s.total_details?.amount_tax || 0),
    total: Number(s.amount_total ?? subtotal),
  };
}
