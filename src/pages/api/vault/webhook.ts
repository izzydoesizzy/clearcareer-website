import type { APIRoute } from "astro";
import Stripe from "stripe";
import { Resend } from "resend";
import { buildBoldConversion, SITE_URL, DISCOVERY_CALL_URL } from "../../../lib/email/index.js";
import type { EmailData } from "../../../lib/email/types.js";
import { LLU_PITCH } from '../../../data/llu-pitch.js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const stripeKey = import.meta.env.STRIPE_SECRET_KEY;
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return new Response(JSON.stringify({ error: "Stripe not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(stripeKey);
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return new Response(JSON.stringify({ error: "No signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // "no_payment_required" covers 100% promo codes (Land and Level Up members get the Career Suite free).
    const isFreeCareerSuite = session.payment_status === "no_payment_required" && session.metadata?.product === "career-suite";
    if (session.payment_status === "paid" || isFreeCareerSuite) {
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name;
      const firstName = customerName?.split(" ")[0];

      if (session.metadata?.product === "vault" && customerEmail) {
        await sendProductEmail(customerEmail, session.id, "vault", firstName);
      }

      if (session.metadata?.product === "career-suite" && customerEmail) {
        await sendProductEmail(customerEmail, session.id, "career-suite", firstName);
      }

      if (session.metadata?.product === "layoff-survival-kit" && customerEmail) {
        await sendProductEmail(customerEmail, session.id, "layoff-survival-kit", firstName);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

async function sendProductEmail(
  email: string,
  sessionId: string,
  product: "vault" | "layoff-survival-kit" | "career-suite",
  firstName?: string,
) {
  const resendKey = import.meta.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("RESEND_API_KEY not set, skipping email delivery");
    return;
  }

  const baseUrl = import.meta.env.SITE || SITE_URL;
  const emailData = product === "vault"
    ? buildVaultEmailData(baseUrl, sessionId, firstName)
    : product === "career-suite"
      ? buildCareerSuiteEmailData(baseUrl, sessionId, firstName)
      : buildLayoffKitEmailData(baseUrl, sessionId, firstName);

  const subject = product === "vault"
    ? "Your Career Prompt Vault is ready"
    : product === "career-suite"
      ? "Your Career Suite is ready"
      : "Your Layoff Survival Kit is ready";

  const html = buildBoldConversion(emailData);
  const resend = new Resend(resendKey);

  await resend.emails.send({
    from: "Izzy from ClearCareer <izzy@joinclearcareer.com>",
    to: email,
    subject,
    html,
  });
}

function buildVaultEmailData(baseUrl: string, sessionId: string, firstName?: string): EmailData {
  const accessUrl = `${baseUrl}/tools/career-prompt-vault/access?session_id=${sessionId}`;

  return {
    productName: "Your Career Prompt Vault",
    subtitle: "50 AI career frameworks, ready to use.",
    firstName,
    primaryCta: {
      text: "Access Your Toolkit",
      url: accessUrl,
    },
    quickTip: {
      label: "Pro tip",
      text: 'Start with the "Career Highlights Extractor" prompt. Upload your resume, run it, and you\'ll have a list of quantified achievements you can use across every other prompt in the vault.',
    },
    extraContent: `
<h3 style="margin:0 0 12px;font-size:16px;color:#1B2A4A;">Quick start:</h3>
<ol style="margin:0;padding-left:20px;line-height:1.8;">
  <li style="color:#4b5563;font-size:14px;">Go to <a href="https://claude.ai" style="color:#0161EF;">claude.ai</a>, <a href="https://chatgpt.com" style="color:#0161EF;">chatgpt.com</a>, or your preferred AI tool</li>
  <li style="color:#4b5563;font-size:14px;">Upload your resume</li>
  <li style="color:#4b5563;font-size:14px;">Copy a prompt from your access page and paste it in</li>
  <li style="color:#4b5563;font-size:14px;">Replace the [brackets] with your details and hit send</li>
</ol>`,
    upsell: {
      headline: LLU_PITCH.headline,
      description: LLU_PITCH.description,
      bullets: LLU_PITCH.bullets,
      buttonText: LLU_PITCH.button,
      buttonUrl: `${baseUrl}/land-and-level-up`,
    },
    testimonial: {
      quote: "Top of salary range, extra vacation, and a role that matters.",
      name: "Alison Gibbins",
      outcome: "Top of salary range + 5 extra vacation days; corporate to nonprofit transition",
    },
    discoveryCall: {
      text: "Want to talk through your job search?",
      url: DISCOVERY_CALL_URL,
    },
  };
}

function buildCareerSuiteEmailData(baseUrl: string, sessionId: string, firstName?: string): EmailData {
  const accessUrl = `${baseUrl}/tools/career-suite/access?session_id=${sessionId}`;

  return {
    productName: "Your Career Suite",
    subtitle: "Six AI tools for Claude, ChatGPT and Gemini, in the order you use them.",
    firstName,
    primaryCta: {
      text: "Download Your Tools",
      url: accessUrl,
    },
    quickTip: {
      label: "Start here",
      text: "Install Career Clarity and the AI Achievement Interviewer first. Run the Quick Start (15 minutes), then do your first voice interview on your phone. Everything else builds on that.",
    },
    extraContent: `
<h3 style="margin:0 0 12px;font-size:16px;color:#1B2A4A;">Your first week:</h3>
<ol style="margin:0;padding-left:20px;line-height:1.8;">
  <li style="color:#4b5563;font-size:14px;">Career Clarity Quick Start: working titles and resume feedback</li>
  <li style="color:#4b5563;font-size:14px;">AI Achievement Interviewer: 2 to 3 voice sittings until every role has numbers</li>
  <li style="color:#4b5563;font-size:14px;">Career Clarity Full Report: final titles, pay for your city, target companies</li>
  <li style="color:#4b5563;font-size:14px;">Summary refresh: your resume is done</li>
</ol>
<p style="margin:12px 0 0;color:#4b5563;font-size:14px;">Bookmark your download page. It's your access link for life.</p>`,
    upsell: {
      headline: LLU_PITCH.headline,
      description: LLU_PITCH.description,
      bullets: LLU_PITCH.bullets,
      buttonText: LLU_PITCH.button,
      buttonUrl: `${baseUrl}/land-and-level-up`,
    },
    testimonial: {
      quote: "After 12 months of searching and 160+ applications with no offers, I was hired in 3 weeks using Izzy's system.",
      name: "Jorge G.",
      outcome: "Hired in 3 weeks after 12 months",
    },
    discoveryCall: {
      text: "Want to talk through your job search?",
      url: DISCOVERY_CALL_URL,
    },
  };
}

function buildLayoffKitEmailData(baseUrl: string, sessionId: string, firstName?: string): EmailData {
  const accessUrl = `${baseUrl}/layoff-survival-kit/access/${sessionId}`;
  const calculatorUrl = `${baseUrl}/free-tools/severance-calculator`;

  return {
    productName: "Your Layoff Survival Kit",
    subtitle: "Severance calculator, lawyer directory, and 10 complete guides.",
    firstName,
    primaryCta: {
      text: "Access Your Kit",
      url: accessUrl,
    },
    quickTip: {
      label: "Start here",
      text: `Run the <a href="${calculatorUrl}" style="color:#0161EF;text-decoration:none;font-weight:600;">severance calculator</a> first. It takes 2 minutes and will tell you whether your package is fair before you sign anything.`,
    },
    extraContent: `
<h3 style="margin:0 0 12px;font-size:16px;color:#1B2A4A;">What's inside:</h3>
<ul style="margin:0;padding-left:20px;">
  <li style="color:#4b5563;font-size:14px;line-height:1.8;">Severance negotiation playbook with word-for-word scripts</li>
  <li style="color:#4b5563;font-size:14px;line-height:1.8;">Employment lawyer directory (30+ Canadian firms)</li>
  <li style="color:#4b5563;font-size:14px;line-height:1.8;">Financial runway worksheet and tax planning strategies</li>
  <li style="color:#4b5563;font-size:14px;line-height:1.8;">LinkedIn optimization guide and salary negotiation framework</li>
  <li style="color:#4b5563;font-size:14px;line-height:1.8;">30/60/90 day job search action plan</li>
</ul>`,
    upsell: {
      headline: "Want to talk it through?",
      description: "Getting laid off is overwhelming. If you want to talk through your situation, your severance, or your next move, book a free call to see if working together is the right fit.",
      bullets: [
        "Review your severance package with a career expert",
        "Get a clear 30-day action plan",
        "Understand your options before signing anything",
      ],
      buttonText: "Book a Free Call",
      buttonUrl: DISCOVERY_CALL_URL,
    },
    testimonial: {
      quote: "600+ applications, only 3 interviews. ClearCareer changed everything.",
      name: "Darin Mellor",
      outcome: "Maintained salary after completely transforming job search approach",
    },
    discoveryCall: false,
  };
}
