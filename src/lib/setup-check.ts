/**
 * What's still not set up. Shown at the bottom of Izzy's daily digest until it's all done,
 * so nothing quietly stays half-finished.
 */
import { welcome } from '../data/llu.js';

export function setupGaps(env: Record<string, string | undefined>): string[] {
  const out: string[] = [];
  const need = (k: string, why: string) => { if (!env[k]) out.push(`${k} is not set in Vercel: ${why}`); };
  need('BREVO_LEADS_LIST_ID', 'no-book nudges and new-lead tracking are off.');
  need('BREVO_CALL_LIST_ID', 'call reminders and sales briefs are off.');
  need('BREVO_CLIENTS_LIST_ID', 'onboarding reminders, seat counts and renewals are off.');
  need('CALENDLY_QUALIFIED_URL', 'approved leads are getting the public booking link.');
  need('PUBLIC_GROUP_CHECKOUT_URL', 'the group "Claim my seat" button goes to the form instead of Stripe.');
  need('PUBLIC_PRIVATE_CHECKOUT_URL', 'the private "Claim my seat" button goes to the form instead of Stripe.');
  need('PUBLIC_GROUP_CHECKOUT_URL_REGULAR', 'after Black Friday, the group button falls back to the form.');
  need('PUBLIC_PRIVATE_CHECKOUT_URL_REGULAR', 'after Black Friday, the private button falls back to the form.');
  need('STRIPE_DEAL_LINK_IDS', 'the Black Friday payment links will not switch off on their own after Nov 30.');
  need('STRIPE_WEBHOOK_SECRET', 'payments do not trigger welcome emails or onboarding.');
  need('STRIPE_SECRET_KEY', 'the thank-you page cannot show the onboarding button right away, and Black Friday links cannot switch off on their own.');
  need('ONBOARD_SECRET', 'welcome emails cannot include the onboarding link.');
  need('GOOGLE_REFRESH_TOKEN', 'no Drive folders, uploads, signed PDFs or roster. Run scripts/google-auth.mjs.');
  need('GOOGLE_PARENT_FOLDER_ID', 'client folders have nowhere to go.');
  need('GOOGLE_ROSTER_SHEET_ID', 'the client roster sheet is not updating.');
  need('VERCEL_DEPLOY_HOOK_URL', 'the landing page will not switch off Black Friday prices on its own.');
  need('PUBLIC_RENEWAL_URL', 'the month-3 email will ask people to reply instead of linking to the $50 a month plan.');
  if (!env.CALENDLY_WEBHOOK_SIGNING_KEY && !env.CALL_WEBHOOK_SECRET) out.push('Calendly is not connected (CALENDLY_WEBHOOK_SIGNING_KEY or CALL_WEBHOOK_SECRET): no booked, reminder or no-show emails.');
  if (!welcome.communityUrl) out.push('Mighty Networks invite link is empty in src/data/llu.ts (welcome.communityUrl).');
  if (!welcome.callStart || !welcome.callUrl) out.push('Wednesday call time or link is empty in src/data/llu.ts (welcome.callStart, welcome.callUrl).');
  return out;
}
