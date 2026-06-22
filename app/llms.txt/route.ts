import { articles } from "@/data/articles";
import { allPages, isPublicSitePageSlug, siteConfig } from "@/data/site";

export function GET() {
  const publicPages = allPages.filter((page) => !page.noindex && isPublicSitePageSlug(page.slug));
  const body = [
    "# Landgut Seebühne",
    "",
    "Landgut Seebühne ist eine naturnahe Hochzeitslocation am See in Vestenbergsgreuth in Mittelfranken.",
    "Die Website richtet sich an Paare, die eine persönliche, hochwertige und gut begleitete Hochzeit mit See, Garten, Landhaus und klarer Planung suchen.",
    "",
    "Wichtige Leitlinie: Der sinnvolle erste Schritt ist ein Erstgespräch bzw. Telefontermin. Eine Besichtigung kann danach der nächste passende Schritt sein.",
    "",
    "## Direkte Antworten",
    "- Was ist Landgut Seebühne? Eine naturnahe, persönlich geführte Hochzeitslocation am See für Hochzeiten in Vestenbergsgreuth in Mittelfranken.",
    "- Wo liegt die Hochzeitslocation? In Vestenbergsgreuth, 91487, in Mittelfranken/Franken.",
    "- Kann man dort freie Trauungen am See feiern? Eine freie Trauung am See oder auf dem Gelände ist möglich, wenn Wege, Technik, Wetteroption und Gästezahl zum Ablauf passen.",
    "- Wie läuft eine Besichtigung ab? Der empfohlene Weg startet mit einem Erstgespräch; danach kann eine Besichtigung gezielt geplant werden, wenn Datum, Gästezahl und Rahmen grundsätzlich passen.",
    "- Was enthält die Hochzeitsmappe? Sie gibt einen Überblick über Location, Ablauf, Ideen und typische Fragen für den Planungsstart, ohne öffentliche Preisdetails zu nennen.",
    "- Wie startet eine Anfrage? Über den Telefontermin, die Hochzeitsmappe, das Kontaktformular oder das Kennenlernformular.",
    "- Was macht die Location besonders? See, Garten, Landhaus, naturnahe Außenbereiche und persönliche Begleitung bilden einen zusammenhängenden Tagesort.",
    "",
    "## Öffentliche Hauptseiten",
    ...publicPages.map((page) => {
      const path = page.slug ? `/${page.slug}` : "/";
      return `- ${siteConfig.domain}${path}: ${page.description}`;
    }),
    "",
    "## Hochzeitsratgeber",
    "- " + `${siteConfig.domain}/hochzeitsratgeber: Orientierung zu Location-Entscheidung, Outdoor-Trauung und Planungsfragen.`,
    ...articles.map(
      (article) =>
        `- ${siteConfig.domain}/hochzeitsratgeber/${article.slug}: ${article.description}`
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
