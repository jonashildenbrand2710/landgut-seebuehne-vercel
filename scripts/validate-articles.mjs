import fs from "node:fs";
import path from "node:path";

const articlesDirectory = path.join(process.cwd(), "content", "articles");
const minimumWords = 1200;
const requiredMetadata = ["Meta Title", "Meta Description", "Slug", "Pillar", "Status"];
const forbiddenPatterns = [
  /\b\d+(?:[.,]\d+)?\s*(?:€|EUR|Euro)\b/i,
  /\bab\s+\d/i,
  /\bMindestums[aä]tz(?:e|es)?\b/i,
  /\bReservierungsgeb(?:ü|ue)hr(?:en)?\b/i,
  /\bStornogeb(?:ü|ue)hr(?:en)?\b/i,
  /\bStornotabelle(?:n)?\b/i,
  /\bPaketpreis(?:e)?\b/i,
  /\bZahlungsplan\b/i,
  /\bZahlungsfrist(?:en)?\b/i
];

const errors = [];

if (!fs.existsSync(articlesDirectory)) {
  errors.push(`Artikelordner fehlt: ${articlesDirectory}`);
} else {
  const files = fs
    .readdirSync(articlesDirectory)
    .filter((file) => file.endsWith(".md"))
    .sort();

  if (!files.length) {
    errors.push("Keine Markdown-Artikel in content/articles gefunden.");
  }

  const seenSlugs = new Set();

  for (const file of files) {
    const filePath = path.join(articlesDirectory, file);
    const markdown = fs.readFileSync(filePath, "utf8").split(/\n## Intern:/)[0].trim();
    const metadata = parseMetadata(markdown);
    const label = `content/articles/${file}`;
    const wordCount = markdown.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
    const slug = metadata.Slug;
    const expectedSlug = path.basename(file, ".md");

    for (const field of requiredMetadata) {
      if (!metadata[field]) {
        errors.push(`${label}: Pflichtfeld fehlt: ${field}`);
      }
    }

    if (slug && slug !== expectedSlug) {
      errors.push(`${label}: Slug "${slug}" passt nicht zum Dateinamen "${expectedSlug}".`);
    }

    if (slug) {
      if (seenSlugs.has(slug)) {
        errors.push(`${label}: Slug "${slug}" ist doppelt vergeben.`);
      }
      seenSlugs.add(slug);
    }

    if (!/^#\s+\S/.test(markdown)) {
      errors.push(`${label}: H1-Titel fehlt.`);
    }

    if (!/Publishing-ready/i.test(metadata.Status ?? "")) {
      errors.push(`${label}: Status muss Publishing-ready enthalten.`);
    }

    if (wordCount < minimumWords) {
      errors.push(`${label}: nur ${wordCount} Wörter, erwartet mindestens ${minimumWords}.`);
    }

    if (!/^## CTA$/m.test(markdown)) {
      errors.push(`${label}: CTA-Abschnitt fehlt.`);
    }

    if (!/^## FAQ$/m.test(markdown)) {
      errors.push(`${label}: FAQ-Abschnitt fehlt.`);
    }

    if (!/Erstgespr(?:ä|ae)ch/i.test(sectionText(markdown, "CTA"))) {
      errors.push(`${label}: CTA muss auf das Erstgespräch verweisen.`);
    }

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(markdown)) {
        errors.push(`${label}: mögliche Preis-/Vertragsregel-Verletzung gefunden (${pattern}).`);
      }
    }
  }
}

if (errors.length) {
  console.error("Artikelvalidierung fehlgeschlagen:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Artikelvalidierung bestanden.");

function parseMetadata(markdown) {
  const metadata = {};
  const lines = markdown.split(/\r?\n/);
  const contentStart = lines.findIndex((line) => line.startsWith("## "));
  const metadataLines = contentStart === -1 ? lines : lines.slice(0, contentStart);

  for (const line of metadataLines) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) continue;
    metadata[match[1].trim()] = match[2].trim();
  }

  return metadata;
}

function sectionText(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (startIndex === -1) return "";

  const sectionLines = [];
  for (const line of lines.slice(startIndex + 1)) {
    if (line.startsWith("## ")) break;
    sectionLines.push(line);
  }

  return sectionLines.join("\n");
}
