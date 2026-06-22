import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { mainNavigation } from "@/data/site";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Landgut Seebühne Startseite">
        <BrandLogo className="brand-logo brand-logo-header" decorative />
      </Link>
      <nav className="main-nav" aria-label="Hauptnavigation">
        {mainNavigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="header-cta" href="/termin-buchen">
        <CalendarDays aria-hidden="true" size={18} />
        <span>Erstgespräch</span>
      </Link>
    </header>
  );
}
