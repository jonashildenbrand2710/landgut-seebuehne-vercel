# Pre-DNS Gold Loop 2026-06-23

Ziel: letzter Launch-Loop vor Umschaltung der Hauptdomain von Onepage auf das
Vercel-Projekt `landgut-seebuehne-vercel`.

## Kurzstatus

- SEO-/URL-Coverage: gruen.
- Bekannte oeffentliche Onepage-/GSC-Pfade: 21.
- Nicht durch Vercel abgedeckte Pfade: 0.
- Hauptdomain live: `www.landgut-seebuehne.de` zeigt weiterhin Onepage.
- Vercel-Deploy: `https://landgut-seebuehne-vercel.vercel.app`.
- Hinweis: `www.landgut-sibylin.de` loest nicht auf; gemeint ist nach bisherigem
  Projektstand `www.landgut-seebuehne.de`.

## Link- und URL-Abgleich

Quellen:

- Live-Crawl interner Links von `https://www.landgut-seebuehne.de/`
- `docs/migration/onepage-current/sitemap.xml`
- `docs/migration/onepage-current/inventory.json`
- aktualisierter GSC-Export bis `2026-06-20`

Ergebnis gegen Vercel-Alias:

| Pfad | Vercel-Ergebnis | Bewertung |
|---|---:|---|
| `/` | 200 | indexierbar |
| `/besichtigung` | 200 | indexierbar |
| `/bewerbung` | 200, `noindex, follow` | kontrolliert erreichbar |
| `/chatbot` | 200, `noindex, follow` | kontrolliert erreichbar |
| `/danke` | 200, `noindex, follow` | kontrolliert erreichbar |
| `/formular` | 200 | indexierbar |
| `/getting-ready` | 200 | indexierbar |
| `/hochzeitsmappe` | 200 | indexierbar |
| `/impressum` | 200 | indexierbar, rechtlich final pruefen |
| `/kontaktformular` | 200 | indexierbar |
| `/location` | 200 | indexierbar |
| `/page-2i9tl81gd9` | 301 auf `/` | abgedeckt |
| `/page-ha0a71x0wl` | 301 auf `/` | abgedeckt |
| `/page-j4jy8j2l17` | 301 auf `/` | abgedeckt |
| `/preise` | 200, `noindex, follow` | kontrolliert erreichbar |
| `/preise-basis` | 200, `noindex, follow` | kontrolliert erreichbar |
| `/quizz` | 200, `noindex, follow` | kontrolliert erreichbar |
| `/termin-buchen` | 200 | indexierbar |
| `/trauung` | 200 | indexierbar |
| `/uber-uns` | 200 | indexierbar |
| `/zimmerbuchung` | 200, `noindex, follow` | kontrolliert erreichbar |

Zusaetzlich remote geprueft:

- `/hochzeitsratgeber`: 200
- `/hochzeitsratgeber/freie-trauung-am-see`: 200
- `/blog/freie-trauung-am-see`: 301 auf
  `/hochzeitsratgeber/freie-trauung-am-see`
- `/journal/*`, `/blog/*`, `/ratgeber`: per `next.config.ts` auf
  `/hochzeitsratgeber` bzw. Artikelziele abgesichert.

## Integrationsstand

### Vercel Environment Variables

Per `npx vercel env ls` sichtbar gesetzt:

- `CRM_BOOKING_API_URL`
- `CRM_BOOKING_API_TOKEN`
- `CRM_BOOKING_FLOW_ID`
- `CRM_BOOKING_FLOW_VERSION`
- `SUPABASE_FUNCTIONS_URL`
- `HOCHZEITSMAPPE_ACCESS_TOKEN`
- `ACTIVECAMPAIGN_API_URL`
- `ACTIVECAMPAIGN_API_KEY`
- `ACTIVECAMPAIGN_HOCHZEITSMAPPE_AUTOMATION_ID`
- `ACTIVECAMPAIGN_HOCHZEITSMAPPE_LIST_ID`
- `ACTIVECAMPAIGN_HOCHZEITSMAPPE_TAG_IDS`

Nicht in der Vercel-Liste sichtbar und vor Tracking-/Verification-Go gezielt zu
entscheiden:

- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_GSC_VERIFICATION`
- `NEXT_PUBLIC_BING_VERIFICATION`
- `META_CAPI_ACCESS_TOKEN`
- `INDEXNOW_KEY`

`NEXT_PUBLIC_SITE_URL` war nicht sichtbar, ist aber im Code mit korrektem
Fallback auf `https://www.landgut-seebuehne.de` abgesichert.

### Buchungsfunnel

Remote-Smoke-Test:

- `POST /api/booking/availability`: 200
- Response enthaelt `calendar_checked: true`
- Response enthaelt echte freie Slots fuer `appointmentType: phone`

Nicht automatisch getestet:

- `POST /api/booking/book`, weil das voraussichtlich einen echten Lead bzw.
  Kalendereintrag erzeugt. Vor DNS-Umzug mit freigegebenem internen Testslot und
  klar markiertem Testkontakt einmal end-to-end pruefen.

### Hochzeitsmappe

Remote-Smoke-Test:

- `GET /api/hochzeitsmappe`: 303 auf `/hochzeitsmappe`
- `POST /api/hochzeitsmappe` mit fehlenden Pflichtfeldern: 303 auf
  `/hochzeitsmappe?status=missing#mappe-form`

Nicht automatisch getestet:

- Valider Hochzeitsmappe-Lead, weil dabei Supabase/ActiveCampaign/Fallback
  beschrieben werden. Vor DNS-Umzug mit freigegebenem Testkontakt einmal
  end-to-end pruefen und danach Testkontakt/Lead im CRM markieren oder loeschen.

### Tracking und Consent

Onepage hatte laut gesicherter Admin-Notiz aktive Tracking-Integrationen:

- Google Tag / Google Ads
- Google Tag Manager
- Facebook Pixel
- Meta Conversion API Token
- Onepage Analytics
- Cookie-Banner mit Hinweis/Accept-Button

Im Vercel-Code und im gerenderten Vercel-HTML wurde keine aktive GTM-, Google
Analytics-, Google Ads- oder Meta-Pixel-Injection gefunden. Das ist technisch
sauber, solange keine nicht notwendigen Cookies gesetzt werden sollen. Wenn
Ads-/Conversion-Kontinuitaet zum Livegang noetig ist, ist Tracking/Consent ein
echtes Launch-Gate und sollte vor DNS-Umzug bewusst geloest werden.

## Go/No-Go

SEO-/Redirect-Go:

- Ja. Es gibt aktuell keinen bekannten oeffentlichen oder GSC-relevanten Pfad,
  der im Vercel-Projekt auf 404 laufen wuerde.

Business-/Tracking-/Legal-Go:

- Bedingt. Vor DNS-Umzug final klaeren:
  - valider Testtermin im Buchungsfunnel
  - valider Hochzeitsmappe-Testlead
  - Tracking-Entscheidung: bewusst auslassen oder consent-aware integrieren
  - Impressum und Datenschutz rechtlich freigeben
  - nach DNS-Umzug 404s, Redirects, Sitemap und Search Console ueberwachen

## Gold-Loop-Prompt

Den folgenden Prompt in einem frischen Codex-Thread bzw. Gold-Loop verwenden:

```text
Du arbeitest im Repo:
/Volumes/PROJEKTE/first app/landgut-seebuehne-vercel

Rolle:
Du bist der finale Pre-DNS-Launch-Auditor fuer den Umzug von
www.landgut-seebuehne.de von Onepage auf das Vercel-Projekt
landgut-seebuehne-vercel. Arbeite vorsichtig, read-only wo moeglich, und
committe keine Secrets. Veraendere Code nur, wenn ein klarer blockerfreier Fix
notwendig und sicher ist. Rechtstexte, Tracking-Consent und echte Testleads nur
als Risiko markieren, wenn keine Freigabe vorliegt.

Primaere Quellen:
- AGENTS.md
- docs/migration/url-matrix.md
- docs/migration/livegang-checklist.md
- docs/migration/pre-dns-gold-loop-2026-06-23.md
- docs/migration/google-search-console/summary.md
- docs/migration/onepage-current/sitemap.xml
- docs/migration/onepage-current/inventory.json
- docs/migration/onepage-admin/tracking-integrations.md
- docs/migration/onepage-admin/seo-settings.md
- app/sitemap.ts, app/robots.ts, app/llms.txt/route.ts, next.config.ts

Wichtige Ziel-URLs:
- Finale Domain: https://www.landgut-seebuehne.de
- Vercel-Alias: https://landgut-seebuehne-vercel.vercel.app
- P1-Seiten:
  /, /location, /trauung, /getting-ready, /uber-uns, /hochzeitsmappe,
  /besichtigung, /termin-buchen, /kontaktformular, /formular, /impressum,
  /hochzeitsratgeber,
  /hochzeitsratgeber/hochzeitslocation-besichtigen-fragen,
  /hochzeitsratgeber/freie-trauung-am-see
- P2-/kontrollierte Seiten:
  /danke, /preise, /preise-basis, /quizz, /chatbot, /zimmerbuchung, /bewerbung
- Legacy:
  /page-j4jy8j2l17, /page-2i9tl81gd9, /page-ha0a71x0wl,
  /blog, /blog/:slug, /journal, /journal/:slug, /ratgeber, /ueber-uns

Aufgaben:

1. Arbeitsstand sichern
- `git status --short --branch`
- Keine fremden Aenderungen zuruecksetzen.
- Wenn lokale Aenderungen vorhanden sind, nur beruecksichtigen und nicht
  aufraeumen.

2. Build- und Basischecks
- `npm run lint`
- `npm run validate:articles`
- `npm run build`
- Wenn etwas fehlschlaegt: Ursache mit Datei/Zeile nennen, nur klare kleine Fixes
  umsetzen.

3. Remote-Vercel-SEO-Smoke-Test
- Gegen `https://landgut-seebuehne-vercel.vercel.app` testen:
  - P1-Seiten muessen 200 liefern, keine `noindex` Robots-Meta haben und Canonical
    auf `https://www.landgut-seebuehne.de/...` setzen.
  - P2-Seiten muessen 200 liefern und `noindex, follow` haben.
  - `/page-*` muss 301 auf `/` liefern.
  - `/blog`, `/journal`, `/ratgeber` muessen 301 auf `/hochzeitsratgeber` bzw.
    passende Artikel liefern.
  - `/sitemap.xml` darf keine P2-/noindex-/page-* Seiten enthalten.
  - `/robots.txt` muss Crawling erlauben und die finale Sitemap referenzieren.
  - `/llms.txt` darf keine Preisdetails, Demo-Texte oder internen Secrets nennen.

4. Oeffentliche Alt-URL-Coverage
- Sammle Pfade aus:
  - live internem Link-Crawl von `https://www.landgut-seebuehne.de`
  - `docs/migration/onepage-current/sitemap.xml`
  - `docs/migration/onepage-current/inventory.json`
  - `docs/migration/google-search-console/search-pages.csv`
- Teste alle Pfade gegen den Vercel-Alias.
- Ergebnis: Tabelle mit Pfad, Quelle, Vercel-Status, Ziel/Robots, Bewertung.
- Harte Regel: Kein bekannter Pfad darf auf Vercel 404/500 liefern, ausser er ist
  bewusst als nicht relevant dokumentiert.

5. Vercel Environment Variables
- `npx vercel env ls` ausfuehren, keine Werte ausgeben.
- Pruefen, ob Production/Preview mindestens diese Integrationen haben:
  - CRM_BOOKING_API_URL
  - CRM_BOOKING_API_TOKEN
  - CRM_BOOKING_FLOW_ID
  - CRM_BOOKING_FLOW_VERSION
  - SUPABASE_FUNCTIONS_URL
  - HOCHZEITSMAPPE_ACCESS_TOKEN
  - ACTIVECAMPAIGN_API_URL
  - ACTIVECAMPAIGN_API_KEY
  - ACTIVECAMPAIGN_HOCHZEITSMAPPE_AUTOMATION_ID
  - ACTIVECAMPAIGN_HOCHZEITSMAPPE_LIST_ID
  - ACTIVECAMPAIGN_HOCHZEITSMAPPE_TAG_IDS
- Public Tracking/Verification bewusst bewerten:
  - NEXT_PUBLIC_GTM_ID
  - NEXT_PUBLIC_GOOGLE_ADS_ID
  - NEXT_PUBLIC_META_PIXEL_ID
  - NEXT_PUBLIC_GSC_VERIFICATION
  - NEXT_PUBLIC_BING_VERIFICATION
  - META_CAPI_ACCESS_TOKEN

6. Nicht-destruktive Integrationstests
- `POST /api/booking/availability` gegen Vercel testen. Erwartung: 200,
  `calendar_checked: true`, Slots oder bewusst leere Slots.
- `GET /api/hochzeitsmappe` testen. Erwartung: 303 auf `/hochzeitsmappe`.
- `POST /api/hochzeitsmappe` mit fehlenden Pflichtfeldern testen. Erwartung:
  303 auf `/hochzeitsmappe?status=missing#mappe-form`.
- Keinen echten Termin buchen und keinen validen Lead absenden, ausser der Nutzer
  hat einen Testkontakt und Testslot explizit freigegeben.

7. Tracking/Consent-Gate
- Im Code und gerenderten Vercel-HTML pruefen, ob GTM/Google Ads/Meta Pixel aktiv
  injiziert werden.
- Abgleich mit `docs/migration/onepage-admin/tracking-integrations.md`.
- Wenn keine Tracking-Scripts aktiv sind: als bewusst trackingfrei oder als
  Launch-Gate fuer Ads/Conversion-Kontinuitaet markieren.
- Wenn Tracking aktiv ist: Consent-/Cookie-Hinweis und Datenschutz auf Plausibilitaet
  pruefen, aber keine Rechtsfreigabe behaupten.

8. Rechtliches
- Impressum und Datenschutz auf technische Erreichbarkeit, Canonicals und
  sichtbare Inhalte pruefen.
- Keine rechtliche Freigabe behaupten. Wenn ungeprueft: als Business-/Legal-Gate
  markieren.

9. Nach-DNS-Plan
- Konkrete Kommandos fuer direkt nach Umschaltung notieren:
  - `curl -I https://www.landgut-seebuehne.de/`
  - `curl -I https://www.landgut-seebuehne.de/page-j4jy8j2l17`
  - `curl -I https://www.landgut-seebuehne.de/hochzeitsratgeber`
  - `curl -s https://www.landgut-seebuehne.de/sitemap.xml`
  - Search Console URL-Pruefung fuer `/`, `/location`, `/trauung`,
    `/termin-buchen`
  - Sitemap neu einreichen
  - 404-/Redirect-Monitoring 7 bis 14 Tage

Ausgabeformat:
- Starte mit `Go`, `Conditional Go` oder `No-Go`.
- Danach maximal 10 Findings nach Schwere sortiert.
- Danach `Geprueft`, `Nicht geprueft`, `Nach DNS sofort`.
- Nenne konkrete Pfade und Kommandos.
- Keine Secrets, keine Token, keine echten Env-Werte ausgeben.
```
