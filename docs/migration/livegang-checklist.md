# Livegang-Checkliste

## Vor DNS-Umzug

- Vercel Preview bauen und mobil/desktop pruefen.
- `npm run validate:articles` und `npm run build` muessen erfolgreich sein.
- Blogartikel duerfen nur aus Volltexten in `content/articles/` kommen, nicht aus Kurzfassungen.
- Alle Onepage-URLs aus `docs/migration/onepage-current/inventory.json` testen.
- Keine wichtige URL darf versehentlich 404 liefern.
- `sitemap.xml` enthaelt nur indexierbare Zielseiten.
- `robots.txt` erlaubt Crawling und verweist auf die Sitemap.
- `llms.txt` enthaelt keine Demo-Texte und keine Preisdetails.
- Canonicals zeigen auf die finale `www.landgut-seebuehne.de` URL.
- Preis-, Danke- und interne Funnel-Seiten sind `noindex`.
- Tracking, Consent, Google Search Console, Analytics/GTM und Meta Pixel pruefen.
- Formulare, Kalenderlinks und Danke-Seiten komplett testen.
- Impressum und Datenschutz final freigeben.
- DNS TTL vor Umzug senken.

## Rebuild-Check 2026-06-22

- Lokal geprueft: `npm run lint`, `npm run build` und Production-Server auf Port 3130.
- P1-Seiten aus `AGENTS.md` liefern lokal 200, sind indexierbar und haben Canonicals auf die finale Domain.
- `/hochzeitsratgeber` und die Ratgeberartikel sind wieder primaere indexierbare URLs; `/blog`, `/ratgeber` und `/journal` leiten per 301 darauf.
- P2-/Review-Seiten liefern kontrolliert 200 mit `noindex, follow` und stehen nicht in der Sitemap.
- Bekannte alte `page-*` URLs leiten per 301 auf `/`.
- `sitemap.xml`, `robots.txt` und `llms.txt` sind lokal konsistent mit den indexierbaren Zielseiten.

## Offene Risiken fuer den Domain-Umzug

- Kein Backlink-Export im Projekt gefunden; externe Linkziele muessen nach Livegang ueber 404-/Redirect-Monitoring und Search Console beobachtet werden.
- Vercel-Preview, finale Domain-Zuordnung, DNS und Search-Console-Verifizierung koennen erst mit Projektzugriff bzw. gesetzten Environment Variables final geprueft werden.
- Formular-, Kalender-, CRM-, Tracking- und Consent-Wege brauchen echte Secrets/IDs in Vercel und einen End-to-End-Test in der Preview.
- Impressum und Datenschutz bleiben vor Livegang rechtlich final freizugeben.

## Direkt nach DNS-Umzug

- Startseite und Kernseiten mit `curl -I` pruefen.
- Alte `page-*` URLs auf 301 pruefen.
- Search Console URL-Pruefung fuer Startseite, `/location`, `/trauung`, `/termin-buchen`.
- Sitemap neu einreichen.
- 404- und Redirect-Monitoring fuer 7 bis 14 Tage.
- Leads und Tracking gegen Onepage-Vergleich pruefen.
