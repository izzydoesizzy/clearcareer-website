"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  outcome?: string;
  image?: string;
}

interface TestimonialModalProps {
  testimonial: Testimonial | null;
  onClose: () => void;
}

export default function TestimonialModal({ testimonial, onClose }: TestimonialModalProps) {
  useEffect(() => {
    if (!testimonial) return;

    document.body.style.overflow = "hidden";
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [testimonial, onClose]);

  if (!testimonial) return null;

  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Full testimonial"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-gray-100 hover:text-navy"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {testimonial.outcome && (
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {testimonial.outcome}
            </span>
          </div>
        )}

        <blockquote className="mb-6">
          <p className="text-[1.0625rem] leading-[1.85] text-text">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </blockquote>

        <div className="flex items-center gap-3 border-t border-border pt-5">
          {testimonial.image ? (
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-blue/20">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="h-full w-full rounded-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue text-sm font-semibold text-white">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy">{testimonial.name}</p>
            <p className="text-sm text-text-muted">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
