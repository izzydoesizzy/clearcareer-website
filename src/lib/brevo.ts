import { CONSENT_TEXT, CONSENT_VERSION } from './consent.js';

/** Brevo list that starts the nurture automation. Set BREVO_NURTURE_LIST_ID once the list exists. */
const NURTURE_LIST_ID = Number(import.meta.env.BREVO_NURTURE_LIST_ID) || 0;

/** The resource list, plus the nurture list. Only call this for people who ticked the opt-in box. */
export function withNurture(listId: number): number[] {
  return NURTURE_LIST_ID ? [listId, NURTURE_LIST_ID] : [listId];
}

/** Proof of consent, stored on the Brevo contact. */
export function consentAttributes(source: string): Record<string, string | boolean> {
  return {
    SOURCE: source,
    MARKETING_CONSENT: true,
    CONSENT_DATE: new Date().toISOString(),
    CONSENT_SOURCE: source,
    CONSENT_VERSION,
    CONSENT_WORDING: CONSENT_TEXT,
  };
}
