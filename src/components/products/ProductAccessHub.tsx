"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ProductGuide } from "../../data/product-config";
import SkillInstallGuide from "./SkillInstallGuide";
import SkillDownloads, { type SkillSummary } from "./SkillDownloads";
import PromptCards, { type PromptCard } from "./PromptCards";

interface ProductAccessHubProps {
  productName: string;
  productSlug: string;
  buyerName: string;
  buyerEmail: string;
  guides: ProductGuide[];
  /** The token from the URL. Sent with every guide and download request. */
  accessToken: string;
  startHere?: string | null;
  skills?: SkillSummary[];
  prompts?: { skill: string; cards: PromptCard[] }[];
  /** Bundles: links to each included product's own page. */
  included?: { name: string; description: string; url: string }[];
  /** Extra downloads, such as setup text for a Claude Project or Custom GPT. */
  extraDownloads?: { label: string; file: string }[];
  /** Extra reading passed in directly (bonus guides). */
  docs?: { id: string; title: string; markdown: string }[];
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none break-words prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-[#0161EF] prose-table:block prose-table:overflow-x-auto prose-pre:overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

type Section = { id: string; label: string; icon: string; group: "start" | "tools" | "guides" };

export default function ProductAccessHub({
  productName,
  productSlug,
  buyerName,
  buyerEmail,
  guides,
  accessToken,
  startHere,
  skills = [],
  prompts = [],
  included = [],
  extraDownloads = [],
  docs = [],
}: ProductAccessHubProps) {
  const sections: Section[] = [
    ...(startHere ? [{ id: "start", label: "Start here", icon: "👋", group: "start" as const }] : []),
    ...(included.length ? [{ id: "products", label: "Your products", icon: "📦", group: "start" as const }] : []),
    ...(skills.length ? [{ id: "skills", label: "Claude skills", icon: "✨", group: "tools" as const }, { id: "install", label: "Install the skills", icon: "🧩", group: "tools" as const }] : []),
    ...(prompts.length ? [{ id: "prompts", label: "Copy-paste prompts", icon: "📋", group: "tools" as const }] : []),
    ...guides.map((g) => ({ id: g.id, label: g.title, icon: g.icon, group: "guides" as const })),
    ...docs.map((d) => ({ id: d.id, label: d.title, icon: "🎁", group: "guides" as const })),
  ];
  const [active, setActive] = useState(sections[0]?.id || "");
  const [guideContent, setGuideContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const cache = useRef<Record<string, string>>({});
  const tokenQuery = `t=${encodeURIComponent(accessToken)}`;
  const download = (file: string) => `/api/products/${productSlug}/download/${file}?${tokenQuery}`;

  const loadGuide = useCallback(async (guideId: string) => {
    if (cache.current[guideId]) { setGuideContent({ ...cache.current }); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productSlug}/guide/${guideId}?${tokenQuery}`);
      const data = await res.json();
      cache.current[guideId] = res.ok ? data.markdown : "This guide needs your access link. Open this page from your purchase email.";
    } catch {
      cache.current[guideId] = "Failed to load guide. Please refresh and try again.";
    }
    setGuideContent({ ...cache.current });
    setLoading(false);
  }, [productSlug, tokenQuery]);

  const open = useCallback((id: string) => {
    setActive(id);
    if (guides.some((g) => g.id === id)) loadGuide(id);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [guides, loadGuide]);

  useEffect(() => {
    if (guides.some((g) => g.id === active)) loadGuide(active);
    // only on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupLabel = { start: "Start", tools: "Use it", guides: "Guides" } as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-baseline">
            <a href="/" className="shrink-0 text-lg font-bold text-[#0161EF]">ClearCareer</a>
            <span className="ml-2 truncate text-sm text-gray-500">{productName}</span>
          </div>
          <span className="hidden text-sm text-gray-400 sm:inline">{buyerEmail}</span>
        </div>
      </header>

      {/* Stacked on phones (menu bar above the content), side by side from md up. */}
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <nav className="hidden w-72 shrink-0 border-r border-gray-200 bg-white p-4 md:block" aria-label="Product sections">
          {(["start", "tools", "guides"] as const).map((grp) => {
            const items = sections.filter((s) => s.group === grp);
            if (!items.length) return null;
            return (
              <div key={grp} className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{groupLabel[grp]}</p>
                <ul className="space-y-1">
                  {items.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => open(s.id)}
                        aria-current={active === s.id ? "page" : undefined}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${active === s.id ? "bg-blue-50 font-medium text-[#0161EF]" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        <span aria-hidden="true">{s.icon}</span>
                        <span>{s.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {extraDownloads.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Downloads</p>
              {extraDownloads.map((d) => (
                <a key={d.file} href={download(d.file)} className="block rounded-lg px-3 py-2 text-sm text-[#0161EF] hover:bg-blue-50">{d.label}</a>
              ))}
            </div>
          )}
        </nav>

        <div className="sticky top-14 z-40 w-full border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <label className="sr-only" htmlFor="section-select">Section</label>
          <select id="section-select" value={active} onChange={(e) => open(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base">
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
            ))}
          </select>
          {extraDownloads.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {extraDownloads.map((d) => (
                // Short labels on phones: the full ones ("... (setup steps inside each folder)") wrap badly.
                <a key={d.file} href={download(d.file)} className="truncate rounded-lg border border-[#0161EF] px-2 py-1.5 text-center text-sm font-medium text-[#0161EF]">
                  ⬇ {d.label.replace(/\s*\(.*\)\s*$/, "")}
                </a>
              ))}
            </div>
          )}
        </div>

        <main className="min-w-0 flex-1 px-4 py-6 sm:p-6 md:p-10">
          <div className="mx-auto max-w-3xl">
            {active === "start" && startHere && (
              <>
                {buyerName && <p className="mb-4 text-sm text-gray-500">Welcome, {buyerName.split(" ")[0]}.</p>}
                <MarkdownContent content={startHere} />
                {(skills.length > 0 || prompts.length > 0) && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {skills.length > 0 && <button onClick={() => open("skills")} className="rounded-lg bg-[#0161EF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0450c8]">Get the Claude skills</button>}
                    {prompts.length > 0 && <button onClick={() => open("prompts")} className="rounded-lg border border-[#0161EF] px-4 py-2.5 text-sm font-semibold text-[#0161EF] hover:bg-blue-50">Copy-paste prompts</button>}
                  </div>
                )}
              </>
            )}

            {active === "products" && (
              <div>
                <h1 className="text-2xl font-semibold text-[#030620]">Your products</h1>
                <p className="mt-2 text-sm text-gray-600">Each one has its own page with its skills, prompts and guides. Bookmark this page: it links to all of them.</p>
                <ul className="mt-6 space-y-3">
                  {included.map((p) => (
                    <li key={p.url} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                      <span><span className="block font-semibold text-[#030620]">{p.name}</span><span className="mt-0.5 block text-sm text-gray-600">{p.description}</span></span>
                      <a href={p.url} className="shrink-0 rounded-lg bg-[#0161EF] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#0450c8]">Open</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {active === "skills" && (
              <div>
                <h1 className="text-2xl font-semibold text-[#030620]">Your Claude skills</h1>
                <p className="mb-6 mt-2 text-sm text-gray-600">Download each skill, then install it once. After that, just ask Claude for help and it uses the method.</p>
                <SkillDownloads skills={skills} downloadBase={download} />
                <button onClick={() => open("install")} className="mt-6 text-sm font-semibold text-[#0161EF] underline underline-offset-2">How to install them →</button>
              </div>
            )}

            {active === "install" && (
              <div>
                <h1 className="text-2xl font-semibold text-[#030620]">Install the skills</h1>
                <p className="mb-6 mt-2 text-sm text-gray-600">Pick where you use AI. No Claude? The ChatGPT, Gemini and copy-paste routes work too.</p>
                <SkillInstallGuide skillNames={skills.map((s) => s.name)} firstSkill={skills[0]?.name || ""} />
              </div>
            )}

            {active === "prompts" && (
              <div>
                <h1 className="text-2xl font-semibold text-[#030620]">Copy-paste prompts</h1>
                <p className="mb-6 mt-2 text-sm text-gray-600">The same method as the skills, for any AI tool. Attach your resume first, then paste a prompt and fill in the [brackets].</p>
                <PromptCards groups={prompts} />
              </div>
            )}

            {docs.some((d) => d.id === active) && <MarkdownContent content={docs.find((d) => d.id === active)!.markdown} />}

            {guides.some((g) => g.id === active) && (
              loading && !guideContent[active] ? (
                <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#0161EF]" /></div>
              ) : guideContent[active] ? (
                <MarkdownContent content={guideContent[active]} />
              ) : (
                <p className="py-20 text-center text-gray-400">Loading…</p>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
