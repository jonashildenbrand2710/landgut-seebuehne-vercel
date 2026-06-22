import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageJsonLd } from "@/components/StructuredData";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Hochzeitsratgeber",
  description:
    "Ratgeber des Landgut Seebühne zu Location-Entscheidung, freier Trauung, Outdoor-Hochzeit und Planung ohne Stress.",
  alternates: {
    canonical: "/hochzeitsratgeber"
  },
  openGraph: {
    url: "/hochzeitsratgeber"
  }
};

export default function RatgeberIndexPage() {
  return (
    <>
      <PageJsonLd
        path="/hochzeitsratgeber"
        title="Hochzeitsratgeber"
        description="Ratgeber des Landgut Seebühne zu Location-Entscheidung, freier Trauung, Outdoor-Hochzeit und Planung ohne Stress."
        breadcrumbs={[
          { name: "Startseite", path: "/" },
          { name: "Hochzeitsratgeber", path: "/hochzeitsratgeber" }
        ]}
      />
      <section className="subpage-hero">
        <div className="section-inner">
          <p className="eyebrow dark">Hochzeitsratgeber</p>
          <h1>Antworten aus der Perspektive einer erfahrenen Hochzeitslocation.</h1>
          <p>
            Keine beliebigen Hochzeitstipps, sondern Orientierung zu Entscheidungen,
            die euren Ort, euren Ablauf und das Gefühl am Tag wirklich betreffen.
          </p>
        </div>
      </section>
      <section className="section-band">
        <div className="section-inner">
          <div className="article-grid">
            {articles.map((article) => (
              <article className="article-card" key={article.slug}>
                <p>{article.pillar}</p>
                <h2>{article.title}</h2>
                <span>{article.description}</span>
                <small>
                  {article.readingTime} · {article.wordCount.toLocaleString("de-DE")} Wörter
                </small>
                <Link href={`/hochzeitsratgeber/${article.slug}`}>
                  Artikel lesen <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
