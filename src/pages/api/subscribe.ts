import type { APIRoute } from 'astro';

export const prerender = false;

const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
const SITE_URL = 'https://joinclearcareer.com';
const DISCOVERY_CALL_URL = 'https://calendly.com/clearcareer/discovery-call';

const LIST_IDS: Record<string, number> = {
  'make-it-count': 3,
  'achievement-worksheet': 4,
  'newsletter': 5,
  'canadian-finance-companies': 3,
  'quantified-achievements': 3,
  'linkedin-banners': 3,
  'linkedin-headshot': 3,
  'email-templates': 3,
  'salary-guide-2026': 3,
  'hidden-job-titles': 3,
  'linkedin-boolean': 3,
  'layoff-survival-kit': 3,
  'canadian-remote-companies': 3,
};

// ── CTA Group System ───────────────────────────────────────────────────────

type CtaGroup = 'resume' | 'linkedin' | 'strategy' | 'company-lists' | 'layoff';

interface CtaBlock {
  quickWinTip: string;
  headline: string;
  description: string;
  bullets: string[];
  buttonText: string;
  buttonUrl: string;
  testimonial: { quote: string; name: string; outcome: string };
}

const CTA_BLOCKS: Record<CtaGroup, CtaBlock> = {
  resume: {
    quickWinTip: 'Start with your 3 most recent roles. That\'s where recruiters spend 80% of their time. If you can quantify one achievement per role with a real number, you\'re already ahead of 90% of applicants.',
    headline: 'Want AI to help you write stronger bullets?',
    description: 'The Career Prompt Vault has 50 AI frameworks you can copy, paste, and use right now. 7 of them are built specifically for resumes.',
    bullets: [
      'Turn vague job duties into quantified achievements',
      'Generate professional summaries that actually sound like you',
      'Works with Claude, ChatGPT, Gemini, or any AI tool',
    ],
    buttonText: 'Get the Vault for $9',
    buttonUrl: `${SITE_URL}/tools/career-prompt-vault`,
    testimonial: {
      quote: '200+ failed apps. 27 targeted emails. 13 replies. 1 offer.',
      name: 'Blake McDermott',
      outcome: '$5K salary increase after rewriting resume with ClearCareer',
    },
  },
  linkedin: {
    quickWinTip: 'Your headline is the most-read line on your entire profile. It shows up in search results, connection requests, and comments. Make it about the value you deliver, not just your job title.',
    headline: 'Want weekly feedback on your LinkedIn?',
    description: 'ClearCareer Community members get live coaching every week, plus templates, tools, and a private network of job seekers helping each other.',
    bullets: [
      'Weekly group coaching calls with Izzy',
      'LinkedIn profile reviews and post feedback',
      'Job search templates, tools, and AI prompts',
    ],
    buttonText: 'Join the Community',
    buttonUrl: `${SITE_URL}/programs/community`,
    testimonial: {
      quote: 'Izzy\'s system completely transformed my job search from hundreds of applications with no results to receiving responses within the first week.',
      name: 'Andrew Cameron',
      outcome: 'Employer responses in first week',
    },
  },
  strategy: {
    quickWinTip: 'Most job seekers apply to 50+ roles and hear back from 2. The ones who land interviews fast do the opposite: they pick 10-15 companies, research the decision makers, and reach out directly.',
    headline: 'Want all 21 career assets built for you?',
    description: 'The Job Search Ignition System builds your complete job search toolkit in 8 weeks. Resume, LinkedIn, outreach templates, interview prep, salary negotiation scripts, and more.',
    bullets: [
      '20+ done-for-you career assets (resume, LinkedIn, outreach, interview prep)',
      '3 private 1:1 coaching sessions with Izzy',
      'Weekly group calls and WhatsApp support for 8 weeks',
    ],
    buttonText: 'Learn About the Program',
    buttonUrl: `${SITE_URL}/programs/jsis`,
    testimonial: {
      quote: 'Stuck in a job search black hole. 2 offers in weeks.',
      name: 'Annie Bell',
      outcome: '2 offers within weeks of joining the program',
    },
  },
  'company-lists': {
    quickWinTip: 'Don\'t just save this list. Pick your top 10, find 2-3 people at each company on LinkedIn, and send a connection request with a note. That single action beats 100 cold applications.',
    headline: 'Want coaching and accountability while you search?',
    description: 'ClearCareer Community members get weekly coaching, job search templates, and a private network of professionals doing the same thing you are.',
    bullets: [
      'Weekly group coaching calls with Izzy',
      'Outreach templates and LinkedIn scripts',
      'A community of job seekers who actually share leads',
    ],
    buttonText: 'Join the Community',
    buttonUrl: `${SITE_URL}/programs/community`,
    testimonial: {
      quote: '1 year unemployed. Employed in 3 weeks.',
      name: 'Kristin Davis',
      outcome: 'Hired in 3 weeks after joining ClearCareer',
    },
  },
  layoff: {
    quickWinTip: 'The first 72 hours matter most. Before you update LinkedIn or start applying, read the severance section. Most people leave thousands of dollars on the table by accepting the first offer.',
    headline: 'Need the full toolkit?',
    description: 'The free guide covers the first 72 hours. The full Layoff Survival Kit gives you everything else: a severance calculator, lawyer directory, tax strategies, and 10 complete guides.',
    bullets: [
      'Severance negotiation playbook with scripts',
      'Employment lawyer directory (30+ Canadian firms)',
      'Financial runway worksheet and tax planning strategies',
    ],
    buttonText: 'Get the Full Kit for $67',
    buttonUrl: `${SITE_URL}/layoff-survival-kit`,
    testimonial: {
      quote: 'From freelancer to $127K + 30 PTO days negotiated.',
      name: 'Kira Howe',
      outcome: '$127K salary with negotiated PTO after career transition',
    },
  },
};

// ── Lead Magnet Config ─────────────────────────────────────────────────────

const LEAD_MAGNETS: Record<string, {
  subject: string;
  playbook: string;
  webUrl: string;
  ctaGroup: CtaGroup;
  pdfUrl?: string;
  sheetUrl?: string;
  imageUrl?: string;
}> = {
  'make-it-count': {
    subject: "Here's your Make It Count playbook",
    playbook: "Make It Count: The Complete Guide to Quantifying Your Career Impact",
    webUrl: `${SITE_URL}/blog/make-it-count-quantify-your-career-impact`,
    pdfUrl: `${SITE_URL}/downloads/make-it-count.pdf`,
    ctaGroup: 'resume',
  },
  'resume-is-an-ad': {
    subject: "Here's your Resume playbook",
    playbook: "Your Resume Is an Ad, Not a Biography",
    webUrl: `${SITE_URL}/blog/resume-is-an-ad-not-a-biography`,
    pdfUrl: `${SITE_URL}/downloads/resume-is-an-ad.pdf`,
    ctaGroup: 'resume',
  },
  'achievement-mining': {
    subject: "Here's your Achievement Mining playbook",
    playbook: "Achievement Mining: How to Quantify Your Resume Bullets",
    webUrl: `${SITE_URL}/blog/achievement-mining-how-to-quantify-your-resume-bullets`,
    pdfUrl: `${SITE_URL}/downloads/achievement-mining.pdf`,
    ctaGroup: 'resume',
  },
  'linkedin-profile-optimization': {
    subject: "Here's your LinkedIn Optimization playbook",
    playbook: "LinkedIn Profile Optimization: The Full Audit",
    webUrl: `${SITE_URL}/blog/linkedin-profile-optimization-the-full-audit`,
    pdfUrl: `${SITE_URL}/downloads/linkedin-profile-optimization.pdf`,
    ctaGroup: 'linkedin',
  },
  'linkedin-post-ideas': {
    subject: "Here's your LinkedIn Post Ideas guide",
    playbook: "30+ LinkedIn Post Ideas for Job Seekers",
    webUrl: `${SITE_URL}/blog/linkedin-post-ideas-for-job-seekers`,
    ctaGroup: 'linkedin',
  },
  'canadian-finance-companies': {
    subject: "Here's your list of 86 Canadian Banking & Fintech companies",
    playbook: "86 Companies Hiring in Canadian Banking & Fintech",
    webUrl: `${SITE_URL}/resources/canadian-banking-fintech-companies`,
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1GNyVSBTVlmkMEBDRp7f3D4XzNVsjX1gpNL3XsLhGBAY/copy',
    imageUrl: `${SITE_URL}/images/resources/canadian-finance-spreadsheet-email.jpg`,
    ctaGroup: 'company-lists',
  },
  'quantified-achievements': {
    subject: "Here's your 1,600+ Quantified Achievement Bullets",
    playbook: "1,600+ Quantified Resume Achievements for 80+ Job Titles",
    webUrl: `${SITE_URL}/resources/quantified-achievements`,
    sheetUrl: 'https://docs.google.com/spreadsheets/d/10coFJPjCTFB5Bheob6uPGUucVi7GOTgeWnL3Y-e5h2c/copy',
    ctaGroup: 'resume',
  },
  'linkedin-banners': {
    subject: "Here's your LinkedIn Banner Pack",
    playbook: "33 Free LinkedIn Banners for Job Seekers",
    webUrl: `${SITE_URL}/resources/linkedin-banners`,
    ctaGroup: 'linkedin',
  },
  'linkedin-headshot': {
    subject: "Here's your DIY LinkedIn Headshot Guide",
    playbook: "DIY LinkedIn Headshot Guide",
    webUrl: `${SITE_URL}/resources/linkedin-headshot-guide`,
    pdfUrl: `${SITE_URL}/downloads/diy-linkedin-headshot-guide.pdf`,
    ctaGroup: 'linkedin',
  },
  'email-templates': {
    subject: "Here are your 7 Job Search Email Templates",
    playbook: "7 Email Templates Every Job Seeker Needs",
    webUrl: `${SITE_URL}/resources/email-templates`,
    ctaGroup: 'strategy',
  },
  'salary-guide-2026': {
    subject: "Here's your 2026 Canadian Salary Guide",
    playbook: "The 2026 Salary Guide: 50 In-Demand Roles in Canada",
    webUrl: `${SITE_URL}/resources/2026-salary-guide`,
    ctaGroup: 'strategy',
  },
  'hidden-job-titles': {
    subject: "Here are 40 Job Titles That Pay $100K+ in Canada",
    playbook: "40 Job Titles You've Never Heard Of That Pay $100K+",
    webUrl: `${SITE_URL}/resources/hidden-job-titles`,
    ctaGroup: 'strategy',
  },
  'linkedin-boolean': {
    subject: "Here's your LinkedIn Boolean Search Cheat Sheet",
    playbook: "The LinkedIn Recruiter Cheat Sheet: 30 Boolean Search Strings",
    webUrl: `${SITE_URL}/resources/linkedin-boolean-search`,
    ctaGroup: 'linkedin',
  },
  'layoff-checklist': {
    subject: "Here's your Layoff Survival Checklist",
    playbook: "The Layoff Survival Checklist: 25 Steps For the First 72 Hours",
    webUrl: `${SITE_URL}/resources/layoff-checklist`,
    ctaGroup: 'layoff',
  },
  'canadian-remote-companies': {
    subject: "Here's your list of 194 Canadian Remote & Hybrid Companies",
    playbook: "194+ Companies in Canada Hiring Remote & Hybrid Roles",
    webUrl: `${SITE_URL}/resources/canadian-remote-companies`,
    ctaGroup: 'company-lists',
  },
};

// ── Email Builder ──────────────────────────────────────────────────────────

function buildDeliveryEmail(
  playbook: string,
  webUrl: string,
  ctaGroup: CtaGroup,
  pdfUrl?: string,
  sheetUrl?: string,
  imageUrl?: string,
): string {
  const cta = CTA_BLOCKS[ctaGroup];

  const imageSection = imageUrl
    ? `<tr><td style="padding:0 0 24px"><img src="${imageUrl}" alt="${playbook}" style="width:100%;border-radius:8px;border:1px solid #e5e7eb" /></td></tr>`
    : '';

  const downloadButton = pdfUrl
    ? `<tr><td style="padding:12px 0 0"><a href="${pdfUrl}" style="display:inline-block;padding:12px 24px;background:#030620;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">Download PDF Version</a></td></tr>`
    : sheetUrl
      ? `<tr><td style="padding:12px 0 0"><a href="${sheetUrl}" style="display:inline-block;padding:14px 28px;background:#059669;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">Copy Spreadsheet to Google Drive</a></td></tr>`
      : '';

  const bulletHtml = cta.bullets
    .map((b) => `<li style="color:#4b5563;font-size:14px;line-height:1.6;padding:2px 0">${b}</li>`)
    .join('\n');

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

<!-- Resource Delivery -->
<tr><td style="padding:40px 40px 0">
<h2 style="margin:0 0 16px;color:#1B2A4A;font-size:24px;font-weight:700;line-height:1.3">Your playbook is ready</h2>
<p style="margin:0 0 24px;color:#64748B;font-size:16px;line-height:1.6">Thanks for grabbing <strong style="color:#1B2A4A">${playbook}</strong>. Click below to access it right now.</p>

<table cellpadding="0" cellspacing="0" width="100%">
${imageSection}
</table>

<table cellpadding="0" cellspacing="0">
<tr><td><a href="${webUrl}" style="display:inline-block;padding:14px 28px;background:#0161EF;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">Read the Full Playbook</a></td></tr>
${downloadButton}
</table>

<p style="margin:24px 0 0;color:#64748B;font-size:14px;line-height:1.6">The link above will always work. Bookmark it if you want to come back later.</p>
</td></tr>

<!-- Quick Win Tip -->
<tr><td style="padding:24px 40px 0">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border-radius:8px;border-left:4px solid #0161EF">
<tr><td style="padding:16px 20px">
<p style="margin:0 0 4px;color:#0161EF;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Quick tip</p>
<p style="margin:0;color:#1B2A4A;font-size:14px;line-height:1.6">${cta.quickWinTip}</p>
</td></tr>
</table>
</td></tr>

<!-- Divider -->
<tr><td style="padding:32px 40px 0"><hr style="margin:0;border:none;border-top:1px solid #e5e7eb"></td></tr>

<!-- Secondary CTA -->
<tr><td style="padding:24px 40px 0">
<h3 style="margin:0 0 8px;color:#1B2A4A;font-size:18px;font-weight:700;line-height:1.3">${cta.headline}</h3>
<p style="margin:0 0 16px;color:#64748B;font-size:14px;line-height:1.6">${cta.description}</p>
<table cellpadding="0" cellspacing="0" width="100%">
<tr><td>
<ul style="margin:0 0 20px;padding-left:20px">
${bulletHtml}
</ul>
</td></tr>
<tr><td>
<a href="${cta.buttonUrl}" style="display:inline-block;padding:12px 24px;background:#030620;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">${cta.buttonText}</a>
</td></tr>
</table>
</td></tr>

<!-- Divider -->
<tr><td style="padding:28px 40px 0"><hr style="margin:0;border:none;border-top:1px solid #e5e7eb"></td></tr>

<!-- Social Proof -->
<tr><td style="padding:24px 40px 0">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:8px">
<tr><td style="padding:20px 24px">
<p style="margin:0 0 8px;color:#1B2A4A;font-size:15px;font-weight:600;font-style:italic;line-height:1.5">"${cta.testimonial.quote}"</p>
<p style="margin:0;color:#64748B;font-size:13px"><strong style="color:#1B2A4A">${cta.testimonial.name}</strong> &middot; ${cta.testimonial.outcome}</p>
</td></tr>
</table>
</td></tr>

<!-- Discovery Call CTA -->
<tr><td style="padding:28px 40px 0;text-align:center">
<p style="margin:0 0 8px;color:#1B2A4A;font-size:14px;font-weight:600">Want to talk through your job search?</p>
<p style="margin:0"><a href="${DISCOVERY_CALL_URL}" style="color:#0161EF;text-decoration:none;font-size:14px;font-weight:600">Book a free discovery call &rarr;</a></p>
</td></tr>

<!-- Footer -->
<tr><td style="padding:32px 40px 0">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:0 0 12px 12px">
<tr><td style="padding:24px 40px;text-align:center">
<p style="margin:0 0 4px;color:#64748B;font-size:13px">Izzy Piyale-Sheard | <a href="${SITE_URL}" style="color:#0161EF;text-decoration:none">ClearCareer</a></p>
<p style="margin:0;color:#94a3b8;font-size:12px">You're getting this because you downloaded a free resource. <a href="{{unsubscribe}}" style="color:#94a3b8">Unsubscribe</a></p>
</td></tr>
</table>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

// ── Email Sending ──────────────────────────────────────────────────────────

async function sendDeliveryEmail(email: string, source: string): Promise<void> {
  const magnet = LEAD_MAGNETS[source];
  if (!magnet) return; // No delivery email for newsletter signups, etc.

  const html = buildDeliveryEmail(
    magnet.playbook,
    magnet.webUrl,
    magnet.ctaGroup,
    magnet.pdfUrl,
    magnet.sheetUrl,
    magnet.imageUrl,
  );

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
