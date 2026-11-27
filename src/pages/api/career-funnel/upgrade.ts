import type { APIRoute } from "astro";
import { sandbox, allowedOrigin, COOKIE, FLOW, state } from "../../../lib/career-funnel-test";
export const prerender = false;
export const POST: APIRoute = async ({request,url,cookies}) => {
  if (!allowedOrigin(url) || request.headers.get("origin") !== url.origin) return new Response("Preview only",{status:403});
  const back=(reason:string)=>new Response(null,{status:303,headers:{Location:"/career-funnel-preview?checkout="+reason,"Cache-Control":"no-store"}});
  try {
    const stripe=sandbox();
    if(!stripe) return back("unavailable");
    const choice=(await request.formData()).get("choice");
    if(choice==="restart"){cookies.delete(COOKIE,{path:"/"});return back("restart");}
    const x=await state(stripe,cookies.get(COOKIE)?.value);
    if(!x) return back("unavailable");
    if(x.secondDone) return back("complete");
    const first=choice==="first" || choice==="skip-first";
    const second=choice==="group" || choice==="skip-group" || choice==="fit";
    if(!first&&!second) return back("invalid");
    if(first&&(x.firstDone||x.second)) return back("continue");
    if(second&&!x.firstDone) return back("continue");
    const existing=first?x.first:x.second;
    if(choice==="skip-first"||choice==="skip-group"||choice==="fit"){
      if(existing && existing.status!=="canceled"){
        if(existing.status==="succeeded"||existing.status==="processing"||existing.status==="requires_capture") return back("pending");
        await stripe.paymentIntents.cancel(existing.id);
      }
      await stripe.checkout.sessions.update(x.s.id,{metadata:first?{first_skipped:"yes"}:{group_skipped:"yes",fit:choice==="fit"?"yes":"no"}});
      return back("continue");
    }
    if(existing) return back(existing.status==="succeeded"?"continue":existing.status==="processing"?"pending":"payment-failed");
    const stage=first?"first":"group";
    const pi=await stripe.paymentIntents.create({
      amount:first?x.offer.nextAmount:x.due,currency:"cad",customer:x.customer,payment_method:x.method,
      payment_method_types:["card"],confirm:true,off_session:true,
      description:(first?x.offer.next:"Land and Level Up")+" (sandbox)",
      metadata:{funnel:FLOW,session:x.s.id,stage},
    },{idempotencyKey:FLOW+":"+x.s.id+":"+stage});
    return back(!pi.livemode&&pi.status==="succeeded"?"continue":pi.status==="processing"?"pending":"payment-failed");
  } catch {return back("payment-failed");}
};
