import type { APIRoute } from "astro";
import { sandbox, allowedOrigin, offers, COOKIE, FLOW } from "../../../lib/career-funnel-test";
import { offer } from "../../../data/llu";
export const prerender = false;
export const POST: APIRoute = async ({ request, url, cookies }) => {
  if (!allowedOrigin(url) || request.headers.get("origin") !== url.origin) return new Response("Preview only", {status:403});
  const back = (reason:string) => new Response(null,{status:303,headers:{Location:"/career-funnel-preview?checkout="+reason,"Cache-Control":"no-store"}});
  try {
    const stripe = sandbox();
    if (!stripe) return back("unavailable");
    const form = await request.formData();
    const key = form.get("variant");
    if ((key !== "a" && key !== "b") || form.get("consent") !== "yes") return back("consent");
    const item = offers[key], bump = form.get("bump") === "yes";
    const session = await stripe.checkout.sessions.create({
      mode:"payment", payment_method_types:["card"], customer_creation:"always",
      payment_intent_data:{setup_future_usage:"off_session",metadata:{funnel:FLOW}},
      line_items:[{price_data:{currency:"cad",unit_amount:item.amount,product_data:{name:item.name+" (sandbox)"}},quantity:1},
        ...(bump ? [{price_data:{currency:"cad",unit_amount:900,product_data:{name:"Salary Number Generator (sandbox)"}},quantity:1}] : [])],
      metadata:{funnel:FLOW,variant:key,bump:bump?"yes":"no",group:offer.dealLive?"94900":"120000"},
      success_url:url.origin+"/career-funnel-preview?checkout=success",
      cancel_url:url.origin+"/career-funnel-preview?checkout=cancelled",
    });
    if (session.livemode || !session.url) return back("unavailable");
    cookies.set(COOKIE,session.id,{path:"/",httpOnly:true,secure:true,sameSite:"lax",maxAge:7200});
    return new Response(null,{status:303,headers:{Location:session.url,"Cache-Control":"no-store"}});
  } catch { return back("unavailable"); }
};
