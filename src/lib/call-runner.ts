/**
 * Sends the emails for one booked call and records what went out on the Brevo contact.
 */
import { brevo, type BrevoContact } from './brevo-api.js';
import { bookedEmail, dayBeforeEmail, morningOfEmail, followUp1Email, followUp2Email, type Checkout } from './call-emails.js';
import { buildSalesBrief } from './sales-brief.js';
import { callInfo, storedAnswers, type Step } from './call-flow.js';

export interface RunnerEnv {
  apiKey: string;
  notifyTo: string;
  checkout: Checkout;
}

export async function runSteps(env: RunnerEnv, contact: BrevoContact, steps: Step[]): Promise<Step[]> {
  const api = brevo(env.apiKey);
  const a = contact.attributes || {};
  const answers = storedAnswers(a);
  const c = callInfo(contact.email, a, answers);
  const done: Step[] = [];

  for (const step of steps) {
    let ok = false;
    if (step === 'brief') {
      if (!answers) {
        ok = await api.send({
          to: env.notifyTo, senderName: 'ClearCareer Bookings', tags: ['sales-brief'],
          subject: `Call ${c.callAt.toLocaleString('en-CA', { timeZone: 'America/Toronto' })} | ${c.firstName} | No form answers on file`,
          html: `<p style="font-family:Arial,sans-serif;">${c.firstName} (${contact.email}) booked a call but there are no form answers on their Brevo contact, so there is no sales plan. They may have used an old booking link.</p>`,
          replyTo: { email: contact.email },
        });
      } else {
        const brief = buildSalesBrief(answers, { callAt: c.callAt, joinUrl: c.joinUrl }, env.checkout);
        ok = await api.send({ to: env.notifyTo, senderName: 'ClearCareer Bookings', subject: brief.subject, html: brief.html, replyTo: { email: contact.email, name: c.firstName }, tags: ['sales-brief'] });
      }
    } else {
      if (contact.emailBlacklisted) { done.push(step); continue; } // they unsubscribed: skip, but mark as handled
      const mail =
        step === 'booked' ? bookedEmail(c)
        : step === 'daybefore' ? dayBeforeEmail(c)
        : step === 'morning' ? morningOfEmail(c)
        : step === 'follow1' ? followUp1Email(c, env.checkout)
        : followUp2Email(c, env.checkout);
      ok = await api.send({ to: contact.email, toName: c.firstName, subject: mail.subject, html: mail.html, tags: [`call-${step}`] });
    }
    if (ok) done.push(step);
  }

  if (done.length) {
    const sent = String(a.CALL_EMAILS_SENT || '').split(',').filter(Boolean);
    await api.upsert(contact.email, { CALL_EMAILS_SENT: [...new Set([...sent, ...done])].join(',') });
  }
  return done;
}

export function checkoutFromEnv(env: Record<string, string | undefined>): Checkout {
  const ok = (u?: string) => (u && /^https:\/\//.test(u) && !u.includes('calendly.com') ? u : undefined);
  return { group: ok(env.PUBLIC_GROUP_CHECKOUT_URL), private: ok(env.PUBLIC_PRIVATE_CHECKOUT_URL) };
}
