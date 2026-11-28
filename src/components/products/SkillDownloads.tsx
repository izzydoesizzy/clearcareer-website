import { useState } from "react";

export interface SkillSummary { name: string; description: string; zipName: string; files: { path: string; bytes: number }[] }

/** The description is written for Claude; buyers only need its first sentence. */
const firstSentence = (d: string) => (d.match(/^.*?[.!?](?=\s|$)/)?.[0] || d).replace(/^Helps a job seeker /, "Helps you ");

const kb = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);

/** One card per Claude skill: what it does, a download button, and the exact files inside. */
export default function SkillDownloads({ skills, downloadBase }: { skills: SkillSummary[]; downloadBase: (file: string) => string }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <p className="rounded-lg bg-[#EFF5FF] px-4 py-3 text-sm text-[#030620]">
        Each skill is a small zip of plain text files: no apps, no code. Download one, then follow the <strong>Install</strong> steps.
      </p>
      {skills.map((s) => {
        const total = s.files.reduce((n, f) => n + f.bytes, 0);
        const isOpen = open === s.name;
        return (
          <div key={s.name} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-[#0161EF]">{s.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">{firstSentence(s.description)}</p>
              </div>
              <a
                href={downloadBase(s.zipName)}
                download
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0161EF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0450c8]"
              >
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download {s.zipName}
              </a>
            </div>
            <button onClick={() => setOpen(isOpen ? null : s.name)} className="mt-3 text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-700" aria-expanded={isOpen}>
              {isOpen ? "Hide" : "See"} what's inside ({s.files.length} text files, {kb(total)})
            </button>
            {isOpen && (
              <ul className="mt-2 space-y-1 rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-700">
                {s.files.map((f) => (
                  <li key={f.path} className="flex justify-between gap-4"><span>{f.path}</span><span className="text-gray-400">{kb(f.bytes)}</span></li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
