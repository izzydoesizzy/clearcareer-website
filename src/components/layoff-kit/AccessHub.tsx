import { useState, type ComponentPropsWithoutRef } from "react";
import { SeveranceCalculator } from "./SeveranceCalculator";
import { LawyerDirectory } from "./LawyerDirectory";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ── Inline markdown renderer ───────────────────────────────────────────────

function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <article className={className ?? "prose prose-sm max-w-none"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, ...props }: ComponentPropsWithoutRef<"a">) => (
            <a {...props} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

// ── Guide metadata ─────────────────────────────────────────────────────────

const GUIDES = [
  { id: "calculator", title: "Severance Calculator", icon: "🧮", type: "tool" as const },
  { id: "lawyers", title: "Employment Lawyer Directory", icon: "⚖️", type: "tool" as const },
  { id: "01-severance-negotiation", title: "Severance Negotiation Playbook", icon: "📋", type: "guide" as const },
  { id: "02-tax-planning", title: "Tax Planning Strategies", icon: "💰", type: "guide" as const },
  { id: "03-benefits-transition", title: "Benefits Transition Guide", icon: "🏥", type: "guide" as const },
  { id: "04-financial-runway", title: "Financial Runway Worksheet", icon: "📊", type: "guide" as const },
  { id: "05-linkedin-optimization", title: "LinkedIn Optimization", icon: "💼", type: "guide" as const },
  { id: "06-salary-negotiation", title: "Salary Negotiation Scripts", icon: "🎯", type: "guide" as const },
  { id: "07-government-support", title: "Government Support Directory", icon: "🇨🇦", type: "guide" as const },
  { id: "08-reference-strategy", title: "Reference Strategy Guide", icon: "📝", type: "guide" as const },
  { id: "09-non-compete-audit", title: "Non-Compete Audit Checklist", icon: "🔍", type: "guide" as const },
  { id: "10-job-search-plan", title: "30/60/90 Day Job Search Plan", icon: "🗓️", type: "guide" as const },
];

interface GuideContent {
  [id: string]: string;
}

export function AccessHub({
  buyerName,
  buyerEmail,
}: {
  buyerName: string;
  buyerEmail: string;
}) {
  const [activeTab, setActiveTab] = useState("calculator");
  const [guideContent, setGuideContent] = useState<GuideContent>({});
  const [loading, setLoading] = useState<string | null>(null);

  async function loadGuide(id: string) {
    if (guideContent[id]) return;
    setLoading(id);
    try {
      const res = await fetch(`/api/layoff-kit/guide/${id}`);
      if (res.ok) {
        const { markdown } = await res.json();
        setGuideContent((prev) => ({ ...prev, [id]: markdown }));
      }
    } catch {
      setGuideContent((prev) => ({
        ...prev,
        [id]: "Failed to load guide. Please refresh the page.",
      }));
    }
    setLoading(null);
  }

  function handleTabClick(id: string) {
    setActiveTab(id);
    const guide = GUIDES.find((g) => g.id === id);
    if (guide?.type === "guide" && !guideContent[id]) {
      loadGuide(id);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="font-semibold text-[#030620] text-sm">ClearCareer</span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-sm text-gray-600">Layoff Survival Kit</span>
          </div>
          <span className="text-xs text-gray-400">{buyerEmail}</span>
        </div>
      </header>

      {/* Disclaimer bar */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <p className="text-xs text-amber-800">
            <strong>Educational resource only.</strong> This kit is not legal, tax, or financial advice.
            Consult an employment lawyer and CPA before making decisions about your severance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <nav className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Tools</p>
            {GUIDES.filter((g) => g.type === "tool").map((g) => (
              <button
                key={g.id}
                onClick={() => handleTabClick(g.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                  activeTab === g.id
                    ? "bg-[#0161EF] text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{g.icon}</span>
                {g.title}
              </button>
            ))}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-4">Guides</p>
            {GUIDES.filter((g) => g.type === "guide").map((g) => (
              <button
                key={g.id}
                onClick={() => handleTabClick(g.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                  activeTab === g.id
                    ? "bg-[#0161EF] text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{g.icon}</span>
                {g.title}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile tab selector */}
        <div className="md:hidden w-full">
          <select
            value={activeTab}
            onChange={(e) => handleTabClick(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm mb-4"
          >
            <optgroup label="Tools">
              {GUIDES.filter((g) => g.type === "tool").map((g) => (
                <option key={g.id} value={g.id}>{g.icon} {g.title}</option>
              ))}
            </optgroup>
            <optgroup label="Guides">
              {GUIDES.filter((g) => g.type === "guide").map((g) => (
                <option key={g.id} value={g.id}>{g.icon} {g.title}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Content area */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            {activeTab === "calculator" && (
              <div>
                <h1 className="text-2xl font-bold text-[#030620] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Canadian Severance Calculator
                </h1>
                <p className="text-gray-600 text-sm mb-6">
                  Enter your details to see your statutory minimum and common-law estimate.
                </p>
                <SeveranceCalculator />
              </div>
            )}

            {activeTab === "lawyers" && (
              <div>
                <h1 className="text-2xl font-bold text-[#030620] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Employment Lawyer Directory
                </h1>
                <p className="text-gray-600 text-sm mb-6">
                  Curated employment lawyers across Canada. Filter by province or specialty.
                </p>
                <LawyerDirectory />
              </div>
            )}

            {activeTab !== "calculator" && activeTab !== "lawyers" && (
              <div>
                {loading === activeTab ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0161EF] border-t-transparent" />
                  </div>
                ) : guideContent[activeTab] ? (
                  <MarkdownContent
                    content={guideContent[activeTab]}
                    className="prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-[#0161EF]"
                  />
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <p className="text-lg mb-2">{GUIDES.find((g) => g.id === activeTab)?.icon}</p>
                    <p>Loading guide...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
