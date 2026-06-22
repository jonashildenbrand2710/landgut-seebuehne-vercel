# Pre-Launch SEO-/GEO-Audit 2026-06-22

Arbeitsstand vor dem Domainumzug. Grundlage: `AGENTS.md`, `url-matrix.md`,
GSC-Exports bis 2026-06-19 und aktueller Rebuild-Code.

## Query-Mapping

| Suchintention / GSC-Cluster | Zielseite im Rebuild | Entscheidung |
|---|---|---|
| `landgut seebühne`, `seebühne vestenbergsgreuth`, `seebühne landgut` | `/` | Startseite bleibt die primäre Marken- und lokale Einstiegsseite. |
| `hochzeitslocation franken`, `hochzeitslocation mittelfranken`, `hochzeitslocation am see`, `hochzeit am see franken` | `/location` und `/` | Location-Seite stärkt Ort, See, Garten, Landhaus und Tagesablauf; Startseite bleibt breite Landingpage. |
| `freie trauung am see`, `am see heiraten`, `gartenhochzeit` | `/trauung`, `/hochzeitsratgeber/freie-trauung-am-see` | Leistungsseite beantwortet das Angebot, Ratgeber vertieft Planung und Plan-B-Fragen. |
| `hochzeitsmappe` | `/hochzeitsmappe` | Lead-Magnet bleibt indexierbar und in Sitemap/Navigation verlinkt. |
| Besichtigung- und Fragen-Intent | `/besichtigung`, `/hochzeitsratgeber/hochzeitslocation-besichtigen-fragen` | Erstgespräch vor Besichtigung wird als klarer Ablauf erklärt. |
| `getting ready` und Ablaufstart | `/getting-ready`, `/hochzeitsratgeber/getting-ready-vor-ort` | P1-Seite und Ratgeberartikel decken Ablaufvorteil und Vorbereitung ab. |
| Kontakt-, Anfrage- und Formularintent | `/termin-buchen`, `/kontaktformular`, `/formular` | Conversion-Wege bleiben indexierbar und sind sitewide intern verlinkt. |
| Preis-Queries / alte Preis-URLs | `/preise`, `/preise-basis` | Kontrolliert erreichbar mit `noindex, follow`; keine Aufnahme in Sitemap, keine öffentlichen Preisdetails. |
| Rezensionen-Queries | `/` | Sichtbare Paarstimmen bleiben menschlich lesbar; keine Review- oder AggregateRating-Structured-Data ohne verifizierte Quelle. |
| Café-/Restaurant-Queries | `/` vorerst | Historisch sichtbar, aber vor Launch keine neue Seite ohne klare aktuelle Suchintention, Quelle und CTA. Nach Livegang beobachten. |
| Alte `page-*` URLs | `/` | Per 301 auf die Startseite, damit bekannte alte Onepage-URLs nicht 404en. |

## Umgesetzte Pre-Launch-Verbesserungen

- Title-/H1-Signale der wichtigsten Leistungs- und Conversion-Seiten stärker auf Ort, Angebot und nächsten Schritt ausgerichtet.
- Sitewide JSON-LD ergänzt: `WebSite` plus belegbares `LocalBusiness`/`EventVenue` ohne Preise, Bewertungen oder Verfügbarkeiten.
- Page-/Article-JSON-LD ergänzt: `WebPage`, `BreadcrumbList`, sichtbare FAQ-Inhalte als `FAQPage` und Ratgeberartikel als `Article`.
- Footer um interne Links zu `getting-ready`, `besichtigung`, `termin-buchen`, `kontaktformular` und `formular` erweitert.
- Ratgeberartikel um kontextuelle Links zu passenden Leistungs- und Conversion-Seiten ergänzt.
- `llms.txt` um kurze direkte Antworten auf die wichtigsten AI-/Answer-Fragen erweitert.

## Live-Nachkontrolle

- Nach Domainumzug GSC-Performance fuer Marken-, Location-, Hochzeitsmappe- und Preis-/Review-Queries kontrollieren.
- 404-/Redirect-Berichte beobachten, besonders fuer alte Onepage- und `page-*` URLs.
- Formular-, Kalender-, CRM-, Tracking- und Consent-Wege mit echten Vercel Environment Variables end-to-end testen.
- Datenschutz und Impressum rechtlich final freigeben.
