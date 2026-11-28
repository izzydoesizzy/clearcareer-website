/**
 * Signed access links for digital products.
 *
 * A token is the buyer's email plus a signature over (product, email), so nothing needs storing
 * and the link keeps working. It lets a product open even when it wasn't bought through a
 * Stripe Checkout session (for example a one-click upsell), and in the test funnel.
 *
 * Secret: ACCESS_SECRET, or ONBOARD_SECRET if that isn't set.
 */
import { hmacHex, safeEqual } from './brevo-api.js';

export type AccessProduct = 'vault' | 'salary-generator' | 'script-vault' | 'layoff-survival-kit';

const b64 = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));

export function accessSecret(env: Record<string, unknown>): string {
  return String(env.ACCESS_SECRET || env.ONBOARD_SECRET || '');
}

export async function makeAccessToken(product: AccessProduct | string, email: string, secret: string): Promise<string> {
  const e = email.trim().toLowerCase();
  return `${b64(e)}.${(await hmacHex(secret, `access:${product}:${e}`)).slice(0, 32)}`;
}

/** The buyer's email if the token is valid for this product, otherwise null. */
export async function readAccessToken(product: AccessProduct | string, token: string, secret: string): Promise<string | null> {
  if (!secret || !token || !token.includes('.')) return null;
  const [p, sig] = token.split('.');
  let email = '';
  try { email = unb64(p); } catch { return null; }
  if (!email.includes('@')) return null;
  const expected = (await hmacHex(secret, `access:${product}:${email}`)).slice(0, 32);
  return safeEqual(sig || '', expected) ? email : null;
}

/** Where each product opens. `origin` lets the test funnel link to its own preview. */
export function accessUrl(product: AccessProduct | string, token: string, origin = 'https://joinclearcareer.com'): string {
  if (product === 'vault') return `${origin}/tools/career-prompt-vault/access?t=${encodeURIComponent(token)}`;
  if (product === 'layoff-survival-kit') return `${origin}/layoff-survival-kit/access/${encodeURIComponent(token)}`;
  return `${origin}/products/${product}/access/${encodeURIComponent(token)}`;
}
