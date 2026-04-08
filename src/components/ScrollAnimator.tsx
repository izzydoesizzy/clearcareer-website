"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollAnimator() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll("[data-animate], [data-animate-stagger]")
      .forEach((el) => {
        observer.observe(el);
      });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
