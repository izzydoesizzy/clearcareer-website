"use client";

import { useState } from "react";
import TestimonialCard from "./TestimonialCard";
import TestimonialModal from "./TestimonialModal";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  pullQuote?: string;
  tagline?: string;
  outcome?: string;
  imagePath?: string;
  category: string;
  sortPriority?: number;
}

interface Category {
  label: string;
  value: string;
  count: number;
}

interface TestimonialFilterProps {
  testimonials: Testimonial[];
  categories: Category[];
}

export default function TestimonialFilter({
  testimonials,
  categories,
}: TestimonialFilterProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalData, setModalData] = useState<Testimonial | null>(null);

  const filtered =
    activeCategory === "all"
      ? testimonials
      : testimonials.filter((t) => t.category === activeCategory);

  return (
    <>
      {/* Sticky Filter Bar */}
      <div
        className="sticky top-0 z-30 border-b border-border bg-white/95 py-4 backdrop-blur-sm"
        id="filter-bar"
      >
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all sm:px-4 sm:py-2 ${
                  activeCategory === cat.value
                    ? "border-blue bg-blue text-white shadow-sm"
                    : "border-border bg-white text-text hover:border-blue/30 hover:bg-blue-bg/50"
                }`}
              >
                {cat.label}
                <span
                  className={`ml-1 text-xs ${
                    activeCategory === cat.value
                      ? "text-blue-100"
                      : "text-text-muted"
                  }`}
                >
                  ({cat.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
            {filtered.map((t, i) => (
              <div key={`${t.name}-${i}`} className="testimonial-item">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    t.quote.length > 150 ? setModalData(t) : null
                  }
                >
                  <TestimonialCard
                    name={t.name}
                    role={t.role}
                    quote={t.quote}
                    pullQuote={
                      t.pullQuote || t.tagline || t.quote.slice(0, 150)
                    }
                    outcome={t.outcome}
                    image={t.imagePath}
                    index={i}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalData && (
        <TestimonialModal
          testimonial={{
            name: modalData.name,
            role: modalData.role,
            quote: modalData.quote,
            outcome: modalData.outcome,
            image: modalData.imagePath,
          }}
          onClose={() => setModalData(null)}
        />
      )}
    </>
  );
}
