"use client";

import { useState } from "react";

interface Pair {
  name: string;
  before: string;
  after: string;
}

interface BeforeAfterCarouselProps {
  pairs: Pair[];
}

export default function BeforeAfterCarousel({
  pairs,
}: BeforeAfterCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = pairs.length;

  const goTo = (index: number) => {
    setCurrent(Math.max(0, Math.min(index, total - 1)));
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {pairs.map((pair) => (
          <div key={pair.name} className="w-full shrink-0 px-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Before
                </p>
                <img
                  src={pair.before}
                  alt={`${pair.name} LinkedIn before`}
                  className="w-full rounded-lg shadow-md"
                  loading="lazy"
                  width={820}
                  height={540}
                />
              </div>
              <div>
                <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-success">
                  After
                </p>
                <img
                  src={pair.after}
                  alt={`${pair.name} LinkedIn after`}
                  className="w-full rounded-lg shadow-md"
                  loading="lazy"
                  width={820}
                  height={540}
                />
              </div>
            </div>
            <p className="mt-3 text-center text-sm font-medium text-text-muted">
              {pair.name}&apos;s transformation
            </p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => goTo(current - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text-muted shadow-sm transition-all hover:border-blue hover:text-blue hover:shadow-md disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-muted disabled:hover:shadow-sm"
          aria-label="Previous"
          disabled={current === 0}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex gap-2">
          {pairs.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === current ? "bg-blue" : "bg-border"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => goTo(current + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text-muted shadow-sm transition-all hover:border-blue hover:text-blue hover:shadow-md disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-muted disabled:hover:shadow-sm"
          aria-label="Next"
          disabled={current === total - 1}
        >
          <svg
            className="h-5 w-5"
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
        </button>
      </div>
    </div>
  );
}
