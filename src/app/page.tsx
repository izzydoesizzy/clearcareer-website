import { generatePageMetadata } from "@components/SEOHead";
import Hero from "@components/Hero";
import StatsBar from "@components/StatsBar";
import TrustBar from "@components/TrustBar";
import DeliverableGrid from "@components/DeliverableGrid";
import IndustryStatCard from "@components/IndustryStatCard";
import SourceCitations from "@components/SourceCitations";
import PricingCard from "@components/PricingCard";
import CTASection from "@components/CTASection";
import HomepageTestimonials from "@components/HomepageTestimonials";
import { getAllPosts } from "@lib/blog";
import deliverableData from "@data/deliverables.json";
import allTestimonials from "@data/testimonials.json";
import Link from "next/link";

export const metadata = generatePageMetadata({
  title: "ClearCareer | Career Coaching That Gets Results",
  description:
    "200+ professionals coached. $1.2M+ in collective raises. 8-week done-with-you job search accelerator with 20+ career assets. Book a free strategy call.",
  url: "/",
});

export default function HomePage() {
  // Get top career testimonials with taglines
  const careerTestimonials = [...allTestimonials]
    .filter((t: any) => t.category === "career-outcome" && t.tagline)
    .sort((a: any, b: any) => (a.sortPriority ?? Infinity) - (b.sortPriority ?? Infinity))
    .slice(0, 9);

  // Get latest blog posts
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* 1. Hero */}
      <Hero
        variant="split"
        photoSrc="/images/izzy-profile.webp"
        photoAlt="Izzy Piyale-Sheard, career coach"
        eyebrow="Career Coaching That Actually Works"
        headline="Stop Grinding Alone. Start Getting <span class='bg-gradient-to-r from-blue to-blue-light bg-clip-text text-transparent'>Results.</span>"
        subheadline="200+ professionals coached. $1.2M+ in collective raises. An 8-week system that turns stuck job seekers into confident candidates with 20+ done-for-you assets."
        primaryCTA={{ text: "Book a Free Strategy Call", href: "https://calendly.com/clearcareer/discovery-call" }}
        secondaryCTA={{ text: "See the Program", href: "/programs/jsis" }}
        trustText="Free 20-minute call · No commitment · No pressure"
      />

      {/* 2. Stats Bar */}
      <StatsBar />

      {/* 3. Trust Bar */}
      <TrustBar />

      {/* 4. Problem Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate="fade-up">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">The Problem</p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              You&apos;ve Done Everything Right. So Why Isn&apos;t It Working?
            </h2>
          </div>

          <div className="mx-auto mt-6 max-w-[720px] text-center">
            <p className="text-lg leading-relaxed text-text-muted">
              You&apos;ve tailored every resume. Optimized your LinkedIn. Applied to hundreds of roles. And still: silence. You&apos;re not alone. The average job search now takes over 5 months, and only ~8.5% of applications get callbacks. The system is broken. You need a different approach, built by someone who&apos;s helped 200+ professionals break through the same wall you&apos;re hitting right now.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3" data-animate-stagger>
            <div className="rounded-xl bg-blue-bg p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue/10">
                <svg className="h-6 w-6 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy">5.5 Months on Average</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                The average job search takes 5.5 months (BLS, 2025). For senior roles, it stretches to 6-9 months (LinkedIn, 2024). Every month at $100K+ costs ~$8,300 in lost income.
              </p>
            </div>

            <div className="rounded-xl bg-blue-bg p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue/10">
                <svg className="h-6 w-6 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy">100-200+ Applications</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                The typical job seeker sends 100-200+ applications before landing. Only ~8.5% get callbacks (Indeed, 2024). Up to 40% of listings may be ghost jobs that were never real (Resume Builder, 2024).
              </p>
            </div>

            <div className="rounded-xl bg-blue-bg p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue/10">
                <svg className="h-6 w-6 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy">85% Through Networking</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Up to 85% of jobs are filled through networking (LinkedIn, 2024). Referral candidates are hired at 10x the rate of applicants (Jobvite, 2024). Yet most job seekers spend their time applying, not connecting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4b. Industry Data Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-bg/50 py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate="fade-up">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">The Data</p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              The Numbers Behind the Struggle
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
              These aren&apos;t our numbers. This is what the research says about job searching in 2025.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" data-animate-stagger>
            <IndustryStatCard number="5.5 months" label="Average job search" detail="1 in 5 are unemployed for 27+ weeks" source="BLS, 2025" color="warning" />
            <IndustryStatCard number="~8.5%" label="Application callback rate" detail="Most resumes never reach a human" source="Indeed, 2024" color="warning" />
            <IndustryStatCard number="85%" label="Jobs filled through networking" detail="Referrals are hired at 10x the rate" source="LinkedIn + Jobvite, 2024" color="blue" />
            <IndustryStatCard number="$750K+" label="Cost of not negotiating" detail="55% of workers never negotiate salary" source="HBR + Pew Research" color="warning" />
          </div>

          <SourceCitations
            variant="section"
            sources={[
              { source: "U.S. Bureau of Labor Statistics", year: 2025, url: "https://www.bls.gov/news.release/empsit.nr0.htm" },
              { source: "Indeed Hiring Lab", year: 2024, url: "https://www.hiringlab.org/" },
              { source: "LinkedIn Economic Graph", year: 2024, url: "https://economicgraph.linkedin.com/" },
              { source: "Jobvite Recruiter Nation Report", year: 2024, url: "https://www.jobvite.com/lp/recruiter-nation/" },
              { source: "Pew Research Center", year: 2023, url: "https://www.pewresearch.org/social-trends/2023/03/30/" },
              { source: "Harvard Business Review", year: 2023, url: "https://hbr.org/2014/06/why-women-dont-negotiate-their-job-offers" },
            ]}
          />
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-bg/50 py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate="fade-up">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">How It Works</p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              From Stuck to Hired in 4 Steps
            </h2>
          </div>

          <div className="relative mt-12">
            <div className="absolute left-0 right-0 top-5 hidden h-0.5 border-t-2 border-dashed border-blue/20 md:block" style={{ marginLeft: "calc(12.5% + 20px)", marginRight: "calc(12.5% + 20px)" }}></div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6" data-animate-stagger>
              {[
                { step: 1, title: "Book a Free Audit", desc: "20-minute call with Izzy. We'll diagnose what's broken in your current approach." },
                { step: 2, title: "Get Your Custom Plan", desc: "AI-powered intake interview builds your personalized job search toolkit." },
                { step: 3, title: "Build With Your Cohort", desc: "8 weeks of group calls, WhatsApp support, and 1:1 sessions with Izzy." },
                { step: 4, title: "Land Your Next Role", desc: "Walk away with 20+ done-for-you assets and a strategy that works." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="relative text-center">
                  <div className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue text-sm font-bold text-white">
                    {step}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Deliverables Preview */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate="fade-up">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">What&apos;s Included</p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              20+ Assets Built For You, Not Assigned as Homework
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
              Every asset below is built with you, not assigned as homework. That&apos;s what sets ClearCareer apart.
            </p>
          </div>

          <div className="mt-12">
            <DeliverableGrid pillars={deliverableData.pillars} />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/programs/jsis"
              className="inline-flex items-center justify-center rounded-lg bg-blue px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-dark"
            >
              See the Full Program
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Featured Testimonials */}
      <section className="bg-blue-bg/30 py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate="fade-up">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">Client Results</p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              Real People, Real Results
            </h2>
          </div>

          <div className="mt-12">
            <HomepageTestimonials testimonials={careerTestimonials} />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 text-base font-semibold text-blue transition-colors hover:text-blue-dark"
            >
              Read all 80+ testimonials
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Latest from the Blog */}
      {latestPosts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
            <div className="text-center" data-animate="fade-up">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">From the Blog</p>
              <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
                Career Strategies That Work
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="aspect-video bg-blue-bg" />
                  <div className="p-6">
                    {post.frontmatter.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {post.frontmatter.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded-full bg-blue-bg px-3 py-1 text-xs font-medium text-blue">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="line-clamp-2 text-lg font-semibold text-navy transition-colors group-hover:text-blue">
                      {post.frontmatter.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                      {post.frontmatter.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-base font-semibold text-blue transition-colors hover:text-blue-dark"
              >
                Read all articles
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 9. Programs Overview */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-bg/50 py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate="fade-up">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">Programs</p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              Choose Your Path
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-[800px] grid-cols-1 gap-8 md:grid-cols-2">
            <PricingCard
              tier="Job Search Ignition System"
              price="$2,497"
              features={[
                "20+ done-for-you assets",
                "3 private 1:1 sessions with Izzy",
                "8 weeks of group accountability",
                "AI-powered career toolkit",
                "LinkedIn Content System",
                "WhatsApp async support",
              ]}
              ctaText="Learn More"
              ctaHref="/programs/jsis"
              featured={true}
              paymentPlan="Or 3 payments of $833/mo"
            />
            <PricingCard
              tier="ClearCareer Community"
              price="$49/mo"
              features={[
                "Weekly group coaching calls",
                "Job search templates & tools",
                "Private community access",
                "Monthly workshops",
                "Resource library",
              ]}
              ctaText="Join the Community"
              ctaHref="/programs/community"
              paymentPlan="Or $249 lifetime"
            />
          </div>
        </div>
      </section>

      {/* 10. Final CTA */}
      <CTASection
        heading="Ready to Stop Grinding <span class='bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'>Alone?</span>"
        body="Book a free 20-minute Job Search Audit. We'll diagnose what's broken and show you exactly what we'd build together."
        primaryCTA={{ text: "Book My Free Audit", href: "https://calendly.com/clearcareer/discovery-call" }}
        secondaryCTA={{ text: "See the Program", href: "/programs/jsis" }}
        variant="gradient"
      />
    </>
  );
}
