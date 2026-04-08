import FAQAccordion from "@components/FAQAccordion";
import TestimonialCard from "@components/TestimonialCard";
import NovaCheckout from "@components/NovaCheckout";

const PRODUCT_NAME = "The Career Prompt Vault";

const categories = [
  {
    title: "Resume & Skills",
    count: 7,
    before: "Managed a team and completed projects on time.",
    after: "Led a cross-functional team of 12 engineers, delivering a $2.4M platform migration 3 weeks ahead of schedule, reducing infrastructure costs by 34%.",
  },
  {
    title: "LinkedIn",
    count: 10,
    before: "Marketing Manager at Acme Corp",
    after: "B2B Marketing Leader | 3x Pipeline Growth | HubSpot + Salesforce | Helping SaaS companies turn content into revenue",
  },
  {
    title: "Interview Prep",
    count: 8,
    before: "Um, so I've been working in marketing for about 10 years, and I've done a lot of different things...",
    after: "I'm a B2B marketing leader with 10 years of experience scaling pipeline for SaaS companies. Most recently at Acme, I built the content engine that drove 3x pipeline growth in 18 months...",
  },
  {
    title: "Networking & Outreach",
    count: 9,
    before: "Hi, I'm looking for a job. Do you have any openings?",
    after: "Hi Sarah, I came across your talk at SaaStr on product-led growth and your point about activation metrics really resonated. I've spent the last 3 years solving that exact problem at Acme...",
  },
  {
    title: "Market Research",
    count: 9,
    before: "I have no idea what salary to ask for.",
    after: "Senior PM in Toronto: $145K-$175K base (Glassdoor avg $158K, Levels.fyi $162K). Target: $165K. Walk-away: $150K. Anchor: $180K.",
  },
  {
    title: "Negotiation & Transitions",
    count: 7,
    before: "That sounds great, I'll take it!",
    after: "Thank you for the offer. I'm genuinely excited about this role. Based on my research and the scope we discussed, I was targeting $165K. Is there flexibility to close that gap?",
  },
];

const testimonials = [
  {
    name: "Annie Bell",
    role: "ClearCareer client",
    quote: "I joined Izzy's course and within weeks got 2 offers. To say he knows his stuff would be the understatement of the year.",
    outcome: "2 offers within weeks",
  },
  {
    name: "Charla F.",
    role: "ClearCareer client",
    quote: "The resume rewrite and interview prep completely changed my trajectory. I went from $90K to $260K.",
    outcome: "$170K salary increase",
  },
  {
    name: "Jorge G.",
    role: "ClearCareer client",
    quote: "After 12 months of searching and 160+ applications with no offers, I was hired in 3 weeks using Izzy's system.",
    outcome: "Hired in 3 weeks after 12 months",
  },
  {
    name: "Victor P.",
    role: "ClearCareer client",
    quote: "500+ rejections over 11 months. After applying Izzy's frameworks, I had 3 interviews in 2 weeks.",
    outcome: "3 interviews in 2 weeks",
  },
  {
    name: "Andrew Cameron",
    role: "ClearCareer client",
    quote: "Izzy's system completely transformed my job search from hundreds of applications with no results to receiving responses within the first week.",
    outcome: "Responses within the first week",
  },
  {
    name: "Marsha D.",
    role: "ClearCareer client",
    quote: "After a 3-year career break, I negotiated $10K more than the initial offer using the salary negotiation scripts.",
    outcome: "$10K negotiated after career break",
  },
];

const valueStack = [
  { item: "50 AI Career Frameworks (6 categories)", value: 197 },
  { item: "Custom AI System Prompt", value: 47 },
  { item: "Step-by-Step Setup Guide", value: 27 },
  { item: "Quick-Start Guide: 4 Wins in 30 Minutes", value: 27 },
  { item: "Bonus: AI Job Search Prompt Pack (15 prompts)", value: 47 },
  { item: "Bonus: Salary Research Prompt Pack (7 prompts)", value: 27 },
  { item: 'Bonus: "Tell Me About Yourself" Guide', value: 27 },
];

const faqItems = [
  {
    question: "Which AI tools does this work with?",
    answer:
      "The Career Prompt Vault works with any AI assistant: Claude, ChatGPT, Gemini, Perplexity, Copilot, or whatever you prefer. Every prompt produces great results on any platform.",
  },
  {
    question: "What if I don't have a resume yet?",
    answer:
      "Start with the Career Highlights Matrix prompt. It helps you pull out your key achievements even if you've never written a formal resume. From there, the toolkit can help you build one from scratch.",
  },
  {
    question: "How is this different from just asking AI for career help?",
    answer:
      "AI gives you generic advice. The Career Prompt Vault gives you the exact frameworks from 300+ coaching engagements, structured prompts that produce specific outputs you can use immediately. It's the difference between asking a stranger for help vs. working with a career strategist who has a proven playbook.",
  },
  {
    question: "How long does setup take?",
    answer:
      "About 5 minutes. We include a step-by-step guide for the recommended Claude Projects setup, but you can also just copy-paste prompts directly into ChatGPT, Gemini, or any other AI tool and start getting results immediately.",
  },
  {
    question: "What exactly do I get?",
    answer:
      "50 career frameworks organized into 6 category files, a custom system prompt that turns any AI tool into your career strategist, a setup guide, a quick-start guide with your first 4 wins in 30 minutes, and 3 bonus resources. Lifetime access, no recurring fees.",
  },
  {
    question: "Is this the same material from the $2,497 coaching program?",
    answer:
      "These are the same prompt frameworks used in the Job Search Ignition System. The coaching program adds 1:1 strategy sessions, done-for-you resume and LinkedIn rewrites, weekly accountability calls, and personalized feedback. The Vault gives you the self-serve toolkit.",
  },
];

/* ── Sidebar included items ── */
const sidebarItems = [
  "50 AI career frameworks",
  "6 organized categories",
  "Custom AI system prompt",
  "Setup guide + quick-start guide",
  "3 bonus prompt packs",
  "Lifetime access",
];

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function VaultPage() {
  const totalValue = valueStack.reduce((sum, v) => sum + v.value, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-lg font-bold text-navy">
            Clear<span className="text-blue">Career</span>
          </span>
          <a
            href="#checkout"
            className="rounded-lg bg-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-dark"
          >
            Get It Now - $9
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TWO-COLUMN LAYOUT
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10 xl:gap-14">
          {/* ── LEFT COLUMN (scrollable sales content) ── */}
          <div>
            {/* HERO */}
            <section className="pb-10 pt-10 md:pt-16">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue-bg px-4 py-1.5 text-sm font-medium text-navy">
                <span className="flex text-warning">★★★★★</span>
                <span>200+ professionals coached</span>
              </div>

              <h1 className="font-display text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.1] text-navy">
                {PRODUCT_NAME}
              </h1>

              <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
                Turn your AI assistant into your personal career strategist. 50
                battle-tested prompts from the same frameworks behind $1.2M+ in
                collective client raises. Works with Claude, ChatGPT, Gemini,
                Perplexity, or your favourite AI tool.
              </p>

              <p className="mt-6 text-sm text-text-muted">
                <span className="font-semibold text-navy">$9</span>{" "}
                <span className="ml-1 text-text-muted line-through">$47</span>{" "}
                <span className="mx-2 text-border">|</span> Lifetime access{" "}
                <span className="mx-2 text-border">|</span> 48-hour money-back
                guarantee
              </p>
            </section>

            {/* ── Mobile checkout (shows on small screens only) ── */}
            <div className="mb-10 lg:hidden" id="checkout">
              <div className="rounded-2xl border border-border bg-white p-5 shadow-xl">
                <SidebarContent totalValue={totalValue} />
                <div className="mt-5">
                  <NovaCheckout />
                </div>
              </div>
            </div>

            {/* PROBLEM */}
            <section className="pb-12">
              <h2 className="font-display text-[clamp(1.25rem,3vw,1.75rem)] text-navy">
                Why does job searching feel so heavy?
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-text-muted">
                <p>
                  You send 200 applications with the same resume. You rewrite
                  your LinkedIn headline for the third time, wondering if
                  it&apos;s any better. You walk into interviews without a plan
                  and hope the right words come out.
                </p>
                <p>
                  The problem isn&apos;t effort. The problem is you don&apos;t
                  have a system. You&apos;re guessing at what works instead of
                  following frameworks proven across hundreds of job searches.
                </p>
                <p className="font-medium text-navy">
                  {PRODUCT_NAME} gives you 50 of those frameworks. Drop them
                  into any AI tool, feed in your resume, and start generating
                  real career assets you can use today.
                </p>
              </div>
            </section>

            {/* WHAT YOU GET (with before/after samples) */}
            <section className="pb-12">
              <h2 className="font-display text-[clamp(1.25rem,3vw,1.75rem)] text-navy">
                50 prompts. 6 categories. Before &amp; after.
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Each prompt is a proven framework from 300+ coaching
                engagements. Here&apos;s what they turn generic AI output into:
              </p>

              <div className="mt-8 space-y-5">
                {categories.map((cat) => (
                  <div
                    key={cat.title}
                    className="rounded-xl border border-border bg-white p-5 shadow-card"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-navy">{cat.title}</h3>
                      <span className="rounded-full bg-blue-bg px-3 py-0.5 text-xs font-semibold text-blue">
                        {cat.count} frameworks
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-red-50 p-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-400">
                          Without the Vault
                        </p>
                        <p className="text-sm italic text-text-muted">
                          &ldquo;{cat.before}&rdquo;
                        </p>
                      </div>
                      <div className="rounded-lg bg-green-50 p-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-600">
                          With the Vault
                        </p>
                        <p className="text-sm italic text-navy">
                          &ldquo;{cat.after}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* VALUE STACK */}
            <section className="pb-12">
              <h2 className="font-display text-[clamp(1.25rem,3vw,1.75rem)] text-navy">
                Everything you get
              </h2>

              <div className="mt-6 rounded-xl border border-border bg-white p-6 shadow-card">
                <div className="space-y-3">
                  {valueStack.map((v) => (
                    <div
                      key={v.item}
                      className="flex items-center justify-between border-b border-dashed border-border pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <CheckIcon className="h-4 w-4 shrink-0 text-success" />
                        <span className="text-sm text-navy">{v.item}</span>
                      </div>
                      <span className="text-sm text-text-muted line-through">
                        ${v.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t-2 border-navy pt-4">
                  <span className="font-bold text-navy">Total Value:</span>
                  <span className="text-lg font-bold text-text-muted line-through">
                    ${totalValue}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-navy">Your Price:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue">$9</span>
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-bold text-success">
                      Save {Math.round((1 - 9 / totalValue) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="pb-12">
              <h2 className="font-display text-[clamp(1.25rem,3vw,1.75rem)] text-navy">
                These frameworks have helped 200+ professionals
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {testimonials.map((t, i) => (
                  <TestimonialCard
                    key={t.name}
                    name={t.name}
                    role={t.role}
                    quote={t.quote}
                    outcome={t.outcome}
                    index={i}
                  />
                ))}
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="pb-12">
              <h2 className="font-display text-[clamp(1.25rem,3vw,1.75rem)] text-navy">
                Up and running in 5 minutes
              </h2>
              <div className="mt-6 space-y-5">
                {[
                  {
                    step: "1",
                    title: "Get instant access",
                    desc: "Complete checkout and immediately access your vault: 6 prompt files, setup guide, quick-start guide, and bonuses.",
                  },
                  {
                    step: "2",
                    title: "Load into your favourite AI tool",
                    desc: "Follow the setup guide for Claude Projects, or copy-paste prompts into ChatGPT, Gemini, Perplexity. Works with any AI tool.",
                  },
                  {
                    step: "3",
                    title: "Add your resume and go",
                    desc: "Feed in your resume and start generating career assets. Professional summary, LinkedIn headlines, interview answers, salary data.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-sm font-bold text-white">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">{item.title}</h3>
                      <p className="mt-1 text-sm text-text-muted">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* GUARANTEE */}
            <section className="pb-12">
              <div className="rounded-xl border-2 border-success/30 bg-success/5 p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                  <svg
                    className="h-7 w-7 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-navy">
                  48-Hour Money-Back Guarantee
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-muted">
                  If {PRODUCT_NAME} doesn&apos;t help you, email us within 48
                  hours. Full refund, no questions asked. You keep everything.
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section className="pb-12">
              <h2 className="font-display text-[clamp(1.25rem,3vw,1.75rem)] text-navy">
                Common questions
              </h2>
              <div className="mt-6">
                <FAQAccordion items={faqItems} />
              </div>
            </section>

            {/* CREATOR BIO */}
            <section className="pb-16">
              <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-white p-6 shadow-card sm:flex-row sm:text-left">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue text-xl font-bold text-white">
                  IP
                </div>
                <div>
                  <h3 className="font-bold text-navy">
                    Built by Izzy Piyale-Sheard
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    Founder of ClearCareer. 200+ professionals coached. $1.2M+
                    in collective raises. Featured in CBC Radio, Global News,
                    Newsweek, and Inc. Magazine. These are the same frameworks he
                    uses with clients who pay $2,497 for the full Job Search
                    Ignition System.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN (sticky sidebar with checkout) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-[72px] pt-10 md:pt-16" id="checkout">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-xl">
                <SidebarContent totalValue={totalValue} />
                <div className="mt-5">
                  <NovaCheckout />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 p-3 backdrop-blur-sm lg:hidden">
        <a
          href="#checkout"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue py-3 text-base font-bold text-white shadow-lg"
        >
          Get {PRODUCT_NAME} - $9
        </a>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-white py-8 pb-20 lg:pb-8">
        <div className="mx-auto max-w-[1200px] px-4 text-center text-sm text-text-muted sm:px-6">
          <p>
            &copy; {new Date().getFullYear()} ClearCareer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ── Sidebar content (reused in desktop sidebar + mobile inline) ── */
function SidebarContent({ totalValue }: { totalValue: number }) {
  return (
    <>
      {/* Social proof */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-warning">★★★★★</span>
        <span className="text-text-muted">200+ professionals coached</span>
      </div>

      <h3 className="font-display text-xl text-navy">{PRODUCT_NAME}</h3>

      {/* Price */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-navy">$9</span>
        <span className="text-lg text-text-muted line-through">${totalValue}</span>
        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-bold text-success">
          Save {Math.round((1 - 9 / totalValue) * 100)}%
        </span>
      </div>

      <p className="mt-1 text-xs text-text-muted">
        One-time payment. Lifetime access. No recurring fees.
      </p>

      {/* What's included */}
      <div className="mt-5 space-y-2">
        {sidebarItems.map((item) => (
          <div key={item} className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span className="text-sm text-navy">{item}</span>
          </div>
        ))}
      </div>

      {/* Guarantee badge */}
      <div className="mt-5 flex items-center gap-2 rounded-lg bg-success/5 p-3">
        <svg
          className="h-5 w-5 shrink-0 text-success"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <span className="text-xs font-medium text-success">
          48-hour money-back guarantee. Keep everything.
        </span>
      </div>

      {/* Divider before checkout form */}
      <div className="mt-5 border-t border-border pt-5">
        <p className="mb-3 text-center text-sm font-semibold text-navy">
          Secure Checkout
        </p>
      </div>
    </>
  );
}
