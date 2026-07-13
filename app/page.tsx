import type { Metadata } from "next";
import {
  FamilyStory,
  HeroImageStrip,
  ImpressionSection,
  JournalTeaser,
  LeadMagnetSection,
  MiniGallery,
  PersonalCta,
  ProblemSolution,
  PromiseGrid,
  Testimonials,
  WeddingBundles
} from "@/components/LandingSections";
import { FAQ } from "@/components/PageSections";
import { Hero } from "@/components/Hero";
import { PageJsonLd } from "@/components/StructuredData";
import { landingFaq } from "@/data/landing";
import { indexPage } from "@/data/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: indexPage.title,
  description: indexPage.description,
  path: "/"
});

export default function HomePage() {
  return (
    <>
      <PageJsonLd
        path="/"
        title={indexPage.title}
        description={indexPage.description}
        breadcrumbs={[{ name: "Startseite", path: "/" }]}
        faq={landingFaq}
      />
      <Hero
        eyebrow={indexPage.heroEyebrow}
        title={indexPage.heroTitle}
        text={indexPage.heroText}
        imageKey={indexPage.imageKey}
        primaryCta={indexPage.primaryCta}
        variant="cinematic"
        proof={{
          label: "Von 120 Paaren bestbewertet",
          mentions: ["Hochzeit.de", "Bridebook", "Instagram", "Google"]
        }}
      />
      <HeroImageStrip />
      <LeadMagnetSection />
      <PromiseGrid />
      <ImpressionSection />
      <WeddingBundles />
      <FamilyStory />
      <Testimonials />
      <ProblemSolution />
      <MiniGallery />
      <JournalTeaser />
      <PersonalCta />
      <FAQ items={landingFaq} />
    </>
  );
}
