import { generatePageMetadata } from "@components/SEOHead";
import Hero from "@components/Hero";
import CTASection from "@components/CTASection";

export const metadata = generatePageMetadata({
  title: "Free Career Resources | ClearCareer",
  description: "Free job search guides, templates, and tools. Resume writing tips, interview prep, networking strategies, and salary negotiation frameworks.",
  url: "/resources",
});

const resourceCategories = [
  { icon: "📄", title: "Resume & LinkedIn", description: "Professional resume templates, LinkedIn optimization guides, and headline formulas." },
  { icon: "🎤", title: "Interview Preparation", description: "STAR method guides, common question banks, and follow-up email templates." },
  { icon: "🤝", title: "Networking & Outreach", description: "Cold email templates, LinkedIn connection scripts, and networking strategies." },
  { icon: "💰", title: "Salary Negotiation", description: "Negotiation frameworks, counteroffer scripts, and research tools." },
  { icon: "🎯", title: "Job Search Strategy", description: "Target company research, job board optimization, and tracking templates." },
  { icon: "🤖", title: "AI for Job Seekers", description: "Prompt libraries, tool guides, and AI-powered search strategies." },
];

export default function ResourcesPage() {
  return (
    <>
      <Hero
        variant="page"
        eyebrow="Free Resources"
        headline="Free Guides, Templates, and Tools"
        subheadline="Everything you need to level up your job search. No sign-up required."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resourceCategories.map((resource) => (
              <div key={resource.title} className="rounded-xl border border-border bg-white p-8">
                <div className="mb-4 text-3xl">{resource.icon}</div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-navy">{resource.title}</h3>
                  <span className="flex-shrink-0 rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                    Coming Soon
                  </span>
                </div>
                <p className="mt-3 text-[1.0625rem] leading-[1.75] text-text-muted">
                  {resource.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-blue-bg p-8 text-center md:p-12">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              Get career tips delivered weekly
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
              Actionable strategies. Real examples. No fluff.
            </p>
            <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-text placeholder:text-text-muted focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-dark"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      <CTASection
        heading="Want Personalized Guidance?"
        body="Free resources are great, but nothing beats working with a coach who knows your situation."
        primaryCTA={{ text: "Book a Free Audit", href: "https://calendly.com/clearcareer/discovery-call" }}
        variant="blue"
      />
    </>
  );
}
