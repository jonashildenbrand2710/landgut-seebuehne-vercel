import type { Article } from "@/data/articles";
import { imageLibrary, indexPage, siteConfig, type SitePage } from "@/data/site";

type JsonLdNode = Record<string, unknown>;
type BreadcrumbItem = {
  name: string;
  path: string;
};

function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.domain}${normalizedPath}`;
}

function imageUrl(src: string) {
  return absoluteUrl(src);
}

function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c")
      }}
    />
  );
}

function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdNode | null {
  if (items.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

function faqSchema(items?: SitePage["faqs"]): JsonLdNode | null {
  if (!items?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

function compact(nodes: Array<JsonLdNode | null>) {
  return nodes.filter(Boolean) as JsonLdNode[];
}

export function SiteJsonLd() {
  const venueId = absoluteUrl("/#venue");

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            url: absoluteUrl("/"),
            name: siteConfig.displayName,
            inLanguage: "de-DE",
            publisher: {
              "@id": venueId
            }
          },
          {
            "@type": ["LocalBusiness", "EventVenue"],
            "@id": venueId,
            name: siteConfig.displayName,
            url: absoluteUrl("/"),
            description: indexPage.description,
            email: siteConfig.email,
            telephone: siteConfig.phone,
            image: imageUrl(imageLibrary.hero.src),
            logo: imageUrl(siteConfig.brand.logo.src),
            address: {
              "@type": "PostalAddress",
              streetAddress: siteConfig.address.streetAddress,
              postalCode: siteConfig.address.postalCode,
              addressLocality: siteConfig.address.addressLocality,
              addressCountry: siteConfig.address.addressCountry
            },
            areaServed: [
              {
                "@type": "Place",
                name: "Mittelfranken"
              },
              {
                "@type": "Place",
                name: "Franken"
              }
            ]
          }
        ]
      }}
    />
  );
}

export function PageJsonLd({
  path,
  title,
  description,
  breadcrumbs,
  faq
}: {
  path: string;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  faq?: SitePage["faqs"];
}) {
  const nodes = compact([
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${absoluteUrl(path)}#webpage`,
      url: absoluteUrl(path),
      name: title,
      description,
      inLanguage: "de-DE",
      isPartOf: {
        "@id": absoluteUrl("/#website")
      }
    },
    breadcrumbSchema(breadcrumbs),
    faqSchema(faq)
  ]);

  return <JsonLd data={nodes} />;
}

export function ArticleJsonLd({ article }: { article: Article }) {
  const path = `/hochzeitsratgeber/${article.slug}`;
  const nodes = compact([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${absoluteUrl(path)}#article`,
      mainEntityOfPage: {
        "@id": `${absoluteUrl(path)}#webpage`
      },
      headline: article.title,
      description: article.description,
      url: absoluteUrl(path),
      inLanguage: "de-DE",
      author: {
        "@id": absoluteUrl("/#venue")
      },
      publisher: {
        "@id": absoluteUrl("/#venue")
      },
      wordCount: article.wordCount,
      articleSection: article.pillar,
      image: imageUrl(imageLibrary.hero.src)
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${absoluteUrl(path)}#webpage`,
      url: absoluteUrl(path),
      name: article.metaTitle,
      description: article.description,
      inLanguage: "de-DE",
      isPartOf: {
        "@id": absoluteUrl("/#website")
      }
    },
    breadcrumbSchema([
      { name: "Startseite", path: "/" },
      { name: "Hochzeitsratgeber", path: "/hochzeitsratgeber" },
      { name: article.title, path }
    ]),
    faqSchema(article.faq)
  ]);

  return <JsonLd data={nodes} />;
}
