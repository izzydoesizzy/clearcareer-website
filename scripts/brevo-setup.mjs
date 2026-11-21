#!/usr/bin/env node
/**
 * One-time Brevo setup for the consent + nurture system. Safe to run twice.
 *
 *   BREVO_API_KEY=xkeysib-... node scripts/brevo-setup.mjs
 *
 * Creates: the contact fields that record consent, and two lists
 * ("Nurture: Land and Level Up (opted in)" and "Call booked").
 * Prints the list IDs. Put the nurture ID in BREVO_NURTURE_LIST_ID (Vercel env).
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
];
for (const [name, type] of attrs) {
  const r = await api(`/contacts/attributes/normal/${name}`, { method: 'POST', body: JSON.stringify({ type }) });
  console.log(`attribute ${name}:`, r.ok ? 'created' : `${r.status} ${(await r.text()).slice(0, 80)}`);
}

const existing = await (await api('/contacts/lists?limit=50')).json();
const folderId = existing.lists?.[0]?.folderId ?? 1;
for (const name of ['Nurture: Land and Level Up (opted in)', 'Call booked']) {
  const found = existing.lists?.find((l) => l.name === name);
  if (found) { console.log(`list "${name}": already exists, id ${found.id}`); continue; }
  const r = await api('/contacts/lists', { method: 'POST', body: JSON.stringify({ name, folderId }) });
  const j = await r.json();
  console.log(`list "${name}":`, r.ok ? `created, id ${j.id}` : `${r.status} ${JSON.stringify(j)}`);
}
