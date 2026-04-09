import type { APIRoute } from "astro";
import Stripe from "stripe";
import { Resend } from "resend";

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

    if (session.payment_status === "paid") {
      const customerEmail = session.customer_details?.email;

      if (session.metadata?.product === "vault" && customerEmail) {
        await sendConfirmationEmail(customerEmail, session.id);
      }

      if (session.metadata?.product === "layoff-survival-kit" && customerEmail) {
        await sendLayoffKitAccessEmail(customerEmail, session.id);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

async function sendConfirmationEmail(email: string, sessionId: string) {
  const resendKey = import.meta.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("RESEND_API_KEY not set, skipping email delivery");
    return;
  }

  const resend = new Resend(resendKey);
  const baseUrl = import.meta.env.SITE || "https://joinclearcareer.com";
  const accessUrl = `${baseUrl}/tools/career-prompt-vault/access?session_id=${sessionId}`;
  const communityUrl = `${baseUrl}/programs/community`;
  const discoveryUrl = "https://calendly.com/clearcareer/discovery-call";

  await resend.emails.send({
    from: "Izzy from ClearCareer <hello@joinclearcareer.com>",
    to: email,
    subject: "Your Career Prompt Vault is ready",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f0f0f;">
        <div style="padding:32px 24px;background:linear-gradient(135deg,#0161EF 0%,#0450c8 100%);border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:24px;">Your Career Prompt Vault</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:16px;">50 AI career frameworks, ready to use.</p>
        </div>
        <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;">
          <p style="margin:0 0 16px;line-height:1.6;">
            Thanks for grabbing The Career Prompt Vault. You now have 50 proven career frameworks that turn any AI assistant into your personal career strategist.
          </p>
          <a href="${accessUrl}" style="display:inline-block;padding:12px 24px;background:#0161EF;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;">
            Access Your Toolkit
          </a>
          <h3 style="margin:24px 0 12px;font-size:16px;">Quick start:</h3>
          <ol style="margin:0;padding-left:20px;line-height:1.8;">
            <li>Go to <a href="https://claude.ai" style="color:#0161EF;">claude.ai</a>, <a href="https://chatgpt.com" style="color:#0161EF;">chatgpt.com</a>, or your preferred AI tool</li>
            <li>Upload your resume</li>
            <li>Copy a prompt from your access page and paste it in</li>
            <li>Replace the [brackets] with your details and hit send</li>
          </ol>

          <!-- Quick Tip -->
          <div style="margin:24px 0 0;background:#f0f7ff;border-radius:8px;border-left:4px solid #0161EF;padding:16px 20px;">
            <p style="margin:0 0 4px;color:#0161EF;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Pro tip</p>
            <p style="margin:0;color:#1B2A4A;font-size:14px;line-height:1.6;">Start with the "Career Highlights Extractor" prompt. Upload your resume, run it, and you'll have a list of quantified achievements you can use across every other prompt in the vault.</p>
          </div>

          <hr style="margin:28px 0;border:none;border-top:1px solid #e5e7eb">

          <!-- Community CTA -->
          <h3 style="margin:0 0 8px;color:#1B2A4A;font-size:18px;font-weight:700;">You've got the prompts. Now get weekly coaching.</h3>
          <p style="margin:0 0 16px;color:#4b5563;font-size:14px;line-height:1.6;">ClearCareer Community members get live coaching every week to put these frameworks into action. Plus templates, tools, and a private network of job seekers helping each other.</p>
          <ul style="margin:0 0 20px;padding-left:20px;">
            <li style="color:#4b5563;font-size:14px;line-height:1.6;padding:2px 0">Weekly group coaching calls with Izzy</li>
            <li style="color:#4b5563;font-size:14px;line-height:1.6;padding:2px 0">Resume and LinkedIn profile reviews</li>
            <li style="color:#4b5563;font-size:14px;line-height:1.6;padding:2px 0">From $49/month or $249 for lifetime access</li>
          </ul>
          <a href="${communityUrl}" style="display:inline-block;padding:12px 24px;background:#030620;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Join the Community</a>

          <hr style="margin:28px 0;border:none;border-top:1px solid #e5e7eb">

          <!-- Testimonial -->
          <div style="background:#fafafa;border-radius:8px;padding:20px 24px;">
            <p style="margin:0 0 8px;color:#1B2A4A;font-size:15px;font-weight:600;font-style:italic;line-height:1.5;">"1+ year searching. Hired in 30 days."</p>
            <p style="margin:0;color:#64748B;font-size:13px;"><strong style="color:#1B2A4A;">Sparsh Kalia</strong> &middot; Hired in 30 days after joining ClearCareer</p>
          </div>

          <!-- Discovery Call -->
          <div style="text-align:center;padding:24px 0 8px;">
            <p style="margin:0 0 8px;color:#1B2A4A;font-size:14px;font-weight:600;">Want to talk through your job search?</p>
            <p style="margin:0;"><a href="${discoveryUrl}" style="color:#0161EF;text-decoration:none;font-size:14px;font-weight:600;">Book a free discovery call &rarr;</a></p>
          </div>

          <p style="margin:16px 0 0;font-size:14px;color:#6b7280;">
            Questions? Just reply to this email. I read every one.<br>- Izzy
          </p>
        </div>
      </div>
    `,
  });
}

async function sendLayoffKitAccessEmail(email: string, sessionId: string) {
  const resendKey = import.meta.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("RESEND_API_KEY not set, skipping email delivery");
    return;
  }

  const resend = new Resend(resendKey);
  const baseUrl = import.meta.env.SITE || "https://joinclearcareer.com";
  const accessUrl = `${baseUrl}/layoff-survival-kit/access/${sessionId}`;
  const calculatorUrl = `${baseUrl}/free-tools/severance-calculator`;
  const discoveryUrl = "https://calendly.com/clearcareer/discovery-call";

  await resend.emails.send({
    from: "Izzy from ClearCareer <hello@joinclearcareer.com>",
    to: email,
    subject: "Your Layoff Survival Kit is ready",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f0f0f;">
        <div style="padding:32px 24px;background:linear-gradient(135deg,#0161EF 0%,#0450c8 100%);border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:24px;">Your Layoff Survival Kit</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:16px;">Severance calculator, lawyer directory, and 10 complete guides.</p>
        </div>
        <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;">
          <p style="margin:0 0 16px;line-height:1.6;">
            Your private access page is ready. Bookmark this link so you can come back to it anytime.
          </p>
          <a href="${accessUrl}" style="display:inline-block;padding:12px 24px;background:#0161EF;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;">
            Access Your Kit
          </a>

          <!-- What's Inside -->
          <h3 style="margin:24px 0 12px;font-size:16px;color:#1B2A4A;">What's inside:</h3>
          <ul style="margin:0 0 0;padding-left:20px;">
            <li style="color:#4b5563;font-size:14px;line-height:1.8;">Severance negotiation playbook with word-for-word scripts</li>
            <li style="color:#4b5563;font-size:14px;line-height:1.8;">Employment lawyer directory (30+ Canadian firms)</li>
            <li style="color:#4b5563;font-size:14px;line-height:1.8;">Financial runway worksheet and tax planning strategies</li>
            <li style="color:#4b5563;font-size:14px;line-height:1.8;">LinkedIn optimization guide and salary negotiation framework</li>
            <li style="color:#4b5563;font-size:14px;line-height:1.8;">30/60/90 day job search action plan</li>
          </ul>

          <!-- Quick Tip -->
          <div style="margin:24px 0 0;background:#f0f7ff;border-radius:8px;border-left:4px solid #0161EF;padding:16px 20px;">
            <p style="margin:0 0 4px;color:#0161EF;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Start here</p>
            <p style="margin:0;color:#1B2A4A;font-size:14px;line-height:1.6;">Run the <a href="${calculatorUrl}" style="color:#0161EF;text-decoration:none;font-weight:600;">severance calculator</a> first. It takes 2 minutes and will tell you whether your package is fair before you sign anything.</p>
          </div>

          <hr style="margin:28px 0;border:none;border-top:1px solid #e5e7eb">

          <!-- Discovery Call CTA -->
          <h3 style="margin:0 0 8px;color:#1B2A4A;font-size:18px;font-weight:700;">Want to talk it through?</h3>
          <p style="margin:0 0 16px;color:#4b5563;font-size:14px;line-height:1.6;">Getting laid off is overwhelming. If you want to talk through your situation, your severance, or your next move, book a free call. No pitch, just clarity.</p>
          <a href="${discoveryUrl}" style="display:inline-block;padding:12px 24px;background:#030620;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Book a Free Call</a>

          <hr style="margin:28px 0;border:none;border-top:1px solid #e5e7eb">

          <!-- Testimonial -->
          <div style="background:#fafafa;border-radius:8px;padding:20px 24px;">
            <p style="margin:0 0 8px;color:#1B2A4A;font-size:15px;font-weight:600;font-style:italic;line-height:1.5;">"$20K+ raise and a bonus. After getting zero interviews."</p>
            <p style="margin:0;color:#64748B;font-size:13px;"><strong style="color:#1B2A4A;">Tamara Gordon</strong> &middot; $20K+ salary increase after ClearCareer coaching</p>
          </div>

          <p style="margin:24px 0 0;font-size:14px;color:#6b7280;line-height:1.6;">
            If the button doesn't work, copy and paste this URL:<br>
            <a href="${accessUrl}" style="color:#0161EF;">${accessUrl}</a>
          </p>
          <p style="margin:16px 0 0;font-size:14px;color:#6b7280;">
            Questions? Just reply to this email. I read every one.<br>- Izzy
          </p>
        </div>
      </div>
    `,
  });
}
