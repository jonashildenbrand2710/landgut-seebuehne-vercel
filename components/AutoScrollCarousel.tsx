"use client";

import { useEffect, useRef, type ReactNode } from "react";

type AutoScrollCarouselProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  /** Pause nach Nutzer-Interaktion, bevor das Auto-Sliding wieder einsetzt. */
  idleMs?: number;
  intervalMs?: number;
};

/**
 * Horizontal scrollbarer Streifen, der in einem ruhigen Intervall von selbst
 * zum naechsten Element weitergleitet. Nutzer-Interaktion (Wischen, Hover,
 * Fokus) pausiert das Sliding, prefers-reduced-motion deaktiviert es ganz.
 */
export function AutoScrollCarousel({
  ariaLabel,
  children,
  className,
  idleMs = 9000,
  intervalMs = 4200
}: AutoScrollCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let interactedUntil = 0;
    let hovered = false;
    let visible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.35 }
    );
    observer.observe(container);

    const markInteraction = () => {
      interactedUntil = Date.now() + idleMs;
    };
    const onPointerEnter = () => {
      hovered = true;
    };
    const onPointerLeave = () => {
      hovered = false;
    };

    const step = () => {
      if (!visible || hovered || document.hidden || reduceMotion.matches) return;
      if (Date.now() < interactedUntil) return;

      const firstItem = container.querySelector<HTMLElement>(":scope > *");
      if (!firstItem) return;

      const styles = window.getComputedStyle(container);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const stepWidth = firstItem.getBoundingClientRect().width + gap;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 4) return;

      if (container.scrollLeft >= maxScroll - 4) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: stepWidth, behavior: "smooth" });
      }
    };

    const timer = window.setInterval(step, intervalMs);
    container.addEventListener("pointerdown", markInteraction, { passive: true });
    container.addEventListener("touchstart", markInteraction, { passive: true });
    container.addEventListener("wheel", markInteraction, { passive: true });
    container.addEventListener("focusin", markInteraction);
    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      container.removeEventListener("pointerdown", markInteraction);
      container.removeEventListener("touchstart", markInteraction);
      container.removeEventListener("wheel", markInteraction);
      container.removeEventListener("focusin", markInteraction);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [idleMs, intervalMs]);

  return (
    <div aria-label={ariaLabel} className={className} ref={containerRef}>
      {children}
    </div>
  );
}
