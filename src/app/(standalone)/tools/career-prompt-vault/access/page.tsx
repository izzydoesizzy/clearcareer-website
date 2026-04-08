import { redirect } from "next/navigation";

interface AccessPageProps {
  searchParams: Promise<{ session_id?: string; dev?: string }>;
}

async function verifySession(sessionId: string): Promise<boolean> {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return false;

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return (
      session.payment_status === "paid" &&
      session.metadata?.product === "nova"
    );
  } catch {
    return false;
  }
}

const promptCategories = [
  { file: "01-resume-skills.md", title: "Resume & Skills", count: 7, description: "Write bullet points, professional summaries, skills sections, and optimize for ATS." },
  { file: "02-linkedin.md", title: "LinkedIn", count: 10, description: "Headlines, About Me, work experience, posts, boolean search, connection scripts." },
  { file: "03-interview.md", title: "Interview Prep", count: 8, description: "Tell Me About Yourself, STAR stories, custom questions, elevator pitch, confidence builder." },
  { file: "04-networking-outreach.md", title: "Networking & Outreach", count: 9, description: "Cold emails, cover letters, follow-up cadence, informational interviews, alumni outreach." },
  { file: "05-market-research.md", title: "Market Research & Strategy", count: 9, description: "Company research, salary data, job description breakdown, find recruiters, prospective companies." },
  { file: "06-negotiation-lifecycle.md", title: "Negotiation & Transitions", count: 7, description: "Salary scripts, offer evaluation, counter-offers, resignation letter, first 90 days plan." },
];

export default async function VaultAccessPage({ searchParams }: AccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const isDev = process.env.NODE_ENV === "development" && params.dev === "true";

  if (!sessionId && !isDev) {
    redirect("/tools/career-prompt-vault");
  }

  if (!isDev && sessionId) {
    const isValid = await verifySession(sessionId);
    if (!isValid) {
      redirect("/tools/career-prompt-vault");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-lg font-bold text-navy">
            Clear<span className="text-blue">Career</span>
          </span>
          <span className="rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">
            Purchase confirmed
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-bg to-white pb-12 pt-12 md:pt-16">
        <div className="mx-auto max-w-[720px] px-4 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] text-navy">
            Your Career Prompt Vault
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base text-text-muted">
            Your AI Career Toolkit is ready. Download your files below and follow the setup guide.
          </p>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="py-12">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <h2 className="font-display text-xl text-navy">Set up in 5 minutes</h2>
          <div className="mt-6 space-y-5">
            {[
              { step: "1", title: "Create a Claude account", desc: "Go to claude.ai and sign up for a free account." },
              { step: "2", title: "Create a Project", desc: "Click Projects > Create Project. Paste the Project Instructions file into Custom Instructions." },
              { step: "3", title: "Upload the prompt files", desc: "Add all 6 prompt files as Project Knowledge." },
              { step: "4", title: "Upload your resume", desc: "Add your resume (PDF, DOCX, or TXT) as Project Knowledge too." },
              { step: "5", title: "Start chatting", desc: "Open a conversation and ask for help with your resume, LinkedIn, interviews, or salary research." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-sm font-bold text-white">{item.step}</div>
                <div>
                  <h3 className="font-semibold text-navy">{item.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads: Project Instructions */}
      <section className="bg-blue-bg py-12">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <h2 className="font-display text-xl text-navy">Project Instructions</h2>
          <p className="mt-2 text-sm text-text-muted">Paste these into your Claude Project&apos;s Custom Instructions box.</p>
          <div className="mt-6 rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-navy">nova-project-instructions.md</h3>
                <p className="mt-1 text-xs text-text-muted">System prompt that turns Claude into your career strategist</p>
              </div>
              <a href="/downloads/nova/nova-project-instructions.md" download className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-dark">Download</a>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads: Prompt Files */}
      <section className="py-12">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <h2 className="font-display text-xl text-navy">Prompt Files</h2>
          <p className="mt-2 text-sm text-text-muted">Upload all 6 files to your Claude Project.</p>
          <div className="mt-6 space-y-3">
            {promptCategories.map((cat) => (
              <div key={cat.file} className="flex items-center justify-between rounded-xl border border-border bg-white p-4 shadow-sm">
                <div className="min-w-0 pr-4">
                  <h3 className="font-semibold text-navy">{cat.title}</h3>
                  <p className="mt-0.5 text-xs text-text-muted">{cat.count} frameworks &middot; {cat.description}</p>
                </div>
                <a href={`/downloads/nova/prompts/${cat.file}`} download className="shrink-0 rounded-lg border border-blue px-3 py-1.5 text-sm font-semibold text-blue hover:bg-blue-bg">Download</a>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a href="/downloads/nova/nova-complete-bundle.zip" download className="inline-flex items-center gap-2 rounded-lg bg-blue px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-dark">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Everything (.zip)
            </a>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="bg-blue-bg py-12">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <h2 className="font-display text-xl text-navy">Guides</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-navy">Setup Guide</h3>
              <p className="mt-1 text-sm text-text-muted">Step-by-step instructions for setting up your Claude Project.</p>
              <a href="/downloads/nova/guides/setup-guide.md" download className="mt-3 inline-block text-sm font-semibold text-blue hover:text-blue-dark">Download &rarr;</a>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-navy">Quick Start: First 30 Minutes</h3>
              <p className="mt-1 text-sm text-text-muted">4 quick wins you can generate in your first session.</p>
              <a href="/downloads/nova/guides/quick-start.md" download className="mt-3 inline-block text-sm font-semibold text-blue hover:text-blue-dark">Download &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      {/* Bonuses */}
      <section className="py-12">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <h2 className="font-display text-xl text-navy">Bonus Resources</h2>
          <div className="mt-6 space-y-3">
            {[
              { title: "AI Job Search Prompt Pack", desc: "15 copy-paste prompts for every stage of your search.", file: "bonus-ai-job-search-prompt-pack.md" },
              { title: "Salary Research Prompt Pack", desc: "7 prompts for finding real salary data for your target role.", file: "bonus-salary-research-prompt-pack.md" },
              { title: '"Tell Me About Yourself" Guide', desc: "The 5-part framework for the most common interview question.", file: "bonus-tell-me-about-yourself-guide.md" },
            ].map((bonus) => (
              <div key={bonus.file} className="flex items-center justify-between rounded-xl border border-border bg-white p-4 shadow-sm">
                <div className="min-w-0 pr-4">
                  <h3 className="font-semibold text-navy">{bonus.title}</h3>
                  <p className="mt-0.5 text-xs text-text-muted">{bonus.desc}</p>
                </div>
                <a href={`/downloads/nova/${bonus.file}`} download className="shrink-0 rounded-lg border border-success px-3 py-1.5 text-sm font-semibold text-success hover:bg-success/5">Bonus</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upsell CTA */}
      <section className="relative overflow-hidden py-12" style={{ background: "linear-gradient(135deg, #0161EF 0%, #0450c8 50%, #030620 100%)" }}>
        <div className="relative mx-auto max-w-[720px] px-4 text-center sm:px-6">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-100">Want more than prompts?</p>
          <h2 className="mt-3 font-display text-[clamp(1.25rem,3vw,2rem)] text-white">The Job Search Ignition System</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-blue-100">
            The Career Prompt Vault gives you the frameworks. The full 8-week program gives you done-for-you resume and LinkedIn rewrites, 1:1 coaching sessions, weekly accountability calls, and personalized strategy.
          </p>
          <a href="/programs/jsis" className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-blue hover:bg-gray-100 hover:shadow-lg">
            Learn about the full program
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-8">
        <div className="mx-auto max-w-[1080px] px-4 text-center text-sm text-text-muted sm:px-6">
          <p>&copy; {new Date().getFullYear()} ClearCareer. All rights reserved.</p>
          <p className="mt-2">Questions? Email <a href="mailto:hello@joinclearcareer.com" className="text-blue">hello@joinclearcareer.com</a></p>
        </div>
      </footer>
    </div>
  );
}
