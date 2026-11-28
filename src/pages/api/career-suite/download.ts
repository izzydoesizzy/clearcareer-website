import type { APIRoute } from "astro";
import Stripe from "stripe";
import { readFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { isSuiteSessionValid, suiteDownloadPath } from "../../../data/career-suite";

export const prerender = false;

// Serves Career Suite files only to buyers. The files live outside public/
// (skills/clearcareer-career-suite/dist), so this route is the only way to reach them.
const DIST = join(process.cwd(), "skills", "clearcareer-career-suite", "dist");

const text = (body: string, status: number) =>
  new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

export const GET: APIRoute = async ({ url }) => {
  const sessionId = url.searchParams.get("session_id") || "";
  const platform = url.searchParams.get("platform") || "";
  const skill = url.searchParams.get("skill") || "";

  // Only names from our own list are accepted, so no path tricks get through.
  const relPath = suiteDownloadPath(platform, skill);
  if (!relPath) return text("Unknown download.", 404);

  const stripeKey = import.meta.env.STRIPE_SECRET_KEY;
  if (!stripeKey || !sessionId.startsWith("cs_")) return text("Access link not valid.", 403);

  try {
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!isSuiteSessionValid(session)) return text("Access link not valid.", 403);
  } catch {
    return text("Access link not valid.", 403);
  }

  try {
    const file = await readFile(join(DIST, relPath));
    const name = relPath.endsWith(".md")
      ? basename(relPath)
      : `clearcareer-${platform}-${basename(relPath)}`;
    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": relPath.endsWith(".md") ? "text/markdown; charset=utf-8" : "application/zip",
        "Content-Disposition": `attachment; filename="${name}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err: any) {
    console.error("Career Suite download missing:", relPath, err.message);
    return text("That file isn't available right now. Email izzy@joinclearcareer.com and we'll send it.", 500);
  }
};
