import type { Metadata } from "next";
import {
  FamilyStory,
  ImpressionSection,
  LeadMagnetSection,
  MiniGallery,
  PersonalCta,
  ProblemSolution,
  PromiseGrid,
  ProofStrip,
  Testimonials,
  WeddingBundles
} from "@/components/LandingSections";
import { FAQ } from "@/components/PageSections";
import { Hero } from "@/components/Hero";
import { landingFaq } from "@/data/landing";
import { indexPage } from "@/data/site";

export const metadata: Metadata = {
  title: indexPage.title,
  description: indexPage.description,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/"
  }
};

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow={indexPage.heroEyebrow}
        title={indexPage.heroTitle}
        text={indexPage.heroText}
        imageKey={indexPage.imageKey}
        primaryCta={indexPage.primaryCta}
        secondaryCta={indexPage.secondaryCta}
      />
      <ProofStrip />
      <LeadMagnetSection />
      <PromiseGrid />
      <ImpressionSection />
      <WeddingBundles />
      <FamilyStory />
      <Testimonials />
      <ProblemSolution />
      <MiniGallery />
      <PersonalCta />
      <FAQ items={landingFaq} />
    </>
  );
}
