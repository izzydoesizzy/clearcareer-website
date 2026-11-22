/**
 * Which Stripe payment link to use for each program.
 *
 *   PUBLIC_GROUP_CHECKOUT_URL / PUBLIC_PRIVATE_CHECKOUT_URL   one link per program, at the regular price
 *
 * Black Friday is a Stripe promotion code (BLACKFRIDAY, 20% off, expires Nov 30 at 11:59 pm ET),
 * so the same links work before and after the deal. The older *_REGULAR variables still work as a
 * fallback. No link sends people to the book-a-call form instead of a dead end.
 */
export interface Checkout { group?: string; private?: string }

const ok = (u?: string) => (u && /^https:\/\//.test(u) && !u.includes('calendly.com') ? u : undefined);

export function checkoutLinks(env: Record<string, unknown>, _now: Date = new Date()): Checkout {
  const e = (k: string) => (env[k] ? String(env[k]) : undefined);
  return {
    group: ok(e('PUBLIC_GROUP_CHECKOUT_URL')) || ok(e('PUBLIC_GROUP_CHECKOUT_URL_REGULAR')),
    private: ok(e('PUBLIC_PRIVATE_CHECKOUT_URL')) || ok(e('PUBLIC_PRIVATE_CHECKOUT_URL_REGULAR')),
  };
}
