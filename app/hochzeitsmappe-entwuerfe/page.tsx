import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, MapPin, Waves } from "lucide-react";
import {
  hochzeitsmappeConcepts,
  type HochzeitsmappeConcept
} from "@/data/hochzeitsmappe-concepts";
import {
  newPrimaryImages,
  retainedOriginalCoupleImages
} from "@/data/hochzeitsmappe-images";
import styles from "./page.module.css";

type ConceptId = HochzeitsmappeConcept["id"];

type ConceptPageProps = {
  searchParams: Promise<{ auswahl?: string }>;
};

const themeClasses: Record<ConceptId, string> = {
  dornrose: styles.themeDornrose,
  seeufer: styles.themeSeeufer,
  editorial: styles.themeEditorial
};

const auditPoints = [
  {
    label: "Bewahren",
    text: "Echte Paarbilder, glaubwürdige Stimmen, konkrete Informationen und den See als emotionales Leitmotiv."
  },
  {
    label: "Neu ordnen",
    text: "Weniger Kapitelwechsel, größere Lesetypografie und ein Spannungsbogen von Vision über Orientierung bis zum Kennenlernen."
  },
  {
    label: "Reduzieren",
    text: "Schreibschrift nur als seltener Akzent; keine gelben Markierungen, Clipart-Linien oder kleinteiligen Fotocollagen."
  }
];

const locationFacts = [
  "Nur eine Hochzeit pro Tag",
  "Trauung direkt am See",
  "Feiern im Landhaus",
  "Übernachten auf dem Gelände"
];

export const metadata: Metadata = {
  title: "Designvorschau Hochzeitsmappe",
  description: "Interne Designvorschau für die neue Hochzeitsmappe des Landgut Seebühne.",
  robots: {
    index: false,
    follow: false
  }
};

function Palette({ concept }: { concept: HochzeitsmappeConcept }) {
  return (
    <div className={styles.palette} aria-label={`Farbwelt ${concept.title}`}>
      {concept.palette.map((color) => (
        <span className={styles.swatchItem} key={color.name}>
          <span
            className={styles.swatch}
            style={{ "--swatch": color.value } as CSSProperties}
          />
          <span>{color.name}</span>
        </span>
      ))}
    </div>
  );
}

function SeatingPlan({ concept }: { concept: HochzeitsmappeConcept }) {
  const tables = [
    { x: 145, y: 105, label: "1" },
    { x: 330, y: 105, label: "2" },
    { x: 515, y: 105, label: "3" },
    { x: 237, y: 255, label: "4" },
    { x: 422, y: 255, label: "5" }
  ];

  return (
    <div className={styles.seatingCard}>
      <div className={styles.seatingHeading}>
        <span>Bestuhlungsbeispiel</span>
        <strong>80–100 Gäste</strong>
      </div>
      <svg
        className={styles.seatingSvg}
        viewBox="0 0 660 390"
        role="img"
        aria-labelledby={`${concept.id}-seat-title ${concept.id}-seat-desc`}
      >
        <title id={`${concept.id}-seat-title`}>Aquarellierter Sitzplan</title>
        <desc id={`${concept.id}-seat-desc`}>
          Beispielhafte Anordnung von fünf runden Gästetischen, Brauttisch und Tanzfläche.
        </desc>
        <path className={styles.roomWash} d="M34 31H626V348H34z" />
        <path className={styles.danceFloor} d="M240 150h180v78H240z" />
        <text className={styles.planLabel} x="330" y="194" textAnchor="middle">
          Tanzfläche
        </text>
        <path className={styles.headTable} d="M245 310h170v34H245z" />
        <text className={styles.planLabel} x="330" y="333" textAnchor="middle">
          Brauttisch
        </text>
        {tables.map((table) => (
          <g key={table.label} transform={`translate(${table.x} ${table.y})`}>
            <circle className={styles.tableWash} r="43" />
            <circle className={styles.tableLine} r="31" />
            <text className={styles.tableNumber} y="6" textAnchor="middle">
              {table.label}
            </text>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const radians = (angle * Math.PI) / 180;
              return (
                <circle
                  className={styles.seat}
                  cx={Math.cos(radians) * 49}
                  cy={Math.sin(radians) * 49}
                  key={angle}
                  r="6"
                />
              );
            })}
          </g>
        ))}
        <path className={styles.vineLine} d="M55 330c34-38 67-42 99-20s61 15 82-6" />
        <path className={styles.vineLine} d="M604 50c-36 18-51 43-46 76s-8 57-39 73" />
      </svg>
      <p>Als editierbare Illustration gedacht – nicht mehr als Screenshot eines Grundrisses.</p>
    </div>
  );
}

function PhotoStorySpread() {
  const ceremony = newPrimaryImages[0];
  const table = newPrimaryImages[2];
  const crew = newPrimaryImages[5];
  const crewAtWork = newPrimaryImages[7];

  return (
    <article className={`${styles.spread} ${styles.photoStorySpread}`}>
      <div className={styles.photoStoryCopy}>
        <span className={styles.chapterLabel}>Der Ort wird lebendig</span>
        <h3>Schöne Räume sind der Anfang. Menschen machen den Unterschied.</h3>
        <p>
          Die neue Bildwelt zeigt nicht nur das fertige Fest. Sie lässt auch die Crew sichtbar werden,
          die vorbereitet, anrichtet, begleitet und den Tag für euch leicht wirken lässt.
        </p>
      </div>
      <figure className={`${styles.storyImage} ${styles.storyImageCeremony}`}>
        <Image
          src={ceremony.src}
          alt={ceremony.alt}
          fill
          quality={85}
          sizes="(max-width: 820px) 90vw, 720px"
        />
        <figcaption>{ceremony.label}</figcaption>
      </figure>
      <figure className={`${styles.storyImage} ${styles.storyImageTable}`}>
        <Image
          src={table.src}
          alt={table.alt}
          fill
          quality={75}
          sizes="(max-width: 820px) 44vw, 330px"
        />
        <figcaption>{table.label}</figcaption>
      </figure>
      <figure className={`${styles.storyImage} ${styles.storyImageCrew}`}>
        <Image
          src={crewAtWork.src}
          alt={crewAtWork.alt}
          fill
          quality={75}
          sizes="(max-width: 820px) 44vw, 330px"
        />
        <figcaption>{crewAtWork.label}</figcaption>
      </figure>
      <figure className={`${styles.storyImage} ${styles.storyImageWork}`}>
        <Image
          src={crew.src}
          alt={crew.alt}
          fill
          quality={75}
          sizes="(max-width: 820px) 90vw, 420px"
        />
        <figcaption>{crew.label}</figcaption>
      </figure>
      <span className={styles.pageMarker}>Neue Bildwelt · Ort, Details und Crew</span>
    </article>
  );
}

function ImageCuration() {
  return (
    <section className={styles.curation}>
      <div className={styles.curationInner}>
        <span className={styles.kicker}>Verbindliche Bildlogik</span>
        <h2>Fünf echte Paarmomente bleiben. Der Rest wird neu erzählt.</h2>
        <p className={styles.curationLead}>
          Diese fünf Motive aus der Original-PDF bleiben als emotionale Anker erhalten. Location,
          Ausstattung, Zimmer, Dekoration und Service werden dagegen vorrangig mit dem neuen Ordner
          bebildert. So bleibt die Geschichte glaubwürdig, ohne optisch im alten PDF stehen zu bleiben.
        </p>

        <div className={styles.retainedGrid}>
          {retainedOriginalCoupleImages.map((image, index) => (
            <article className={styles.retainedCard} key={image.src}>
              <div className={styles.retainedImage}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  quality={75}
                  sizes="(max-width: 620px) 90vw, (max-width: 1050px) 44vw, 240px"
                />
                <span>{index + 1}</span>
              </div>
              <div>
                <small>{image.source}</small>
                <h3>{image.label}</h3>
                <p>{image.role}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.newImageBoard}>
          <div className={styles.newImageCopy}>
            <span className={styles.chapterLabel}>Primär aus dem neuen Ordner</span>
            <h3>Mehr Ort. Mehr Atmosphäre. Und endlich sichtbar: die Crew.</h3>
            <p>
              Die ausgewählten neuen Bilder zeigen Vorbereitung und Gastgeberschaft statt nur fertige
              Dekoration. Das schafft Nähe und stärkt die Conversion, weil Interessentinnen nicht nur
              Räume, sondern Betreuung sehen.
            </p>
          </div>
          {newPrimaryImages.slice(0, 8).map((image, index) => (
            <figure className={styles.newImageTile} key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                quality={75}
                sizes="(max-width: 620px) 44vw, (max-width: 1050px) 30vw, 230px"
              />
              <figcaption>
                <span>{index >= 5 ? "Crew" : "Neu"}</span>
                {image.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConceptPreview({
  concept,
  selected
}: {
  concept: HochzeitsmappeConcept;
  selected: boolean;
}) {
  return (
    <section
      className={`${styles.concept} ${themeClasses[concept.id]} ${selected ? styles.selected : ""}`}
      id={concept.id}
    >
      <header className={styles.conceptHeader}>
        <div className={styles.conceptNumber}>{concept.number}</div>
        <div className={styles.conceptIntro}>
          <div className={styles.verdictRow}>
            <span>{concept.verdict}</span>
            {selected ? <strong>Ausgewählt</strong> : null}
          </div>
          <h2>{concept.title}</h2>
          <p>{concept.description}</p>
        </div>
        <Palette concept={concept} />
        <Link
          className={styles.selectButton}
          href={`/hochzeitsmappe-entwuerfe?auswahl=${concept.id}#entscheidung`}
          aria-current={selected ? "true" : undefined}
        >
          {selected ? <Check aria-hidden="true" size={18} /> : null}
          <span>{selected ? "Richtung gewählt" : "Diese Richtung wählen"}</span>
        </Link>
      </header>

      <div className={styles.bookPreview}>
        <article className={`${styles.spread} ${styles.coverSpread}`}>
          <Image
            className={styles.heroImage}
            src="/images/site/hero-brautpaar-steg-am-see.jpg"
            alt="Brautpaar auf einem Steg am See unter den Weiden des Landgut Seebühne"
            fill
            loading={concept.id === "dornrose" ? "eager" : "lazy"}
            quality={85}
            sizes="(max-width: 900px) 94vw, 1200px"
          />
          <div className={styles.heroShade} />
          <div className={styles.coverCopy}>
            <span>{concept.coverEyebrow}</span>
            <h3>{concept.coverTitle}</h3>
            <p>{concept.coverSubtitle}</p>
          </div>
          <div className={styles.coverSeal} aria-hidden="true">
            <Waves size={22} />
            <span>Am See</span>
          </div>
          <span className={styles.pageMarker}>Visionsleitbild · echte Fotografie</span>
        </article>

        <article className={`${styles.spread} ${styles.chapterSpread}`}>
          <Image
            className={styles.artBackdrop}
            src={concept.art}
            alt=""
            fill
            quality={75}
            sizes="(max-width: 900px) 94vw, 1200px"
            aria-hidden="true"
          />
          <div className={styles.chapterCopy}>
            <span className={styles.chapterLabel}>{concept.chapterLabel}</span>
            <h3>{concept.chapterTitle}</h3>
            <p className={styles.chapterLead}>{concept.chapterLead}</p>
            <p>{concept.chapterBody}</p>
          </div>
          <blockquote>{concept.quote}</blockquote>
          <aside className={styles.factCard}>
            <span>Im Klartext</span>
            <ul>
              {locationFacts.map((fact) => (
                <li key={fact}>
                  <Check aria-hidden="true" size={15} />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </aside>
          <span className={styles.pageMarker}>Poetischer Auftakt + klare Orientierung</span>
        </article>

        <PhotoStorySpread />

        <article className={`${styles.spread} ${styles.planningSpread}`}>
          <div className={styles.mapColumn}>
            <span className={styles.chapterLabel}>Orientierung auf einen Blick</span>
            <h3>{concept.mapTitle}</h3>
            <div className={styles.mapFrame}>
              <Image
                src="/images/hochzeitsmappe-concepts/lageplan-aquarell-referenz.jpg"
                alt="Aquarellierter Lageplan des Landgut Seebühne mit See, Landhaus, Marktplatz und Gästehäusern"
                fill
                quality={85}
                sizes="(max-width: 900px) 88vw, 720px"
              />
            </div>
            <div className={styles.mapLegend}>
              <span><b>1</b> Empfang</span>
              <span><b>2</b> Landhaus</span>
              <span><b>7</b> Marktplatz</span>
              <span><b>8</b> Seeterrasse</span>
            </div>
          </div>
          <div className={styles.seatingColumn}>
            <span className={styles.chapterLabel}>Gemeinsam feiern</span>
            <h3>{concept.seatingTitle}</h3>
            <SeatingPlan concept={concept} />
          </div>
          <span className={styles.pageMarker}>Lage- und Sitzplan in einer Bildsprache</span>
        </article>

        <article className={`${styles.spread} ${styles.ctaSpread}`}>
          <div className={styles.ctaVisual}>
            <Image
              className={styles.ctaImage}
              src="/images/hochzeitsmappe-curated/original-paar-wildblumen.jpg"
              alt="Brautpaar in einer sommerlichen Wildblumenwiese"
              fill
              quality={75}
              sizes="(max-width: 820px) 94vw, 48vw"
            />
          </div>
          <div className={styles.ctaCopy}>
            <span>{concept.ctaEyebrow}</span>
            <h3>{concept.ctaTitle}</h3>
            <p>{concept.ctaBody}</p>
            <span className={styles.mockButton}>
              Kennenlerngespräch planen
              <ArrowRight aria-hidden="true" size={17} />
            </span>
          </div>
          <span className={styles.pageMarker}>Conversion-Ziel · natürlich aus der Geschichte heraus</span>
        </article>
      </div>
    </section>
  );
}

export default async function HochzeitsmappeEntwuerfePage({ searchParams }: ConceptPageProps) {
  const params = await searchParams;
  const selected = hochzeitsmappeConcepts.some((concept) => concept.id === params.auswahl)
    ? (params.auswahl as ConceptId)
    : undefined;
  const selectedConcept = hochzeitsmappeConcepts.find((concept) => concept.id === selected);

  return (
    <article className={styles.page}>
      <section className={styles.intro}>
        <div className={styles.introGlow} aria-hidden="true" />
        <div className={styles.introInner}>
          <span className={styles.kicker}>Konzeptvorschau · Hochzeitsmappe 2026</span>
          <h1>Drei Wege in dasselbe Märchen am See.</h1>
          <p className={styles.introLead}>
            Alle Richtungen bewahren den echten Hero mit Paar, Steg, See und Weiden. Sie unterscheiden
            sich nur darin, wie deutlich die Märchenwelt erzählt wird – von Dornröschen-romantisch bis
            modern-editorial.
          </p>
          <nav className={styles.quickNav} aria-label="Designrichtungen">
            {hochzeitsmappeConcepts.map((concept) => (
              <a href={`#${concept.id}`} key={concept.id}>
                <b>{concept.number}</b>
                <span>{concept.title}</span>
                <ArrowDown aria-hidden="true" size={16} />
              </a>
            ))}
          </nav>
          <div className={styles.auditGrid}>
            {auditPoints.map((point) => (
              <article key={point.label}>
                <span>{point.label}</span>
                <p>{point.text}</p>
              </article>
            ))}
          </div>
          <p className={styles.scopeNote}>
            Diese Vorschau zeigt bewusst Cover, Erzählton, Lageplan, Sitzplan und Abschluss-CTA. Die
            vollständige Mappe wird erst nach der Stilentscheidung ausgearbeitet.
          </p>
        </div>
      </section>

      {hochzeitsmappeConcepts.map((concept) => (
        <ConceptPreview concept={concept} key={concept.id} selected={concept.id === selected} />
      ))}

      <ImageCuration />

      <section className={styles.decision} id="entscheidung">
        <MapPin aria-hidden="true" size={28} />
        <span className={styles.kicker}>Entscheidungspunkt</span>
        <h2>
          {selectedConcept
            ? `${selectedConcept.title} ist vorgemerkt.`
            : "Welche Welt soll die vollständige Mappe tragen?"}
        </h2>
        <p>
          {selectedConcept
            ? "Die Auswahl ist nur in dieser Vorschau markiert. Als nächster Schritt können wir genau diese Richtung verfeinern oder gezielt Elemente einer zweiten Richtung hineinmischen."
            : "Wählt A, B oder C. Danach werden Inhaltsarchitektur, echte Bildauswahl, Aquarell-Umwandlungen und alle editierbaren HTML-Seiten in dieser Richtung ausgearbeitet."}
        </p>
        <div className={styles.decisionLinks}>
          {hochzeitsmappeConcepts.map((concept) => (
            <Link
              className={concept.id === selected ? styles.activeDecision : ""}
              href={`/hochzeitsmappe-entwuerfe?auswahl=${concept.id}#entscheidung`}
              key={concept.id}
            >
              <b>{concept.number}</b>
              <span>{concept.shortTitle}</span>
            </Link>
          ))}
        </div>
        {selected === "dornrose" ? (
          <Link className={styles.openFullConcept} href="/hochzeitsmappe-dornrose">
            Vollständige Dornrose-Fassung öffnen
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        ) : null}
      </section>
    </article>
  );
}
