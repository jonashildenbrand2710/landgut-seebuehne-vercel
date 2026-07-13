import { articles } from "@/data/articles";
import { allPages, isPublicSitePageSlug, siteConfig } from "@/data/site";

export function GET() {
  const publicPages = allPages.filter((page) => !page.noindex && isPublicSitePageSlug(page.slug));
  const body = [
    "# Landgut Seebühne",
    "",
    "> Naturnahe, familiengeführte Hochzeitslocation am See in Vestenbergsgreuth (Mittelfranken, Bayern). Eine Hochzeit pro Tag, See, Garten und Landhaus als zusammenhängender Tagesort - persönlich begleitet vom Kennenlerngespräch bis zur Feier.",
    "",
    "Die Website richtet sich an Paare, die eine persönliche, hochwertige und gut begleitete Hochzeit mit See, Garten, Landhaus und klarer Planung suchen.",
    "Wichtige Leitlinie: Der sinnvolle erste Schritt ist ein Kennenlerngespräch bzw. Telefontermin. Eine Besichtigung kann danach der nächste passende Schritt sein.",
    "",
    "## Direkte Antworten",
    "",
    "- Was ist Landgut Seebühne? Eine naturnahe, persönlich geführte Hochzeitslocation am See für Hochzeiten in Vestenbergsgreuth in Mittelfranken. Familiengeführt seit 1996, mit idyllischem See und rund 8.000 qm Park.",
    "- Wo liegt die Hochzeitslocation? Hauptstraße 32, 91487 Vestenbergsgreuth, in Mittelfranken/Franken (Bayern).",
    "- Wie exklusiv ist die Location? Es gilt eine One-Wedding-Policy: eine Hochzeit pro Tag, keine Parallelveranstaltungen.",
    "- Welche Hochzeitsformate gibt es? Tiny Wedding (15-35 Gäste, Sonntag-Donnerstag), Classic Wedding (Location komplett exklusiv, Sonntag-Donnerstag) und Signature Wedding (Prime-Wochenendtermine inkl. freier Trauung am See und Hochzeitssuite). Details und Preise werden persönlich geklärt.",
    "- Kann man dort freie Trauungen am See feiern? Eine freie Trauung am See oder auf dem Gelände ist möglich, wenn Wege, Technik, Wetteroption und Gästezahl zum Ablauf passen.",
    "- Gibt es einen Plan B bei Regen? Ja, Wetteroptionen und Plan B werden früh in der Planung mitgedacht - inklusive geschützter Bereiche.",
    "- Gibt es Übernachtungsmöglichkeiten? Ja, für Gäste zum Vorzugspreis; je nach Paket auch eine Hochzeitssuite direkt vor Ort.",
    "- Wie läuft eine Besichtigung ab? Der empfohlene Weg startet mit einem Kennenlerngespräch; danach kann eine Besichtigung gezielt geplant werden, wenn Datum, Gästezahl und Rahmen grundsätzlich passen.",
    "- Was enthält die Hochzeitsmappe? Sie gibt einen Überblick über Location, Ablauf, Ideen und typische Fragen für den Planungsstart, ohne öffentliche Preisdetails zu nennen.",
    "- Wie startet eine Anfrage? Über den Telefontermin, die Hochzeitsmappe, die Kontaktseite oder die Kennenlernseite.",
    "",
    "## Öffentliche Hauptseiten",
    "",
    ...publicPages.map((page) => {
      const path = page.slug ? `/${page.slug}` : "/";
      const label = page.navTitle ?? page.title;
      return `- [${label}](${siteConfig.domain}${path}): ${page.description}`;
    }),
    "",
    "## Hochzeitsratgeber",
    "",
    `- [Hochzeits-Journal (Ratgeber)](${siteConfig.domain}/hochzeitsratgeber): Orientierung zu Location-Entscheidung, Outdoor-Trauung und Planungsfragen.`,
    ...articles.map(
      (article) =>
        `- [${article.title}](${siteConfig.domain}/hochzeitsratgeber/${article.slug}): ${article.description}`
    ),
    "",
    "## Kontakt",
    "",
    `- E-Mail: ${siteConfig.email}`,
    `- Telefon: ${siteConfig.phoneInternational} (${siteConfig.phone})`,
    `- Adresse: ${siteConfig.address.legal}`,
    "",
    "Konkrete Preise, Vertragsdetails und Zahlungsmodalitäten werden nicht öffentlich in dieser Datei genannt und sollen persönlich im Kennenlerngespräch geklärt werden."
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
