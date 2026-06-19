import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleFinalCta, ArticleMarkdown } from "@/components/MarkdownArticle";
import { FAQ } from "@/components/PageSections";
import { articles, getArticle } from "@/data/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: article.metaTitle,
    description: article.description,
    alternates: {
      canonical: `/blog/${article.slug}`
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `/blog/${article.slug}`
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <article className="article-page">
        <div className="article-header">
          <Link href="/blog">
            <ArrowLeft aria-hidden="true" size={16} />
            Journal
          </Link>
          <p className="eyebrow dark">{article.pillar}</p>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <div className="article-meta" aria-label="Artikelinformationen">
            <span>{article.readingTime}</span>
            <span>{article.wordCount.toLocaleString("de-DE")} Wörter</span>
          </div>
        </div>
        <ArticleMarkdown blocks={article.blocks} />
      </article>
      <ArticleFinalCta blocks={article.ctaBlocks} />
      <FAQ items={article.faq} />
    </>
  );
}
