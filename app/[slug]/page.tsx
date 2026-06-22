import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTASection, FAQ, SectionBand } from "@/components/PageSections";
import { Hero } from "@/components/Hero";
import { PageJsonLd } from "@/components/StructuredData";
import { getPageBySlug, isPublicSitePageSlug, sitePages } from "@/data/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return sitePages
    .filter((page) => page.slug !== "hochzeitsmappe")
    .map((page) => ({ slug: page.slug }));
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
    robots: page.noindex || !isPublicSitePageSlug(page.slug)
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
  const isIndexablePage = !page.noindex && isPublicSitePageSlug(page.slug);

  return (
    <>
      {isIndexablePage ? (
        <PageJsonLd
          path={`/${page.slug}`}
          title={page.title}
          description={page.description}
          breadcrumbs={[
            { name: "Startseite", path: "/" },
            { name: page.navTitle ?? page.title, path: `/${page.slug}` }
          ]}
          faq={page.faqs}
        />
      ) : null}
      <Hero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        text={page.heroText}
        imageKey={page.imageKey}
        primaryCta={page.primaryCta}
        secondaryCta={page.secondaryCta}
        allowDirectActions={page.slug === "termin-buchen"}
      />
      {page.sections.map((section, index) => (
        <SectionBand section={section} index={index} key={section.title} />
      ))}
      <FAQ items={page.faqs} />
      {!["datenschutz", "impressum"].includes(page.slug) ? (
        <CTASection allowDirectActions={page.slug === "termin-buchen"} />
      ) : null}
    </>
  );
}
