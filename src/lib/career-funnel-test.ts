import Stripe from "stripe";
export const COOKIE = "cc_funnel_sandbox";
export const FLOW = "career-funnel-sandbox-v2";
export const offers = {
  a: { name: "Career Prompt Vault", amount: 900, next: "Job Search Script Vault", nextAmount: 2900 },
  b: { name: "Job Search Toolkit Bundle", amount: 4900, next: "Career Change Command Center", nextAmount: 4700 },
} as const;
export type Variant = keyof typeof offers;
export const format = (n: number) => new Intl.NumberFormat("en-CA", {style:"currency",currency:"CAD",maximumFractionDigits:2}).format(n/100);
export function sandbox() {
  const secret = import.meta.env.STRIPE_FUNNEL_TEST_SECRET_KEY || "";
  return /^(sk|rk)_test_/.test(secret) ? new Stripe(secret) : null;
}
export function allowedOrigin(url: URL) {
  return url.protocol === "https:" && /^clearcareer-website-[a-z0-9-]+-izzydoesizzys-projects\.vercel\.app$/.test(url.hostname);
}
export const id = (v: string | {id:string} | null | undefined) => typeof v === "string" ? v : v?.id;
export async function state(stripe: Stripe, sessionId: string | undefined) {
  if (!sessionId || !/^cs_test_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  const s = await stripe.checkout.sessions.retrieve(sessionId, {expand:["payment_intent"]});
  if (s.livemode || s.status !== "complete" || s.payment_status !== "paid" || s.metadata?.funnel !== FLOW || s.currency !== "cad" || Date.now()/1000 - s.created > 7200) return null;
  const key = s.metadata.variant;
  if (key !== "a" && key !== "b") return null;
  const offer = offers[key], bump = s.metadata.bump === "yes";
  const base = offer.amount + (bump ? 900 : 0), group = Number(s.metadata.group);
  if (s.amount_total !== base || ![94900,120000].includes(group)) return null;
  const customer = id(s.customer), pi = s.payment_intent;
  if (!customer || !pi || typeof pi === "string" || pi.livemode || pi.status !== "succeeded" || !id(pi.payment_method) || id(pi.customer) !== customer) return null;
  const intents = (await stripe.paymentIntents.list({customer,limit:100})).data.filter(p => !p.livemode && p.metadata.funnel === FLOW && p.metadata.session === s.id && p.currency === "cad");
  const first = intents.find(p=>p.metadata.stage==="first");
  const second = intents.find(p=>p.metadata.stage==="group");
  const firstPaid = first?.status==="succeeded" && first.amount===offer.nextAmount;
  const due = group-base-(firstPaid?offer.nextAmount:0);
  const secondPaid = second?.status==="succeeded" && second.amount===due;
  const firstDone = firstPaid || s.metadata.first_skipped === "yes";
  const secondDone = secondPaid || s.metadata.group_skipped === "yes";
  return {s,key,offer,bump,base,group,due,customer,method:id(pi.payment_method)!,first,second,firstPaid,secondPaid,firstDone,secondDone};
}
