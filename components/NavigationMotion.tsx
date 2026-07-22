"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ENTER_DURATION_MS = 480;
const PENDING_FALLBACK_MS = 1400;

function firstVisiblePageSurface(main: HTMLElement | null) {
  if (!main) return null;

  return Array.from(main.children).find(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.matches("article, section, div")
  );
}

export function NavigationMotion() {
  const pathname = usePathname();
  const pendingTimeoutRef = useRef<number | null>(null);
  const entryAnimationRef = useRef<Animation | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const main = document.querySelector<HTMLElement>("main#inhalt");
    const surface = firstVisiblePageSurface(main);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.classList.remove("route-is-pending");
    if (pendingTimeoutRef.current !== null) {
      window.clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }

    if (!surface || prefersReducedMotion) return;

    entryAnimationRef.current?.cancel();
    entryAnimationRef.current = surface.animate(
      [
        { opacity: 0.88, transform: "translate3d(0, 9px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" }
      ],
      { duration: ENTER_DURATION_MS, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );

    return () => {
      entryAnimationRef.current?.cancel();
      entryAnimationRef.current = null;
    };
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;

    const clearPending = () => {
      root.classList.remove("route-is-pending");
      if (pendingTimeoutRef.current !== null) {
        window.clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }
    };

    const markPending = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const current = new URL(window.location.href);
      const onlyHashChanges =
        destination.pathname === current.pathname &&
        destination.search === current.search &&
        destination.hash !== current.hash;
      const destinationIsCurrent =
        destination.pathname === current.pathname &&
        destination.search === current.search &&
        destination.hash === current.hash;

      if (onlyHashChanges || destinationIsCurrent) return;

      root.classList.add("route-is-pending");
      if (pendingTimeoutRef.current !== null) {
        window.clearTimeout(pendingTimeoutRef.current);
      }
      pendingTimeoutRef.current = window.setTimeout(clearPending, PENDING_FALLBACK_MS);
    };

    document.addEventListener("click", markPending, { capture: true });
    window.addEventListener("pageshow", clearPending);

    return () => {
      document.removeEventListener("click", markPending, { capture: true });
      window.removeEventListener("pageshow", clearPending);
      clearPending();
    };
  }, []);

  return (
    <div aria-hidden="true" className="route-progress">
      <span />
    </div>
  );
}
