# Bewerbungsfunnel-Nachbau

Stand: 2026-06-23

## Live-Referenz

Referenzseite: `https://www.landgut-seebuehne.de/bewerbung`

Die Seite ist ein eigenständiger Onepage-Funnel ohne normale Website-Navigation.
Sie nutzt eine schmale, mobile-first Spalte, einen Prozent-Fortschritt und
wechselt von warmer Team-Ansprache zu einem klaren Kontaktformular.

## Beobachtete Struktur

1. Einstieg mit grünem Vollflächen-Hintergrund, Teamfoto, weißem Logo, großer
   Serif-Headline und dunklem CTA:
   "Werde Teil eines besonderen Teams - an einem besonderen Ort."
2. Jobdetail für "Servicekraft (m/w/d) - Hochzeiten auf dem Landgut Seebühne"
   mit Standort, Arbeitgeber, Mini-Job, 5-10h/Woche, Qualifikationen, Aufgaben
   und Erwartungsblöcken.
3. Kontaktformular mit Progress `75%`, weißer Card, Feldern für Vorname,
   Nachname, Startdatum, E-Mail, deutsche Telefonnummer und optionalem
   Lebenslauf-Upload.

## Gestalterische Schlüsse

- Intro und Formular liegen auf Sage-Grün, der Jobdetail-Step auf warmem Creme.
- Headlines sind serifig und groß; Fließtext bleibt ruhig und sans-serif.
- CTA-Buttons sind pillenförmig mit kräftigem Schatten.
- Job-Abschnitte arbeiten mit großzügigen weißen Cards und einfachen Icons.
- Formularfelder sind groß, klar gerahmt und mit kurzer Validierungscopy
  versehen.
- `/bewerbung` bleibt eine kontrollierte `noindex, follow`-Seite und gehört
  nicht in die Sitemap.

## Integrationsstand

Stand: 2026-06-24

Der Bewerbungsfunnel versendet Bewerbungen serverseitig per IONOS-SMTP. Die
Produktivwerte liegen als Vercel Environment Variables, nicht im Code:
`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`,
`APPLICATION_MAIL_FROM` und `APPLICATION_MAIL_TO`.

Live getestet wurde eine Dummy-Bewerbung mit Anhang gegen
`https://www.landgut-seebuehne.de/api/bewerbung`; die Route antwortete mit
`303` auf `/bewerbung?status=success#bewerbungsformular`.

## Wiederverwendbarer Goal-Prompt

```text
/goal
Ziel: Analysiere die bestehende Live-Seite
https://www.landgut-seebuehne.de/bewerbung im In-App-Browser und baue im
Next.js-Projekt einen inhaltlich und gestalterisch stimmigen Nachbau unter
/bewerbung.

Arbeitsweise:
1. Öffne die Live-URL sichtbar im In-App-Browser und lasse bestätigen, dass es
   die richtige alte Referenzseite ist.
2. Klicke dich durch den Funnel, ohne die finale Live-Bewerbung abzusenden.
   Erfasse Progress-Schritte, Copy, Tonalität, Layout, Bilder, Formularfelder,
   Validierungscopy und CTA-Struktur.
3. Prüfe die Projektquellen: AGENTS.md, docs/migration, data/site.ts,
   app/[slug]/page.tsx, sitemap/robots und vorhandene Bilder.
4. Baue /bewerbung als kontrollierte noindex-Seite nach. Verwende lokale Assets
   und halte wiederverwendbare Copy/Daten außerhalb der JSX-Struktur, wenn es
   sinnvoll ist.
5. Erstelle nur dann eine echte Formularweiterleitung, wenn ein Server-Endpoint
   per Environment Variable dokumentiert und gesetzt werden kann. Ohne Endpoint
   keine falsche Erfolgsmeldung ausgeben.
6. Teste lint/build und prüfe die lokale Seite im Browser auf Desktop und mobil.
7. Dokumentiere Ergebnis, offene Integrationsrisiken und die geprüften Befehle.
```
