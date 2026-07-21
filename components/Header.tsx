"use client";

import { useEffect, useState } from "react";
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
  const isDornrose = pathname === "/hochzeitsmappe-dornrose";

  useEffect(() => {
    if (isStatic) return;
    const updateHeaderState = () => {
      setIsScrolled(window.scrollY > 18);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderState);
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
        className={`header-cta header-cta--${variant}`}
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
