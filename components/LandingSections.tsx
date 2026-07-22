import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  Download,
  Heart,
  MapPin,
  Plus,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import {
  landingAdvantages,
  landingAvailability,
  landingBundles,
  landingFamily,
  landingGallery,
  landingLeadMagnet,
  landingProblemSigns,
  landingPromises,
  landingTeamLeaders,
  landingTestimonials
} from "@/data/landing";
import { AutoScrollCarousel } from "@/components/AutoScrollCarousel";
import { BrandLogo } from "@/components/BrandLogo";
import { articles } from "@/data/articles";
import { imageLibrary } from "@/data/site";

type ImageKey = keyof typeof imageLibrary;

const imageFocus: Partial<Record<ImageKey, string>> = {
  ceremony: "50% 46%",
  coupleDock: "50% 45%",
  coupleFence: "50% 42%",
  gettingReady: "50% 22%",
  hero: "50% 56%",
  lake: "50% 50%",
  location: "50% 46%",
  team: "50% 25%",
  teamChristine: "50% 24%",
  teamJohanna: "50% 24%",
  teamJonas: "50% 22%",
  teamOliver: "50% 25%"
};

function focalPoint(imageKey: ImageKey) {
  return imageFocus[imageKey] ?? "center center";
}

const BACKGROUND_IMAGE_QUALITY = 60;
const CONTENT_IMAGE_QUALITY = 70;
const BUNDLE_CTA_TONES = ["cream", "sage", "mauve"] as const;

function InternalCta({
  href,
  children,
  variant = "primary",
  tone,
  icon = "arrow",
  className
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  tone?: "sage" | "cream" | "mauve";
  icon?: "arrow" | "download" | "none";
  className?: string;
}) {
  const resolvedTone = tone ?? (variant === "secondary" ? "mauve" : "sage");

  return (
    <Link
      className={`button ${variant} cta-botanical cta-tone-${resolvedTone}${className ? ` ${className}` : ""}`}
      href={href}
    >
      <span>{children}</span>
      {icon === "download" ? <Download aria-hidden="true" size={18} /> : null}
      {icon === "arrow" ? <ArrowRight aria-hidden="true" size={18} /> : null}
    </Link>
  );
}

export function HeroImageStrip() {
  const images: ImageKey[] = [
    "coupleFence",
    "coupleDock",
    "lake",
    "location",
    "gettingReady",
    "ceremony",
    "hero"
  ];

  return (
    <section className="hero-image-strip" aria-label="Impressionen der Hauptseite">
      <AutoScrollCarousel
        ariaLabel="Hochzeitsimpressionen – horizontal wisch- oder scrollbar"
        className="auto-scroll-carousel hero-strip-inner"
        intervalMs={4000}
        scrollDurationMs={1500}
      >
        {images.map((imageKey) => {
          const image = imageLibrary[imageKey];

          return (
            <div className="hero-strip-item" data-carousel-slide key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                quality={CONTENT_IMAGE_QUALITY}
                sizes="(max-width: 680px) 78vw, (max-width: 1100px) 42vw, 24vw"
                style={{ objectPosition: focalPoint(imageKey) }}
              />
            </div>
          );
        })}
      </AutoScrollCarousel>
    </section>
  );
}

export function LeadMagnetSection() {
  const image = imageLibrary.availability;

  return (
    <section className="lead-magnet-section">
      <Image
        className="lead-magnet-image"
        src={image.src}
        alt=""
        fill
        quality={BACKGROUND_IMAGE_QUALITY}
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="lead-magnet-shade" />
      <div className="section-inner lead-magnet-inner">
        <div className="landing-copy centered">
          <p className="eyebrow dark">{landingLeadMagnet.eyebrow}</p>
          <h2>{landingLeadMagnet.title}</h2>
          <p>{landingLeadMagnet.text}</p>
          <div className="inline-actions">
            <InternalCta
              className="lead-magnet-cta"
              href="/hochzeitsmappe"
              icon="download"
              tone="cream"
            >
              Hochzeitsmappe laden
            </InternalCta>
          </div>
          <BrandLogo className="brand-logo brand-logo-lead" decorative variant="light" />
        </div>
      </div>
    </section>
  );
}

export function PromiseGrid() {
  const images: ImageKey[] = [
    "ceremony",
    "coupleFence",
    "coupleDock",
    "lake",
    "gettingReady",
    "location"
  ];

  return (
    <section className="promise-section">
      <Image
        className="promise-bg"
        src={imageLibrary.lake.src}
        alt=""
        fill
        quality={BACKGROUND_IMAGE_QUALITY}
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="promise-shade" />
      <div className="section-inner promise-layout">
        <div className="promise-copy">
          <p className="eyebrow">6 Versprechen</p>
          <h2>Sechs Versprechen für eure perfekte Hochzeit</h2>
          <p>Genießt sorgenfrei - eure Traumhochzeit ist in besten Händen.</p>
          <div className="promise-list">
            {landingPromises.map((promise) => (
              <article className="promise-card" key={promise.number}>
                <span>{promise.number}</span>
                <div>
                  <h3>{promise.title}</h3>
                  <p>{promise.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <AutoScrollCarousel
          ariaLabel="Hochzeitsimpressionen der sechs Versprechen – horizontal wisch- oder scrollbar"
          className="auto-scroll-carousel promise-visual-grid"
          intervalMs={4000}
          scrollDurationMs={1500}
        >
          {images.map((imageKey) => {
            const image = imageLibrary[imageKey];

            return (
              <div className="promise-visual" data-carousel-slide key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  quality={CONTENT_IMAGE_QUALITY}
                  sizes="(max-width: 920px) 80vw, 22vw"
                  style={{ objectPosition: focalPoint(imageKey) }}
                />
              </div>
            );
          })}
        </AutoScrollCarousel>
      </div>
    </section>
  );
}

export function ImpressionSection() {
  const image = imageLibrary.availability;

  return (
    <section className="availability-section">
      <Image
        className="availability-image"
        src={image.src}
        alt={image.alt}
        fill
        quality={BACKGROUND_IMAGE_QUALITY}
        sizes="100vw"
      />
      <div className="availability-shade" />
      <div className="section-inner availability-content">
        <p className="eyebrow">{landingAvailability.eyebrow}</p>
        <h2>{landingAvailability.title}</h2>
        <p>{landingAvailability.text}</p>
        <Link
          className="button primary light cta-botanical cta-tone-mauve"
          href="/termin-buchen"
        >
          <span>{landingAvailability.cta}</span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}

export function WeddingBundles() {
  return (
    <section className="section-band bundle-section">
      <div className="section-inner">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow dark">Wedding - Bundles - Selection</p>
            <h2>
              Entdeckt unsere <span className="no-break">Location-Pakete</span>
            </h2>
          </div>
          <p>
            Für mehr Details zu unseren Leistungen und Möglichkeiten bucht ihr
            direkt einen unverbindlichen Besichtigungstermin bei uns vor Ort.
          </p>
        </div>
        <div className="bundle-grid">
          {landingBundles.map((bundle, index) => (
            <article className={bundle.badge ? "bundle-card featured" : "bundle-card"} key={bundle.title}>
              {bundle.badge ? <span className="bundle-badge">{bundle.badge}</span> : null}
              <p>{bundle.kicker}</p>
              <h3>{bundle.title}</h3>
              <span>{bundle.text}</span>
              <ul>
                {bundle.points.map((point) => (
                  <li key={point}>
                    <Check aria-hidden="true" size={17} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Link
                className={`button primary bundle-link cta-botanical cta-tone-${BUNDLE_CTA_TONES[index] ?? "sage"}`}
                href="/termin-buchen"
              >
                <span>{bundle.cta}</span>
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </article>
          ))}
        </div>
        <div className="center-actions bundle-compare-actions">
          <InternalCta href="/termin-buchen" tone="mauve">
            Pakete persönlich vergleichen
          </InternalCta>
        </div>
      </div>
    </section>
  );
}

export function FamilyStory() {
  return (
    <section className="family-section">
      <div className="family-mobile-prelude" aria-hidden="true">
        <div className="family-mobile-monogram">
          <BrandLogo className="family-mobile-monogram-logo" decorative />
        </div>
      </div>
      <div className="section-inner family-story-layout">
        <div className="landing-copy family-intro">
          <p className="eyebrow dark">{landingFamily.eyebrow}</p>
          <h2>{landingFamily.title}</h2>
          <p>{landingFamily.text}</p>
          <div className="family-facts" aria-label="Besonderheiten des Familienunternehmens">
            <div>
              <Heart aria-hidden="true" size={24} />
              <span>aus echter Familiengeschichte entstanden</span>
            </div>
            <div>
              <Users aria-hidden="true" size={24} />
              <span>persönliche Ansprechpartner statt anonymer Eventfläche</span>
            </div>
            <div>
              <MapPin aria-hidden="true" size={24} />
              <span>See, Gärten und Gastgebererfahrung in Mittelfranken</span>
            </div>
          </div>
          <div className="inline-actions">
            <InternalCta href="/termin-buchen">Landgut persönlich erleben</InternalCta>
            <InternalCta href="/termin-buchen" variant="secondary">
              Freie Termine prüfen
            </InternalCta>
          </div>
        </div>
        <div className="family-story-cards">
          {landingFamily.cards.map((card, index) => (
            <article className="family-story-card" key={card.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="section-inner teamleader-block">
        <div className="teamleader-heading">
          <p className="eyebrow dark">Teamleader - Landgut Seebühne:</p>
        </div>
        <div className="teamleader-grid">
          {landingTeamLeaders.map((leader) => {
            const image = imageLibrary[leader.imageKey];

            return (
              <article className="teamleader-card" key={leader.name}>
                <div className="teamleader-photo">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    quality={CONTENT_IMAGE_QUALITY}
                    sizes="(max-width: 680px) 50vw, (max-width: 1100px) 25vw, 260px"
                    style={{ objectPosition: focalPoint(leader.imageKey) }}
                  />
                </div>
                <div className="teamleader-caption">
                  <h3>{leader.name}</h3>
                  <p>{leader.role}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="teamleader-actions">
          <InternalCta href="/termin-buchen" tone="cream">
            Persönlich kennenlernen
          </InternalCta>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="section-band testimonial-section">
      <div className="section-inner">
        <div className="testimonial-heading">
          <p className="eyebrow">Paarstimmen</p>
          <h2>Was unsere Paare sagen</h2>
          <p>Für mehr Rezensionen schaut gerne auf Google vorbei.</p>
        </div>
        <div className="testimonial-grid">
          {landingTestimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.quote}>
              <div className="testimonial-stars" aria-label="5 von 5 Sternen">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star aria-hidden="true" fill="currentColor" key={star} size={15} />
                ))}
              </div>
              <blockquote>{testimonial.quote}</blockquote>
              <p>
                <strong>{testimonial.name}</strong>
                {testimonial.context ? <span>{testimonial.context}</span> : null}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProblemSolution() {
  return (
    <section className="problem-solution-section">
      <div className="section-inner problem-solution-heading">
        <p className="eyebrow">{landingProblemSigns.eyebrow}</p>
        <h2>{landingProblemSigns.title}</h2>
        <p>{landingProblemSigns.text}</p>
      </div>

      <div className="section-inner warning-funnel-grid">
        <div className="warning-accordion-list">
          {landingProblemSigns.items.map((item, index) => (
            <details className="warning-item" key={item.title} name="warning-signs" open={index === 0}>
              <summary>
                <span className="warning-number">{index + 1}</span>
                <span className="warning-summary-copy">
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
                <Plus className="warning-plus" aria-hidden="true" size={19} />
              </summary>
              <div className="warning-body">
                <p className="warning-question">{item.question}</p>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>
                      <AlertTriangle aria-hidden="true" size={15} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <p className="warning-result">
                  <strong>{item.resultLabel}</strong>
                  <span>{item.result}</span>
                </p>
              </div>
            </details>
          ))}
        </div>

        <aside className="warning-solution-card" aria-label="Antwort der Seebühne">
          <p className="eyebrow">Problem - Lösung</p>
          <h3>8 Lösungen für typische Hochzeits-Location-Probleme</h3>
          <p>
            Warum ihr bei uns nicht die typischen Location-Probleme haben werdet
            & was uns von anderen unterscheidet.
          </p>
          <ol className="solution-list">
            {landingAdvantages.map((item) => (
              <li key={item.title}>
                <Check aria-hidden="true" size={17} />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
              </li>
            ))}
          </ol>
          <Link
            className="button primary light cta-botanical cta-tone-cream"
            href="/termin-buchen"
          >
            <span>{landingProblemSigns.cta}</span>
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </aside>
      </div>
    </section>
  );
}

export function MiniGallery() {
  return (
    <section className="section-band gallery-section">
      <div className="section-inner">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow dark">Galerie</p>
            <h2>Ein erster Blick auf See, Garten und Gastgeber.</h2>
          </div>
          <p>
            Ein erster Blick auf See, Garten, Innenräume, Getting Ready und die
            Menschen, die euren Tag begleiten.
          </p>
        </div>
        <div className="mini-gallery-grid">
          {landingGallery.map((item) => {
            const image = imageLibrary[item.imageKey];
            return (
              <article className="gallery-item" key={item.title}>
                <div>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    quality={CONTENT_IMAGE_QUALITY}
                    sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    style={{ objectPosition: focalPoint(item.imageKey) }}
                  />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function JournalTeaser() {
  const featured = articles.slice(0, 3);

  return (
    <section className="section-band journal-section">
      <div className="section-inner">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow dark">Hochzeits-Journal</p>
            <h2>Lest euch in Ruhe ein</h2>
          </div>
          <p>
            Manche Fragen klären sich am besten im Gespräch, andere beim Lesen.
            Im Hochzeits-Journal teilen wir unsere Erfahrung aus vielen
            Hochzeitsjahren am See - ehrlich, konkret und ohne Zeitdruck.
          </p>
        </div>
        <div className="article-grid journal-grid">
          {featured.map((article) => (
            <article className="article-card" key={article.slug}>
              <p>{article.pillar}</p>
              <h3>{article.title}</h3>
              <span>{article.description}</span>
              <small>{article.readingTime}</small>
              <Link href={`/hochzeitsratgeber/${article.slug}`}>
                Artikel lesen <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </article>
          ))}
        </div>
        <div className="center-actions">
          <InternalCta href="/hochzeitsratgeber" variant="secondary">
            Alle Beiträge im Journal entdecken
          </InternalCta>
        </div>
      </div>
    </section>
  );
}

export function PersonalCta() {
  return (
    <section className="personal-cta-section">
      <div className="section-inner personal-cta-inner">
        <div>
          <Sparkles aria-hidden="true" size={24} />
          <p className="eyebrow">Offene Fragen</p>
          <h2>Erlebt die Seebühne persönlich bei einer Besichtigung.</h2>
          <p>
            Wählt direkt einen freien Termin im Kalender. Vor Ort zeigen wir euch
            See, Garten und Landhaus und nehmen uns Zeit für eure Fragen.
          </p>
        </div>
        <div className="personal-cta-actions">
          <Link
            className="button primary light cta-botanical cta-tone-cream"
            href="/termin-buchen"
          >
            <CalendarDays aria-hidden="true" size={18} />
            <span>Wunschdatum prüfen</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
