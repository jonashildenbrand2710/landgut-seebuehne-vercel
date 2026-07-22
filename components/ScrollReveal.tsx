"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTORS = [
  ".hero-strip-item",
  ".landing-copy > *",
  ".mappe-benefit-panel",
  ".mappe-proof-card",
  ".mappe-final-copy > *",
  ".mappe-form-card",
  ".section-heading-row > *",
  ".section-copy > *",
  ".promise-copy > *",
  ".promise-card",
  ".promise-visual",
  ".availability-content > *",
  ".bundle-card",
  ".family-facts div",
  ".family-story-card",
  ".teamleader-heading",
  ".teamleader-card",
  ".teamleader-actions",
  ".testimonial-heading > *",
  ".testimonial-card",
  ".problem-solution-heading > *",
  ".warning-item",
  ".warning-solution-card",
  ".gallery-item",
  ".center-actions",
  ".personal-cta-inner > *",
  ".cta-inner > *",
  ".faq-item",
  ".article-card",
  ".article-inline-cta",
  ".article-body section",
  ".footer-grid > *"
].join(",");

const CARD_SELECTORS = [
  ".promise-card",
  ".bundle-card",
  ".testimonial-card",
  ".family-story-card",
  ".teamleader-card",
  ".mappe-proof-card",
  ".mappe-form-card",
  ".gallery-item",
  ".article-card",
  ".faq-item"
].join(",");

const VISUAL_SELECTORS = [
  ".promise-visual",
  ".hero-strip-item",
  ".landing-media",
  ".gallery-item > div"
].join(",");

const SPLIT_PARENTS = ".split, .cta-inner, .personal-cta-inner, .section-heading-row";

function revealStartTransform(target: HTMLElement, useVerticalMotion: boolean) {
  let x = 0;
  let y = target.matches(CARD_SELECTORS) ? 20 : target.matches(VISUAL_SELECTORS) ? 16 : 12;
  const scale = target.matches(CARD_SELECTORS) ? 0.992 : target.matches(VISUAL_SELECTORS) ? 0.988 : 1;
  const parent = target.parentElement;

  if (!useVerticalMotion && parent?.matches(SPLIT_PARENTS)) {
    x = target === parent.firstElementChild ? -8 : 8;
    y = 0;
  }

  return `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
}

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTORS));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!targets.length || prefersReducedMotion) return;

    const useVerticalMotion = window.matchMedia("(max-width: 680px)").matches;
    const animations = new Set<Animation>();
    const delays = new Map(targets.map((target, index) => [target, Math.min(index % 4, 3) * 24]));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;
          observer.unobserve(entry.target);

          if (typeof target.animate !== "function") return;

          const animation = target.animate(
            [
              { opacity: 0, transform: revealStartTransform(target, useVerticalMotion) },
              { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }
            ],
            {
              delay: delays.get(target) ?? 0,
              duration: 820,
              easing: "cubic-bezier(0.2, 0.75, 0.25, 1)",
              fill: "backwards"
            }
          );

          animations.add(animation);
          animation.addEventListener("finish", () => animations.delete(animation), { once: true });
        });
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.05 }
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);

  return null;
}
