import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTASection, FAQ, SectionBand } from "@/components/PageSections";
import { Hero } from "@/components/Hero";
import { getPageBySlug, sitePages } from "@/data/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return sitePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${page.slug}`
    },
    openGraph: {
      url: `/${page.slug}`
    },
    robots: page.noindex
      ? {
          index: false,
          follow: true
        }
      : undefined
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <Hero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        text={page.heroText}
        imageKey={page.imageKey}
        primaryCta={page.primaryCta}
        secondaryCta={page.secondaryCta}
      />
      {page.noindex ? (
        <section className="notice-band">
          <div className="section-inner">
            <p>
              Diese URL bleibt bewusst erreichbar, wird aber aktuell nicht als
              öffentliche SEO-Seite geführt. Vor Livegang bitte Zweck, Tracking
              und mögliche Weiterleitung final prüfen.
            </p>
          </div>
        </section>
      ) : null}
      {page.sections.map((section, index) => (
        <SectionBand section={section} index={index} key={section.title} />
      ))}
      <FAQ items={page.faqs} />
      {page.slug !== "impressum" ? <CTASection /> : null}
    </>
  );
}
