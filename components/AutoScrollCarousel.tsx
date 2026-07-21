"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode
} from "react";

type AutoScrollCarouselProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  intervalMs?: number;
};

export function AutoScrollCarousel({
  ariaLabel,
  children,
  className,
  intervalMs = 4500
}: AutoScrollCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const directionRef = useRef<1 | -1>(1);
  const pausedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
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

    viewport.scrollBy({
      behavior: "smooth",
      left: step * direction
    });
  }, []);

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
    const viewport = viewportRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!viewport || reducedMotion.matches) {
      return;
    }

    const pause = () => {
      pausedRef.current = true;
      clearTimer();
    };
    const resume = () => {
      pausedRef.current = false;
      scheduleAutoplay();
    };
    const postpone = () => {
      if (!pausedRef.current) {
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
  }, [clearTimer, scheduleAutoplay]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
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
