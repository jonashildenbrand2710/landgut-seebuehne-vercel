"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTORS = [
  ".hero-strip-inner",
  ".landing-copy",
  ".mappe-benefit-panel",
  ".mappe-proof-grid",
  ".mappe-final-copy",
  ".mappe-form-card",
  ".section-heading-row > *",
  ".section-inner.split > *",
  ".promise-copy",
  ".promise-list",
  ".promise-visual-grid",
  ".availability-content",
  ".bundle-grid",
  ".family-facts",
  ".family-story-cards",
  ".teamleader-heading",
  ".teamleader-grid",
  ".teamleader-actions",
  ".testimonial-heading",
  ".testimonial-grid",
  ".problem-solution-heading",
  ".warning-accordion-list",
  ".warning-solution-card",
  ".mini-gallery-grid",
  ".center-actions",
  ".personal-cta-inner > *",
  ".cta-inner > *",
  ".faq-grid",
  ".article-grid",
  ".article-inline-cta",
  ".article-body section",
  ".footer-grid"
].join(",");

const SPLIT_PARENTS = ".split, .cta-inner, .personal-cta-inner, .section-heading-row";

function revealStartTransform(target: HTMLElement, useVerticalMotion: boolean) {
  let x = 0;
  let y = useVerticalMotion ? 4 : 7;
  const parent = target.parentElement;

  if (!useVerticalMotion && parent?.matches(SPLIT_PARENTS)) {
    x = target === parent.firstElementChild ? -5 : 5;
    y = 0;
  }

  return `translate3d(${x}px, ${y}px, 0)`;
}

export function ScrollReveal() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTORS));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!targets.length || prefersReducedMotion) return;

    const useVerticalMotion = window.matchMedia("(max-width: 680px)").matches;
    const startOpacity = useVerticalMotion ? 0.985 : 0.97;
    const duration = useVerticalMotion ? 340 : 440;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;
          observer.unobserve(entry.target);

          if (typeof target.animate !== "function") return;

          target.style.willChange = "transform, opacity";
          const animation = target.animate(
            [
              { opacity: startOpacity, transform: revealStartTransform(target, useVerticalMotion) },
              { opacity: 1, transform: "translate3d(0, 0, 0)" }
            ],
            {
              duration,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)"
            }
          );

          animations.add(animation);
          const finishAnimation = () => {
            animations.delete(animation);
            target.style.removeProperty("will-change");
          };

          animation.addEventListener("finish", finishAnimation, { once: true });
          animation.addEventListener("cancel", finishAnimation, { once: true });
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.12 }
    );

    const initialViewportHeight = window.innerHeight;
    targets.forEach((target) => {
      const bounds = target.getBoundingClientRect();
      const isInitiallyVisible = bounds.bottom > 0 && bounds.top < initialViewportHeight;

      if (!isInitiallyVisible) observer.observe(target);
    });

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      targets.forEach((target) => target.style.removeProperty("will-change"));
    };
  }, [pathname]);

  return null;
}
