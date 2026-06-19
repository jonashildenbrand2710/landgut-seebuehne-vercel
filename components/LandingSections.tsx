import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Heart,
  Mail,
  MapPin,
  Sparkles,
  Star,
  Users,
  XCircle
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
  landingProof,
  landingTeamLeaders,
  landingTestimonials
} from "@/data/landing";
import { imageLibrary, siteConfig } from "@/data/site";

function InternalCta({
  href,
  children,
  variant = "primary"
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link className={`button ${variant}`} href={href}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={18} />
    </Link>
  );
}

export function ProofStrip() {
  return (
    <section className="proof-strip" aria-label="Bewertung und Social Proof">
      <div className="section-inner proof-inner">
        <div className="proof-copy">
          <Star aria-hidden="true" size={22} />
          <span>Bestbewertet von Paaren und als Hochzeitsort am See gesucht.</span>
        </div>
        <dl className="proof-stats">
          {landingProof.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.value}</dt>
              <dd>{stat.label}</dd>
            </div>
          ))}
        </dl>
        <div className="mention-row" aria-label="Wiederkehrende Einstiegspunkte">
          {landingProof.mentions.map((mention) => (
            <span key={mention}>{mention}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HeroImageStrip() {
  const images = [
    imageLibrary.coupleDock,
    imageLibrary.gettingReady,
    imageLibrary.location,
    imageLibrary.mappeCover,
    imageLibrary.ceremony
  ];

  return (
    <section className="hero-image-strip" aria-label="Impressionen der Hauptseite">
      <div className="hero-strip-inner">
        {images.map((image) => (
          <div className="hero-strip-item" key={image.src}>
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 680px) 40vw, 19vw" />
          </div>
        ))}
      </div>
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
            <InternalCta href="/hochzeitsmappe">Hochzeitsmappe downloaden</InternalCta>
          </div>
          <span className="lead-logo">SB</span>
        </div>
      </div>
    </section>
  );
}

export function PromiseGrid() {
  return (
    <section className="section-band promise-section">
      <div className="section-inner">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow dark">6 Versprechen</p>
            <h2>Warum Paare nicht nur den See buchen, sondern den sicheren Rahmen.</h2>
          </div>
          <p>
            Schönheit zieht euch an. Sicherheit, Begleitung und klare Abläufe
            sorgen dafür, dass ihr euch am Hochzeitstag wirklich fallen lassen könnt.
          </p>
        </div>
        <div className="promise-grid">
          {landingPromises.map((promise) => (
            <article className="promise-card" key={promise.number}>
              <span>{promise.number}</span>
              <h3>{promise.title}</h3>
              <p>{promise.text}</p>
            </article>
          ))}
        </div>
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
        sizes="100vw"
      />
      <div className="availability-shade" />
      <div className="section-inner availability-content">
        <p className="eyebrow">{landingAvailability.eyebrow}</p>
        <h2>{landingAvailability.title}</h2>
        <p>{landingAvailability.text}</p>
        <Link className="button primary light" href="/termin-buchen">
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
            <p className="eyebrow dark">Wedding Bundles</p>
            <h2>Drei Einstiege, ein Ziel: euer Hochzeitstag soll zusammenpassen.</h2>
          </div>
          <p>
            Die Pakete geben eine erste Richtung. Welche Leistungen und welcher
            Rahmen zu euch passen, klären wir persönlich.
          </p>
        </div>
        <div className="bundle-grid">
          {landingBundles.map((bundle) => (
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
              <Link className="bundle-link" href="/termin-buchen">
                <span>{bundle.cta}</span>
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </article>
          ))}
        </div>
        <div className="center-actions">
          <InternalCta href="/termin-buchen">Leistungen persönlich klären</InternalCta>
        </div>
      </div>
    </section>
  );
}

export function FamilyStory() {
  return (
    <section className="family-section">
      <div className="section-inner family-story-layout">
        <div className="landing-copy family-intro">
          <p className="eyebrow dark">{landingFamily.eyebrow}</p>
          <h2>{landingFamily.title}</h2>
          <p>{landingFamily.text}</p>
          <div className="family-facts" aria-label="Besonderheiten des Familienunternehmens">
            <div>
              <Heart aria-hidden="true" size={20} />
              <span>aus echter Familiengeschichte entstanden</span>
            </div>
            <div>
              <Users aria-hidden="true" size={20} />
              <span>persönliche Ansprechpartner statt anonymer Eventfläche</span>
            </div>
            <div>
              <MapPin aria-hidden="true" size={20} />
              <span>See, Gärten und Gastgebererfahrung in Mittelfranken</span>
            </div>
          </div>
          <div className="inline-actions">
            <InternalCta href="/uber-uns">Mehr über uns</InternalCta>
            <InternalCta href="/location" variant="secondary">
              Location ansehen
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
          <p className="eyebrow dark">Teamleader - Landgut Seebühne</p>
          <h2>Preise & Details persönlich anfragen</h2>
          <p>
            Diese Ansprechpartner führen euch vom ersten Kontakt über die Einordnung
            eures Rahmens bis zu den nächsten sinnvollen Schritten.
          </p>
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
                    sizes="(max-width: 680px) 50vw, (max-width: 1100px) 25vw, 260px"
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
                <span>{testimonial.context}</span>
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
      <div className="section-inner problem-solution-grid">
        <div>
          <p className="eyebrow dark">Warnsignale</p>
          <h2>Was bei der Locationsuche später Stress macht.</h2>
          <ul className="signal-list">
            {landingProblemSigns.map((item) => (
              <li key={item}>
                <XCircle aria-hidden="true" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow dark">Antwort der Seebühne</p>
          <h2>Acht Punkte, die euren Tag tragfähiger machen.</h2>
          <ul className="advantage-list">
            {landingAdvantages.map((item) => (
              <li key={item}>
                <Check aria-hidden="true" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
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
                    sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw"
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

export function PersonalCta() {
  return (
    <section className="personal-cta-section">
      <div className="section-inner personal-cta-inner">
        <div>
          <Sparkles aria-hidden="true" size={24} />
          <p className="eyebrow">Offene Fragen</p>
          <h2>Lasst uns erst den Rahmen sortieren. Dann wird Besichtigung sinnvoll.</h2>
          <p>
            Erzählt uns Datum, Gästezahl und eure grobe Vorstellung. Im Gespräch
            klären wir, ob die Seebühne grundsätzlich passt und welcher nächste
            Schritt euch wirklich weiterbringt.
          </p>
        </div>
        <div className="personal-cta-actions">
          <Link className="button primary light" href="/termin-buchen">
            <CalendarDays aria-hidden="true" size={18} />
            <span>Erstgespräch sichern</span>
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
