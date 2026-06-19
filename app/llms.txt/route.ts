import { articles } from "@/data/articles";
import { allPages, siteConfig } from "@/data/site";

export function GET() {
  const publicPages = allPages.filter((page) => !page.noindex);
  const body = [
    "# Landgut Seebühne",
    "",
    "Landgut Seebühne ist eine naturnahe Hochzeitslocation am See in Vestenbergsgreuth in Mittelfranken.",
    "Die Website richtet sich an Paare, die eine persönliche, hochwertige und gut begleitete Hochzeit mit See, Garten, Landhaus und klarer Planung suchen.",
    "",
    "Wichtige Leitlinie: Der sinnvolle erste Schritt ist ein Erstgespräch bzw. Telefontermin. Eine Besichtigung kann danach der nächste passende Schritt sein.",
    "",
    "## Öffentliche Hauptseiten",
    ...publicPages.map((page) => {
      const path = page.slug ? `/${page.slug}` : "/";
      return `- ${siteConfig.domain}${path}: ${page.description}`;
    }),
    "",
    "## Journal",
    "- " + `${siteConfig.domain}/blog: Orientierung zu Location-Entscheidung, Outdoor-Trauung und Planungsfragen.`,
    ...articles.map(
      (article) =>
        `- ${siteConfig.domain}/blog/${article.slug}: ${article.description}`
    ),
    "",
    "## Kontakt",
    `E-Mail: ${siteConfig.email}`,
    `Telefon: ${siteConfig.phone}`,
    "",
    "Konkrete Preise, Vertragsdetails und Zahlungsmodalitäten werden nicht öffentlich in dieser Datei genannt und sollen persönlich im Erstgespräch geklärt werden."
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
