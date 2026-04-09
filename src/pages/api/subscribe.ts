import type { APIRoute } from 'astro';

export const prerender = false;

const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
const SITE_URL = 'https://joinclearcareer.com';

const LIST_IDS: Record<string, number> = {
  'make-it-count': 3,
  'achievement-worksheet': 4,
  'newsletter': 5,
};

// Lead magnet delivery config: source → email details
const LEAD_MAGNETS: Record<string, {
  subject: string;
  playbook: string;
  webUrl: string;
  pdfUrl?: string;
}> = {
  'make-it-count': {
    subject: "Here's your Make It Count playbook",
    playbook: "Make It Count: The Complete Guide to Quantifying Your Career Impact",
    webUrl: `${SITE_URL}/blog/make-it-count-quantify-your-career-impact`,
    pdfUrl: `${SITE_URL}/downloads/make-it-count.pdf`,
  },
  'resume-is-an-ad': {
    subject: "Here's your Resume playbook",
    playbook: "Your Resume Is an Ad, Not a Biography",
    webUrl: `${SITE_URL}/blog/resume-is-an-ad-not-a-biography`,
    pdfUrl: `${SITE_URL}/downloads/resume-is-an-ad.pdf`,
  },
  'achievement-mining': {
    subject: "Here's your Achievement Mining playbook",
    playbook: "Achievement Mining: How to Quantify Your Resume Bullets",
    webUrl: `${SITE_URL}/blog/achievement-mining-how-to-quantify-your-resume-bullets`,
    pdfUrl: `${SITE_URL}/downloads/achievement-mining.pdf`,
  },
  'linkedin-profile-optimization': {
    subject: "Here's your LinkedIn Optimization playbook",
    playbook: "LinkedIn Profile Optimization: The Full Audit",
    webUrl: `${SITE_URL}/blog/linkedin-profile-optimization-the-full-audit`,
    pdfUrl: `${SITE_URL}/downloads/linkedin-profile-optimization.pdf`,
  },
  'linkedin-post-ideas': {
    subject: "Here's your LinkedIn Post Ideas guide",
    playbook: "30+ LinkedIn Post Ideas for Job Seekers",
    webUrl: `${SITE_URL}/blog/linkedin-post-ideas-for-job-seekers`,
  },
};

function buildDeliveryEmail(playbook: string, webUrl: string, pdfUrl?: string): string {
  const pdfSection = pdfUrl
    ? `<tr><td style="padding:12px 0 0"><a href="${pdfUrl}" style="display:inline-block;padding:12px 24px;background:#030620;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">Download PDF Version</a></td></tr>`
    : '';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">

<!-- Header -->
<tr><td style="background:#0161EF;padding:32px 40px;text-align:center">
<h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.5px">CLEARCAREER</h1>
</td></tr>

<!-- Body -->
<tr><td style="padding:40px">
<h2 style="margin:0 0 16px;color:#1B2A4A;font-size:24px;font-weight:700;line-height:1.3">Your playbook is ready</h2>
<p style="margin:0 0 24px;color:#64748B;font-size:16px;line-height:1.6">Thanks for grabbing <strong style="color:#1B2A4A">${playbook}</strong>. Click below to read it right now.</p>

<table cellpadding="0" cellspacing="0">
<tr><td><a href="${webUrl}" style="display:inline-block;padding:14px 28px;background:#0161EF;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">Read the Full Playbook</a></td></tr>
${pdfSection}
</table>

<p style="margin:24px 0 0;color:#64748B;font-size:14px;line-height:1.6">The link above will always work. Bookmark it if you want to come back later.</p>

<hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb">

<p style="margin:0 0 8px;color:#1B2A4A;font-size:14px;font-weight:600">Want more help with your job search?</p>
<p style="margin:0 0 4px;color:#64748B;font-size:14px;line-height:1.6">I also offer coaching, done-for-you resume rewrites, and an 8-week job search accelerator.</p>
<p style="margin:8px 0 0"><a href="${SITE_URL}/programs/jsis" style="color:#0161EF;text-decoration:none;font-size:14px;font-weight:600">Learn about the program &rarr;</a></p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#f8fafc;padding:24px 40px;text-align:center">
<p style="margin:0 0 4px;color:#64748B;font-size:13px">Izzy Piyale-Sheard | <a href="${SITE_URL}" style="color:#0161EF;text-decoration:none">ClearCareer</a></p>
<p style="margin:0;color:#94a3b8;font-size:12px">You're getting this because you downloaded a free resource. <a href="{{unsubscribe}}" style="color:#94a3b8">Unsubscribe</a></p>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

async function sendDeliveryEmail(email: string, source: string): Promise<void> {
  const magnet = LEAD_MAGNETS[source];
  if (!magnet) return; // No delivery email for newsletter signups, etc.

  const html = buildDeliveryEmail(magnet.playbook, magnet.webUrl, magnet.pdfUrl);

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Izzy from ClearCareer', email: 'izzy@joinclearcareer.com' },
      to: [{ email }],
      subject: magnet.subject,
      htmlContent: html,
    }),
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const listId = LIST_IDS[source] || LIST_IDS['newsletter'];

    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY not set');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Add contact to Brevo list
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
        attributes: {
          SOURCE: source || 'website',
        },
      }),
    });

    // Accept success or duplicate contact
    const contactOk = brevoRes.ok || brevoRes.status === 204;
    if (!contactOk) {
      const brevoBody = await brevoRes.text();
      if (!(brevoRes.status === 400 && brevoBody.includes('already exist'))) {
        console.error('Brevo contact error:', brevoRes.status, brevoBody);
      }
    }

    // 2. Send delivery email (fire and forget, don't block the response)
    sendDeliveryEmail(email, source).catch((err) => {
      console.error('Delivery email error:', err);
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
