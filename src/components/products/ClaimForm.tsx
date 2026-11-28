"use client";

import { useState } from "react";

/**
 * Free product signup. The product is sent whatever they choose; the unticked box only decides
 * whether they also join Izzy's emails (CASL). On success, they can open it right away.
 */
export default function ClaimForm({ productSlug, productName, consentText }: { productSlug: string; productName: string; consentText: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      const res = await fetch(`/api/products/${productSlug}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: f.get("firstName"),
          email: f.get("email"),
          consent: f.get("consent") === "on",
          website: f.get("website"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
      setUrl(data.url || "");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center">
        <p className="text-lg font-semibold text-[#030620]">It's on its way.</p>
        <p className="mt-2 text-sm text-gray-600">Check your inbox for your link to the {productName}. You can also open it now.</p>
        {url && <a href={url} className="mt-4 inline-block rounded-lg bg-[#0161EF] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0450c8]">Open it now</a>}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-3 rounded-xl border border-gray-200 bg-white p-6 text-left">
      <label className="block text-sm font-medium text-[#030620]">
        First name
        <input name="firstName" autoComplete="given-name" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base" />
      </label>
      <label className="block text-sm font-medium text-[#030620]">
        Email
        <input name="email" type="email" required autoComplete="email" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base" />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="flex items-start gap-3 text-sm text-gray-600">
        <input name="consent" type="checkbox" className="mt-1 h-4 w-4 shrink-0" />
        <span>{consentText}</span>
      </label>
      <button type="submit" disabled={state === "sending"} className="w-full rounded-lg bg-[#0161EF] px-6 py-3 text-base font-semibold text-white hover:bg-[#0450c8] disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send me the free audit"}
      </button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <p className="text-xs text-gray-500">You'll get the audit either way. The box is only for my emails.</p>
    </form>
  );
}
