/**
 * One check for "may this person open this product?", used by the access pages, the download
 * endpoint and the guide APIs. Server only.
 *
 * A token is either:
 *   - a signed access link (src/lib/access.ts), made for the product or for a bundle that includes it
 *   - a paid Stripe Checkout Session id whose metadata.product is the product or a bundle that includes it
 */
import Stripe from 'stripe';
import { readAccessToken, accessSecret, isPreviewHost } from './access.js';
import { bundlesIncluding } from '../data/product-config.js';

export interface Access { ok: boolean; email?: string; name?: string; via?: string }

export async function verifyAccess(product: string, token: string | null | undefined, env: Record<string, string | undefined>, url?: URL): Promise<Access> {
  if (!token) return { ok: false };
  const owners = [product, ...bundlesIncluding(product)];

  if (token.includes('.')) {
    const secret = accessSecret(env, url);
    for (const owner of owners) {
      const email = await readAccessToken(owner, token, secret);
      if (email) return { ok: true, email, via: owner };
    }
    return { ok: false };
  }

  if (/^cs_(live|test)_[A-Za-z0-9_]+$/.test(token)) {
    const isTest = token.startsWith('cs_test_');
    const key = isTest && url && isPreviewHost(url) ? env.STRIPE_FUNNEL_TEST_SECRET_KEY : env.STRIPE_SECRET_KEY;
    if (!key) return { ok: false };
    try {
      const s = await new Stripe(key).checkout.sessions.retrieve(token);
      const bought = String(s.metadata?.product || '');
      if (s.payment_status === 'paid' && owners.includes(bought)) {
        return { ok: true, email: s.customer_details?.email || '', name: s.customer_details?.name || '', via: bought };
      }
    } catch {
      // unknown or deleted session
    }
  }
  return { ok: false };
}
