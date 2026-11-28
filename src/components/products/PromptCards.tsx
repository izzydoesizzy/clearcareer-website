import { useState } from "react";

export interface PromptStep { label: string; text: string }
export interface PromptCard { id: string; skill: string; title: string; whatItDoes: string; whenToUse: string; steps: PromptStep[]; replace: string }

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); } catch { /* clipboard blocked */ }
      }}
      className="shrink-0 rounded-md border border-[#0161EF] px-2.5 py-1 text-xs font-semibold text-[#0161EF] hover:bg-[#EFF5FF]"
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}

/** The skills' prompts as copy-paste cards, for any AI tool. Grouped by skill, with a search box. */
export default function PromptCards({ groups, labels = {} }: { groups: { skill: string; cards: PromptCard[] }[]; labels?: Record<string, string> }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [active, setActive] = useState(groups[0]?.skill || "");
  const needle = q.trim().toLowerCase();
  const shown = needle
    ? groups.flatMap((g) => g.cards).filter((c) => (c.title + " " + c.whatItDoes + " " + c.whenToUse).toLowerCase().includes(needle))
    : groups.find((g) => g.skill === active)?.cards || [];

  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search prompts (for example: headline, thank-you, salary)"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        aria-label="Search prompts"
      />
      {!needle && groups.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {groups.map((g) => (
            <button key={g.skill} onClick={() => setActive(g.skill)} className={`rounded-full px-3 py-1 text-xs font-medium ${active === g.skill ? "bg-[#030620] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {labels[g.skill] || g.skill} ({g.cards.length})
            </button>
          ))}
        </div>
      )}
      <ul className="mt-4 space-y-3">
        {shown.map((c) => {
          const isOpen = open === c.id;
          return (
            <li key={c.id} className="rounded-xl border border-gray-200 bg-white">
              <button onClick={() => setOpen(isOpen ? null : c.id)} className="flex w-full items-start justify-between gap-4 p-4 text-left" aria-expanded={isOpen}>
                <span>
                  <span className="block font-semibold text-[#030620]">{c.title}</span>
                  {c.whatItDoes && <span className="mt-0.5 block text-sm text-gray-600">{c.whatItDoes}</span>}
                </span>
                <span aria-hidden="true" className="mt-1 text-gray-400">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="space-y-4 border-t border-gray-100 p-4">
                  {c.whenToUse && <p className="text-sm text-gray-600"><strong className="text-gray-800">When to use it:</strong> {c.whenToUse}</p>}
                  {c.steps.map((s, i) => (
                    <div key={i}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{s.label}</p>
                        <CopyButton text={s.text} />
                      </div>
                      <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-3 font-mono text-[13px] leading-relaxed text-gray-800">{s.text}</pre>
                    </div>
                  ))}
                  {c.replace && <p className="text-xs text-gray-500"><strong>Replace:</strong> {c.replace}</p>}
                </div>
              )}
            </li>
          );
        })}
        {!shown.length && <li className="py-8 text-center text-sm text-gray-500">No prompts match that search.</li>}
      </ul>
    </div>
  );
}
