/**
 * Email consent wording. One place, so every form says the same thing and the
 * server can record exactly what the person agreed to (CASL / CAN-SPAM / GDPR).
 *
 * Rules these follow:
 * - The box is never pre-ticked.
 * - The free resource is sent whether or not the box is ticked.
 * - The wording says who is asking, what they will get, and how to stop.
 * - If you change the wording, bump CONSENT_VERSION so old records stay accurate.
 */
export const CONSENT_VERSION = 'v1-2026-11-21';

export const CONSENT_TEXT =
  "Yes, also email me career tips and a short series this week about salary negotiation, the cost of a long search, and ClearCareer's Land and Level Up group. I can unsubscribe at any time.";

/** Shown under the footer newsletter form, where subscribing is the whole point. */
export const NEWSLETTER_CONSENT_TEXT =
  'By subscribing, you agree to get weekly career tips and occasional emails from ClearCareer about its programs, including Land and Level Up. Unsubscribe any time.';

export const CONSENT_SENDER_LINE = 'Sent by ClearCareer, 710-20 Tubman Ave, Toronto, ON M5A 0M8, Canada.';
