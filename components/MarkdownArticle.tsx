import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import type { ArticleBlock } from "@/data/articles";

export type ArticleRelatedLink = {
  href: string;
  label: string;
  description: string;
};

export function ArticleMarkdown({ blocks }: { blocks: ArticleBlock[] }) {
  const summaryIndex = blocks.findIndex((block) => block.type === "panel");
  const inlineCtaIndex = summaryIndex >= 0 ? summaryIndex : Math.min(2, blocks.length - 1);

  return (
    <div className="article-body">
      {blocks.map((block, index) => (
        <Fragment key={`${block.type}-${index}`}>
          {renderBlock(block, index)}
          {index === inlineCtaIndex ? <ArticleInlineCta /> : null}
        </Fragment>
      ))}
    </div>
  );
}

function ArticleInlineCta() {
  return (
    <aside className="article-inline-cta" aria-label="Nächster Schritt">
      <div>
        <p className="eyebrow dark">Nächster Schritt</p>
        <p className="article-inline-cta-title">Passt der Rahmen zu eurer Hochzeit?</p>
        <p>
          Im Erstgespräch sortieren wir Datum, Gästezahl und offene Fragen, bevor
          eine Besichtigung sinnvoll geplant wird.
        </p>
      </div>
      <Link className="button primary" href="/termin-buchen">
        <span>Erstgespräch anfragen</span>
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </aside>
  );
}

export function ArticleFinalCta({ blocks }: { blocks: ArticleBlock[] }) {
  if (!blocks.length) return null;

  return (
    <section className="article-final-cta">
      <div>
        <p className="eyebrow dark">Nächster Schritt</p>
        {blocks.map((block, index) => renderBlock(block, index))}
      </div>
      <div className="article-final-cta-actions">
        <Link className="button primary" href="/termin-buchen">
          <span>Erstgespräch anfragen</span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}

export function ArticleRelatedLinks({ links }: { links: ArticleRelatedLink[] }) {
  if (!links.length) return null;

  return (
    <section className="section-band muted article-related-section">
      <div className="section-inner">
        <p className="eyebrow dark">Weiterführend</p>
        <h2>Passende Seiten zum nächsten Schritt</h2>
        <div className="article-grid">
          {links.map((link) => (
            <article className="article-card" key={link.href}>
              <h3>{link.label}</h3>
              <span>{link.description}</span>
              <Link href={link.href}>
                Seite öffnen <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderBlock(block: ArticleBlock, index: number): ReactNode {
  if (block.type === "heading") {
    const Heading = block.level === 2 ? "h2" : "h3";
    return <Heading key={`${block.text}-${index}`}>{renderInline(block.text)}</Heading>;
  }

  if (block.type === "paragraph") {
    return <p key={`${block.text}-${index}`}>{renderInline(block.text)}</p>;
  }

  if (block.type === "blockquote") {
    return <blockquote key={`${block.text}-${index}`}>{renderInline(block.text)}</blockquote>;
  }

  if (block.type === "list") {
    return (
      <ul className="article-list" key={`list-${index}`}>
        {block.items.map((item, itemIndex) => (
          <li className="article-list-item" key={`${item}-${itemIndex}`}>
            <span className="article-list-marker" aria-hidden="true">
              {String(itemIndex + 1).padStart(2, "0")}
            </span>
            <span className="article-list-text">{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="article-summary" key={`summary-${index}`}>
      <p className="eyebrow dark">{block.eyebrow}</p>
      {block.blocks.map((child, childIndex) => renderBlock(child, childIndex))}
    </section>
  );
}

function renderInline(value: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value))) {
    if (match.index > lastIndex) {
      parts.push(value.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={`${token}-${match.index}`}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={`${token}-${match.index}`}>{token.slice(1, -1)}</code>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts;
}
