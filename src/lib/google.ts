/**
 * Google Drive and Sheets, with plain fetch (no extra packages). Server only.
 *
 * Uses Izzy's own Google account through an OAuth refresh token with the narrow
 * "drive.file" scope: the site can only see files it created itself.
 * One-time setup: scripts/google-auth.mjs (creates the folders, roster and agreement template).
 *
 * Env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 */
export interface GoogleEnv {
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REFRESH_TOKEN?: string;
}

export const DOC = 'application/vnd.google-apps.document';
export const FOLDER = 'application/vnd.google-apps.folder';

export function googleReady(env: GoogleEnv): boolean {
  return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REFRESH_TOKEN);
}

export function google(env: GoogleEnv) {
  let token = '';
  let expires = 0;

  async function auth(): Promise<string> {
    if (token && Date.now() < expires - 60_000) return token;
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID || '',
        client_secret: env.GOOGLE_CLIENT_SECRET || '',
        refresh_token: env.GOOGLE_REFRESH_TOKEN || '',
        grant_type: 'refresh_token',
      }),
    });
    if (!r.ok) throw new Error(`Google auth failed: ${r.status} ${await r.text()}`);
    const j = (await r.json()) as { access_token: string; expires_in: number };
    token = j.access_token;
    expires = Date.now() + j.expires_in * 1000;
    return token;
  }

  async function call(url: string, init: RequestInit = {}): Promise<Response> {
    const t = await auth();
    const r = await fetch(url, { ...init, headers: { Authorization: `Bearer ${t}`, ...(init.headers || {}) } });
    if (!r.ok) throw new Error(`Google ${init.method || 'GET'} ${url.split('?')[0]} failed: ${r.status} ${await r.text()}`);
    return r;
  }

  /** multipart/related upload: metadata + content in one request. */
  async function upload(meta: Record<string, unknown>, body: Uint8Array | string, contentType: string): Promise<{ id: string; webViewLink: string; name: string }> {
    const boundary = `cc${Math.random().toString(36).slice(2)}`;
    const enc = new TextEncoder();
    const head = enc.encode(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`);
    const data = typeof body === 'string' ? enc.encode(body) : body;
    const tail = enc.encode(`\r\n--${boundary}--`);
    const all = new Uint8Array(head.length + data.length + tail.length);
    all.set(head, 0); all.set(data, head.length); all.set(tail, head.length + data.length);
    const r = await call('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,name', {
      method: 'POST',
      headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
      body: all,
    });
    return r.json();
  }

  return {
    async createFolder(name: string, parentId: string): Promise<{ id: string; webViewLink: string }> {
      const r = await call('https://www.googleapis.com/drive/v3/files?fields=id,webViewLink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mimeType: FOLDER, parents: [parentId] }),
      });
      return r.json();
    },

    /** Upload any file (resume, PDF) into a folder. */
    uploadFile(folderId: string, name: string, data: Uint8Array, mimeType: string) {
      return upload({ name, parents: [folderId] }, data, mimeType);
    },

    /** Create a Google Doc from HTML (Drive converts it). */
    createDocFromHtml(folderId: string, name: string, html: string) {
      return upload({ name, parents: [folderId], mimeType: DOC }, html, 'text/html; charset=UTF-8');
    },

    /** Export a Google Doc. 'text/html' for the agreement template, 'application/pdf' for signed copies. */
    async exportDoc(fileId: string, mimeType: 'text/html' | 'application/pdf' | 'text/plain'): Promise<Uint8Array> {
      const r = await call(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(mimeType)}`);
      return new Uint8Array(await r.arrayBuffer());
    },

    async fileInfo(fileId: string): Promise<{ id: string; name: string; modifiedTime: string; webViewLink: string }> {
      const r = await call(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,modifiedTime,webViewLink`);
      return r.json();
    },

    async appendRow(sheetId: string, range: string, row: (string | number)[]) {
      await call(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [row] }),
      });
    },

    /** Update cells in the row whose column B equals `email`. Columns are letters, e.g. { H: 'Yes' }. */
    async updateRowByEmail(sheetId: string, tab: string, email: string, cells: Record<string, string>) {
      const r = await call(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${tab}!B:B`)}`);
      const j = (await r.json()) as { values?: string[][] };
      const idx = (j.values || []).findIndex((v) => (v[0] || '').toLowerCase() === email.toLowerCase());
      if (idx < 0) return false;
      const data = Object.entries(cells).map(([col, value]) => ({ range: `${tab}!${col}${idx + 1}`, values: [[value]] }));
      await call(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchUpdate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valueInputOption: 'USER_ENTERED', data }),
      });
      return true;
    },
  };
}

export const folderUrl = (id: string) => `https://drive.google.com/drive/folders/${id}`;
