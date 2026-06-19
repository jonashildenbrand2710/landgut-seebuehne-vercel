# Onepage Admin SEO Settings

Stand: 2026-06-19

Scope: Hauptdomain `www.landgut-seebuehne.de`, Homepage
`Natürlich heiraten - Landgut Seebühne` und `/hochzeitsmappe`.

Nachvalidierung 2026-06-19: Das gepruefte Onepage-Projekt zeigt in der
Projekt-/Domain-Navigation `Landgut Seebühne` mit `www.landgut-seebuehne.de`.
Eine separate Domain `www.landgut.se` war in diesem Projekt nicht sichtbar.

## Globale SEO-Einstellungen

- Websitename: leer
- Seitentitel-Muster: `{{page_title}}`
- Google Search Console: nicht verbunden, Button zeigt `Verbinden`
- Google Tag Manager: verbunden/bearbeitbar, Wert redigiert
- Informationsschema: `Standard`
  - `@type`: `WebSite`
  - `name`: leer
  - `url`: `https://www.landgut-seebuehne.de`
- Viewport-Skalierung: aus
  - Oeffentlich gerendert: `width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no`
- Sitemap: `Automatisch (Empfohlen)`
- Robots.txt: `Standard (Empfohlen)`
  - `User-agent: *`
  - `Allow: /`
  - `Sitemap: https://www.landgut-seebuehne.de/sitemap.xml`
- LLMs.txt: `Automatisch`
- Bing-Verifikation: im geprueften Onepage-Bereich nicht gefunden.

## Homepage `/`

Admin-Grundeinstellungen:

- Interner Seitentitel: `Natürlich heiraten - Landgut Seebühne`
- Seitenadresse: `/`
- Indexierung: erlaubt

Admin-SEO:

- SEO-Titel: leer
- Meta Description: leer
- Keywords: leer
- Sharing-Bild: nicht gesetzt
- Landmark-Struktur:
  - Header: keine Sektion
  - Main: 15 Sektionen
  - Footer: keine Sektion
- Ueberschriften: 17 gesamt, 0 mit manuell gesetztem Markup
- Alt-Texte: 119 Bilder gesamt, 0 gesetzt, 119 fehlend

Oeffentlich gerendert:

- `<title>`: `Natürlich heiraten - Landgut Seebühne`
- Canonical: `https://www.landgut-seebuehne.de/`
- Meta Description: nicht vorhanden
- Robots-Meta: nicht vorhanden
- OpenGraph:
  - `og:type`: `website`
  - `og:title`: `Natürlich heiraten - Landgut Seebühne`
  - `og:url`: `https://www.landgut-seebuehne.de/`
  - `og:site_name`: `www.landgut-seebuehne.de`

## `/hochzeitsmappe`

Admin-Grundeinstellungen:

- Interner Seitentitel: `Hochzeitsmappe`
- Seitenadresse: `/hochzeitsmappe`
- Indexierung: erlaubt

Admin-SEO:

- SEO-Titel: leer
- Meta Description: leer
- Keywords: leer
- Sharing-Bild: nicht gesetzt
- Landmark-Struktur:
  - Header: keine Sektion
  - Main: 4 Sektionen
  - Footer: keine Sektion
- Ueberschriften: 8 gesamt, 0 mit manuell gesetztem Markup
- Alt-Texte: 4 Bilder gesamt, 0 gesetzt, 4 fehlend

Oeffentlich gerendert:

- `<title>`: `Hochzeitsmappe`
- Canonical: `https://www.landgut-seebuehne.de/hochzeitsmappe`
- Meta Description: nicht vorhanden
- Robots-Meta: nicht vorhanden
- OpenGraph:
  - `og:type`: `website`
  - `og:title`: `Hochzeitsmappe`
  - `og:url`: `https://www.landgut-seebuehne.de/hochzeitsmappe`
  - `og:site_name`: `www.landgut-seebuehne.de`

## Sitemap-/LLMs-Hinweis

Die Onepage-Admin-Vorschau der automatischen Sitemap enthaelt auch historische
und interne Pfade wie `/quizz`, `/page-j4jy8j2l17`, `/uber-uns` und
`/getting-ready`. Der gesicherte aktuelle Stand liegt zusaetzlich unter
`docs/migration/onepage-current/sitemap.xml`.

Fuer den Next-Neubau sollten nur freigegebene SEO-Seiten in `app/sitemap.ts`
stehen; interne Funnel-, Preis- oder Review-Seiten bleiben kontrolliert und
werden nicht als SEO-Ziele ausgebaut.
