"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { CalendarDays, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { mainNavigation } from "@/data/site";

export type HeaderVariant = "glass" | "glass-refined" | "floating" | "scroll-morph";

const mobileNavigation = [
  ...mainNavigation,
  { label: "Getting Ready", href: "/getting-ready" },
  { label: "Besichtigung", href: "/besichtigung" },
  { label: "Termin buchen", href: "/termin-buchen" },
  { label: "Kontakt", href: "/kontaktformular" }
];

export function Header({
  variant = "glass",
  static: isStatic = false
}: {
  variant?: HeaderVariant;
  static?: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuId = useId();

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
    variant === "floating" ? "site-header--floating-layout" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const brandClassName = ["brand", `brand--${variant}`].join(" ");

  return (
    <header className={headerClassName}>
      <Link
        className={brandClassName}
        href="/"
        aria-label="Landgut Seebühne Startseite"
        onClick={() => setIsMenuOpen(false)}
      >
        <BrandLogo className={`brand-logo brand-logo-header brand-logo-header--${variant}`} decorative priority />
      </Link>
      <nav className="main-nav" aria-label="Hauptnavigation">
        {mainNavigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link
        className={`header-cta header-cta--${variant}`}
        href="/termin-buchen"
        aria-label="Telefontermin zum Erstgespräch buchen"
        onClick={() => setIsMenuOpen(false)}
      >
        <CalendarDays aria-hidden="true" size={18} />
        <span className="header-cta-label-full">Erstgespräch</span>
        <span className="header-cta-label-short">Termin</span>
      </Link>
      <button
        className="mobile-menu-button"
        type="button"
        aria-controls={mobileMenuId}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Navigation schließen" : "Navigation öffnen"}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        {isMenuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
      </button>
      <nav className="mobile-nav-panel" id={mobileMenuId} aria-label="Mobile Navigation" hidden={!isMenuOpen}>
        {mobileNavigation.map((item) => (
          <Link href={item.href} key={item.href} onClick={() => setIsMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
