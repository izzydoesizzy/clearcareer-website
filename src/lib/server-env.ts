/**
 * Every server setting, read when the request runs.
 *
 * Why this exists: when code passes the whole `import.meta.env` object around, Astro's build
 * only fills it with the private settings that are named in that same file. So
 * `accessSecret(import.meta.env)` in a page never saw ACCESS_SECRET, and the Stripe webhook
 * handed helpers an object without the Google or Brevo keys they read. Server code should
 * pass `serverEnv()` instead. It merges the runtime environment (all of Vercel's settings) over
 * what the build knows, so a setting added in Vercel works without a code change.
 *
 * Server only. Never import this into a component that runs in the browser.
 */
export type ServerEnvRecord = Record<string, string | undefined>;

export function serverEnv(): ServerEnvRecord {
  const built = (import.meta.env || {}) as unknown as ServerEnvRecord;
  const runtime = typeof process !== 'undefined' && process.env ? (process.env as ServerEnvRecord) : {};
  return { ...built, ...runtime };
}
