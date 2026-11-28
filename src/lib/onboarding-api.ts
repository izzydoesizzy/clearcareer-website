/**
 * Shared helpers for the /api/onboarding/* routes. Server only.
 */
import { readToken } from './onboarding.js';
import { serverEnv } from './server-env.js';
import { getClient, type Client, type ServerEnv } from './clients.js';

export const env = serverEnv() as unknown as ServerEnv & { STRIPE_SECRET_KEY?: string };

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** Token to client, or an error response. */
export async function authClient(token: string | null | undefined): Promise<{ client: Client } | { error: Response }> {
  if (!env.ONBOARD_SECRET || !env.BREVO_API_KEY) return { error: json({ error: 'Onboarding is not set up yet. Please email izzy@joinclearcareer.com.' }, 503) };
  const email = await readToken(String(token || ''), env.ONBOARD_SECRET);
  if (!email) return { error: json({ error: 'This link is not valid. Please use the link in your welcome email.' }, 401) };
  const client = await getClient(env, email);
  if (!client) return { error: json({ error: "We couldn't find your enrolment yet. If you just paid, give it a minute and refresh." }, 404) };
  return { client };
}

export function clientIp(request: Request, fallback?: string): string {
  return (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-real-ip') || fallback || 'unknown';
}
