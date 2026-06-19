# Onepage Admin Tracking And Integrations

Stand: 2026-06-19

Scope: Onepage-Projekt `Landgut Seebühne`, Hauptdomain
`www.landgut-seebuehne.de`.

Alle IDs und Tokens sind absichtlich redigiert. Echte Werte gehoeren nicht in
Git, sondern in `.env.local` und Vercel Project Settings.

## Integrationen

- Google Tag: aktiv
  - Feld `trGtag`: `AW-1677...[redacted]`
  - IP anonymisieren: aus
- Facebook Pixel: aktiv
  - Pixel-ID: `4601...[redacted]`
  - Conversion API Zugriffstoken: vorhanden, `EA...[redacted]`
- TikTok Pixel: aus
- LinkedIn Insight Tag: aus
- Hotjar: aus
- Google Maps: aus
- Google ReCaptcha: aus
- Onepage Analytics: aktiv

## Code-Snippets

Onepage `Einstellungen > Code`:

- `<head>`:
  - Google Tag Manager Script vorhanden
  - Container-ID: `GTM-...[redacted]`
- `<body>`:
  - Google Tag Manager noscript iframe vorhanden
  - Container-ID: `GTM-...[redacted]`
- `Styles`:
  - leer

## Cookie-Banner

Cookie-Banner ist konfiguriert; die sichtbare Auswahl wirkt wie
`Benachrichtigung`.

- Titel: `Wir verwenden Cookies`
- Beschreibung: ausfuehrlicher Cookie-Hinweis mit funktionalen Cookies,
  Performance und Marketing
- Button: `Akzeptieren`
- Cookie-Richtlinie:
  - Titel: `Datenschutzerklärung`
  - URL: leer

## Env-Mapping fuer Next/Vercel

Vorhandene bzw. sinnvolle Variablennamen:

- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `META_CONVERSION_API_ACCESS_TOKEN`
- `NEXT_PUBLIC_GSC_VERIFICATION`
- `NEXT_PUBLIC_BING_VERIFICATION`

Keine echten Werte in `.env.example`, Code oder Dokumentation eintragen.
