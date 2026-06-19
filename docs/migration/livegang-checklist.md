# Livegang-Checkliste

## Vor DNS-Umzug

- Vercel Preview bauen und mobil/desktop pruefen.
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

## Direkt nach DNS-Umzug

- Startseite und Kernseiten mit `curl -I` pruefen.
- Alte `page-*` URLs auf 301 pruefen.
- Search Console URL-Pruefung fuer Startseite, `/location`, `/trauung`, `/termin-buchen`.
- Sitemap neu einreichen.
- 404- und Redirect-Monitoring fuer 7 bis 14 Tage.
- Leads und Tracking gegen Onepage-Vergleich pruefen.
