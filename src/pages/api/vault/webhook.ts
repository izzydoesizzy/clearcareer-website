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

    if (session.metadata?.product === "vault" && session.payment_status === "paid") {
      const customerEmail = session.customer_details?.email;
      if (customerEmail) {
        await sendConfirmationEmail(customerEmail, session.id);
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
        <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
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
          <p style="margin:24px 0 0;font-size:14px;color:#6b7280;">
            Questions? Just reply to this email. I read every one.<br>- Izzy
          </p>
        </div>
      </div>
    `,
  });
}
