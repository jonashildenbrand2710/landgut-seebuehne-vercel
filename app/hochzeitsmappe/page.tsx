import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  KeyRound,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { HochzeitsmappeForm } from "@/components/HochzeitsmappeForm";
import { PageJsonLd } from "@/components/StructuredData";
import { imageLibrary } from "@/data/site";

const mappeBenefits = [
  {
    title: "Das Landgut entdecken",
    text: "Seht See, Trauplatz, Landhaus und Gästezimmer so, wie sie euren Hochzeitstag tragen können."
  },
  {
    title: "Euren Tag vor Augen haben",
    text: "Verbindet Ankommen, Trauung, Feier und Übernachtung zu einem stimmigen Ablauf."
  },
  {
    title: "Ideen konkretisieren",
    text: "Nehmt Inspiration für Atmosphäre, Tischplanung und die besonderen Momente am Wasser mit."
  },
  {
    title: "Fragen besser einordnen",
    text: "Findet klare Antworten und merkt schnell, was ihr bei einer persönlichen Besichtigung vertiefen möchtet."
  }
];

const proofCards = [
  {
    icon: KeyRound,
    step: "01",
    title: "Kurz eintragen",
    text:
      "Gebt eure Kontaktdaten einmal ein. So bleibt die Hochzeitsmappe persönlich geschützt."
  },
  {
    icon: BookOpenCheck,
    step: "02",
    title: "Sofort online eintauchen",
    text:
      "Direkt nach dem Absenden öffnet sich die vollständige Mappe im Browser – ohne Download oder Dateianhang."
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Später wiederkommen",
    text:
      "Euer persönlicher Link kommt zusätzlich per E-Mail und bringt euch wieder in den geschützten Online-Guide."
  }
];

const guideChapters = ["Ankommen am See", "Trauung & Tagesablauf", "Feiern & Übernachten"];

export const metadata: Metadata = {
  title: "Online-Hochzeitsmappe",
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
        url: imageLibrary.mappeCover.src,
        alt: imageLibrary.mappeCover.alt
      }
    ]
  }
};

function GuideKicker() {
  return (
    <div className="mappe-stars">
      <Sparkles aria-hidden="true" size={18} />
      <span>Einblick · Inspiration · Planung</span>
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
        description="Persönliche Online-Hochzeitsmappe der Seebühne: Location, Ablauf, Ideen und wichtige Fragen für euren Planungsstart."
        breadcrumbs={[
          { name: "Startseite", path: "/" },
          { name: "Hochzeitsmappe", path: "/hochzeitsmappe" }
        ]}
      />
      <section className="mappe-hero">
        <div className="section-inner mappe-hero-intro">
          <GuideKicker />
          <h1>Eure Online-Hochzeitsmappe</h1>
          <p className="mappe-subtitle">
            Entdeckt euren möglichen Hochzeitstag am See – Kapitel für Kapitel.
          </p>
          <span className="mappe-label">Kostenlos · persönlich · direkt im Browser</span>
          <p>
            Die Mappe führt euch durch das Landgut, macht Abläufe greifbar und zeigt,
            wie sich eure Hochzeit hier anfühlen kann. Einmal kurz eintragen – danach
            öffnet sich euer persönlicher Online-Guide sofort.
          </p>
          <div className="hero-actions mappe-actions">
            <a className="button primary" href="#mappe-form">
              <BookOpenCheck aria-hidden="true" size={18} />
              <span>Persönlichen Zugang öffnen</span>
            </a>
            <a className="button secondary" href="#mappe-inhalte">
              <ArrowRight aria-hidden="true" size={18} />
              <span>Das erwartet euch</span>
            </a>
          </div>
        </div>
      </section>

      <section className="mappe-overview-section" id="mappe-inhalte">
        <div className="section-inner mappe-overview-grid">
          <div className="mappe-cover-stage">
            <div className="mappe-browser-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <small>landgut-seebuehne.de</small>
            </div>
            <div className="mappe-guide-visual">
              <Image
                className="mappe-cover-image"
                src={cover.src}
                alt={cover.alt}
                fill
                fetchPriority="high"
                preload
                quality={72}
                sizes="(max-width: 920px) 90vw, 620px"
              />
              <div className="mappe-guide-shade" aria-hidden="true" />
              <div className="mappe-guide-title">
                <span>Die Hochzeitsmappe der Seebühne</span>
                <strong>Ein Ort für euer eigenes Märchen.</strong>
              </div>
            </div>
            <div className="mappe-guide-chapters" aria-label="Beispielkapitel der Online-Hochzeitsmappe">
              {guideChapters.map((chapter, index) => (
                <span key={chapter}>
                  <small>0{index + 1}</small>
                  {chapter}
                </span>
              ))}
            </div>
          </div>
          <div className="mappe-benefit-panel">
            <p className="eyebrow dark">Euer Online-Guide</p>
            <h2>Mehr als Informationen: ein erster Rundgang durch euren Tag.</h2>
            <ul className="mappe-benefit-list">
              {mappeBenefits.map((benefit) => (
                <li key={benefit.title}>
                  <Check aria-hidden="true" size={19} />
                  <span>
                    <strong>{benefit.title}</strong>
                    {benefit.text}
                  </span>
                </li>
              ))}
            </ul>
            <a className="button primary" href="#mappe-form">
              <BookOpenCheck aria-hidden="true" size={18} />
              <span>Online-Hochzeitsmappe öffnen</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section-band mappe-proof-section">
        <div className="section-inner">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow dark">So funktioniert der Zugang</p>
              <h2>Von der Landingpage direkt in eure Hochzeitsmappe.</h2>
            </div>
            <p>
              Kein Medienbruch und kein Warten auf eine Datei: Nach dem kurzen Formular
              lest ihr direkt dort weiter, wo eure Planung beginnt.
            </p>
          </div>
          <div className="mappe-proof-grid">
            {proofCards.map((card) => {
              const Icon = card.icon;

              return (
                <article className="mappe-proof-card" key={card.title}>
                  <div className="mappe-proof-card-head">
                    <Icon aria-hidden="true" size={24} />
                    <span>{card.step}</span>
                  </div>
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
            <p className="eyebrow">Euer persönlicher Zugang</p>
            <h2>Einmal eintragen. Sofort am See eintauchen.</h2>
            <p>
              Öffnet die kostenlose Online-Hochzeitsmappe direkt im Browser. Entdeckt
              Bilder, Ablaufideen und Antworten in eurem Tempo – und bringt eure
              wichtigsten Fragen einfach zur Besichtigung mit.
            </p>
            <div className="mappe-mini-proof" aria-label="Inhalte der Hochzeitsmappe">
              <span>Persönlicher Online-Zugang</span>
              <span>Sofort im Browser</span>
              <span>Später per Link erreichbar</span>
            </div>
          </div>

          <HochzeitsmappeForm />
        </div>
      </section>
    </article>
  );
}
