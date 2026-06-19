# LLM-Auffindbarkeit und KI-SEO: Slide-Faden

Ziel: Diese Datei ist unser roter Faden fuer die Uebertragung von Onepage zu Vercel und den spaeteren Ausbau der Auffindbarkeit in Google, ChatGPT, Claude, Perplexity, Bing/Copilot und anderen KI-Systemen.

## Slide 1: Grundidee

Wir bauen nicht nur eine neue Website. Wir uebertragen eine bestehende digitale Reputation.

Wichtig sind:

- Domain-Signale
- alte URLs
- sichtbare Inhalte
- unsichtbare SEO-Daten
- technische Dateien
- externe Profile
- Tracking und Conversion-Daten
- klare, zitierbare Fakten fuer Suchmaschinen und KI-Systeme

## Slide 2: Was LLM-Auffindbarkeit bedeutet

LLM-Auffindbarkeit heisst:

Wenn jemand eine KI fragt, zum Beispiel "Welche Hochzeitslocation am See gibt es in Mittelfranken?", soll Landgut Seebuehne als relevante, vertrauenswuerdige Quelle verstanden werden.

Dafuer reicht keine einzelne KI-Datei. Die Website muss wie eine klare Wissensbasis funktionieren.

## Slide 3: Unterschied zu klassischer SEO

Klassische SEO fragt:

- Fuer welche Suchbegriffe rankt eine Seite?
- Wie gut ist die Seite technisch indexierbar?
- Welche Links und Signale hat die Domain?

KI-/LLM-Sichtbarkeit fragt zusaetzlich:

- Kann ein KI-System die Fakten schnell erkennen?
- Sind die Aussagen konkret und zitierbar?
- Gibt es klare Antworten auf echte Nutzerfragen?
- Stimmen Website, Google Business Profile und externe Quellen ueberein?

## Slide 4: Dateien auf der neuen Website

Diese Dateien und Elemente muessen wir bewusst setzen:

- `robots.txt`: Zutrittsregeln fuer Crawler
- `sitemap.xml`: Landkarte der wichtigen Seiten
- `llms.txt`: kompakter KI-Spickzettel
- optional `llms-full.txt`: spaeter fuer groessere Ratgeber- oder FAQ-Bereiche
- Canonical-Tags: Hauptversion jeder Seite
- Meta-Titel und Meta-Beschreibungen
- Open-Graph-Daten fuer WhatsApp, Facebook, LinkedIn und iMessage
- strukturierte Daten als JSON-LD
- Alt-Texte fuer Bilder
- logische HTML-Ueberschriften
- Redirect-Regeln fuer alte URLs

## Slide 5: `robots.txt` bewusst entscheiden

`robots.txt` ist kein SEO-Trick, sondern eine Zugangskarte.

Wir muessen entscheiden:

- Googlebot erlauben
- Bingbot erlauben
- wichtige Such- und Antwort-Bots erlauben
- Trainings-Bots bewusst bewerten
- keine wichtigen Seiten versehentlich blockieren

Beispiele wichtiger KI-/Such-Bots:

- OpenAI: `OAI-SearchBot`, `GPTBot`, `ChatGPT-User`
- Anthropic: `ClaudeBot`, `Claude-User`, `Claude-SearchBot`
- Perplexity: `PerplexityBot`, `Perplexity-User`

## Slide 6: Training vs. Suche

Nicht jeder Bot hat denselben Zweck.

Beispiele:

- Such-/Antwort-Bots helfen, Inhalte in KI-Antworten oder KI-Suchen zu finden.
- Trainings-Bots koennen Inhalte fuer Modelltraining erfassen.
- User-Bots rufen Inhalte ab, wenn ein Nutzer in ChatGPT, Claude oder Perplexity aktiv danach fragt.

Unsere Empfehlung:

- Sichtbarkeit in Suche und Nutzerabrufen ermoeglichen
- Training separat bewusst entscheiden
- keine privaten oder unfertigen Inhalte oeffentlich in `llms.txt` oder auf indexierbaren Seiten nennen

## Slide 7: `llms.txt`

`llms.txt` ist ein optionaler KI-Spickzettel unter:

`https://www.landgut-seebuehne.de/llms.txt`

Er enthaelt:

- kurze Beschreibung von Landgut Seebuehne
- wichtigste oeffentliche Seiten
- zentrale Themen
- klare Einordnung: Hochzeitslocation am See, Mittelfranken, freie Trauung, exklusive Feiern, Naturkulisse

Wichtig:

- Kein Ersatz fuer gute Inhalte
- Kein garantierter Ranking-Hebel
- Keine geheimen Informationen
- Sinnvoll als kleines, sauberes Zusatzsignal

## Slide 8: Strukturierte Daten

Strukturierte Daten helfen Maschinen, sichtbare Inhalte besser einzuordnen.

Moegliche Typen:

- `Organization`
- `LocalBusiness` oder passender Venue-Typ
- `FAQPage`
- `BreadcrumbList`
- spaeter `Article` fuer Ratgeber

Regel:

Strukturierte Daten duerfen nur Aussagen enthalten, die auch sichtbar und korrekt auf der Seite stehen.

## Slide 9: Welche Daten aus Onepage wichtig sind

Aus Onepage brauchen wir mehr als Texte und Bilder:

- Meta-Titel
- Meta-Beschreibungen
- URL-Struktur
- SEO-Einstellungen je Seite
- Canonicals, falls gesetzt
- Noindex-Einstellungen
- alte Weiterleitungen
- Formulare und Empfaenger
- Danke-Seiten
- Tracking-Codes
- Cookiebanner/Consent-Einstellungen
- Custom Code im Header/Footer
- Open-Graph-Bilder und Social-Texte
- Bild-Alt-Texte
- versteckte Seiten, Popups oder Quiz-/Chatbot-Seiten

## Slide 10: Welche Daten aus Google Search Console wichtig sind

Search Console zeigt Googles Sicht auf die Domain.

Wir brauchen:

- Top-Suchanfragen
- Top-Seiten
- Klicks
- Impressionen
- durchschnittliche Positionen
- indexierte Seiten
- nicht indexierte Seiten
- 404-Fehler
- Weiterleitungsfehler
- externe Links
- Sitemap-Status

Diese Daten helfen uns, keine wertvollen Suchsignale zu verlieren.

## Slide 11: Welche Daten aus Analytics wichtig sind

Analytics zeigt, was Besucher tun.

Wir brauchen:

- meistbesuchte Seiten
- wichtigste Quellen
- Mobil/Desktop-Verteilung
- Anfragen
- Terminbuchungen
- Klicks auf Telefon, E-Mail, Hochzeitsmappe oder Kalender
- Conversion-Events
- Kampagnenparameter, falls Ads oder Social Kampagnen laufen

## Slide 12: Zugangs-Checkliste

Zugaenge, die wir brauchen oder pruefen sollten:

- Onepage
- Vercel
- Domain/DNS ueber Jonas
- Google Search Console
- Google Analytics
- Google Tag Manager, falls vorhanden
- Cookiebanner/Consent-Tool
- Google Business Profile
- Bing Webmaster Tools
- Instagram/Facebook/Pinterest
- Hochzeitsportale und Branchenverzeichnisse
- Review-Portale
- Kalender-/Buchungstool
- Formular-/CRM-/E-Mail-Ziel

## Slide 13: Externe Profile als LLM-Signal

KI-Systeme verlassen sich nicht nur auf die eigene Website.

Wichtig ist Konsistenz auf:

- Google Business Profile
- Instagram
- Facebook
- Hochzeitsportalen
- regionalen Verzeichnissen
- Bewertungsplattformen
- Presse/Blog-Erwaehnungen
- Partnerseiten

Name, Ort, Beschreibung, Leistungen und Kontakt sollten ueberall zusammenpassen.

## Slide 14: Bilder und LLMs

Bilder helfen nicht nur Menschen.

Sie beeinflussen:

- Vertrauen
- Conversion
- Google Images
- Ladezeit
- visuelles Verstaendnis
- thematische Einordnung

Wichtig:

- echte Location-Bilder
- echte See-/Trauplatz-/Feier-Motive
- optimierte Dateigroessen
- klare Alt-Texte
- keine generischen Stockbilder
- Bildrechte klaeren

Andere Bilder sind okay, wenn sie eure echte Positionierung staerken.

## Slide 15: Inhalte, die LLMs gut verstehen

Wir sollten klare Antworten sichtbar machen:

- Was ist Landgut Seebuehne?
- Wo liegt die Location?
- Fuer welche Hochzeiten ist sie geeignet?
- Gibt es eine freie Trauung am See?
- Was passiert bei Regen?
- Welche Gaestezahlen sind passend?
- Welche Bundles gibt es?
- Wie laeuft Anfrage und Besichtigung ab?
- Wer sind die Gastgeber?
- Was unterscheidet euch von anderen Locations?
- Fuer wen ist die Location nicht passend?

## Slide 16: Reihenfolge fuer den Umzug

1. Onepage vollstaendig sichern
2. Search-Console- und Analytics-Daten exportieren
3. aktuelle Landingpage 1:1 nachbauen
4. alte URLs mappen
5. Redirects setzen
6. technische SEO-Dateien setzen
7. strukturierte Daten ergaenzen
8. Search Console und Bing Webmaster verbinden
9. `llms.txt` ergaenzen
10. Livegang kontrolliert durchfuehren
11. 2 bis 8 Wochen beobachten
12. danach Ratgeber und FAQ gezielt ausbauen

## Slide 17: Was wir nicht tun sollten

- Domain ohne Not wechseln
- alte URLs ignorieren
- alle Inhalte gleichzeitig radikal umschreiben
- wichtige Bots versehentlich blockieren
- SEO-Daten aus Onepage verlieren
- Tracking erst nach Livegang nachbauen
- Bilder ohne Rechtepruefung uebernehmen
- nur wegen KI viele duenne Seiten erzeugen
- Preise, Versprechen oder Bewertungen in strukturierten Daten uebertreiben

## Slide 18: Prioritaet

Erst Werterhalt, dann Wachstum.

Prioritaet 1:

- bestehende Landingpage sauber uebertragen
- Suchsignale erhalten
- Conversion-Funktion sichern
- Domain-Reputation schuetzen

Prioritaet 2:

- Inhalte klarer strukturieren
- FAQ und Ratgeber ausbauen
- KI-/LLM-Auffindbarkeit verbessern
- externe Profile konsistent machen

## Quellen und Referenzen

- Google AI Features: https://developers.google.com/search/docs/appearance/ai-features
- Google Search Guidance on generative AI content: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- OpenAI Crawlers: https://developers.openai.com/api/docs/bots
- Anthropic Crawlers: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Perplexity Crawlers: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- llms.txt proposal: https://llmstxt.org/
- IndexNow: https://www.indexnow.org/
