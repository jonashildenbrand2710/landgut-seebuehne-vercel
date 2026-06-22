import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { ArticleBlock } from "@/data/articles";

export type ArticleRelatedLink = {
  href: string;
  label: string;
  description: string;
};

export function ArticleMarkdown({ blocks }: { blocks: ArticleBlock[] }) {
  return <div className="article-body">{blocks.map((block, index) => renderBlock(block, index))}</div>;
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
      <ul key={`list-${index}`}>
        {block.items.map((item) => (
          <li key={item}>{renderInline(item)}</li>
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
