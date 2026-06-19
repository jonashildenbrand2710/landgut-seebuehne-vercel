# Onepage Admin Redirects

Stand: 2026-06-19

Scope: Onepage-Projekt `Landgut Seebühne`, Hauptdomain
`www.landgut-seebuehne.de`.

Nachvalidierung 2026-06-19: Die Onepage-Domain-Einstellungen listen
`www.landgut-seebuehne.de` als Hauptdomain und `seebuehne.onepage.me` als
interne Domain. Eine separate Domain `www.landgut.se` war in diesem Projekt
nicht sichtbar.

## Domain-Einstellungen

- `www.landgut-seebuehne.de`
  - Status/Rolle: `Hauptdomain`
  - Typ: `CNAME`
- `seebuehne.onepage.me`
  - Status/Rolle: `Intern`

## Weiterleitungen

- Onepage-Bereich `Einstellungen > Weiterleitungen`: `0/1000`
- Anzeige: `Noch keine Weiterleitungen.`
- Es sind im Onepage-Admin keine Redirect-Regeln hinterlegt.

## Query-Parameter

Unter `Allgemein`:

- Query-Parameter weiterleiten: aktiv
- Nur UTM-Parameter weiterleiten: aktiv

## Relevanz fuer Next/Vercel

Da Onepage keine Redirects pflegt, muessen alte bekannte URLs im Next-Projekt
ueber `next.config.ts` abgesichert werden. Das betrifft besonders historische
`page-*`-URLs und interne Funnel-Seiten, die nicht als SEO-Seiten ausgebaut
werden sollen.
