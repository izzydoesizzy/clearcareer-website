import Link from "next/link";
import { generatePageMetadata } from "@components/SEOHead";
import Hero from "@components/Hero";
import StatsBar from "@components/StatsBar";
import CTASection from "@components/CTASection";
import TestimonialFilter from "@components/TestimonialFilter";
import BeforeAfterCarousel from "@components/BeforeAfterCarousel";
import YouTubeFacade from "@components/YouTubeFacade";
import type { Metadata } from "next";

import testimonials from "@data/testimonials.json";

export const metadata: Metadata = generatePageMetadata({
  title: "Testimonials | ClearCareer Client Results",
  description:
    "80+ testimonials from ClearCareer clients. Real professionals, real results: salary increases, faster job placements, and career transformations.",
});

export default function TestimonialsPage() {
  // Sort by sortPriority (lowest first), entries without it go to end
  const sorted = [...testimonials].sort((a: any, b: any) => {
    const pa = a.sortPriority ?? Infinity;
    const pb = b.sortPriority ?? Infinity;
    return pa - pb;
  });

  // Category counts
  const categoryCounts = sorted.reduce(
    (acc: Record<string, number>, t: any) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    },
    {},
  );

  const categories = [
    { label: "All", value: "all", count: sorted.length },
    {
      label: "Career Outcomes",
      value: "career-outcome",
      count: categoryCounts["career-outcome"] || 0,
    },
    {
      label: "Coaching Quality",
      value: "coaching-quality",
      count: categoryCounts["coaching-quality"] || 0,
    },
    {
      label: "Workshop Feedback",
      value: "workshop",
      count: categoryCounts["workshop"] || 0,
    },
    {
      label: "LinkedIn Reviews",
      value: "linkedin-review",
      count: categoryCounts["linkedin-review"] || 0,
    },
    {
      label: "Peer Endorsements",
      value: "peer-endorsement",
      count: categoryCounts["peer-endorsement"] || 0,
    },
  ];

  const youtubeVideoId = "xyDUx1ji3io";

  const beforeAfterPairs = [
    {
      name: "Henrique",
      before: "/images/before-after/henrique-before.jpg",
      after: "/images/before-after/henrique-after.jpg",
    },
    {
      name: "Julia",
      before: "/images/before-after/julia-before.png",
      after: "/images/before-after/julia-after.png",
    },
    {
      name: "Eblen",
      before: "/images/before-after/eblen-before.png",
      after: "/images/before-after/eblen-after.png",
    },
    {
      name: "Nathaniel",
      before: "/images/before-after/nathaniel-before.png",
      after: "/images/before-after/nathaniel-after.jpg",
    },
    {
      name: "Rubina",
      before: "/images/before-after/rubina-before.jpg",
      after: "/images/before-after/rubina-after.png",
    },
  ];

  return (
    <>
      {/* Hero */}
      <Hero
        variant="page"
        eyebrow="Client Results"
        headline={`Real People. Real <span class='bg-gradient-to-r from-blue to-blue-light bg-clip-text text-transparent'>Numbers.</span>`}
        subheadline="80 professionals coached. $1.2M+ in collective raises. See what changed for them."
      />

      {/* Stats Bar */}
      <StatsBar />

      {/* YouTube Video */}
      <section className="bg-blue-bg/30 py-16 md:py-20">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate="fade-up">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue">
              Watch
            </p>
            <h2 className="mb-8 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              Hear It Directly From Clients
            </h2>
          </div>
          <YouTubeFacade
            videoId={youtubeVideoId}
            title="ClearCareer client video testimonials"
          />
        </div>
      </section>

      {/* Outcomes Teaser */}
      <section className="py-8">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-col items-center gap-6 rounded-2xl bg-gradient-to-r from-blue-bg to-white p-6 text-center sm:flex-row sm:text-left"
            data-animate="fade-up"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue">
                By the Numbers
              </p>
              <p className="mt-1 text-xl font-bold text-navy">
                46% of clients land within 1 month. 98% satisfaction.
              </p>
              <p className="mt-2 text-text-muted">
                Backed by survey data from 58 program members, collected
                2020-2025.
              </p>
            </div>
            <Link
              href="/outcomes"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-dark hover:shadow-lg hover:shadow-blue/25"
            >
              See the Full Report
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate="fade-up">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue">
              Transformations
            </p>
            <h2 className="mb-8 font-display text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.15] text-navy">
              Before and After: LinkedIn Profiles Transformed
            </h2>
          </div>
          <BeforeAfterCarousel pairs={beforeAfterPairs} />
        </div>
      </section>

      {/* Testimonial Filter + Grid */}
      <TestimonialFilter testimonials={sorted} categories={categories} />

      {/* CTA */}
      <CTASection
        heading={`Ready to Write Your Own <span class='bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'>Success Story?</span>`}
        primaryCTA={{
          text: "Book a Free Audit",
          href: "https://calendly.com/clearcareer/discovery-call",
        }}
        variant="gradient"
      />
    </>
  );
}
