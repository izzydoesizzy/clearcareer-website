"use client";

import { useState } from "react";
import TestimonialOutcomeCard from "./TestimonialOutcomeCard";
import TestimonialCard from "./TestimonialCard";
import TestimonialCarousel from "./TestimonialCarousel";
import TestimonialModal from "./TestimonialModal";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  pullQuote?: string;
  tagline?: string;
  outcome?: string;
  imagePath?: string;
}

interface JSISTestimonialsProps {
  testimonialGrid: Testimonial[];
  achievementCards: Testimonial[];
  fenceSitterCards: Testimonial[];
}

export default function JSISTestimonials({
  testimonialGrid,
  achievementCards,
  fenceSitterCards,
}: JSISTestimonialsProps) {
  const [modalData, setModalData] = useState<{
    quote: string;
    name: string;
    role: string;
    outcome?: string;
    image?: string;
  } | null>(null);

  return (
    <>
      {/* Section 8: Testimonials Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              Client Results
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              More Success Stories
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonialGrid.map((t, i) => (
              <TestimonialOutcomeCard
                key={t.name}
                name={t.name}
                role={t.role}
                quote={t.quote}
                tagline={t.tagline || t.outcome || t.pullQuote?.slice(0, 60) || ""}
                outcome={t.outcome}
                image={t.imagePath}
                index={i}
                showReadMore={t.quote.length > 150}
                onReadMore={() =>
                  setModalData({
                    quote: t.quote,
                    name: t.name,
                    role: t.role,
                    outcome: t.outcome,
                    image: t.imagePath,
                  })
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Achievement Cards */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              Client Results
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              What Past Clients Have Achieved
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievementCards.map((t, i) => (
              <TestimonialOutcomeCard
                key={t.name}
                name={t.name}
                role={t.role}
                quote={t.quote}
                tagline={t.tagline || t.outcome || ""}
                outcome={t.outcome}
                image={t.imagePath}
                index={testimonialGrid.length + i}
                showReadMore={t.quote.length > 150}
                onReadMore={() =>
                  setModalData({
                    quote: t.quote,
                    name: t.name,
                    role: t.role,
                    outcome: t.outcome,
                    image: t.imagePath,
                  })
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 14: Fence-Sitter Testimonials */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue">
              Hear From the Fence-Sitters
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-navy">
              Take the Leap
            </h2>
          </div>
          <div className="mt-12">
            <TestimonialCarousel
              visibleCount={1}
              autoPlay={true}
              autoPlayInterval={6000}
            >
              {fenceSitterCards.map((t) => (
                <TestimonialCard
                  key={t.name}
                  name={t.name}
                  role={t.role}
                  quote={t.quote}
                  pullQuote={t.pullQuote || t.quote.slice(0, 150)}
                  outcome={t.outcome}
                  image={t.imagePath}
                  index={0}
                />
              ))}
            </TestimonialCarousel>
          </div>
        </div>
      </section>

      {/* Modal */}
      <TestimonialModal
        testimonial={modalData}
        onClose={() => setModalData(null)}
      />
    </>
  );
}
