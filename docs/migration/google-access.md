# Google-Zugriff fuer Migration und Redirects

Ziel: Wir wollen sehen, wie Landgut Seebuehne aktuell bei Google auftaucht,
welche URLs Klicks und Impressionen bekommen und welche Suchintentionen hinter
den URLs stehen. Dafuer brauchen wir keine Passwoerter. Am sichersten ist ein
Google-OAuth-Zugang mit Leserechten und ein lokaler Token in `.secrets/`.

## Empfohlene Zugriffe

1. Google Search Console
   - Rolle: `Full user` fuer die Property `sc-domain:landgut-seebuehne.de`
     oder `https://www.landgut-seebuehne.de/`.
   - Zweck: URLs, Suchanfragen, Klicks, Impressionen, Sitemaps,
     Indexierungs-/Crawling-Signale.
   - Offizielle Anleitung:
     https://support.google.com/webmasters/answer/7687615

2. Google Analytics 4
   - Rolle: `Viewer` oder `Analyst` reicht fuer die Migration.
   - Zusaetzlich benoetigt: numerische GA4 Property ID.
   - Zweck: Landingpages, echte Nutzung, Anfragen/Conversions.
   - Offizielle Anleitung:
     https://support.google.com/analytics/answer/9305587

3. Google Business Profile
   - Rolle: `Manager`, nicht Primaerinhaber.
   - Zweck: Google Maps, Rezensionen, Website-Link, Oeffnungszeiten,
     lokale Aussenwirkung.
   - Die API ist optional und braucht oft gesonderte Freigabe. Erst UI-Zugriff
     reicht.
   - Offizielle Anleitung:
     https://support.google.com/business/answer/3403100

4. Google Tag Manager und Google Ads
   - Nur noetig, wenn Tracking, Ads-Conversions oder Pixel final uebernommen
     werden sollen.
   - Fuer Analyse reicht meist Lesezugriff.
   - Tag Manager:
     https://support.google.com/tagmanager/answer/6107011
   - Google Ads:
     https://support.google.com/google-ads/answer/6372672

## API-Zugriff einrichten

### 1. Google Cloud Projekt anlegen

1. Oeffne https://console.cloud.google.com/
2. Projekt anlegen, z. B. `landgut-seebuehne-migration`.
3. APIs aktivieren:
   - `Google Search Console API`
   - `Google Analytics Data API`
   - optional spaeter: `Google Analytics Admin API`, `Tag Manager API`

Search Console API nutzt OAuth 2.0 fuer private Nutzerdaten. Die relevanten
Scopes sind `webmasters.readonly` oder `webmasters`.
Offizielle Doku:
https://developers.google.com/webmaster-tools/v1/how-tos/authorizing

### 2. OAuth Consent Screen

1. In Google Cloud zu `APIs & Services` -> `OAuth consent screen`.
2. App-Name z. B. `Landgut Seebuehne Migration`.
3. Publishing status kann fuer uns `Testing` bleiben.
4. Unter `Test users` das Google-Konto eintragen, mit dem du Search Console und
   GA4 freigibst.

### 3. OAuth Client ID erstellen

1. In Google Cloud zu `APIs & Services` -> `Credentials`.
2. `Create credentials` -> `OAuth client ID`.
3. Application type: `Desktop app`.
4. Client ID und Client Secret in `.env.local` eintragen.

Falls Google die Desktop-App bei deinem Konto nicht akzeptiert, nimm
`Web application` und erlaube als Redirect URI:

```text
http://127.0.0.1:8080/oauth2callback
```

### 4. Werte in `.env.local`

Diese Felder sind vorbereitet:

```dotenv
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REDIRECT_URI=http://127.0.0.1:8080/oauth2callback
GOOGLE_OAUTH_SCOPES=https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/analytics.readonly
GOOGLE_OAUTH_TOKEN_FILE=.secrets/google-oauth-token.json
GOOGLE_SEARCH_CONSOLE_SITE_URL=sc-domain:landgut-seebuehne.de
GOOGLE_GSC_START_DATE=
GOOGLE_GSC_END_DATE=
GOOGLE_GSC_ROW_LIMIT=25000
GOOGLE_GA4_PROPERTY_ID=
GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID=
GOOGLE_BUSINESS_PROFILE_LOCATION_ID=
```

Wenn Search Console keine Domain-Property hat, sondern nur eine URL-Prefix-
Property, dann `GOOGLE_SEARCH_CONSOLE_SITE_URL` exakt so setzen:

```dotenv
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://www.landgut-seebuehne.de/
```

Wichtig: `.env.local` und `.secrets/` sind lokal und duerfen nicht committed
werden.

### 5. Token lokal erzeugen

Nach dem Eintragen:

```bash
npm run google:auth
```

Das Script oeffnet bzw. zeigt eine Google-URL. Dort mit dem freigegebenen
Google-Konto anmelden und Zugriff bestaetigen. Danach liegt der Token lokal in:

```text
.secrets/google-oauth-token.json
```

### 6. Search-Console-Export laufen lassen

```bash
npm run audit:google-search
```

Das erzeugt:

```text
docs/migration/google-search-console/sites.json
docs/migration/google-search-console/sitemaps.json
docs/migration/google-search-console/search-pages.csv
docs/migration/google-search-console/search-queries.csv
docs/migration/google-search-console/search-page-query.csv
docs/migration/google-search-console/summary.md
```

Diese Daten nutzen wir danach, um `docs/migration/url-matrix.md` und
`next.config.ts` Redirects sauber zu ergaenzen.

## Sicherheitsnotizen

- Keine Google-Passwoerter teilen.
- Keine echten Secrets in Chat oder Git committen.
- Client Secret und Token koennen spaeter in Google Cloud bzw. im Google-Konto
  widerrufen werden.
- OAuth gibt dem Tool nur Zugriff auf die Google-Produkte, fuer die das
  angemeldete Google-Konto selbst berechtigt ist.
