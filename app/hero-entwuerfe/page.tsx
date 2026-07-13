import type { Metadata } from "next";
import { Header, type HeaderVariant } from "@/components/Header";
import { Hero, type HeroVariant } from "@/components/Hero";
import { indexPage } from "@/data/site";

const proof = {
  label: "Von 120 Paaren bestbewertet",
  mentions: ["Hochzeit.de", "Bridebook", "Instagram", "Google"]
};

const heroDrafts: { label: string; variant: Exclude<HeroVariant, "standard"> }[] = [
  { label: "Entwurf A - Cinematic", variant: "cinematic" },
  { label: "Entwurf B - Editorial", variant: "editorial" },
  { label: "Entwurf C - Collage", variant: "collage" }
];

const headerVariants: { label: string; variant: HeaderVariant }[] = [
  { label: "Header A - Verfeinerter Glass (leichtere Milchglas)", variant: "glass-refined" },
  { label: "Header B - Floating Islands (dezente Glass-Pills)", variant: "floating" },
  { label: "Header C - Scroll-Morph (transparent → Glas beim Scrollen)", variant: "scroll-morph" }
];

export const metadata: Metadata = {
  title: "Hero-Entwürfe",
  description: "Interne Entwurfsseite fuer Varianten der Startseiten-Hero-Section.",
  robots: {
    index: false,
    follow: false
  }
};

export default function HeroDraftsPage() {
  return (
    <>
      {headerVariants.map((headerDraft, index) => {
        const heroDraft = heroDrafts[index % heroDrafts.length];

        return (
          <section key={headerDraft.variant} className="hero-draft-slot">
            <Header variant={headerDraft.variant} static />
            <Hero
              eyebrow={indexPage.heroEyebrow}
              title={indexPage.heroTitle}
              text={indexPage.heroText}
              imageKey={indexPage.imageKey}
              primaryCta={indexPage.primaryCta}
              secondaryCta="Hochzeitsmappe ansehen"
              variant={heroDraft.variant}
              draftLabel={`${headerDraft.label} · ${heroDraft.label}`}
              priority={index === 0}
              proof={proof}
            />
          </section>
        );
      })}
    </>
  );
}
