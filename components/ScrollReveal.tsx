"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTORS = [
  ".hero-strip-inner",
  ".landing-copy > *",
  ".promise-copy > .eyebrow",
  ".promise-copy > h2",
  ".promise-copy > p",
  ".promise-card",
  ".promise-visual",
  ".availability-content > *",
  ".section-heading-row > div > *",
  ".section-heading-row > p",
  ".bundle-card",
  ".bundle-compare-actions",
  ".family-facts > div",
  ".family-story-card",
  ".teamleader-heading > *",
  ".teamleader-card",
  ".teamleader-actions",
  ".testimonial-heading > *",
  ".testimonial-card",
  ".problem-solution-heading > *",
  ".warning-item",
  ".warning-sequence-bridge",
  ".warning-solution-card",
  ".gallery-item",
  ".article-card",
  ".center-actions",
  ".personal-cta-inner > div:first-child > *",
  ".personal-cta-actions",
  ".cta-inner > div > *",
  ".cta-actions",
  ".faq-grid > *",
  ".article-inline-cta",
  ".article-body section",
  ".section-inner.split > *",
  ".footer-signature",
  ".footer-grid > *",
  ".footer-note"
].join(",");

const STAGGERED_ITEM_SELECTOR = [
  ".promise-card",
  ".promise-visual",
  ".bundle-card",
  ".family-facts > div",
  ".family-story-card",
  ".teamleader-card",
  ".testimonial-card",
  ".warning-item",
  ".gallery-item",
  ".article-card",
  ".faq-grid > *",
  ".footer-grid > *"
].join(",");

const CARD_SELECTOR = [
  ".promise-card",
  ".bundle-card",
  ".family-story-card",
  ".teamleader-card",
  ".testimonial-card",
  ".warning-item",
  ".warning-solution-card",
  ".gallery-item",
  ".article-card",
  ".faq-grid > *"
].join(",");

function siblingDelay(target: HTMLElement, compactMotion: boolean) {
  if (!target.matches(STAGGERED_ITEM_SELECTOR)) return 0;

  const siblings = Array.from(target.parentElement?.children ?? []).filter(
    (item): item is HTMLElement => item instanceof HTMLElement && item.matches(STAGGERED_ITEM_SELECTOR)
  );
  const index = Math.max(0, siblings.indexOf(target));
  const step = compactMotion ? 44 : 70;

  return Math.min(index, 3) * step;
}

function motionFrames(target: HTMLElement, compactMotion: boolean): Keyframe[] {
  if (target.matches("h1, h2, .section-heading-row h2, .testimonial-heading h2")) {
    return [
      {
        clipPath: "inset(0 0 100% 0)",
        opacity: 0,
        transform: `translate3d(0, ${compactMotion ? 16 : 28}px, 0)`
      },
      {
        clipPath: "inset(0 0 0% 0)",
        opacity: 1,
        transform: "translate3d(0, 0, 0)"
      }
    ];
  }

  if (target.matches(CARD_SELECTOR)) {
    return [
      {
        opacity: 0,
        transform: `translate3d(0, ${compactMotion ? 20 : 34}px, 0) scale(${compactMotion ? 0.992 : 0.98})`
      },
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }
    ];
  }

  if (target.matches(".hero-strip-inner, .promise-visual")) {
    return [
      { opacity: 0, transform: "translate3d(0, 24px, 0) scale(0.955)" },
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }
    ];
  }

  return [
    {
      opacity: 0,
      transform: `translate3d(0, ${compactMotion ? 12 : 20}px, 0)`
    },
    { opacity: 1, transform: "translate3d(0, 0, 0)" }
  ];
}

function motionDuration(target: HTMLElement, compactMotion: boolean) {
  if (target.matches("h1, h2")) return compactMotion ? 520 : 720;
  if (target.matches(".hero-strip-inner, .promise-visual")) return compactMotion ? 540 : 780;
  if (target.matches(CARD_SELECTOR)) return compactMotion ? 500 : 620;
  return compactMotion ? 430 : 560;
}

export function ScrollReveal() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTORS));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!targets.length) return;

    if (prefersReducedMotion) {
      targets.forEach((target) => target.dataset.motionVisible = "true");
      return;
    }

    const compactMotion = window.matchMedia("(max-width: 680px)").matches;
    const animations = new Set<Animation>();
    const clearStartStyles = (target: HTMLElement) => {
      target.style.removeProperty("clip-path");
      target.style.removeProperty("opacity");
      target.style.removeProperty("transform");
      delete target.dataset.motionPending;
    };
    const prepare = (target: HTMLElement) => {
      if (target.matches(".footer-signature")) return;

      const start = motionFrames(target, compactMotion)[0];
      target.dataset.motionPending = "true";
      target.style.opacity = String(start.opacity ?? 0);
      target.style.transform = String(start.transform ?? "none");
    };
    const reveal = (target: HTMLElement) => {
      target.dataset.motionVisible = "true";

      if (target.matches(".footer-signature") || typeof target.animate !== "function") return;

      target.style.willChange = "transform, opacity";
      const animation = target.animate(motionFrames(target, compactMotion), {
        delay: siblingDelay(target, compactMotion),
        duration: motionDuration(target, compactMotion),
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards"
      });
      clearStartStyles(target);

      animations.add(animation);
      const finishAnimation = () => {
        animations.delete(animation);
        target.style.removeProperty("will-change");
      };

      animation.addEventListener("finish", finishAnimation, { once: true });
      animation.addEventListener("cancel", finishAnimation, { once: true });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          observer.unobserve(entry.target);
          reveal(entry.target as HTMLElement);
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: compactMotion ? 0.07 : 0.1 }
    );

    const initialViewportHeight = window.innerHeight;
    targets.forEach((target) => {
      const bounds = target.getBoundingClientRect();
      const isInitiallyVisible = bounds.bottom > 0 && bounds.top < initialViewportHeight;

      if (isInitiallyVisible) {
        target.dataset.motionVisible = "true";
      } else {
        prepare(target);
        observer.observe(target);
      }
    });

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      targets.forEach((target) => {
        clearStartStyles(target);
        target.style.removeProperty("will-change");
        delete target.dataset.motionVisible;
      });
    };
  }, [pathname]);

  return null;
}
