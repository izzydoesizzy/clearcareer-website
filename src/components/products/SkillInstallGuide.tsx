import { useState, type ReactNode } from "react";

/**
 * How to install a ClearCareer skill, for every tool people use. The pictures are drawn in code
 * (simple sketches of each screen), so nothing breaks when an app restyles its menus.
 */
const TABS = [
  { id: "claude", label: "Claude app", note: "Recommended" },
  { id: "code", label: "Claude Code" },
  { id: "project", label: "Claude Project", note: "Free plan" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "gemini", label: "Gemini" },
  { id: "any", label: "Any AI" },
  { id: "help", label: "Troubleshooting" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Steps({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <ol className="space-y-4">
      {items.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0161EF] text-xs font-bold text-white">{i + 1}</span>
          <div>
            <p className="text-sm font-semibold text-[#030620]">{s.title}</p>
            <div className="mt-0.5 text-sm leading-relaxed text-gray-600">{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A small sketch of a settings screen, so people know what they're looking for. */
function Sketch({ crumbs, rows, button }: { crumbs: string[]; rows: { label: string; on?: boolean }[]; button?: string }) {
  return (
    <figure aria-hidden="true" className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-3 text-xs text-gray-500">{crumbs.join("  ›  ")}</span>
      </div>
      <div className="space-y-2 p-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm">
            <span className="font-mono text-[13px] text-gray-800">{r.label}</span>
            <span className={`h-5 w-9 rounded-full p-0.5 ${r.on ? "bg-[#0161EF]" : "bg-gray-200"}`}>
              <span className={`block h-4 w-4 rounded-full bg-white shadow ${r.on ? "translate-x-4" : ""}`} />
            </span>
          </div>
        ))}
        {button && (
          <div className="pt-1">
            <span className="inline-block rounded-lg border-2 border-dashed border-[#0161EF] px-3 py-1.5 text-sm font-semibold text-[#0161EF]">{button}</span>
          </div>
        )}
      </div>
    </figure>
  );
}

function Code({ children }: { children: string }) {
  return <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[13px] text-gray-800">{children}</code>;
}

export default function SkillInstallGuide({ skillNames, firstSkill }: { skillNames: string[]; firstSkill: string }) {
  const [tab, setTab] = useState<TabId>("claude");
  const example = firstSkill || "cc-resume";

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Where you use AI">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${tab === t.id ? "bg-[#0161EF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            {t.label}
            {"note" in t && t.note && <span className={`ml-1.5 text-xs ${tab === t.id ? "text-blue-100" : "text-gray-500"}`}>({t.note})</span>}
          </button>
        ))}
      </div>

      <div className="mt-6" role="tabpanel">
        {tab === "claude" && (
          <div className="grid gap-6 md:grid-cols-[1fr_280px]">
            <div>
              <p className="mb-4 text-sm text-gray-600">
                For Claude on the web, desktop or mobile with a paid plan (Pro, Max, Team or Enterprise). Each skill installs on its own, so you'll repeat this {skillNames.length > 1 ? `${skillNames.length} times (it takes about a minute each)` : "once"}.
              </p>
              <Steps
                items={[
                  { title: "Download a skill", body: <>Open the <strong>Claude skills</strong> section on this page and download <Code>{`${example}.zip`}</Code>. Don't unzip it.</> },
                  { title: "Open Claude's settings", body: <>Go to <strong>Settings</strong>, then <strong>Capabilities</strong>. Turn on <strong>Code execution and file creation</strong> if it's off: skills need it. (Some versions call this page <strong>Customize</strong>.)</> },
                  { title: "Upload it", body: <>Under <strong>Skills</strong>, choose <strong>Upload skill</strong> and pick the zip you downloaded. On a Team or Enterprise plan, an admin may need to allow skills first.</> },
                  { title: "Check it's switched on", body: <>You'll see <Code>{example}</Code> in your skills list with its switch on.</> },
                  { title: "Try it", body: <>Start a new chat and type something like: <em>"Use {example} to help me with my resume."</em> Claude loads the skill when your request matches, or when you name it.</> },
                ]}
              />
            </div>
            <Sketch crumbs={["Settings", "Capabilities", "Skills"]} rows={skillNames.slice(0, 4).map((n, i) => ({ label: n, on: i === 0 }))} button="+ Upload skill" />
          </div>
        )}

        {tab === "code" && (
          <Steps
            items={[
              { title: "Download the skill zips", body: "One per skill, from the Claude skills section." },
              { title: "Unzip into your skills folder", body: <>Unzip each one into <Code>~/.claude/skills/</Code> (all projects) or <Code>.claude/skills/</Code> (one project). You should end up with <Code>{`~/.claude/skills/${example}/SKILL.md`}</Code>.</> },
              { title: "Restart Claude Code", body: <>Then ask normally, or type <Code>{`/${example}`}</Code> to call it directly.</> },
            ]}
          />
        )}

        {tab === "project" && (
          <Steps
            items={[
              { title: "Create a Project", body: <>In Claude, open <strong>Projects</strong> and create one called "Job search". Projects work on the free plan.</> },
              { title: "Add the instructions", body: <>Unzip a skill and paste the text of its <Code>SKILL.md</Code> into the Project's <strong>instructions</strong> (or use the setup text from the downloads, when your product has one).</> },
              { title: "Add the reference files", body: <>Upload the files from the skill's <Code>references</Code> folder, plus your resume, to the Project's <strong>knowledge</strong>.</> },
              { title: "Chat inside the Project", body: "Every chat in it now knows the method and your background." },
            ]}
          />
        )}

        {tab === "chatgpt" && (
          <Steps
            items={[
              { title: "Create a GPT", body: <>In ChatGPT, open <strong>GPTs</strong>, then <strong>Create</strong>, then <strong>Configure</strong>. (Making GPTs needs a paid ChatGPT plan.)</> },
              { title: "Paste the instructions", body: <>Unzip a skill and paste its <Code>SKILL.md</Code> text into <strong>Instructions</strong>. Delete the lines between the two <Code>---</Code> marks at the top.</> },
              { title: "Upload the references", body: <>Add the files in the skill's <Code>references</Code> folder under <strong>Knowledge</strong>, then save the GPT as private.</> },
              { title: "No paid plan?", body: <>Use the <strong>Copy-paste prompts</strong> section instead. They work in free ChatGPT.</> },
            ]}
          />
        )}

        {tab === "gemini" && (
          <Steps
            items={[
              { title: "Create a Gem", body: <>In Gemini, open <strong>Gems</strong> and choose <strong>New Gem</strong>.</> },
              { title: "Paste the instructions", body: <>Unzip a skill and paste its <Code>SKILL.md</Code> text (without the top lines between <Code>---</Code>) into the instructions box.</> },
              { title: "Add the references", body: <>Upload the files in the skill's <Code>references</Code> folder, save, and chat with your Gem.</> },
            ]}
          />
        )}

        {tab === "any" && (
          <Steps
            items={[
              { title: "Open the copy-paste prompts", body: "Every skill's prompts are on this page, ready to copy." },
              { title: "Paste into any AI chat", body: "ChatGPT, Claude, Gemini, Copilot or anything else. Attach your resume first so it uses your real experience." },
              { title: "Fill in the [brackets]", body: "Replace each [Variable] with your details, then send. Keep your facts true: the AI should never invent numbers for you." },
            ]}
          />
        )}

        {tab === "help" && (
          <dl className="space-y-4 text-sm">
            {[
              ["Is the zip safe?", "Yes. It only holds plain text (.md) files you can open and read: no apps, no code, nothing that runs on its own. Open it first if you'd like to look."],
              ["The upload failed", "Upload the zip exactly as you downloaded it. If you unzipped and re-zipped it, make sure the zip holds one folder with SKILL.md inside."],
              ["I don't see Skills in settings", "Skills need a paid Claude plan with code execution turned on. Menus move around: look under Capabilities or Customize. On Team or Enterprise, ask your admin."],
              ["Claude isn't using the skill", "Name it in your message: \"Use " + example + " to…\". Check its switch is on in your skills list."],
              ["Do I need all of them?", "No. Each skill works on its own. Start with the one you need this week."],
              ["Still stuck?", "Reply to your purchase email. It comes straight to me."],
            ].map(([q, a]) => (
              <div key={q} className="rounded-lg border border-gray-200 p-4">
                <dt className="font-semibold text-[#030620]">{q}</dt>
                <dd className="mt-1 text-gray-600">{a}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
