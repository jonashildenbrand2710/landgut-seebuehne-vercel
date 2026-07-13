import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  ArticleFinalCta,
  ArticleMarkdown,
  ArticleRelatedLinks,
  type ArticleRelatedLink
} from "@/components/MarkdownArticle";
import { FAQ } from "@/components/PageSections";
import { ArticleJsonLd } from "@/components/StructuredData";
import { articles, getArticle } from "@/data/articles";
import { pageMetadata } from "@/lib/page-metadata";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const defaultRelatedLinks: ArticleRelatedLink[] = [
  {
    href: "/hochzeitsmappe",
    label: "Hochzeitsmappe",
    description: "PDF-Guide mit Überblick, Ablaufideen und Fragen für euren Planungsstart."
  },
  {
    href: "/besichtigung",
    label: "Besichtigung",
    description: "Warum die Besichtigung nach einem ersten Rahmencheck hilfreicher wird."
  },
  {
    href: "/termin-buchen",
    label: "Kennenlerngespräch",
    description: "Datum, Gästezahl, Rahmen und offene Fragen persönlich einordnen."
  }
];

const relatedLinksBySlug: Record<string, ArticleRelatedLink[]> = {
  "freie-trauung-am-see": [
    defaultRelatedLinks[0],
    defaultRelatedLinks[1],
    defaultRelatedLinks[2]
  ],
  "hochzeitslocation-besichtigen-fragen": [
    {
      href: "/besichtigung",
      label: "Besichtigung",
      description: "Der passende Ablauf vom Kennenlerngespräch zur Besichtigung vor Ort."
    },
    defaultRelatedLinks[1],
    defaultRelatedLinks[2]
  ],
  "getting-ready-vor-ort": [
    {
      href: "/getting-ready",
      label: "Getting Ready vor Ort",
      description: "Ruhiger in den Hochzeitstag starten und unnötige Wege vermeiden."
    },
    defaultRelatedLinks[0],
    defaultRelatedLinks[2]
  ],
  "plan-b-regen-gartenhochzeit": [
    defaultRelatedLinks[1],
    defaultRelatedLinks[0],
    defaultRelatedLinks[2]
  ],
  "hochzeitslocation-aus-gaestesicht": [
    defaultRelatedLinks[1],
    defaultRelatedLinks[0],
    defaultRelatedLinks[2]
  ],
  "gastgeber-sein-am-hochzeitstag": [
    defaultRelatedLinks[0],
    defaultRelatedLinks[1],
    defaultRelatedLinks[2]
  ],
  "eine-hochzeit-pro-tag-exklusivitaet": [
    defaultRelatedLinks[0],
    defaultRelatedLinks[1],
    defaultRelatedLinks[2]
  ],
  "hochzeitslocation-vergleichen-ohne-nur-auf-preise-zu-schauen": defaultRelatedLinks
};

function relatedLinksForArticle(slug: string) {
  return relatedLinksBySlug[slug] ?? defaultRelatedLinks;
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const base = pageMetadata({
    title: article.metaTitle,
    description: article.description,
    path: `/hochzeitsratgeber/${article.slug}`
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      title: article.title,
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const relatedLinks = relatedLinksForArticle(article.slug);

  return (
    <>
      <ArticleJsonLd article={article} />
      <article className="article-page">
        <div className="article-header">
          <Link href="/hochzeitsratgeber">
            <ArrowLeft aria-hidden="true" size={16} />
            Hochzeits-Journal
          </Link>
          <p className="eyebrow dark">{article.pillar}</p>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <div className="article-meta" aria-label="Artikelinformationen">
            <span>{article.readingTime}</span>
            <span>{article.wordCount.toLocaleString("de-DE")} Wörter</span>
            {article.dateModified ? (
              <span>
                Aktualisiert am{" "}
                <time dateTime={article.dateModified}>
                  {new Date(`${article.dateModified}T12:00:00`).toLocaleDateString("de-DE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </time>
              </span>
            ) : null}
          </div>
        </div>
        <ArticleMarkdown blocks={article.blocks} />
      </article>
      <ArticleRelatedLinks links={relatedLinks} />
      <ArticleFinalCta blocks={article.ctaBlocks} />
      <FAQ items={article.faq} />
    </>
  );
}
