#!/usr/bin/env node
/**
 * One-time Brevo setup for the consent + nurture system. Safe to run twice.
 *
 *   BREVO_API_KEY=xkeysib-... node scripts/brevo-setup.mjs
 *
 * Creates: the contact fields that record consent, and two lists
 * ("Nurture: Land and Level Up (opted in)", "Call booked" and "Book-a-call applicants").
 * Prints the list IDs. Put them in Vercel: BREVO_NURTURE_LIST_ID, BREVO_CALL_LIST_ID ("Call booked"),
 * BREVO_LEADS_LIST_ID ("Book-a-call applicants"), BREVO_CLIENTS_LIST_ID ("Land and Level Up clients")
 * and BREVO_CUSTOMERS_LIST_ID ("Customers: digital products")
 * (the applicants list). Also set BOOK_CALL_NOTIFY_EMAIL if you want notifications elsewhere.
 */
const KEY = process.env.BREVO_API_KEY;
if (!KEY) { console.error('Set BREVO_API_KEY first.'); process.exit(1); }
const H = { 'api-key': KEY, 'Content-Type': 'application/json', Accept: 'application/json' };
const api = (path, opts = {}) => fetch(`https://api.brevo.com/v3${path}`, { headers: H, ...opts });

const attrs = [
  ['SOURCE', 'text'],
  ['MARKETING_CONSENT', 'boolean'],
  ['CONSENT_DATE', 'text'],
  ['CONSENT_SOURCE', 'text'],
  ['CONSENT_VERSION', 'text'],
  ['CONSENT_WORDING', 'text'],
  ['CALL_BOOKED_AT', 'text'],
  // Book-a-call form answers
  ['LEAD_STATUS', 'text'],
  ['LEAD_SUBMITTED_AT', 'text'],
  ['LEAD_PHONE', 'text'],
  ['LEAD_COUNTRY', 'text'],
  ['LEAD_SITUATION', 'text'],
  ['LEAD_YEARS_EXP', 'float'],
  ['LEAD_SEARCH_LENGTH', 'text'],
  ['LEAD_APPS_TOTAL', 'float'],
  ['LEAD_INTERVIEWS', 'float'],
  ['LEAD_OFFERS', 'float'],
  ['LEAD_DIAGNOSIS', 'text'],
  ['LEAD_COMMIT', 'text'],
  ['LEAD_ANSWERS', 'text'],
  ['CALL_AT', 'text'],
  ['CALL_JOIN_URL', 'text'],
  ['CALL_RESCHEDULE_URL', 'text'],
  ['CALL_EMAILS_SENT', 'text'],
  ['CALL_OUTCOME', 'text'],
  ['ENROLLED_AT', 'text'],
  ['ENROLLED_AMOUNT', 'float'],
  ['ENROLLED_PROGRAM', 'text'],
  ['STRIPE_SESSION', 'text'],
  ['DRIVE_FOLDER_ID', 'text'],
  ['DRIVE_FOLDER_URL', 'text'],
  ['AGREEMENT_SIGNED_AT', 'text'],
  ['AGREEMENT_NAME', 'text'],
  ['AGREEMENT_VERSION', 'text'],
  ['AGREEMENT_IP', 'text'],
  ['INTAKE_DONE_AT', 'text'],
  ['INTAKE_FILES', 'text'],
  ['INTAKE_LINKEDIN', 'text'],
  ['INTAKE_RECORDING', 'text'],
  ['INTAKE_TIMEZONE', 'text'],
  ['ONBOARD_SENT', 'text'],
  ['LEAD_SCORE', 'float'],
  ['LEAD_PROGRAM', 'text'],
  ['LEAD_VALUE', 'float'],
  ['LEAD_TARGET_SALARY', 'float'],
  ['LEAD_STRUGGLES', 'text'],
  ['LEAD_CHALLENGE', 'text'],
  ['LEAD_CALL_GOAL', 'text'],
  ['LEAD_START', 'text'],
  ['LEAD_PAYMENT', 'text'],
  ['LEAD_READY', 'text'],
  ['PURCHASES', 'text'],
  ['LAST_PURCHASE_AT', 'date'],
  ['PURCHASE_REFS', 'text'],
];
for (const [name, type] of attrs) {
  const r = await api(`/contacts/attributes/normal/${name}`, { method: 'POST', body: JSON.stringify({ type }) });
  console.log(`attribute ${name}:`, r.ok ? 'created' : `${r.status} ${(await r.text()).slice(0, 80)}`);
}

const existing = await (await api('/contacts/lists?limit=50')).json();
const folderId = existing.lists?.[0]?.folderId ?? 1;
for (const name of ['Nurture: Land and Level Up (opted in)', 'Call booked', 'Book-a-call applicants', 'Land and Level Up clients', 'Customers: digital products']) {
  const found = existing.lists?.find((l) => l.name === name);
  if (found) { console.log(`list "${name}": already exists, id ${found.id}`); continue; }
  const r = await api('/contacts/lists', { method: 'POST', body: JSON.stringify({ name, folderId }) });
  const j = await r.json();
  console.log(`list "${name}":`, r.ok ? `created, id ${j.id}` : `${r.status} ${JSON.stringify(j)}`);
}
