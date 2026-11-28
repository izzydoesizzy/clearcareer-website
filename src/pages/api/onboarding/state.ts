/** GET /api/onboarding/state?t=TOKEN: everything the onboarding page needs. */
import type { APIRoute } from 'astro';
import { authClient, env, json } from '../../../lib/onboarding-api.js';
import { agreementFor } from '../../../lib/clients.js';
import { storedAnswers } from '../../../lib/call-flow.js';
import { welcome, callTimeLabel } from '../../../data/llu.js';
import { PROGRAMS } from '../../../lib/book-call.js';
import { toolkitUrl } from '../../../lib/onboarding.js';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const r = await authClient(url.searchParams.get('t'));
    if ('error' in r) return r.error;
    const c = r.client;
    const a = storedAnswers(c.attrs);
    const agreement = c.agreementSignedAt ? null : await agreementFor(env, c);
    return json({
      firstName: c.firstName,
      name: c.name,
      program: c.program,
      isPrivate: c.program === PROGRAMS.private.name,
      agreement: agreement ? { html: agreement.html, version: agreement.version } : null,
      signed: c.agreementSignedAt ? { at: c.agreementSignedAt, name: String(c.attrs.AGREEMENT_NAME || '') } : null,
      intakeDone: !!c.intakeDoneAt,
      files: String(c.attrs.INTAKE_FILES || '').split('|').filter(Boolean),
      uploadsReady: !!c.folderId || !!(env.GOOGLE_REFRESH_TOKEN && env.GOOGLE_PARENT_FOLDER_ID),
      prefill: {
        preferredName: c.firstName === 'there' ? '' : c.firstName,
        phone: a?.phone || String(c.attrs.LEAD_PHONE || ''),
        targetRoles: a?.jobTitles || '',
      },
      next: {
        communityName: welcome.communityName,
        communityUrl: welcome.communityUrl,
        callTime: callTimeLabel(),
        callUrl: welcome.callUrl,
        privateBookingUrl: welcome.privateBookingUrl,
        toolkitUrl: await toolkitUrl(env as unknown as Record<string, unknown>, c.email),
      },
    });
  } catch (e) {
    console.error('onboarding state error:', e);
    return json({ error: 'Something went wrong. Please refresh, or email izzy@joinclearcareer.com.' }, 500);
  }
};
