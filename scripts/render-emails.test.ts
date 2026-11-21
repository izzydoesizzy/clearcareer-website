/**
 * Writes the launch emails to emails/brevo/ so Brevo can load them by URL.
 * Run: pnpm emails:render   (does nothing in a normal test run)
 */
import { it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { nurtureEmails } from '../src/lib/email/nurture';

it('renders the launch emails', () => {
  if (!process.env.RENDER_EMAILS) return;
  mkdirSync('emails/brevo', { recursive: true });
  const rows = nurtureEmails().map((e) => {
    writeFileSync(`emails/brevo/launch-${e.n}.html`, e.html);
    return `| ${e.n} | ${e.sendAt} ET | ${e.subject} | ${e.name} | launch-${e.n}.html |`;
  });
  writeFileSync(
    'emails/brevo/README.md',
    `# Land and Level Up launch emails\n\nGenerated from \`src/lib/email/nurture.ts\` by \`pnpm emails:render\`. Edit the source, not these files.\n\nSend each one as a scheduled Brevo campaign to the list "Nurture: Land and Level Up (opted in)". Exclude anyone on the "Call booked" list who has already enrolled.\n\n| # | Send (Toronto) | Subject | Brevo template | File |\n|---|---|---|---|---|\n${rows.join('\n')}\n`,
  );
});
