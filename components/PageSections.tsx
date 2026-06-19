import Link from "next/link";
import { ArrowRight, Check, Mail } from "lucide-react";
import type { PageSection, SitePage } from "@/data/site";
import { siteConfig } from "@/data/site";

export function SectionBand({ section, index }: { section: PageSection; index: number }) {
  return (
    <section className={index % 2 === 0 ? "section-band" : "section-band muted"}>
      <div className="section-inner split">
        <div>
          {section.eyebrow ? <p className="eyebrow dark">{section.eyebrow}</p> : null}
          <h2>{section.title}</h2>
        </div>
        <div className="section-copy">
          {section.text.split("\n").map((line) => (
            <p key={line}>{line}</p>
          ))}
          {section.points ? (
            <ul className="check-list">
              {section.points.map((point) => (
                <li key={point}>
                  <Check aria-hidden="true" size={18} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function FAQ({ items }: { items?: SitePage["faqs"] }) {
  if (!items?.length) return null;

  return (
    <section className="section-band">
      <div className="section-inner">
        <p className="eyebrow dark">FAQ</p>
        <h2>Häufige Fragen</h2>
        <div className="faq-grid">
          {items.map((item) => (
            <article className="faq-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="cta-section">
      <div className="section-inner cta-inner">
        <div>
          <p className="eyebrow">Erster Schritt</p>
          <h2>Lasst uns klären, ob der Rahmen zu eurer Hochzeit passt.</h2>
          <p>
            Im Erstgespräch sortieren wir Datum, Gästezahl, Vorstellungen und
            die Fragen, die euch gerade am meisten beschäftigen.
          </p>
        </div>
        <div className="cta-actions">
          <Link className="button primary light" href="/termin-buchen">
            <span>Erstgespräch anfragen</span>
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
          <a className="button ghost-light" href={`mailto:${siteConfig.email}`}>
            <Mail aria-hidden="true" size={18} />
            <span>E-Mail schreiben</span>
          </a>
        </div>
      </div>
    </section>
  );
}
