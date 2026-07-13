# Google Ads API DNS-Brief Umsetzung

Quelle: `/Volumes/PROJEKTE/first app/SB_Werbung/build-creatives/2026-07-05_vercel-dns-google-ads-api-brief.md`

Stand: 2026-07-07

## Ziel

Google soll die Firmenwebsite fuer die Google Ads API Compliance Review sauber
erreichen koennen. Gleichzeitig soll das Codex-Projekt vorbereitet sein, spaeter
Google Ads fuer das eigene Konto kontrolliert per API zu pruefen und nach
Freigabe zu steuern.

## Umgesetzt im Website-Projekt

- `next.config.ts` leitet die Apex-Domain `landgut-seebuehne.de` per 301 auf die
  kanonische `www`-Domain weiter, sobald die Apex-Domain im DNS auf Vercel zeigt.
- `.env.example` dokumentiert private Google-Ads-API-Variablen und die
  erwarteten DNS-Werte.
- `npm run google-ads-check` prueft DNS, HTTP-Erreichbarkeit, zentrale
  Google-Crawler-Dateien und optional den Google-Ads-API-Status.
- `docs/migration/google-access.md` beschreibt den Ads-API-Scope, Secrets und
  die sichere lokale Nutzung.

## Noch extern zu erledigen

Diese Schritte brauchen Vercel-/DNS-/Google-Zugriff und werden nicht im Code
gespeichert:

- In Vercel `Settings > Domains` beide Domains hinterlegen und verifizieren:
  `landgut-seebuehne.de` und `www.landgut-seebuehne.de`.
- Beim DNS-Provider Apex `@` als `A` auf `76.76.21.21` setzen. Am
  2026-07-07 wurde dieser Record in IONOS angelegt.
- `www` als `CNAME` auf den von Vercel angezeigten Wert setzen, typischerweise
  `cname.vercel-dns-0.com`. In IONOS ist `www` aktuell als `A 76.76.21.21`
  gesetzt; Vercel meldet diese Konfiguration als nicht fehlkonfiguriert und die
  Website liefert darueber `HTTP 200`.
- Alte widerspruechliche `A`-, `AAAA`- oder `CNAME`-Records entfernen.
- SSL fuer beide Domains in Vercel pruefen. Am 2026-07-07 wurde ein neues
  Vercel-Zertifikat fuer `landgut-seebuehne.de` und
  `www.landgut-seebuehne.de` ausgestellt.
- Google Ads API Developer Token erst nach erfolgreichem DNS-Fix mit Hinweis auf
  den Domainumzug erneut einreichen.

## Re-Submission Text

```text
Our website was migrated to a new domain setup last week. During the migration,
DNS propagation may have caused temporary reachability issues. The website is now
live and accessible at https://www.landgut-seebuehne.de/.

Business model: Landgut Seebuehne is a wedding venue in Germany. We use Google
Ads to generate qualified wedding-location leads.

Google Ads API use case: We want to use the API for internal account reporting,
keyword analysis, search campaign monitoring, and campaign management for our
own advertising account. We do not resell API access or manage third-party
advertiser accounts through this tool.
```

## Sicherheitsgrenze

Das Projekt darf ohne ausdrueckliche Freigabe keine Ads-Kampagnen, Budgets,
Keywords, Targetings oder Kontozugriffe aendern. Bis dahin sind nur DNS-,
Website- und Read-only-API-Pruefungen vorgesehen.

## Pruefergebnis 2026-07-07

- `dig A landgut-seebuehne.de +short` liefert `76.76.21.21`.
- `dig A www.landgut-seebuehne.de +short` liefert `76.76.21.21`.
- `https://landgut-seebuehne.de/` liefert `HTTP 301` auf
  `https://www.landgut-seebuehne.de/`.
- `https://www.landgut-seebuehne.de/` liefert `HTTP 200`.
- `https://www.landgut-seebuehne.de/robots.txt` liefert `HTTP 200`.
- `https://www.landgut-seebuehne.de/sitemap.xml` liefert `HTTP 200`.
- `https://www.landgut-seebuehne.de/impressum` liefert `HTTP 200`.
- `npm run google-ads-check` meldet `7 OK, 1 WAIT, 0 FAIL`; der verbleibende
  `WAIT` ist der noch nicht lokal konfigurierte Google-Ads-OAuth-Scope
  `https://www.googleapis.com/auth/adwords`.
