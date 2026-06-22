import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Star } from "lucide-react";
import { imageLibrary, siteConfig } from "@/data/site";

type HeroProps = {
  eyebrow: string;
  title: string;
  text: string;
  imageKey: keyof typeof imageLibrary;
  primaryCta?: string;
  secondaryCta?: string;
  allowDirectActions?: boolean;
  proof?: {
    label: string;
    mentions: string[];
  };
};

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

export function Hero({
  eyebrow,
  title,
  text,
  imageKey,
  primaryCta,
  secondaryCta,
  allowDirectActions = false,
  proof
}: HeroProps) {
  const image = imageLibrary[imageKey];

  return (
    <section className="hero">
      <Image
        className="hero-image"
        src={image.src}
        alt={image.alt}
        fill
        fetchPriority="high"
        preload
        loading="eager"
        quality={72}
        sizes="100vw"
      />
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="hero-actions">
          {primaryCta ? (
            <Link className="button primary" href={ctaHref(primaryCta, allowDirectActions)}>
              <span>{primaryCta}</span>
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          ) : null}
          {secondaryCta ? (
            <Link className="button secondary" href={ctaHref(secondaryCta, allowDirectActions)}>
              <FileText aria-hidden="true" size={18} />
              <span>{secondaryCta}</span>
            </Link>
          ) : null}
        </div>
        {proof ? (
          <div className="hero-proof">
            <div className="hero-rating">
              <span>{proof.label}</span>
              <span aria-label="Bewertung">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star aria-hidden="true" fill="currentColor" key={index} size={14} />
                ))}
              </span>
            </div>
            <div className="hero-mentions" aria-label="Bekannt aus">
              <span className="hero-mentions-label">Bekannt aus:</span>
              <div className="hero-mentions-viewport">
                <div className="hero-mentions-track">
                  {proof.mentions.map((mention) => (
                    <strong key={mention}>{mention}</strong>
                  ))}
                  {proof.mentions.map((mention) => (
                    <strong aria-hidden="true" key={`${mention}-duplicate`}>
                      {mention}
                    </strong>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
