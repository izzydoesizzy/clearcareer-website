import { generatePageMetadata } from "@components/SEOHead";
import Hero from "@components/Hero";
import CTASection from "@components/CTASection";
import { getAllPosts } from "@lib/blog";
import Link from "next/link";

export const metadata = generatePageMetadata({
  title: "Playbooks | ClearCareer Step-by-Step Guides",
  description: "21 detailed, step-by-step playbooks for every stage of your job search. Resume writing, LinkedIn optimization, interview prep, salary negotiation, and more.",
  url: "/playbooks",
});

const sections = [
  { label: "Resume & LinkedIn", description: "Build a resume that sells and a LinkedIn profile that gets found.", category: "resume-linkedin" },
  { label: "Job Search & Networking", description: "Systems for finding opportunities and building real connections.", category: "job-search-strategy" },
  { label: "Interview Prep", description: "Frameworks to prepare, perform, and follow up with confidence.", category: "interviews" },
  { label: "Salary & Negotiation", description: "Never leave money on the table.", category: "salary-negotiation" },
  { label: "Tools & Mindset", description: "AI tools, burnout recovery, and the mental game of job searching.", category: "ai-tools-mindset" },
];

export default function PlaybooksPage() {
  const allPosts = getAllPosts();
  const playbooks = allPosts
    .filter((p) => p.frontmatter.type === "playbook")
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));

  return (
    <>
      <Hero
        variant="page"
        eyebrow="Playbooks"
        headline="Step-by-Step Guides for Every Stage of Your Search"
        subheadline="21 detailed playbooks built from 200+ coaching sessions. Real frameworks, real examples, real results."
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          {sections.map((section) => {
            const sectionPlaybooks = playbooks.filter(
              (p) => p.frontmatter.category === section.category
            );
            if (sectionPlaybooks.length === 0) return null;
            return (
              <div key={section.category} className="mb-14 last:mb-0">
                <div className="mb-6">
                  <h2 className="font-display text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.15] text-navy">
                    {section.label}
                  </h2>
                  <p className="mt-1 text-text-muted">{section.description}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {sectionPlaybooks.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col rounded-xl border border-border bg-white p-5 transition-all hover:border-blue/30 hover:shadow-[0_4px_24px_-4px_rgba(1,97,239,0.12)]"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue px-2.5 py-0.5 text-[0.6875rem] font-semibold text-white">
                          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Playbook
                        </span>
                        {post.frontmatter.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded-full bg-blue-bg px-2.5 py-0.5 text-[0.6875rem] font-medium text-blue">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="line-clamp-2 text-base font-semibold text-navy transition-colors group-hover:text-blue">
                        {post.frontmatter.title}
                      </h3>
                      <p className="mt-2 flex-1 line-clamp-2 text-sm leading-relaxed text-text-muted">
                        {post.frontmatter.description}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue opacity-0 transition-opacity group-hover:opacity-100">
                        Read playbook
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CTASection
        heading="Ready to Put These Playbooks Into Action?"
        primaryCTA={{ text: "Book a Free Audit", href: "https://calendly.com/clearcareer/discovery-call" }}
        variant="gradient"
      />
    </>
  );
}
