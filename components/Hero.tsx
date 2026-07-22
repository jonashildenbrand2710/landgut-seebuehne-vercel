import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, CalendarDays, Check, FileText, Heart, MapPin, Star } from "lucide-react";
import { imageLibrary, siteConfig } from "@/data/site";

export type HeroVariant = "standard" | "cinematic" | "editorial" | "collage";

type HeroProps = {
  eyebrow: string;
  title: string;
  text: string;
  imageKey: keyof typeof imageLibrary;
  primaryCta?: string;
  secondaryCta?: string;
  allowDirectActions?: boolean;
  variant?: HeroVariant;
  draftLabel?: string;
  priority?: boolean;
  proof?: {
    label: string;
    mentions: string[];
  };
};

type ImageKey = keyof typeof imageLibrary;

const imageFocus: Partial<Record<ImageKey, string>> = {
  ceremony: "50% 46%",
  coupleDock: "50% 45%",
  coupleFence: "50% 42%",
  gettingReady: "50% 22%",
  hero: "50% 56%",
  lake: "50% 50%",
  location: "50% 46%",
  mappeCover: "50% 50%",
  team: "50% 25%",
  teamChristine: "50% 24%",
  teamJohanna: "50% 24%",
  teamJonas: "50% 22%",
  teamOliver: "50% 25%"
};

function focalPoint(imageKey: ImageKey) {
  return imageFocus[imageKey] ?? "center center";
}

function ctaHref(label?: string, allowDirectActions = false) {
  if (!label) return "/termin-buchen";
  const normalized = label.toLowerCase();
  if (normalized.includes("mappe")) return "/hochzeitsmappe";
  if (allowDirectActions && normalized.includes("kalender")) return siteConfig.bookingUrl;
  if (allowDirectActions && (normalized.includes("e-mail") || normalized.includes("mail"))) {
    return `mailto:${siteConfig.email}`;
  }
  return "/termin-buchen";
}

const heroFacts = [
  { icon: CalendarDays, label: "Eine Hochzeit pro Tag" },
  { icon: MapPin, label: "See, Garten und Landhaus" },
  { icon: Check, label: "Plan B mitgedacht" }
];

const collageImages: { imageKey: ImageKey; className: string }[] = [
  { imageKey: "coupleFence", className: "hero-collage-item hero-collage-item-large" },
  { imageKey: "gettingReady", className: "hero-collage-item hero-collage-item-portrait" },
  { imageKey: "location", className: "hero-collage-item hero-collage-item-small" }
];

function HeroActions({
  primaryCta,
  secondaryCta,
  allowDirectActions
}: {
  primaryCta?: string;
  secondaryCta?: string;
  allowDirectActions: boolean;
}) {
  if (!primaryCta && !secondaryCta) return null;

  return (
    <div className="hero-actions">
      {primaryCta ? (
        <Link
          className="button primary cta-botanical cta-tone-sage"
          href={ctaHref(primaryCta, allowDirectActions)}
        >
          <span>{primaryCta}</span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      ) : null}
      {secondaryCta ? (
        <Link
          className="button secondary cta-botanical cta-tone-mauve"
          href={ctaHref(secondaryCta, allowDirectActions)}
        >
          <FileText aria-hidden="true" size={18} />
          <span>{secondaryCta}</span>
        </Link>
      ) : null}
    </div>
  );
}

function HeroProof({ proof }: { proof: NonNullable<HeroProps["proof"]> }) {
  return (
    <div className="hero-proof">
      <div className="hero-rating">
        <span>{proof.label}</span>
        <span aria-label="5 von 5 Sternen" role="img">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star aria-hidden="true" fill="currentColor" key={index} size={14} />
          ))}
        </span>
      </div>
      <div className="hero-mentions" aria-label="Bekannt aus">
        <span className="hero-mentions-label">Bekannt aus:</span>
        <div
          className="hero-mentions-viewport"
          tabIndex={0}
          aria-label="Laufband bekannter Plattformen, bei Fokus pausiert"
        >
          <div className="hero-mentions-track">
            <div className="hero-mentions-group">
              {proof.mentions.map((mention) => (
                <strong key={mention}>{mention}</strong>
              ))}
            </div>
            <div aria-hidden="true" className="hero-mentions-group">
              {proof.mentions.map((mention) => (
                <strong key={`${mention}-duplicate`}>{mention}</strong>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroFactBar() {
  return (
    <div className="hero-fact-bar" aria-label="Rahmen der Hochzeitslocation">
      {heroFacts.map(({ icon: Icon, label }) => (
        <div className="hero-fact" key={label}>
          <Icon aria-hidden="true" size={18} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function HeroCollage() {
  return (
    <div className="hero-collage-stack" aria-label="Impressionen vom Landgut Seebühne">
      {collageImages.map(({ imageKey, className }) => {
        const image = imageLibrary[imageKey];

        return (
          <div className={className} key={image.src}>
            <Image
              src={image.src}
              alt=""
              fill
              quality={72}
              sizes="(max-width: 920px) 44vw, 300px"
              style={{ objectPosition: focalPoint(imageKey) }}
              aria-hidden="true"
            />
          </div>
        );
      })}
      <div className="hero-collage-note">
        <Heart aria-hidden="true" size={18} />
        <span>Naturnah feiern, klar begleitet.</span>
      </div>
    </div>
  );
}

export function Hero({
  eyebrow,
  title,
  text,
  imageKey,
  primaryCta,
  secondaryCta,
  allowDirectActions = false,
  variant = "standard",
  draftLabel,
  priority = true,
  proof
}: HeroProps) {
  const image = imageLibrary[imageKey];
  const imageStyle = { "--hero-image-position": focalPoint(imageKey) } as CSSProperties;
  const className = ["hero", `hero-${variant}`, draftLabel ? "hero-draft-preview" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={className}>
      <Image
        className="hero-image"
        src={image.src}
        alt={image.alt}
        fill
        fetchPriority={priority ? "high" : "auto"}
        preload={priority}
        loading={priority ? "eager" : "lazy"}
        quality={75}
        // Im hohen Mobile-Hero braucht das 3:2-Motiv etwa 1,5x Viewport-Hoehe als Slotbreite.
        sizes="(max-width: 680px) 150vh, 100vw"
        style={imageStyle}
      />
      <div className="hero-shade" />
      <div className="hero-content">
        <div className="hero-copy">
          {draftLabel ? <p className="hero-draft-label">{draftLabel}</p> : null}
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{text}</p>
          <HeroActions
            primaryCta={primaryCta}
            secondaryCta={secondaryCta}
            allowDirectActions={allowDirectActions}
          />
        </div>
        {variant === "collage" ? <HeroCollage /> : null}
        {variant === "editorial" ? <HeroFactBar /> : null}
        {proof ? <HeroProof proof={proof} /> : null}
      </div>
    </section>
  );
}
