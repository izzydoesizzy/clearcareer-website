/**
 * One place that knows how to look up and set up a paying client. Server only.
 * Safe to call more than once: it never creates a second folder or roster row.
 */
import { brevo, type BrevoContact } from './brevo-api.js';
import { google, googleReady, folderUrl, type GoogleEnv } from './google.js';
import { programValue } from './book-call.js';
import { ROSTER_TAB, rosterRow } from './onboarding.js';
import { AGREEMENT_DEFAULT_VERSION, DEFAULT_AGREEMENT_HTML, cleanDocHtml, fillAgreement } from './agreement.js';

export interface ServerEnv extends GoogleEnv {
  BREVO_API_KEY?: string;
  BREVO_CLIENTS_LIST_ID?: string;
  GOOGLE_PARENT_FOLDER_ID?: string;
  GOOGLE_ROSTER_SHEET_ID?: string;
  GOOGLE_AGREEMENT_DOC_ID?: string;
  ONBOARD_SECRET?: string;
  BOOK_CALL_NOTIFY_EMAIL?: string;
  [k: string]: string | undefined;
}

export interface Client {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  program: string;
  enrolledAt: Date;
  amount: number;
  folderId: string;
  folderUrl: string;
  agreementSignedAt: string;
  intakeDoneAt: string;
  attrs: Record<string, unknown>;
}

export function toClient(c: BrevoContact): Client {
  const a = c.attributes || {};
  const first = String(a.FIRSTNAME || '').trim();
  const last = String(a.LASTNAME || '').trim();
  return {
    email: c.email,
    firstName: first || 'there',
    lastName: last,
    name: `${first} ${last}`.trim() || c.email,
    program: String(a.ENROLLED_PROGRAM || ''),
    enrolledAt: new Date(String(a.ENROLLED_AT || Date.now())),
    amount: Number(a.ENROLLED_AMOUNT || 0),
    folderId: String(a.DRIVE_FOLDER_ID || ''),
    folderUrl: String(a.DRIVE_FOLDER_URL || ''),
    agreementSignedAt: String(a.AGREEMENT_SIGNED_AT || ''),
    intakeDoneAt: String(a.INTAKE_DONE_AT || ''),
    attrs: a,
  };
}

export async function getClient(env: ServerEnv, email: string): Promise<Client | null> {
  if (!env.BREVO_API_KEY) return null;
  const c = await brevo(env.BREVO_API_KEY).getContact(email);
  return c && c.attributes?.ENROLLED_AT ? toClient(c) : null;
}

/** Make sure the client has a Drive folder and a roster row. Returns the folder (or '' if Google isn't set up). */
export async function ensureFolder(env: ServerEnv, client: Client): Promise<{ folderId: string; folderUrl: string }> {
  if (client.folderId) return { folderId: client.folderId, folderUrl: client.folderUrl };
  if (!googleReady(env) || !env.GOOGLE_PARENT_FOLDER_ID || !env.BREVO_API_KEY) return { folderId: '', folderUrl: '' };
  const g = google(env);
  const label = client.lastName ? `${client.lastName}, ${client.firstName}` : client.name;
  const f = await g.createFolder(label, env.GOOGLE_PARENT_FOLDER_ID);
  const url = f.webViewLink || folderUrl(f.id);
  await brevo(env.BREVO_API_KEY).upsert(client.email, { DRIVE_FOLDER_ID: f.id, DRIVE_FOLDER_URL: url });
  if (env.GOOGLE_ROSTER_SHEET_ID) {
    await g
      .appendRow(env.GOOGLE_ROSTER_SHEET_ID, `${ROSTER_TAB}!A:L`, rosterRow({ enrolledAt: client.enrolledAt, email: client.email, name: client.name, program: client.program, amount: client.amount, folderUrl: url }))
      .catch((e) => console.error('roster append failed:', e));
  }
  client.folderId = f.id;
  client.folderUrl = url;
  return { folderId: f.id, folderUrl: url };
}

export async function updateRoster(env: ServerEnv, email: string, cells: Record<string, string>) {
  if (!googleReady(env) || !env.GOOGLE_ROSTER_SHEET_ID) return;
  await google(env).updateRowByEmail(env.GOOGLE_ROSTER_SHEET_ID, ROSTER_TAB, email, cells).catch((e) => console.error('roster update failed:', e));
}

/** The agreement this client signs: Izzy's Google Doc if set up, otherwise the built-in draft. */
export async function agreementFor(env: ServerEnv, client: Client): Promise<{ html: string; version: string }> {
  let template = DEFAULT_AGREEMENT_HTML;
  let version = AGREEMENT_DEFAULT_VERSION;
  if (googleReady(env) && env.GOOGLE_AGREEMENT_DOC_ID) {
    try {
      const g = google(env);
      const [bytes, info] = await Promise.all([g.exportDoc(env.GOOGLE_AGREEMENT_DOC_ID, 'text/html'), g.fileInfo(env.GOOGLE_AGREEMENT_DOC_ID)]);
      template = cleanDocHtml(new TextDecoder().decode(bytes));
      version = `gdoc-${info.modifiedTime}`;
    } catch (e) {
      console.error('agreement doc export failed, using built-in draft:', e);
    }
  }
  const price = client.program ? programValue(client.program, client.enrolledAt).label : '';
  const date = client.enrolledAt.toLocaleDateString('en-CA', { timeZone: 'America/Toronto', dateStyle: 'long' });
  return { html: fillAgreement(template, { name: client.name, email: client.email, program: client.program, price, date }), version };
}

/** Seats sold so far, from the clients list in Brevo. */
export async function seatsSold(env: ServerEnv): Promise<{ group: number; private: number }> {
  const listId = Number(env.BREVO_CLIENTS_LIST_ID) || 0;
  if (!env.BREVO_API_KEY || !listId) return { group: 0, private: 0 };
  const all = await brevo(env.BREVO_API_KEY).listContacts(listId);
  const priv = all.filter((c) => String(c.attributes?.ENROLLED_PROGRAM || '').includes('private')).length;
  return { group: all.length - priv, private: priv };
}
