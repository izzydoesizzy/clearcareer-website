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
import { makeAccessToken, accessSecret, accessUrl } from './access.js';
import { PRODUCTS } from '../data/product-config.js';
import { LLU_PITCH, LLU_URL } from '../data/llu-pitch.js';

const { shell, P, H, button, link, small, sign, esc } = ui;

export interface CatalogItem { name: string; blurb: string; open: string; start: string }

/** What each product is, and where to start. Only facts from the product pages. */
export const CATALOG: Record<string, CatalogItem> = {
  vault: {
    name: 'Career Prompt Vault',
    blurb: '6 Claude skills (including the Achievement Interviewer) and 50 copy-paste prompts for your resume, LinkedIn, interviews, outreach, research and offers.',
    open: 'Open the Prompt Vault',
    start: 'Start with the Achievement Interviewer in the cc-resume skill. It asks you questions, one at a time, and turns your answers into resume bullets with real numbers.',
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
  'outreach-templates': {
    name: 'Outreach and Email Templates',
    blurb: '80+ templates to reach hiring managers directly, plus a Claude skill that personalizes them.',
    open: 'Open the Outreach Templates',
    start: 'Read "Land an Interview in 1 Week" first, then pick three hiring managers and send your first email today.',
  },
  'interview-confidence': {
    name: 'Interview Confidence Kit',
    blurb: 'STAR stories, mock interviews with a Claude coach, answer frameworks and thank-you emails.',
    open: 'Open the Interview Kit',
    start: 'Build three STAR stories with the cc-interview-coach skill before your next interview is even booked.',
  },
  'salary-negotiation': {
    name: 'Salary Negotiation Scripts and Advice',
    blurb: 'Word-for-word scripts for every stage of the offer, the advice behind them, and a Claude negotiation coach.',
    open: 'Open the Negotiation Scripts',
    start: 'Read "How to Negotiate Your Offer" before your next recruiter call, so you never give the first number by accident.',
  },
  'complete-toolkit': {
    name: 'Complete Job Search Toolkit',
    blurb: 'All five products: the Prompt Vault, Salary Number Generator, Outreach Templates, Interview Kit and Negotiation Scripts, plus bonus scripts.',
    open: 'Open your toolkit',
    start: 'Open the toolkit page first. It links to every product and gives you a 14-day plan.',
  },
  'resume-linkedin-audit': {
    name: 'Resume and LinkedIn Audit Kit',
    blurb: 'Two Claude skills that audit your resume and LinkedIn: a quick snapshot, a full audit, or a Rewrite Guide.',
    open: 'Open the Audit Kit',
    start: 'Run a Full audit on your resume first, fix the top three things, then run it again.',
  },
  'interview-dossier': {
    name: 'Interview Prep Dossier',
    blurb: 'A Claude skill that builds a full prep pack for one specific job: research, objections, answers and questions to ask.',
    open: 'Open the Interview Dossier',
    start: 'Run it as soon as an interview is booked, so you have three days to rehearse.',
  },
  'research-outreach': {
    name: 'Research and Outreach Kit',
    blurb: 'Three Claude skills: score fresh jobs out of 12, rank your target companies, and email the people who hire.',
    open: 'Open the Research and Outreach Kit',
    start: 'Score this week\'s jobs first, then pick five companies for your first outreach campaign.',
  },
  'linkedin-launch': {
    name: 'LinkedIn Launch Pack',
    blurb: 'My own LinkedIn formats: headlines, the 4-part About, messages for 5 situations and posts from your stories.',
    open: 'Open the LinkedIn Launch Pack',
    start: 'Start with your headline and About. They do the most work for the least time.',
  },
  'career-clarity-audit': {
    name: 'Career Clarity Audit',
    blurb: 'Your 5 job titles to target, ready LinkedIn searches, and your anchor, target and walk-away numbers.',
    open: 'Open your free audit',
    start: 'Run it with your resume, then save the 5 job searches it gives you.',
  },
  'all-access': {
    name: 'All-Access Pass',
    blurb: 'Every ClearCareer product, with 17 Claude skills: the full toolkit plus the audits, the interview dossier, research and outreach, and the LinkedIn Launch Pack.',
    open: 'Open your All-Access page',
    start: 'Open your All-Access page first. It links to every product and suggests an order.',
  },
  'layoff-survival-kit': {
    name: 'Layoff Survival Kit',
    blurb: 'Severance calculator, lawyer directory and 10 complete guides.',
    open: 'Open the Layoff Survival Kit',
    start: 'Run the severance calculator first. It takes 2 minutes and tells you whether your package is fair before you sign anything.',
  },
};

export function catalogItem(product: string): CatalogItem | null {
  if (product in CATALOG) return CATALOG[product];
  const p = PRODUCTS[product];
  if (!p || p.price <= 0) return null;
  return { name: p.name.replace(/^The /, ''), blurb: p.description, open: `Open ${p.name.replace(/^The /, 'the ')}`, start: '' };
}

export interface PurchaseLine {
  product: string;
  amount: number;
  url: string;
  /** Bundles: each included product with its own link, shown as its own button. */
  includes?: { product: string; url: string }[];
}
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
const FREE_REASON = "You're getting this because you asked for a free ClearCareer download. It's a one-time email with your link.";
const UNSUB = 'mailto:izzy@joinclearcareer.com?subject=Question%20about%20my%20order';

/** Products with a cover image (scripts/mockups/render.mjs makes them). */
const COVERS = new Set(['vault', 'salary-generator', 'outreach-templates', 'interview-confidence', 'salary-negotiation', 'complete-toolkit', 'resume-linkedin-audit', 'interview-dossier', 'research-outreach', 'linkedin-launch', 'career-clarity-audit', 'all-access', 'layoff-survival-kit']);

/** The product's cover, served from the same site as the access link (so previews show preview images). */
function coverImage(product: string, url: string): string {
  if (!COVERS.has(product)) return '';
  let origin = 'https://joinclearcareer.com';
  try { origin = new URL(url).origin; } catch { /* keep the live site */ }
  return `<img src="${esc(`${origin}/images/products/${product}/cover.jpg`)}" width="300" alt="" style="display:block;width:300px;max-width:100%;height:auto;border-radius:10px;margin:0 0 14px;">`;
}

export function purchaseEmail(o: Order): { subject: string; html: string } {
  const cur = o.currency || 'CAD';
  const items = o.lines
    .map((l) => ({ l, c: catalogItem(l.product) }))
    .filter((x): x is { l: PurchaseLine; c: CatalogItem } => !!x.c);
  const one = items.length === 1;

  const blocks = items
    .map(({ l, c }) => {
      const img = coverImage(l.product, l.url);
      const head = `${one ? '' : H(c.name)}${img}${P(esc(c.blurb))}${button(c.open, l.url)}${c.start ? small(`<strong>Where to start:</strong> ${esc(c.start)}`) : ''}`;
      // Products already listed as their own line (bought before the upgrade) aren't repeated.
      const inside = (l.includes || [])
        .filter((i) => !o.lines.some((other) => other.product === i.product))
        .map((i) => ({ i, ic: catalogItem(i.product) }))
        .filter((x) => x.ic)
        .map(({ i, ic }) => `${P(`<strong>${esc(ic!.name)}</strong><br>${esc(ic!.blurb)}`, 'margin-bottom:8px;')}${button(ic!.open, i.url)}`)
        .join('');
      return head + (inside ? H("What's inside") + inside : '');
    })
    .join('');

  const row = (label: string, value: string, bold = false) =>
    `<tr><td style="padding:8px 0;border-top:1px solid #e5e7eb;font-size:15px;color:#334155;${bold ? 'font-weight:700;' : ''}">${label}</td><td align="right" style="padding:8px 0;border-top:1px solid #e5e7eb;font-size:15px;color:#334155;white-space:nowrap;${bold ? 'font-weight:700;' : ''}">${value}</td></tr>`;
  const summary =
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;">` +
    items.map(({ l, c }) => row(esc(c.name), money(l.amount, cur))).join('') +
    (o.tax > 0 ? row('Tax', money(o.tax, cur)) : '') +
    row(`Total (${cur})`, money(o.total, cur), true) +
    `</table>`;

  // A free download (a lead magnet) has no order to summarize.
  const free = o.total === 0 && o.lines.every((l) => l.amount === 0);
  const body =
    (o.firstName ? P(`Hey ${esc(o.firstName)},`) : P('Hey there,')) +
    P(
      free
        ? "Here's your free copy. The link doesn't expire, so keep this email somewhere you can find it."
        : one
          ? "Thanks for your order. Your link is below. It doesn't expire, so keep this email somewhere you can find it."
          : "Thanks for your order. Your links are below. They don't expire, so keep this email somewhere you can find it.",
    ) +
    blocks +
    (free ? '' : H('Your order') + summary) +
    P("Something not working, or not sure how to use it? Reply to this email. It comes straight to me.") +
    sign('Happy searching,') +
    P(`P.S. ${esc(LLU_PITCH.headline)} ${esc(LLU_PITCH.description)} ${link(LLU_PITCH.button, LLU_URL)}`, 'font-size:15px;');

  const headline = one ? 'Your link is inside, and it never expires.' : 'Your links are inside, and they never expire.';
  return { subject: purchaseSubject(o), html: shell('', headline, body, free ? FREE_REASON : REASON, UNSUB) };
}

/** The signed "open it" link for one product, or a Checkout Session link when no secret is set. */
export async function productLink(
  product: string,
  email: string,
  env: Record<string, unknown>,
  origin = 'https://joinclearcareer.com',
  sessionId?: string,
): Promise<string> {
  const secret = accessSecret(env, new URL(origin));
  if (secret) return accessUrl(product, await makeAccessToken(product, email, secret), origin);
  if (!sessionId) return `${origin}/tools`;
  return product === 'vault'
    ? `${origin}/tools/career-prompt-vault/access?session_id=${encodeURIComponent(sessionId)}`
    : accessUrl(product, sessionId, origin);
}

/**
 * Links to each product inside a bundle, all opened with the bundle's own token (or Checkout
 * Session), which src/lib/product-access.ts accepts for every included product.
 */
export async function bundleLinks(
  bundle: string,
  email: string,
  env: Record<string, unknown>,
  origin = 'https://joinclearcareer.com',
  sessionId?: string,
): Promise<{ product: string; url: string }[]> {
  const includes = PRODUCTS[bundle]?.includes || [];
  if (!includes.length) return [];
  const secret = accessSecret(env, new URL(origin));
  const token = secret ? await makeAccessToken(bundle, email, secret) : sessionId || '';
  if (!token) return [];
  return includes.map((p) => ({
    product: p,
    url: p === 'vault' && !secret ? `${origin}/tools/career-prompt-vault/access?session_id=${encodeURIComponent(token)}` : accessUrl(p, token, origin),
  }));
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
    lines: [{
      product,
      amount: subtotal,
      url: await productLink(product, email, env, origin, s.id),
      ...(PRODUCTS[product]?.includes ? { includes: await bundleLinks(product, email, env, origin, s.id) } : {}),
    }],
    subtotal,
    tax: Number(s.total_details?.amount_tax || 0),
    total: Number(s.amount_total ?? subtotal),
  };
}
