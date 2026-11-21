/**
 * One-time Google setup for client onboarding. Run on your own computer:
 *
 *   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-auth.mjs
 *
 * Before you run it (5 minutes, in Google Cloud console, signed in as izzy@joinclearcareer.com):
 *   1. Create a project (any name), then APIs & Services > Library: enable "Google Drive API" and "Google Sheets API".
 *   2. OAuth consent screen: User type "Internal", app name "ClearCareer onboarding".
 *   3. Credentials > Create credentials > OAuth client ID > Application type "Desktop app". Copy the ID and secret.
 *
 * What it does:
 *   - Opens Google sign-in. Sign in as izzy@joinclearcareer.com and allow access.
 *     (Scope is drive.file: the site can only see files it creates. Nothing else in your Drive.)
 *   - Creates in your Drive: "Land and Level Up" > "Dec 2026 cohort" folder, the "Client roster" sheet,
 *     and the "Client agreement (template)" Google Doc, which you can edit any time.
 *   - Prints the values to paste into Vercel.
 */
import http from 'node:http';
import { readFileSync } from 'node:fs';

const ID = process.env.GOOGLE_CLIENT_ID;
const SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!ID || !SECRET) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first (see the top of this file).');
  process.exit(1);
}
const PORT = 53682;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPE = 'https://www.googleapis.com/auth/drive.file';

// Keep in sync with ROSTER_HEADERS in src/lib/onboarding.ts
const ROSTER_HEADERS = ['Enrolled', 'Email', 'Name', 'Program', 'Paid (CAD)', 'Drive folder', 'Agreement signed', 'Intake done', 'Guarantee ends', 'Joined Mighty Networks', '1:1 rebuild booked', 'Notes'];

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
  client_id: ID, redirect_uri: REDIRECT, response_type: 'code', scope: SCOPE, access_type: 'offline', prompt: 'consent', login_hint: 'izzy@joinclearcareer.com',
})}`;

const code = await new Promise((resolve, reject) => {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, REDIRECT);
    if (u.pathname !== '/callback') { res.end(); return; }
    const c = u.searchParams.get('code');
    res.end(c ? 'All set. You can close this tab and go back to the terminal.' : `Sign-in failed: ${u.searchParams.get('error')}`);
    server.close();
    c ? resolve(c) : reject(new Error(u.searchParams.get('error') || 'no code'));
  });
  server.listen(PORT, '127.0.0.1', () => {
    console.log('\nOpen this link, sign in as izzy@joinclearcareer.com and allow access:\n');
    console.log(authUrl, '\n');
  });
});

const tok = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ code, client_id: ID, client_secret: SECRET, redirect_uri: REDIRECT, grant_type: 'authorization_code' }),
}).then((r) => r.json());
if (!tok.refresh_token) { console.error('No refresh token came back:', tok); process.exit(1); }
const H = { Authorization: `Bearer ${tok.access_token}` };

async function create(meta) {
  const r = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,webViewLink', { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify(meta) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function uploadDoc(name, parent, html) {
  const b = 'ccboundary';
  const body = `--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name, parents: [parent], mimeType: 'application/vnd.google-apps.document' })}\r\n--${b}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${html}\r\n--${b}--`;
  const r = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', { method: 'POST', headers: { ...H, 'Content-Type': `multipart/related; boundary=${b}` }, body });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

const root = await create({ name: 'Land and Level Up', mimeType: 'application/vnd.google-apps.folder' });
const cohort = await create({ name: 'Dec 2026 cohort', mimeType: 'application/vnd.google-apps.folder', parents: [root.id] });
const sheet = await create({ name: 'Land and Level Up - Client roster', mimeType: 'application/vnd.google-apps.spreadsheet', parents: [root.id] });
await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheet.id}:batchUpdate`, {
  method: 'POST', headers: { ...H, 'Content-Type': 'application/json' },
  body: JSON.stringify({ requests: [
    { updateSheetProperties: { properties: { sheetId: 0, title: 'Roster', gridProperties: { frozenRowCount: 1 } }, fields: 'title,gridProperties.frozenRowCount' } },
    { repeatCell: { range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 }, cell: { userEnteredFormat: { textFormat: { bold: true } } }, fields: 'userEnteredFormat.textFormat.bold' } },
  ] }),
});
await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheet.id}/values/Roster!A1:L1?valueInputOption=RAW`, {
  method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ values: [ROSTER_HEADERS] }),
});
const template = readFileSync(new URL('../emails/agreement-template.html', import.meta.url), 'utf8');
const doc = await uploadDoc('Land and Level Up - Client agreement (template)', root.id, template);

console.log('\nDone. Your Drive now has a "Land and Level Up" folder with the roster and the agreement template.');
console.log(`  Roster:    ${sheet.webViewLink}`);
console.log(`  Agreement: ${doc.webViewLink}  (edit freely, keep the {{CLIENT_NAME}} style placeholders)`);
console.log('\nPaste these into Vercel > Project > Settings > Environment Variables:\n');
console.log(`GOOGLE_CLIENT_ID=${ID}`);
console.log(`GOOGLE_CLIENT_SECRET=${SECRET}`);
console.log(`GOOGLE_REFRESH_TOKEN=${tok.refresh_token}`);
console.log(`GOOGLE_PARENT_FOLDER_ID=${cohort.id}`);
console.log(`GOOGLE_ROSTER_SHEET_ID=${sheet.id}`);
console.log(`GOOGLE_AGREEMENT_DOC_ID=${doc.id}`);
