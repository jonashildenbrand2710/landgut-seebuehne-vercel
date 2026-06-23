import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
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
  const imageStyle = { "--hero-image-position": focalPoint(imageKey) } as CSSProperties;

  return (
    <section className={proof ? "hero hero-with-proof" : "hero"}>
      <Image
        className="hero-image"
        src={image.src}
        alt={image.alt}
        fill
        fetchPriority="high"
        preload
        loading="eager"
        quality={85}
        sizes="(max-width: 680px) 1920px, 100vw"
        style={imageStyle}
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
        ) : null}
      </div>
    </section>
  );
}
