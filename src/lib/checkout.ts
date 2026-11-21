/**
 * Which Stripe payment link to use for each program, right now.
 *
 *   PUBLIC_GROUP_CHECKOUT_URL / PUBLIC_PRIVATE_CHECKOUT_URL                  Black Friday links
 *   PUBLIC_GROUP_CHECKOUT_URL_REGULAR / PUBLIC_PRIVATE_CHECKOUT_URL_REGULAR  regular-price links
 *
 * Until the deal ends, the Black Friday links. After, the regular ones (or none, which sends people
 * to the book-a-call form instead of a dead end).
 */
import { dealIsLive } from './email/deal.js';

export interface Checkout { group?: string; private?: string }

const ok = (u?: string) => (u && /^https:\/\//.test(u) && !u.includes('calendly.com') ? u : undefined);

export function checkoutLinks(env: Record<string, unknown>, now: Date = new Date()): Checkout {
  const e = (k: string) => (env[k] ? String(env[k]) : undefined);
  return dealIsLive(now)
    ? { group: ok(e('PUBLIC_GROUP_CHECKOUT_URL')), private: ok(e('PUBLIC_PRIVATE_CHECKOUT_URL')) }
    : { group: ok(e('PUBLIC_GROUP_CHECKOUT_URL_REGULAR')), private: ok(e('PUBLIC_PRIVATE_CHECKOUT_URL_REGULAR')) };
}
