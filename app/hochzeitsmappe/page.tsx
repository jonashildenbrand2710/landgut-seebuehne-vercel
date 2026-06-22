import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Download,
  FileText,
  ShieldCheck,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import { PageJsonLd } from "@/components/StructuredData";
import { imageLibrary } from "@/data/site";

const mappeBenefits = [
  "was euch einen umfassenden Überblick über unsere Location am See gibt und euch direkt in Hochzeitsstimmung versetzt.",
  "was euch Zeit spart, indem es alle wichtigen Informationen auf einen Blick zusammenfasst.",
  "was euch inspiriert, mit konkreten Ideen für Dekoration, Menü und Ablauf.",
  "was euch mit klaren und ehrlichen Antworten auf häufige Fragen rund um eure Hochzeit unterstützt."
];

const proofCards = [
  {
    icon: Users,
    title: "Bewährt bei echten Paaren",
    text:
      "Über 150 Brautpaare haben ihre Hochzeit mit Hilfe unserer Hochzeitsmappe geplant und sind so stressfreier in die ersten Entscheidungen gestartet."
  },
  {
    icon: BookOpenCheck,
    title: "Praxis-orientiert",
    text:
      "Über 20 Seiten mit Erfahrungsschatz, praktischen Einblicken und Fragen, die euch bei der Einordnung eurer Location-Entscheidung helfen."
  },
  {
    icon: ShieldCheck,
    title: "Genutzt von Profis",
    text:
      "Auch erfahrene Hochzeitsplaner nutzen die Mappe als strukturierten Startpunkt für Gespräche, Ablaufideen und konkrete Planung."
  }
];

export const metadata: Metadata = {
  title: "Hochzeitsmappe",
  description:
    "Detaillierter PDF-Guide für Hochzeiten an der Seebühne: Location, Ablauf, Ideen und wichtige Fragen für euren Planungsstart.",
  alternates: {
    canonical: "/hochzeitsmappe"
  },
  openGraph: {
    title: "Hochzeitsmappe",
    description:
      "Detaillierter PDF-Guide für Hochzeiten an der Seebühne.",
    url: "/hochzeitsmappe",
    images: [
      {
        url: imageLibrary.mappeCover.src,
        alt: imageLibrary.mappeCover.alt
      }
    ]
  }
};

function StarRating() {
  return (
    <div className="mappe-stars" aria-label="5 von 5 Sternen">
      {[0, 1, 2, 3, 4].map((star) => (
        <Star aria-hidden="true" fill="currentColor" key={star} size={20} />
      ))}
    </div>
  );
}

export default function HochzeitsmappePage() {
  const cover = imageLibrary.mappeCover;
  const background = imageLibrary.lake;

  return (
    <article className="mappe-page">
      <PageJsonLd
        path="/hochzeitsmappe"
        title="Hochzeitsmappe"
        description="Detaillierter PDF-Guide für Hochzeiten an der Seebühne: Location, Ablauf, Ideen und wichtige Fragen für euren Planungsstart."
        breadcrumbs={[
          { name: "Startseite", path: "/" },
          { name: "Hochzeitsmappe", path: "/hochzeitsmappe" }
        ]}
      />
      <section className="mappe-hero">
        <div className="section-inner mappe-hero-intro">
          <StarRating />
          <h1>Die Hochzeitsmappe</h1>
          <p className="mappe-subtitle">
            Detaillierter PDF-Guide für Hochzeiten an der Seebühne
          </p>
          <span className="mappe-label">Als PDF-Download erhältlich</span>
          <p>
            Mit dieser umfassenden PDF-Broschüre geben wir euch alles an die Hand,
            um eure Fragen zu klären, erste Entscheidungen zu treffen und zu
            erfahren, warum die Seebühne die ideale Location für euren großen Tag ist.
          </p>
          <div className="hero-actions mappe-actions">
            <a className="button primary" href="#mappe-form">
              <Download aria-hidden="true" size={18} />
              <span>Hol dir die Mappe</span>
            </a>
            <Link className="button secondary" href="/termin-buchen">
              <ArrowRight aria-hidden="true" size={18} />
              <span>Telefontermin vereinbaren</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mappe-overview-section">
        <div className="section-inner mappe-overview-grid">
          <div className="mappe-cover-stage">
            <Image
              className="mappe-cover-image"
              src={cover.src}
              alt={cover.alt}
              fill
              priority
              sizes="(max-width: 920px) 90vw, 520px"
            />
          </div>
          <div className="mappe-benefit-panel">
            <p className="eyebrow dark">PDF-Guide</p>
            <h2>Unsere Hochzeitsmappe ist genau das, ...</h2>
            <ul className="mappe-benefit-list">
              {mappeBenefits.map((benefit) => (
                <li key={benefit}>
                  <Check aria-hidden="true" size={19} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <a className="button primary" href="#mappe-form">
              <Download aria-hidden="true" size={18} />
              <span>Jetzt Mappe sichern</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section-band mappe-proof-section">
        <div className="section-inner">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow dark">Bewährt bei Paaren</p>
              <h2>Ein stressfreier Einstieg, bevor die Detailfragen losgehen.</h2>
            </div>
            <p>
              Die Mappe ist als kompakter Planungsstart gedacht: genug Überblick
              für erste Entscheidungen, ohne dass ihr euch durch einzelne Details
              kämpfen müsst.
            </p>
          </div>
          <div className="mappe-proof-grid">
            {proofCards.map((card) => {
              const Icon = card.icon;

              return (
                <article className="mappe-proof-card" key={card.title}>
                  <Icon aria-hidden="true" size={24} />
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mappe-form-section" id="mappe-form">
        <Image
          className="mappe-form-bg"
          src={background.src}
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="mappe-form-shade" />
        <div className="section-inner mappe-form-grid">
          <div className="mappe-final-copy">
            <Sparkles aria-hidden="true" size={26} />
            <p className="eyebrow">Zeit, sofort zu handeln</p>
            <h2>Hol dir jetzt alle Infos für euren Planungsstart.</h2>
            <p>
              Beliebte Termine und Locations sind oft schneller vergeben, als man
              denkt. Mit der kostenlosen Hochzeitsmappe könnt ihr eure Visionen
              konkretisieren und die nächsten Fragen für euer Erstgespräch sortieren.
            </p>
            <div className="mappe-mini-proof" aria-label="Inhalte der Hochzeitsmappe">
              <span>PDF-Guide</span>
              <span>Location am See</span>
              <span>Ablauf & Ideen</span>
            </div>
          </div>

          <form className="mappe-form-card" action="/api/hochzeitsmappe" method="post">
            <FileText aria-hidden="true" size={24} />
            <h3>Hochzeitsmappe sichern</h3>
            <p>
              Bevor du die Hochzeitsmappe laden kannst, bestätige bitte kurz deine
              Kontaktdaten.
            </p>
            <input
              aria-hidden="true"
              autoComplete="off"
              className="mappe-honeypot"
              name="website"
              tabIndex={-1}
              type="text"
            />
            <div className="mappe-field-grid">
              <label className="mappe-field">
                <span>Vorname</span>
                <input autoComplete="given-name" name="firstName" required type="text" />
              </label>
              <label className="mappe-field">
                <span>Nachname</span>
                <input autoComplete="family-name" name="lastName" required type="text" />
              </label>
              <label className="mappe-field">
                <span>E-Mail</span>
                <input autoComplete="email" name="email" required type="email" />
              </label>
              <label className="mappe-field">
                <span>Telefon</span>
                <input autoComplete="tel" name="phone" required type="tel" />
              </label>
            </div>
            <button className="button primary" type="submit">
              <Download aria-hidden="true" size={18} />
              <span>Jetzt Hochzeitsmappe erhalten</span>
            </button>
            <p className="mappe-form-note">
              Wir verwenden eure Angaben nur für eure Anfrage zur Hochzeitsmappe
              und melden uns persönlich, wenn noch etwas offen ist.
            </p>
          </form>
        </div>
      </section>
    </article>
  );
}
