import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, FileText } from "lucide-react";
import { CTASection } from "@/components/PageSections";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Journal | Landgut Seebühne",
  description:
    "Das Journal des Landgut Seebühne mit ruhiger Orientierung zu Location-Entscheidung, freier Trauung, Outdoor-Hochzeit und Planung am See.",
  alternates: {
    canonical: "/blog"
  },
  openGraph: {
    title: "Journal | Landgut Seebühne",
    description:
      "Erfahrungsbasierte Artikel aus der Perspektive einer Hochzeitslocation am See.",
    url: "/blog"
  }
};

export default function BlogIndexPage() {
  const featuredArticle =
    articles.find((article) => article.slug === "freie-trauung-am-see") ?? articles[0];

  if (!featuredArticle) return null;

  const listedArticles = articles.filter((article) => article.slug !== featuredArticle.slug);
  const articleList = listedArticles.length ? listedArticles : articles;

  return (
    <>
      <section className="subpage-hero">
        <div className="section-inner">
          <p className="eyebrow dark">Journal</p>
          <h1>Orientierung für Paare, die ihre Hochzeit am See bewusst planen.</h1>
          <p>
            Artikel aus der Perspektive einer Hochzeitslocation: ruhig, konkret und
            nah an den Entscheidungen, die euren Tag wirklich prägen.
          </p>
          <div className="inline-actions">
            <Link className="button primary" href="/termin-buchen">
              <CalendarDays aria-hidden="true" size={18} />
              <span>Erstgespräch anfragen</span>
            </Link>
            <Link className="button secondary" href="/hochzeitsmappe">
              <FileText aria-hidden="true" size={18} />
              <span>Hochzeitsmappe ansehen</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-inner split">
          <div>
            <p className="eyebrow dark">Empfohlen</p>
            <h2>Ein guter Einstieg, wenn ihr draußen heiraten möchtet.</h2>
          </div>
          <article className="article-card">
            <p>{featuredArticle.pillar}</p>
            <h2>{featuredArticle.title}</h2>
            <span>{featuredArticle.description}</span>
            <Link href={`/blog/${featuredArticle.slug}`}>
              Artikel lesen <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </article>
        </div>
      </section>

      <section className="section-band muted">
        <div className="section-inner">
          <p className="eyebrow dark">Alle Artikel</p>
          <h2>In Ruhe weiterlesen.</h2>
          <div className="article-grid">
            {articleList.map((article) => (
              <article className="article-card" key={article.slug}>
                <p>{article.pillar}</p>
                <h2>{article.title}</h2>
                <span>{article.description}</span>
                <Link href={`/blog/${article.slug}`}>
                  Artikel lesen <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
