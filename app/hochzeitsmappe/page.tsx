import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ShieldCheck,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import { HochzeitsmappeForm } from "@/components/HochzeitsmappeForm";
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
      "Ein klar gegliederter Online-Begleiter mit Erfahrungsschatz, praktischen Einblicken und Fragen, die euch bei der Einordnung eurer Location-Entscheidung helfen."
  },
  {
    icon: ShieldCheck,
    title: "Genutzt von Profis",
    text:
      "Auch erfahrene Hochzeitsplaner nutzen die Mappe als strukturierten Startpunkt für Gespräche, Ablaufideen und konkrete Planung."
  }
];

const previewChapters = [
  { number: "I", label: "Der erste Blick" },
  { number: "II", label: "Das Landgut" },
  { number: "III", label: "Euer Fest" },
  { number: "IV", label: "Nächster Schritt" }
] as const;

export const metadata: Metadata = {
  title: "Hochzeitsmappe",
  description:
    "Persönliche Online-Hochzeitsmappe der Seebühne: Location, Ablauf, Ideen und wichtige Fragen für euren Planungsstart.",
  alternates: {
    canonical: "/hochzeitsmappe"
  },
  openGraph: {
    title: "Hochzeitsmappe",
    description:
      "Persönlicher Online-Hochzeitsbegleiter für Hochzeiten an der Seebühne.",
    url: "/hochzeitsmappe",
    images: [
      {
        url: imageLibrary.availability.src,
        alt: "Einblick in die Online-Hochzeitsmappe des Landgut Seebühne"
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
  const background = imageLibrary.lake;

  return (
    <article className="mappe-page">
      <PageJsonLd
        path="/hochzeitsmappe"
        title="Hochzeitsmappe"
        description="Persönliche Online-Hochzeitsmappe der Seebühne: Location, Ablauf, Ideen und wichtige Fragen für euren Planungsstart."
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
            Euer persönlicher Online-Hochzeitsbegleiter für die Seebühne
          </p>
          <span className="mappe-label">Direkt online entdecken</span>
          <p>
            In dieser liebevoll gestalteten Online-Hochzeitsmappe führen wir euch durch
            das Landgut, geben klare Antworten und zeigen, wie sich euer Tag am See
            anfühlen kann. Nach dem kurzen Opt-in öffnet sie sich sofort im Browser.
          </p>
          <div className="hero-actions mappe-actions">
            <a className="button primary" href="#mappe-form">
              <BookOpenCheck aria-hidden="true" size={18} />
              <span>Online-Mappe öffnen</span>
            </a>
            <Link className="button secondary" href="/termin-buchen">
              <ArrowRight aria-hidden="true" size={18} />
              <span>Besichtigungstermin buchen</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mappe-overview-section">
        <div className="section-inner mappe-overview-grid">
          <div className="mappe-cover-stage">
            <div className="mappe-browser-bar" aria-hidden="true">
              <div className="mappe-browser-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="mappe-browser-address">
                landgut-seebuehne.de/hochzeitsmappe
              </span>
              <span className="mappe-browser-status">
                <i /> Online
              </span>
            </div>

            <div className="mappe-guide-viewport">
              <div className="mappe-guide-progress" aria-hidden="true">
                <span />
              </div>
              <div className="mappe-guide-visual">
                <Image
                  className="mappe-guide-image"
                  src={imageLibrary.availability.src}
                  alt="Vorschau der Online-Hochzeitsmappe mit einem Brautpaar auf dem Steg am See"
                  fill
                  fetchPriority="high"
                  preload
                  quality={75}
                  sizes="(max-width: 920px) 90vw, 620px"
                />
                <div className="mappe-guide-shade" aria-hidden="true" />
                <div className="mappe-guide-masthead">
                  <span>Die Online-Hochzeitsmappe der Seebühne</span>
                  <strong>Ein Ort für euer eigenes Märchen.</strong>
                  <small>Leicht geplant, klar erlebt, für immer erinnert</small>
                </div>
                <span className="mappe-guide-scroll-cue" aria-hidden="true">
                  <i />
                  Scrollen & entdecken
                </span>
              </div>

              <div
                className="mappe-guide-chapters"
                aria-label="Kapitelvorschau der Online-Hochzeitsmappe"
              >
                {previewChapters.map((chapter) => (
                  <span key={chapter.number}>
                    <small>{chapter.number}</small>
                    <strong>{chapter.label}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mappe-benefit-panel">
            <p className="eyebrow dark">Online-Hochzeitsbegleiter</p>
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
              <BookOpenCheck aria-hidden="true" size={18} />
              <span>Persönlichen Zugang sichern</span>
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

      <section className="mappe-form-section">
        <Image
          className="mappe-form-bg"
          src={background.src}
          alt=""
          fill
          quality={60}
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
              konkretisieren und die nächsten Fragen für eure Besichtigung sortieren.
            </p>
            <div className="mappe-mini-proof" aria-label="Inhalte der Hochzeitsmappe">
              <span>Persönlicher Online-Zugang</span>
              <span>Location am See</span>
              <span>Ablauf & Ideen</span>
            </div>
          </div>

          <HochzeitsmappeForm />
        </div>
      </section>
    </article>
  );
}
