import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Clock3,
  Heart,
  KeyRound,
  MapPin,
  Sparkles,
  UsersRound,
  Waves
} from "lucide-react";
import {
  dornroseChapters,
  dornroseFacts,
  dornroseFaqs,
  dornroseMapLegend
} from "@/data/hochzeitsmappe-dornrose";
import { siteConfig } from "@/data/site";
import {
  HOCHZEITSMAPPE_ACCESS_COOKIE,
  verifyHochzeitsmappeAccessToken
} from "@/lib/hochzeitsmappe-access";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dornrose – Hochzeitsmappe am See",
  description:
    "Der persönliche Online-Hochzeitsbegleiter des Landgut Seebühne mit Inspiration, Ablaufideen und Einblicken in die Location am See.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true
  }
};

const ceremonyImages = [
  {
    src: "/images/hochzeitsmappe-curated/neu-trauplatz-birkenbogen.jpg",
    alt: "Trauplatz mit Birkenbogen, zwei weißen Stühlen und Wasserspiel direkt am See",
    label: "Der Trauplatz am Wasser",
    orientation: "wide"
  },
  {
    src: "/images/hochzeitsmappe-curated/neu-paar-weidenlicht-gruen-creme.png",
    alt: "Brautpaar mit Blumenstrauß im warmen Licht unter den Weiden",
    label: "Ein Blick unter den Weiden",
    orientation: "portrait"
  }
] as const;

const coupleMoments = [
  {
    src: "/images/hochzeitsmappe-curated/original-paar-steg.jpg",
    alt: "Brautpaar gemeinsam auf dem schmalen Steg am See",
    label: "Der Steg",
    text: "Ein paar Minuten nur für euch – und das Wasser wird zur stillen Kulisse."
  },
  {
    src: "/images/hochzeitsmappe-curated/original-paar-pavillon.jpg",
    alt: "Brautpaar küsst sich unter dem hell dekorierten Pavillon",
    label: "Der Pavillon",
    text: "Vertraute Orte bekommen an diesem Tag plötzlich eine ganz eigene Bedeutung."
  }
] as const;

function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left"
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`${styles.sectionHeading} ${align === "center" ? styles.headingCenter : ""}`}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function LeafDivider() {
  return (
    <div className={styles.leafDivider} aria-hidden="true">
      <span />
      <i />
      <b />
      <i />
      <span />
    </div>
  );
}

function FullImage({
  src,
  alt,
  width,
  height,
  className = ""
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <Image
      className={`${styles.fullImage} ${className}`}
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={85}
      sizes="(max-width: 760px) 92vw, (max-width: 1100px) 86vw, 1200px"
    />
  );
}

export default async function HochzeitsmappeDornrosePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(HOCHZEITSMAPPE_ACCESS_COOKIE)?.value;

  if (!verifyHochzeitsmappeAccessToken(accessToken)) {
    redirect("/hochzeitsmappe?status=access-required#mappe-form");
  }

  return (
    <article className={styles.page}>
      <section className={styles.hero} id="vision">
        <div className={styles.heroVisual}>
          <Image
            className={styles.heroImage}
            src="/images/site/hero-brautpaar-steg-am-see.jpg"
            alt="Brautpaar auf dem Steg am See unter den Weiden des Landgut Seebühne"
            fill
            preload
            quality={85}
            sizes="100vw"
          />
          <div className={styles.heroShade} aria-hidden="true" />
        </div>
        <div className={styles.heroCopy}>
          <span className={styles.heroKicker}>Die Hochzeitsmappe der Seebühne</span>
          <h1>Ein Ort für euer eigenes Märchen.</h1>
          <p>Leicht geplant, klar erlebt, für immer erinnert</p>
          <a className={styles.heroJump} href="#auftakt">
            <span>Die Geschichte entdecken</span>
            <ArrowDown aria-hidden="true" size={17} />
          </a>
        </div>
        <div className={styles.heroSeal} aria-hidden="true">
          <Waves size={20} />
          <span>Am See</span>
        </div>
      </section>

      <section className={styles.overture} id="auftakt">
        <Image
          className={styles.overtureArt}
          src="/images/hochzeitsmappe-concepts/dornrose-rahmen.webp"
          alt=""
          fill
          quality={75}
          sizes="100vw"
          aria-hidden="true"
        />
        <div className={styles.overtureCopy}>
          <span className={styles.scriptAccent}>Es war einmal …</span>
          <h2>… eine Hochzeit, die nicht inszeniert wirken musste, um zauberhaft zu sein.</h2>
          <LeafDivider />
          <p>
            Vielleicht beginnt eure Vorstellung mit einem Blick über den See. Mit dem Rascheln der
            Weiden, einem gedeckten Tisch im Landhaus und diesem einen Moment kurz vor dem Ja-Wort.
            Die Seebühne gibt diesen Bildern einen Ort – erwachsen, natürlich und voller leiser
            Dornröschen-Magie.
          </p>
          <p>
            Diese Mappe ist euer Begleiter durch das Landgut: inspirierend wie ein Märchenbuch,
            klar wie ein guter Leitfaden und offen genug für eure eigene Geschichte.
          </p>
        </div>
      </section>

      <nav className={styles.chapterNav} aria-label="Kapitel der Hochzeitsmappe">
        {dornroseChapters.map((chapter) => (
          <a href={`#${chapter.id}`} key={chapter.id}>
            <span>{chapter.number}</span>
            <small>{chapter.eyebrow}</small>
            <strong>{chapter.title}</strong>
            <p>{chapter.text}</p>
          </a>
        ))}
      </nav>

      <section className={styles.factsSection}>
        <div className={styles.sectionInner}>
          <SectionHeading
            eyebrow="Im Klartext"
            title="Das Wichtigste, bevor wir weitererzählen."
            text="Denn ein guter Leitfaden darf träumen – und muss trotzdem die richtigen Antworten geben."
          />
          <div className={styles.factsGrid}>
            {dornroseFacts.map((fact) => (
              <article key={fact.label}>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
                <p>{fact.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ceremonySection} id="tag">
        <div className={styles.sectionInner}>
          <SectionHeading
            eyebrow="Kapitel III · Euer Fest"
            title="Wo das Ja-Wort den See berührt."
            text="Die freie Trauung steht nicht irgendwo am Wasser. Sie wird Teil der Landschaft – persönlich, nah und mit genügend Raum für alles, was euch bewegt."
          />
          <div className={styles.ceremonyGrid}>
            {ceremonyImages.map((image, index) => (
              <figure
                className={`${styles.landscapeFigure} ${
                  image.orientation === "portrait" ? styles.portraitCeremony : styles.wideCeremony
                }`}
                key={image.src}
              >
                <div className={styles.landscapeImage}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    quality={85}
                    sizes="(max-width: 780px) 92vw, 46vw"
                  />
                </div>
                <figcaption>
                  <span>0{index + 1}</span>
                  {image.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.timelineSection}>
        <div className={styles.sectionInner}>
          <SectionHeading
            eyebrow="Vom Ankommen bis zum letzten Tanz"
            title="Ein Tag, der sich wie euer Märchen entfaltet."
            text="Vom ersten Willkommen am See bis zur Feier im Landhaus: Diese Bildreise zeigt einen möglichen Ablauf – als Inspiration für euren Tag, nicht als starre Vorgabe."
            align="center"
          />
          <figure className={styles.dayStory}>
            <div className={styles.dayStoryDesktop}>
              <Image
                src="/images/hochzeitsmappe-concepts/tagesablauf-aquarell.png"
                alt="Aquarellierte Bildreise durch einen Hochzeitstag mit Ankunft, Trauung am See, Sektempfang, Kaffee und Kuchen, Fotoshooting, Abendessen, Tanz und Mitternachtsbuffet"
                width={1536}
                height={1024}
                quality={85}
                sizes="(max-width: 1240px) 94vw, 1200px"
              />
            </div>
            <div className={styles.dayStoryMobile} aria-hidden="true">
              <div className={styles.dayStoryMobilePage}>
                <Image
                  src="/images/hochzeitsmappe-concepts/tagesablauf-aquarell.png"
                  alt=""
                  fill
                  quality={85}
                  sizes="calc(100vw - 32px)"
                />
              </div>
              <div className={styles.dayStoryMobilePage}>
                <Image
                  src="/images/hochzeitsmappe-concepts/tagesablauf-aquarell.png"
                  alt=""
                  fill
                  quality={85}
                  sizes="calc(100vw - 32px)"
                />
              </div>
            </div>
            <figcaption>
              Ein beispielhafter Tagesablauf – die genaue Dramaturgie entsteht später gemeinsam mit
              euch.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.placeSection} id="ort">
        <div className={styles.sectionInner}>
          <SectionHeading
            eyebrow="Kapitel II · Das Landgut"
            title="Viele kleine Welten. Ein gemeinsamer Ort."
            text="Der Lageplan macht sichtbar, was sich am Hochzeitstag fast wie von selbst ergibt: kurze Wege, fließende Übergänge und der See als ruhiger Mittelpunkt."
            align="center"
          />
          <div className={styles.mapLayout}>
            <figure className={styles.mapFigure}>
              <FullImage
                src="/images/hochzeitsmappe-concepts/lageplan-aquarell-referenz.jpg"
                alt="Aquarellierter Lageplan des Landgut Seebühne mit See, Landhaus, Seeterrasse und Gästehäusern"
                width={1280}
                height={847}
              />
              <figcaption>Aquarellierter Lageplan · der See bleibt das Herz des Geländes</figcaption>
            </figure>
            <div className={styles.mapLegend}>
              {dornroseMapLegend.map(([number, label]) => (
                <div key={number}>
                  <span>{number}</span>
                  <p>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.landhausSection}>
        <div className={styles.landhausImage}>
          <Image
            src="/images/hochzeitsmappe-curated/neu-landhaus-tafel.jpg"
            alt="Festlich gedeckte lange Tafel im Landhaus"
            fill
            quality={85}
            sizes="(max-width: 860px) 100vw, 50vw"
          />
        </div>
        <div className={styles.landhausCopy}>
          <span className={styles.eyebrow}>Das Landhaus</span>
          <h2>Ein Raum, der sich nach euch verwandeln darf.</h2>
          <p>
            Lange Tafeln, kleinere Tischgruppen, Tanzfläche oder Fotobox: Die Raumplanung folgt
            eurer Gästezahl und der Atmosphäre, die ihr euch wünscht. Der Charakter des Hauses bleibt
            dabei spürbar – warm, nahbar und erfüllt von einer festlichen Leichtigkeit, die durch den
            Abend trägt.
          </p>
          <ul>
            <li><Check aria-hidden="true" size={17} /> flexible Tischanordnungen</li>
            <li><Check aria-hidden="true" size={17} /> Platz für Tanzfläche und DJ</li>
            <li><Check aria-hidden="true" size={17} /> Buffet, Bars und persönliche Details</li>
          </ul>
        </div>
      </section>

      <section className={styles.seatingSection}>
        <div className={styles.sectionInner}>
          <div className={styles.seatingIntro}>
            <span className={styles.eyebrow}>Zwei Bestuhlungsbeispiele</span>
            <h2>Damit eure Gesellschaft nicht nur Platz findet, sondern zusammenfindet.</h2>
            <p>
              Beide Varianten zeigen den Raum vollständig – vom Eingang über Buffet und Bars bis zur
              Tanzfläche. Sie dienen als verständliche Inspiration und werden später auf eure
              tatsächliche Gästezahl abgestimmt.
            </p>
          </div>
          <figure className={styles.seatingFigure}>
            <FullImage
              src="/images/hochzeitsmappe-concepts/tischplan-aquarell-zwei-varianten.jpg"
              alt="Zwei aquarellierte Tischplanvarianten für das Landhaus mit Tafeln, Tanzfläche, Buffet, Bars und Nebenräumen"
              width={853}
              height={1280}
            />
            <figcaption>
              <span>Variante oben:</span>{" "}
              klassische Bestuhlung mit zusätzlichen Tafeln. <span>Variante unten:</span>{" "}
              Lounge, Fotobox und Stehtische.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.momentsSection}>
        <div className={styles.sectionInner}>
          <SectionHeading
            eyebrow="Nur ihr zwei"
            title="Die kleinen Pausen zwischen den großen Momenten."
            text="Fünf echte Paarmotive aus der bisherigen Mappe bleiben Teil der Geschichte. Sie zeigen keine perfekte Märchenfigur, sondern echte Nähe – und genau darin liegt ihr Zauber."
          />
          <div className={styles.momentsGrid}>
            {coupleMoments.map((moment) => (
              <figure key={moment.src}>
                <div className={styles.momentImage}>
                  <Image
                    src={moment.src}
                    alt={moment.alt}
                    fill
                    quality={85}
                    sizes="(max-width: 760px) 92vw, 46vw"
                  />
                </div>
                <figcaption>
                  <h3>{moment.label}</h3>
                  <p>{moment.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.beforeAfterSection}>
        <div className={styles.sectionInner}>
          <SectionHeading
            eyebrow="Vorher & danach"
            title="Euer Tag beginnt früher als das Ja-Wort – und endet später als der letzte Tanz."
            align="center"
          />
          <div className={styles.beforeAfterGrid}>
            <article>
              <div className={styles.portraitImage}>
                <Image
                  src="/images/site/getting-ready-braut.jpg"
                  alt="Braut beim Getting Ready mit Blumenstrauß"
                  fill
                  quality={85}
                  sizes="(max-width: 760px) 92vw, 42vw"
                />
              </div>
              <div>
                <Sparkles aria-hidden="true" size={21} />
                <span>Getting Ready</span>
                <h3>Ein Morgen voller Vorfreude.</h3>
                <p>In Ruhe ankommen, sich verwandeln und den ersten Augenblick bewusst erleben.</p>
              </div>
            </article>
            <article>
              <div className={styles.portraitImage}>
                <Image
                  src="/images/hochzeitsmappe-curated/neu-gaestezimmer.jpg"
                  alt="Helles Gästezimmer mit Holzbalken und Doppelbett"
                  fill
                  quality={85}
                  sizes="(max-width: 760px) 92vw, 42vw"
                />
              </div>
              <div>
                <KeyRound aria-hidden="true" size={21} />
                <span>Bleiben über Nacht</span>
                <h3>Wenn niemand nach Hause eilen muss.</h3>
                <p>
                  Gästezimmer auf dem Gelände machen das Fest zu einem gemeinsamen Erlebnis mit
                  Family &amp; Friends.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.sectionInner}>
          <div className={styles.teamHeading}>
            <div>
              <span className={styles.eyebrow}>Die Menschen hinter dem Ort</span>
              <h2>Die gute Fee ist bei uns ein ganzes Team.</h2>
            </div>
            <p>
              Die Crew bleibt nicht hinter den Kulissen unsichtbar. Sie bereitet vor, denkt mit und
              sorgt dafür, dass ihr euch am Hochzeitstag nicht wie Gastgeber, sondern wie Gäste auf
              eurem eigenen Fest fühlen könnt.
            </p>
          </div>
          <figure className={styles.teamPortrait}>
            <FullImage
              src="/images/hochzeitsmappe-curated/neu-crew-miteinander.jpg"
              alt="Drei Mitglieder der Seebühnen-Crew vollständig sichtbar im Gespräch im Außenbereich"
              width={2400}
              height={1600}
            />
            <figcaption>
              <UsersRound aria-hidden="true" size={19} />
              <span>Persönlich begleiten heißt: da sein, bevor eine Frage entstehen muss.</span>
            </figcaption>
          </figure>
          <div className={styles.crewWorkGrid}>
            <figure className={styles.crewLandscape}>
              <div>
                <Image
                  src="/images/hochzeitsmappe-curated/neu-crew-bogen.jpg"
                  alt="Mitarbeiterin der Seebühnen-Crew bereitet das Buffet im Außenbereich vor"
                  fill
                  quality={85}
                  sizes="(max-width: 760px) 92vw, 56vw"
                />
              </div>
              <figcaption>Liebe zum Detail, bevor es jemand bemerkt.</figcaption>
            </figure>
            <figure className={styles.crewPortrait}>
              <div>
                <Image
                  src="/images/hochzeitsmappe-curated/neu-crew-buffet.jpg"
                  alt="Mitarbeiterin trägt frische Speisen zum Buffet"
                  fill
                  quality={85}
                  sizes="(max-width: 760px) 92vw, 30vw"
                />
              </div>
              <figcaption>Gastgeben bleibt in Bewegung.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.detailsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.detailsVisual}>
            <div className={styles.detailsPhoto}>
              <Image
                src="/images/hochzeitsmappe-curated/neu-willkommen.jpg"
                alt="Floristisch dekoriertes Willkommensschild auf dem Gelände"
                fill
                quality={85}
                sizes="(max-width: 820px) 92vw, 48vw"
              />
            </div>
            <div className={styles.detailsCopy}>
              <span className={styles.eyebrow}>Eure Handschrift</span>
              <h2>Persönlich wird es in den Details.</h2>
              <p>
                Floristik, Papeterie, Rituale und kleine Überraschungen geben dem Landgut eure
                Handschrift. Die Gestaltung darf romantisch sein, ohne verspielt zu werden – wie eine
                Dornrose, die nicht alles überwuchert, sondern genau die richtigen Stellen rahmt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.sectionInner}>
          <SectionHeading
            eyebrow="Gut zu wissen"
            title="Antworten, die aus Vorfreude Planungssicherheit machen."
            text="Die wichtigsten Fragen für eure erste Einordnung. Konkrete Leistungen und Konditionen besprecht ihr persönlich und passend zu eurem Fest."
          />
          <div className={styles.faqGrid}>
            {dornroseFaqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>
                  <span>{faq.question}</span>
                  <b aria-hidden="true">+</b>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection} id="kennenlernen">
        <div className={styles.ctaImagePane}>
          <FullImage
            src="/images/hochzeitsmappe-curated/original-paar-wildblumen.jpg"
            alt="Brautpaar mit sichtbaren Gesichtern und innigem Ausdruck in einer sommerlichen Wildblumenwiese"
            width={1608}
            height={2400}
          />
        </div>
        <div className={styles.ctaCopyPane}>
          <Image
            className={styles.ctaOrnament}
            src="/images/hochzeitsmappe-concepts/dornrose-abschluss-aquarell.jpg"
            alt=""
            fill
            quality={75}
            sizes="(max-width: 820px) 100vw, 55vw"
            aria-hidden="true"
          />
          <Heart aria-hidden="true" size={25} />
          <span className={styles.eyebrow}>Kapitel IV · Der nächste Schritt</span>
          <h2>Vielleicht beginnt eure Geschichte genau hier.</h2>
          <p>
            Erzählt uns, wie ihr euch euren Tag vorstellt. In einem unverbindlichen Kennenlerngespräch
            finden wir gemeinsam heraus, ob die Seebühne der Ort für euer eigenes Märchen ist.
          </p>
          <ul>
            <li><Clock3 aria-hidden="true" size={17} /> eure Eckpunkte in Ruhe besprechen</li>
            <li><MapPin aria-hidden="true" size={17} /> den passenden Weg zur Besichtigung klären</li>
            <li><Check aria-hidden="true" size={17} /> mit einem klaren nächsten Schritt weitergehen</li>
          </ul>
          <a className={styles.primaryButton} href={siteConfig.bookingUrl}>
            Besichtigung planen
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
      </section>

      <section className={styles.mappeCta} aria-label="Hochzeitsmappe kostenlos sichern">
        <div>
          <span>Euer Hochzeitsbegleiter</span>
          <p>Die schönsten Eindrücke und wichtigsten Antworten – gesammelt für eure Planung.</p>
        </div>
        <Link href="/hochzeitsmappe#mappe-form">
          Hochzeitsmappe kostenlos sichern
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>
    </article>
  );
}
