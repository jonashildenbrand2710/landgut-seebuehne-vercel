import fs from "node:fs";
import path from "node:path";

export type ArticleBlock =
  | {
      type: "heading";
      level: 2 | 3;
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "blockquote";
      text: string;
    }
  | {
      type: "list";
      items: string[];
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "panel";
      variant: "summary";
      eyebrow: string;
      blocks: ArticleBlock[];
    };

export type Article = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  pillar: string;
  status: string;
  sourcePath: string;
  excerpt: string;
  wordCount: number;
  readingTime: string;
  datePublished?: string;
  dateModified?: string;
  blocks: ArticleBlock[];
  ctaBlocks: ArticleBlock[];
  faq: { question: string; answer: string }[];
};

type ArticleSection = {
  title: string;
  lines: string[];
};

const articlesDirectory = path.join(process.cwd(), "content", "articles");
const metadataLabels = new Set([
  "Meta Title",
  "Meta Description",
  "Slug",
  "Pillar",
  "Status",
  "Quelle Draft",
  "Quelle Brief"
]);

function readArticleFiles() {
  if (!fs.existsSync(articlesDirectory)) return [];

  return fs
    .readdirSync(articlesDirectory)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => path.join(articlesDirectory, file));
}

function parseArticle(filePath: string): Article {
  const rawMarkdown = fs.readFileSync(filePath, "utf8");
  const publicMarkdown = rawMarkdown.split(/\n## Intern:/)[0].trim();
  const lines = publicMarkdown.split(/\r?\n/);
  const title =
    lines
      .find((line) => line.startsWith("# "))
      ?.replace(/^#\s+/, "")
      .trim() ?? path.basename(filePath, ".md");
  const metadata: Record<string, string> = {};
  const contentStart = lines.findIndex((line) => line.startsWith("## "));

  for (const line of lines.slice(0, contentStart === -1 ? undefined : contentStart)) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) continue;

    const [, label, value] = match;
    if (metadataLabels.has(label.trim())) {
      metadata[label.trim()] = value.trim();
    }
  }

  const sections = splitTopLevelSections(lines.slice(contentStart === -1 ? lines.length : contentStart));
  const ctaSection = sections.find((section) => normalizeHeading(section.title) === "cta");
  const faqSection = sections.find((section) => normalizeHeading(section.title) === "faq");
  const bodySections = sections.filter((section) => {
    const normalized = normalizeHeading(section.title);
    return normalized !== "cta" && normalized !== "faq";
  });
  const blocks = bodySections.flatMap((section) => sectionToBlocks(section));
  const excerpt = firstParagraphFromSection(sections.find((section) => normalizeHeading(section.title) === "einstieg"));
  const slug = metadata.Slug || path.basename(filePath, ".md");
  const wordCount = countWords(publicMarkdown);
  const { datePublished, dateModified } = extractStatusDates(metadata.Status || "");

  return {
    slug,
    title,
    metaTitle: metadata["Meta Title"] || title,
    description: metadata["Meta Description"] || excerpt,
    pillar: metadata.Pillar || "Journal",
    status: metadata.Status || "",
    sourcePath: path.relative(process.cwd(), filePath),
    excerpt,
    wordCount,
    readingTime: readingTime(wordCount),
    datePublished,
    dateModified,
    blocks,
    ctaBlocks: ctaSection ? parseBlocks(ctaSection.lines) : [],
    faq: faqSection ? parseFaq(faqSection.lines) : []
  };
}

function extractStatusDates(status: string) {
  const allDates = [...status.matchAll(/\b(\d{4}-\d{2}-\d{2})\b/g)].map((match) => match[1]).sort();
  const deployDate = status.match(/Deploy[^/]*?(\d{4}-\d{2}-\d{2})/)?.[1];

  return {
    datePublished: deployDate ?? allDates[0],
    dateModified: allDates[allDates.length - 1]
  };
}

function splitTopLevelSections(lines: string[]) {
  const sections: ArticleSection[] = [];
  let current: ArticleSection | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = {
        title: line.replace(/^##\s+/, "").trim(),
        lines: []
      };
      continue;
    }

    if (current) {
      current.lines.push(line);
    }
  }

  if (current) sections.push(current);
  return sections;
}

function sectionToBlocks(section: ArticleSection): ArticleBlock[] {
  const normalized = normalizeHeading(section.title);

  if (normalized === "einstieg") {
    return parseBlocks(section.lines);
  }

  if (normalized === "kurzantwort") {
    return [
      {
        type: "panel",
        variant: "summary",
        eyebrow: "Auf einen Blick",
        blocks: parseBlocks(section.lines)
      }
    ];
  }

  return [
    {
      type: "heading",
      level: 2,
      text: section.title
    },
    ...parseBlocks(section.lines)
  ];
}

function parseBlocks(lines: string[]): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let paragraph: string[] = [];
  let quote: string[] = [];
  let list: string[] = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  }

  function flushQuote() {
    if (!quote.length) return;
    blocks.push({ type: "blockquote", text: quote.join(" ") });
    quote = [];
  }

  function flushList() {
    if (!list.length) return;
    blocks.push({ type: "list", items: list });
    list = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushQuote();
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushQuote();
      flushList();
      blocks.push({
        type: "heading",
        level: 3,
        text: line.replace(/^###\s+/, "").trim()
      });
      continue;
    }

    // Markdown-Bild in eigener Zeile: ![Alt](/pfad.jpg "Optionale Bildunterschrift")
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)$/);
    if (imageMatch) {
      flushParagraph();
      flushQuote();
      flushList();
      blocks.push({
        type: "image",
        src: imageMatch[2],
        alt: imageMatch[1],
        ...(imageMatch[3] ? { caption: imageMatch[3] } : {})
      });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      flushQuote();
      list.push(line.replace(/^-\s+/, "").trim());
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      quote.push(line.replace(/^>\s+/, "").trim());
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushQuote();
  flushList();

  return blocks;
}

function parseFaq(lines: string[]) {
  const items: { question: string; answer: string }[] = [];
  let question = "";
  let answerLines: string[] = [];

  function flushItem() {
    if (!question) return;
    items.push({
      question,
      answer: blocksToText(parseBlocks(answerLines))
    });
    answerLines = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("### ")) {
      flushItem();
      question = line.replace(/^###\s+/, "").trim();
      continue;
    }

    answerLines.push(line);
  }

  flushItem();
  return items;
}

function blocksToText(blocks: ArticleBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "paragraph" || block.type === "blockquote") return block.text;
      if (block.type === "list") return block.items.join("\n");
      if (block.type === "heading") return block.text;
      if (block.type === "image") return "";
      return blocksToText(block.blocks);
    })
    .filter(Boolean)
    .join("\n\n");
}

function firstParagraphFromSection(section?: ArticleSection): string {
  if (!section) return "";
  const firstParagraph = parseBlocks(section.lines).find((block) => block.type === "paragraph");
  return firstParagraph?.type === "paragraph" ? firstParagraph.text : "";
}

function normalizeHeading(value: string): string {
  return value.trim().toLowerCase();
}

function countWords(value: string): number {
  return value.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
}

function readingTime(words: number): string {
  const minutes = Math.max(1, Math.round(words / 240));
  return `ca. ${minutes} Minuten`;
}

export const articles: Article[] = readArticleFiles().map(parseArticle);

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
