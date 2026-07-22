"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

type AutoScrollCarouselProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  intervalMs?: number;
  scrollDurationMs?: number;
};

export function AutoScrollCarousel({
  ariaLabel,
  children,
  className,
  intervalMs = 4500,
  scrollDurationMs = 1500
}: AutoScrollCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const completionTimeoutRef = useRef<number | null>(null);
  const scrollEndHandlerRef = useRef<(() => void) | null>(null);
  const scheduleAutoplayRef = useRef<() => void>(() => undefined);
  const directionRef = useRef<1 | -1>(1);
  const pausedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const stopAnimation = useCallback(() => {
    const viewport = viewportRef.current;

    if (completionTimeoutRef.current !== null) {
      window.clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }

    if (viewport && scrollEndHandlerRef.current) {
      viewport.removeEventListener("scrollend", scrollEndHandlerRef.current);
      scrollEndHandlerRef.current = null;
    }

    if (viewport?.dataset.carouselAnimating === "true") {
      viewport.scrollTo({ behavior: "auto", left: viewport.scrollLeft });
      delete viewport.dataset.carouselAnimating;
    }
  }, []);

  const scrollOneSlide = useCallback((requestedDirection?: 1 | -1) => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const firstSlide = viewport.querySelector<HTMLElement>("[data-carousel-slide]");
    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

    if (!firstSlide || maxScrollLeft <= 1) {
      return;
    }

    const styles = window.getComputedStyle(viewport);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const step = firstSlide.getBoundingClientRect().width + gap;
    let direction = requestedDirection ?? directionRef.current;

    if (requestedDirection === undefined) {
      if (viewport.scrollLeft >= maxScrollLeft - 2) {
        direction = -1;
      } else if (viewport.scrollLeft <= 2) {
        direction = 1;
      }

      directionRef.current = direction;
    }

    stopAnimation();

    const startScrollLeft = viewport.scrollLeft;
    const targetScrollLeft = Math.min(
      maxScrollLeft,
      Math.max(0, startScrollLeft + step * direction)
    );
    const distance = targetScrollLeft - startScrollLeft;

    if (Math.abs(distance) <= 1) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      viewport.scrollLeft = targetScrollLeft;
      return;
    }

    const finishAnimation = () => {
      if (completionTimeoutRef.current !== null) {
        window.clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
      if (scrollEndHandlerRef.current) {
        viewport.removeEventListener("scrollend", scrollEndHandlerRef.current);
        scrollEndHandlerRef.current = null;
      }
      viewport.scrollLeft = targetScrollLeft;
      delete viewport.dataset.carouselAnimating;
      scheduleAutoplayRef.current();
    };

    viewport.dataset.carouselAnimating = "true";
    scrollEndHandlerRef.current = finishAnimation;
    viewport.addEventListener("scrollend", finishAnimation, { once: true });
    completionTimeoutRef.current = window.setTimeout(
      finishAnimation,
      Math.max(800, scrollDurationMs)
    );
    viewport.scrollTo({ behavior: "smooth", left: targetScrollLeft });
  }, [scrollDurationMs, stopAnimation]);

  const scheduleAutoplay = useCallback(() => {
    clearTimer();

    if (pausedRef.current || document.hidden) {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      scrollOneSlide();
    }, intervalMs);
  }, [clearTimer, intervalMs, scrollOneSlide]);

  useEffect(() => {
    scheduleAutoplayRef.current = scheduleAutoplay;
  }, [scheduleAutoplay]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!viewport || reducedMotion.matches) {
      return;
    }

    const pause = () => {
      pausedRef.current = true;
      clearTimer();
      stopAnimation();
    };
    const resume = () => {
      pausedRef.current = false;
      scheduleAutoplay();
    };
    const postpone = () => {
      if (!pausedRef.current && viewport.dataset.carouselAnimating !== "true") {
        scheduleAutoplay();
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimer();
      } else {
        scheduleAutoplay();
      }
    };

    viewport.addEventListener("pointerdown", pause);
    viewport.addEventListener("pointerup", resume);
    viewport.addEventListener("pointercancel", resume);
    viewport.addEventListener("mouseenter", pause);
    viewport.addEventListener("mouseleave", resume);
    viewport.addEventListener("focusin", pause);
    viewport.addEventListener("focusout", resume);
    viewport.addEventListener("wheel", postpone, { passive: true });
    viewport.addEventListener("scroll", postpone, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    scheduleAutoplay();

    return () => {
      clearTimer();
      stopAnimation();
      viewport.removeEventListener("pointerdown", pause);
      viewport.removeEventListener("pointerup", resume);
      viewport.removeEventListener("pointercancel", resume);
      viewport.removeEventListener("mouseenter", pause);
      viewport.removeEventListener("mouseleave", resume);
      viewport.removeEventListener("focusin", pause);
      viewport.removeEventListener("focusout", resume);
      viewport.removeEventListener("wheel", postpone);
      viewport.removeEventListener("scroll", postpone);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearTimer, scheduleAutoplay, stopAnimation]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    directionRef.current = event.key === "ArrowRight" ? 1 : -1;
    scrollOneSlide(directionRef.current);
  };

  return (
    <div
      ref={viewportRef}
      className={className}
      role="region"
      aria-label={ariaLabel}
      data-carousel-viewport
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
