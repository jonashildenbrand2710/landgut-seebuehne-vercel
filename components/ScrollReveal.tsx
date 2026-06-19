"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTORS = [
  ".hero-content > *",
  ".proof-copy",
  ".proof-stats div",
  ".mention-row span",
  ".hero-strip-item",
  ".landing-copy > *",
  ".mappe-hero-intro > *",
  ".mappe-benefit-panel",
  ".mappe-proof-card",
  ".mappe-final-copy > *",
  ".mappe-form-card",
  ".section-heading-row > *",
  ".section-copy > *",
  ".promise-card",
  ".bundle-card",
  ".family-facts div",
  ".family-story-card",
  ".teamleader-card",
  ".testimonial-card",
  ".warning-item",
  ".warning-solution-card",
  ".gallery-item",
  ".personal-cta-inner > *",
  ".cta-inner > *",
  ".faq-item",
  ".article-card",
  ".subpage-hero .section-inner > *",
  ".article-header > *",
  ".article-body section",
  ".footer-grid > *"
].join(",");

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTORS));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!targets.length || prefersReducedMotion) {
      document.body.classList.add("reveal-ready");
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const visibleClass = "is-visible";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(visibleClass);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16
      }
    );

    targets.forEach((target, index) => {
      target.classList.add("reveal-target");
      target.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
      observer.observe(target);
    });

    requestAnimationFrame(() => {
      document.body.classList.add("reveal-ready");
    });

    return () => {
      observer.disconnect();
      document.body.classList.remove("reveal-ready");
    };
  }, [pathname]);

  return null;
}
