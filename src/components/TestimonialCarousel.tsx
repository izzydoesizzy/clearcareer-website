"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";

interface TestimonialCarouselProps {
  children: ReactNode[];
  visibleCount?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function TestimonialCarousel({
  children,
  visibleCount: maxVisible = 3,
  autoPlay = false,
  autoPlayInterval = 5000,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(maxVisible);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPaused = useRef(false);

  const totalSlides = children.length;
  const maxIndex = Math.max(0, totalSlides - visibleCount);

  const getVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return maxVisible;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 1024) return Math.min(2, maxVisible);
    return maxVisible;
  }, [maxVisible]);

  useEffect(() => {
    function handleResize() {
      const newCount = getVisibleCount();
      setVisibleCount(newCount);
      setCurrentIndex((prev) => Math.min(prev, Math.max(0, totalSlides - newCount)));
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getVisibleCount, totalSlides]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay) return;
    function startAutoPlay() {
      autoPlayRef.current = setInterval(() => {
        if (!isPaused.current) {
          setCurrentIndex((prev) => {
            const max = Math.max(0, totalSlides - visibleCount);
            return prev >= max ? 0 : prev + 1;
          });
        }
      }, autoPlayInterval);
    }
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, autoPlayInterval, totalSlides, visibleCount]);

  const goTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const gap = 20;
  const slideWidthPercent = 100 / visibleCount;
  const offset = currentIndex * slideWidthPercent;
  const gapOffset = (currentIndex * gap * (visibleCount - 1)) / visibleCount;
  const transform = `translateX(calc(-${offset}% - ${currentIndex * gap}px + ${gapOffset}px))`;

  const slideWidth = `calc((100% - ${gap * (visibleCount - 1)}px) / ${visibleCount})`;

  const dotCount = maxIndex + 1;

  return (
    <div
      className="testimonial-carousel relative"
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-out"
          style={{ transform }}
          onTouchStart={(e) => { touchStartX.current = e.changedTouches[0].screenX; }}
          onTouchEnd={(e) => {
            const diff = touchStartX.current - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
              if (diff > 0) goTo(currentIndex + 1);
              else goTo(currentIndex - 1);
            }
          }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              style={{
                flex: `0 0 ${slideWidth}`,
                minWidth: slideWidth,
                paddingRight: i === children.length - 1 ? 0 : gap,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => goTo(currentIndex - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text-muted shadow-sm transition-all hover:border-blue hover:text-blue hover:shadow-md"
          aria-label="Previous testimonial"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex gap-2">
          {Array.from({ length: dotCount }, (_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === currentIndex ? "bg-blue" : "bg-border"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(currentIndex + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text-muted shadow-sm transition-all hover:border-blue hover:text-blue hover:shadow-md"
          aria-label="Next testimonial"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
