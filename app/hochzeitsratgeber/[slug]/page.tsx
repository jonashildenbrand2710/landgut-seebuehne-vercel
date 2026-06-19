import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
      canonical: `/hochzeitsratgeber/${article.slug}`
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `/hochzeitsratgeber/${article.slug}`
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
          <Link href="/hochzeitsratgeber">
            <ArrowLeft aria-hidden="true" size={16} />
            Ratgeber
          </Link>
          <p className="eyebrow dark">{article.pillar}</p>
          <h1>{article.title}</h1>
          <p>{article.intro}</p>
        </div>
        <div className="article-body">
          {article.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
      <FAQ items={article.faq.map((item) => ({ question: item.question, answer: item.answer }))} />
    </>
  );
}
