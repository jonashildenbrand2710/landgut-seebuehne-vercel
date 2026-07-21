import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { mainNavigation, siteConfig } from "@/data/site";

const footerSecondaryLinks = [
  { label: "Getting Ready", href: "/getting-ready" },
  { label: "Besichtigung", href: "/besichtigung" },
  { label: "Besichtigung buchen", href: "/termin-buchen" },
  { label: "Kontakt", href: "/kontaktformular" },
  { label: "Buchungsformular", href: "/formular" }
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <BrandLogo className="brand-logo brand-logo-footer" variant="light" />
          <h2>Naturnah heiraten, gut begleitet planen.</h2>
          <p>
            Ein Ort am See für Paare, die Atmosphäre, Exklusivität und klare
            Orientierung verbinden möchten.
          </p>
        </div>
        <div>
          <h3>Seiten</h3>
          <ul>
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            {footerSecondaryLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/datenschutz">Datenschutz</Link>
            </li>
            <li>
              <Link href="/impressum">Impressum</Link>
            </li>
            <li>
              <CookieSettingsButton />
            </li>
          </ul>
        </div>
        <div>
          <h3>Kontakt</h3>
          <ul className="contact-list">
            <li>
              <Mail aria-hidden="true" size={18} />
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
            <li>
              <Phone aria-hidden="true" size={18} />
              <a href={`tel:${siteConfig.phoneInternational}`}>{siteConfig.phone}</a>
            </li>
            <li>{siteConfig.address.legal}</li>
          </ul>
        </div>
      </div>
      <p className="footer-note">
        © {new Date().getFullYear()} Landgut Seebühne. Alle Rechte vorbehalten.
      </p>
    </footer>
  );
}
