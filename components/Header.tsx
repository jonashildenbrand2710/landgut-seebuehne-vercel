"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export type HeaderVariant = "glass" | "glass-refined" | "floating" | "scroll-morph";

export function Header({
  variant = "glass",
  static: isStatic = false
}: {
  variant?: HeaderVariant;
  static?: boolean;
}) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);
  const scrollFrameRef = useRef<number | null>(null);
  const isDornrose = pathname === "/hochzeitsmappe-dornrose";

  useEffect(() => {
    if (isStatic) return;

    const updateHeaderState = () => {
      scrollFrameRef.current = null;
      const nextIsScrolled = window.scrollY > 18;

      if (nextIsScrolled === isScrolledRef.current) return;

      isScrolledRef.current = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
    };
    const scheduleHeaderUpdate = () => {
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = window.requestAnimationFrame(updateHeaderState);
    };

    updateHeaderState();
    window.addEventListener("scroll", scheduleHeaderUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleHeaderUpdate);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, [isStatic]);

  const headerClassName = [
    "site-header",
    `site-header--${variant}`,
    isStatic ? "site-header--static" : "",
    isScrolled ? "is-scrolled" : "",
    variant === "floating" ? "site-header--floating-layout" : "",
    isDornrose ? "site-header--dornrose" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const brandClassName = ["brand", `brand--${variant}`].join(" ");

  return (
    <header className={headerClassName}>
      <Link className={brandClassName} href="/" aria-label="Landgut Seebühne Startseite">
        <BrandLogo className={`brand-logo brand-logo-header brand-logo-header--${variant}`} decorative priority />
      </Link>
      <Link
        className={`header-cta header-cta--${variant} cta-botanical cta-tone-sage`}
        href="/termin-buchen"
        aria-label="Besichtigungstermin am Landgut Seebühne buchen"
      >
        <CalendarDays aria-hidden="true" size={18} />
        <span className="header-cta-label-full">Besichtigung buchen</span>
        <span className="header-cta-label-short">Besichtigung</span>
      </Link>
    </header>
  );
}
