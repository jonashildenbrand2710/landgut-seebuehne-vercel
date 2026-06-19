import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { imageLibrary, siteConfig } from "@/data/site";

type HeroProps = {
  eyebrow: string;
  title: string;
  text: string;
  imageKey: keyof typeof imageLibrary;
  primaryCta?: string;
  secondaryCta?: string;
};

function ctaHref(label?: string) {
  if (!label) return "/termin-buchen";
  const normalized = label.toLowerCase();
  if (normalized.includes("mappe")) return "/hochzeitsmappe";
  if (normalized.includes("e-mail") || normalized.includes("mail")) return `mailto:${siteConfig.email}`;
  if (normalized.includes("ratgeber")) return "/hochzeitsratgeber/freie-trauung-am-see";
  if (normalized.includes("location")) return "/location";
  if (normalized.includes("kontakt")) return "/kontaktformular";
  if (normalized.includes("kalender")) return siteConfig.bookingUrl;
  return "/termin-buchen";
}

export function Hero({ eyebrow, title, text, imageKey, primaryCta, secondaryCta }: HeroProps) {
  const image = imageLibrary[imageKey];

  return (
    <section className="hero">
      <Image
        className="hero-image"
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="hero-actions">
          {primaryCta ? (
            <Link className="button primary" href={ctaHref(primaryCta)}>
              <span>{primaryCta}</span>
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          ) : null}
          {secondaryCta ? (
            <Link className="button secondary" href={ctaHref(secondaryCta)}>
              <FileText aria-hidden="true" size={18} />
              <span>{secondaryCta}</span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
