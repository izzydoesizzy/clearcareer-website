"use client";

import { useState } from "react";
import TestimonialCarousel from "@components/TestimonialCarousel";
import TestimonialOutcomeCard from "@components/TestimonialOutcomeCard";
import TestimonialModal from "@components/TestimonialModal";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  tagline?: string;
  outcome?: string;
  imagePath?: string;
}

interface HomepageTestimonialsProps {
  testimonials: Testimonial[];
}

export default function HomepageTestimonials({ testimonials }: HomepageTestimonialsProps) {
  const [modalTestimonial, setModalTestimonial] = useState<{
    quote: string;
    name: string;
    role: string;
    outcome?: string;
    image?: string;
  } | null>(null);

  return (
    <>
      <TestimonialCarousel visibleCount={3}>
        {testimonials.map((t, i) => (
          <TestimonialOutcomeCard
            key={i}
            name={t.name}
            role={t.role}
            quote={t.quote}
            tagline={t.tagline}
            outcome={t.outcome}
            image={t.imagePath}
            index={i}
            showReadMore={t.quote.length > 150}
            onReadMore={() =>
              setModalTestimonial({
                quote: t.quote,
                name: t.name,
                role: t.role,
                outcome: t.outcome,
                image: t.imagePath,
              })
            }
          />
        ))}
      </TestimonialCarousel>

      <TestimonialModal
        testimonial={modalTestimonial}
        onClose={() => setModalTestimonial(null)}
      />
    </>
  );
}
