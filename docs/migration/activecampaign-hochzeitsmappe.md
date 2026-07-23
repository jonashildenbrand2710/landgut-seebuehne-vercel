# ActiveCampaign: Hochzeitsmappe

Stand: 2026-07-23

Ziel: Der OnePage/Zapier-Schritt fuer die Hochzeitsmappe wird durch eine
serverseitige Next.js-Integration ersetzt. Die Website nimmt den Lead entgegen,
speichert ihn zuerst im Supabase/CRM-Projekt, legt oder aktualisiert danach den
Kontakt in ActiveCampaign und schreibt das ActiveCampaign-Ergebnis wieder an den
CRM-Lead.

## Aus alter OnePage-Form uebernommen

Quelle: `docs/migration/onepage-current/pages/hochzeitsmappe.html`

- Formular-ID alt: `dd7ca618-459a-4ff6-9f13-72f9af3d2e5f`
- Button alt: `Jetzt Hochzeitsmappe erhalten`
- Felder: Vorname, Nachname, E-Mail, Telefon
- Submit-Mail war aktiv: `on_submit_send_mail: true`
- Success-Text alt: `Unsere Hochzeitsmappe ist auf dem Weg in dein Postfach!`
- Tracking alt: `CompleteRegistration`

## Aktueller Preis-Opt-in-Flow

1. `/hochzeitsmappe` zeigt die oeffentliche Dornrose-Hochzeitsmappe.
2. Der primaere CTA `Preise anfordern` fuehrt zum Formular unter
   `/intern/hochzeitsmappe-alt?preise=1#mappe-form`. Ohne den Parameter bleibt
   dort die vollstaendige alte Landingpage intern geparkt.
3. `POST /api/hochzeitsmappe` prueft Honeypot und Pflichtfelder.
4. Lead via Supabase Edge Function `POST /hochzeitsmappe-leads` speichern oder
   anhand der normalisierten E-Mail am vorhandenen Lead aktualisieren.
5. Kontakt via ActiveCampaign
   `POST /contact/sync` upserten.
6. Vor der Ausloesung pruefen, ob der Tag `Preise_angefordert` bereits besteht.
   Ist er vorhanden, wird der Kontakt nur aktualisiert und die Serie nicht erneut
   gestartet.
7. Neue oder noch nicht abonnierte Kontakte zuerst in die Liste
   `Hochzeitsmappe` aufnehmen. Dadurch startet wie bisher die Automation
   `Hochzeitsmappe Opt-in`.
8. Kontakte, die bereits in dieser Liste sind, einmalig direkt in dieselbe
   Automation aufnehmen. So erhaelt auch der bestehende Hochzeitsmappen-Altbestand
   die neue Preis-Mail.
9. Danach den separaten Tag `Preise_angefordert` als dauerhafte
   Wiederholungssperre setzen.
10. CRM-Lead via Supabase Edge Function `PATCH /hochzeitsmappe-leads` mit
   `activecampaign_status = "success"` oder `"failed"` aktualisieren.
11. Nach erfolgreicher Uebermittlung auf `/danke-preise` weiterleiten. Die Seite
   weist auf Posteingang, Spam- und Werbeordner hin.
12. Bestehende Magic-Links bleiben aus Rueckwaertskompatibilitaet gueltig und
    fuehren jetzt zur oeffentlichen URL `/hochzeitsmappe`.

Solange ActiveCampaign noch nicht vollstaendig konfiguriert ist, wird der
bisherige `CONTACT_FORM_ENDPOINT` als Fallback fuer die User Experience genutzt.
Der CRM-Lead wird in diesem Fall trotzdem mit `activecampaign_status = "failed"`
markiert, weil kein ActiveCampaign-Sync ueber die neue Route erfolgt ist. Sobald
AC-URL, API-Key und mindestens eine Zuordnung per Automation, Liste oder Tag
gesetzt sind, laeuft der Flow ueber ActiveCampaign.

## Env Variablen

```env
SUPABASE_FUNCTIONS_URL=https://guiudeaozmqalddthbzy.supabase.co/functions/v1
HOCHZEITSMAPPE_ACCESS_TOKEN=replace-with-same-token-as-supabase-edge-function
HOCHZEITSMAPPE_MAGIC_LINK_SECRET=
ACTIVECAMPAIGN_API_URL=
ACTIVECAMPAIGN_API_KEY=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_AUTOMATION_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_LIST_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_TAG_IDS=
ACTIVECAMPAIGN_PREISE_TAG_ID=15
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_ACCESS_URL_ID=5
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_LEAD_MAGNET_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_PAGE_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_SOURCE_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_SUBMITTED_AT_ID=
```

`SUPABASE_FUNCTIONS_URL`, `HOCHZEITSMAPPE_ACCESS_TOKEN` und
`HOCHZEITSMAPPE_MAGIC_LINK_SECRET` sind server-only Website-Variablen und duerfen
kein `NEXT_PUBLIC_` erhalten. Der erste Token muss zur Supabase Edge Function
passen; das Magic-Link-Secret muss mindestens 32 zufaellige Zeichen enthalten.
`ACTIVECAMPAIGN_HOCHZEITSMAPPE_TAG_IDS` ist kommasepariert.
`ACTIVECAMPAIGN_PREISE_TAG_ID` enthaelt ausschliesslich die einmalige
Wiederholungssperre fuer den Preis-Opt-in. Die bestehende Liste bleibt der
Automation-Trigger fuer neue Kontakte; bei bereits abonnierten Kontakten startet
die Integration dieselbe Automation einmalig direkt.
`CRM_API_KEY` bleibt als Fallback fuer `ACTIVECAMPAIGN_API_KEY` unterstuetzt.

## Account-Audit ohne Secrets im Output

Wenn die ActiveCampaign-Zugangsdaten lokal oder in der Shell gesetzt sind:

```bash
npm run audit:activecampaign
```

Das Skript listet Kampagnen, Automationen, Listen, Tags und Kontaktfelder mit
IDs. Es gibt keine API-Tokens und keine Kontakt-Personendaten aus.

## ActiveCampaign-Mail

- Die Automation `Hochzeitsmappe Opt-in` wird durch den Tag
  `Preise_angefordert` gestartet.
- Die erste E-Mail verlinkt fuer den Button `Preise & Leistungsbausteine ansehen`
  auf `https://kennenlernen.landgut-seebuehne.de/auftrag-info`.
- Absender, Antwortadresse, Abmeldelink, Impressum und alle spaeteren
  Automation-Mails bleiben unveraendert.
- Rechtstexte und Consent-Hinweise muessen final juristisch freigegeben werden,
  bevor daraus ein Marketing-Funnel im Livebetrieb wird.
