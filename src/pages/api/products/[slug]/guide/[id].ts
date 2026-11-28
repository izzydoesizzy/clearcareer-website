import type { APIRoute } from "astro";
import { readFileSync } from "fs";
import { join } from "path";
import { PRODUCTS } from "../../../../../data/product-config";
import { verifyAccess } from "../../../../../lib/product-access";
import { serverEnv } from "../../../../../lib/server-env";

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
  const { slug, id } = params;

  if (!slug || !id || !PRODUCTS[slug]) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  const product = PRODUCTS[slug];
  // Paid guides need the buyer's access token (free products stay open).
  if (product.price > 0 && !(await verifyAccess(slug, url.searchParams.get("t"), serverEnv(), url)).ok) {
    return new Response(JSON.stringify({ error: "Access link required" }), { status: 403 });
  }
  const guide = product.guides.find((g) => g.id === id);

  if (!guide) {
    return new Response(JSON.stringify({ error: "Guide not found" }), {
      status: 404,
    });
  }

  try {
    const guidesDir = join(
      process.cwd(),
      "src",
      "data",
      product.guidesDir
    );
    const content = readFileSync(join(guidesDir, guide.file), "utf-8");

    return new Response(JSON.stringify({ markdown: content }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Guide content not available" }),
      { status: 404 }
    );
  }
};
