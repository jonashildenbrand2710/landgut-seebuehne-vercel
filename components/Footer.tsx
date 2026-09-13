import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { mainNavigation, siteConfig } from "@/data/site";

const footerSecondaryLinks = [
  { label: "Besichtigung", href: "/termin-buchen" },
  { label: "Kennenlerngespräch", href: "/termin-buchen" }
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-signature" id="abschluss">
        <p className="footer-signature-kicker">Bis bald am See</p>
        <h2
          className="footer-signature-heading"
          aria-label="Wir freuen uns auf euch und eure Geschichte."
        >
          <span className="footer-signature-lead" aria-hidden="true">
            Wir freuen uns auf euch und
          </span>
          <svg
            className="footer-signature-script"
            viewBox="0 0 820 150"
            role="presentation"
            aria-hidden="true"
          >
            <defs>
              <mask id="footer-signature-write-mask">
                <rect width="820" height="150" fill="black" />
                <path
                  className="footer-signature-stroke"
                  d="M42 87 C172 76 291 82 412 82 C544 82 660 77 784 84"
                  fill="none"
                  pathLength="1"
                  stroke="white"
                  strokeLinecap="round"
                  strokeWidth="104"
                />
              </mask>
            </defs>
            <text
              x="410"
              y="108"
              fill="currentColor"
              mask="url(#footer-signature-write-mask)"
              textAnchor="middle"
            >
              eure Geschichte.
            </text>
          </svg>
        </h2>
        <p className="footer-signature-copy">
          Lernt das Landgut in Ruhe kennen und erzählt uns, wie sich euer Hochzeitstag
          anfühlen soll.
        </p>
        <Link className="footer-signature-link" href="/termin-buchen">
          Besichtigungstermin wählen
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
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
                <Link href={item.href} prefetch={false}>
                  {item.label}
                </Link>
              </li>
            ))}
            {footerSecondaryLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} prefetch={false}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/datenschutz" prefetch={false}>
                Datenschutz
              </Link>
            </li>
            <li>
              <Link href="/impressum" prefetch={false}>
                Impressum
              </Link>
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
