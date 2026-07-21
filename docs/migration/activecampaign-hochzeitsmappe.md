# ActiveCampaign: Hochzeitsmappe

Stand: 2026-07-21

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

## Neuer Flow

1. `POST /api/hochzeitsmappe`
2. Honeypot und Pflichtfelder pruefen.
3. Einen 90 Tage gueltigen, AES-256-GCM-verschluesselten Magic-Link erzeugen.
   Der Link enthaelt keine lesbaren Kontaktdaten.
4. Lead via Supabase Edge Function `POST /hochzeitsmappe-leads` speichern.
5. Nur wenn der CRM-Lead gespeichert wurde: Kontakt via ActiveCampaign
   `POST /contact/sync` upserten.
6. Den persoenlichen Link in das ActiveCampaign-Kontaktfeld
   `Hochzeitsmappe Zugangslink` (`%HOCHZEITSMAPPE_LINK%`, Feld-ID `5`) schreiben.
7. Optionale Tags setzen.
8. Optionale Liste abonnieren. Im aktuellen Account startet diese Anmeldung die
   Automation fuer den persoenlichen Hochzeitsmappen-Zugang.
9. Die Automation nur dann direkt starten, wenn keine Liste konfiguriert ist.
   Liste und direkter Automation-Start duerfen nicht kombiniert werden, weil der
   Kontakt sonst zweimal in dieselbe Automation eintritt und die erste E-Mail
   doppelt versendet werden kann.
10. CRM-Lead via Supabase Edge Function `PATCH /hochzeitsmappe-leads` mit
   `activecampaign_status = "success"` oder `"failed"` aktualisieren.
11. Sofort zum Magic-Link weiterleiten. Dieser setzt ein sicheres HttpOnly-Cookie
    und oeffnet die saubere URL `/hochzeitsmappe-dornrose` ohne Token im Browser.
12. Direkte Aufrufe ohne gueltiges Cookie werden zur Opt-in-Seite zurueckgeleitet.
    Der personalisierte Link in der ersten E-Mail stellt den Zugang spaeter erneut her.

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
`CRM_API_KEY` bleibt als Fallback fuer `ACTIVECAMPAIGN_API_KEY` unterstuetzt.

## Account-Audit ohne Secrets im Output

Wenn die ActiveCampaign-Zugangsdaten lokal oder in der Shell gesetzt sind:

```bash
npm run audit:activecampaign
```

Das Skript listet Kampagnen, Automationen, Listen, Tags und Kontaktfelder mit
IDs. Es gibt keine API-Tokens und keine Kontakt-Personendaten aus.

## ActiveCampaign-Mail

- Die internen Bezeichnungen im Live-Account sind auf den neuen Flow
  vereinheitlicht: Automation `Hochzeitsmappe Opt-in`, Kampagne
  `Hochzeitsmappe – Persönlicher Zugang`, Tags `Hochzeitsmappe_Optin` und
  `Hochzeitsmappe`. Der alte Tippfehler-Tag wurde als
  `Hochzeitsmappe_Altbestand` kenntlich gemacht.
- Die Hochzeitsmappen-Automation wird weiterhin ueber die Liste
  `Hochzeitsmappe` gestartet. Alte Report-Bezeichnungen sollen auch im
  ActiveCampaign-Account nicht mehr in Betreff, Vorschautext oder Mail-Inhalt
  erscheinen.
- Die erste E-Mail verwendet fuer den Button zur Online-Hochzeitsmappe das
  Personalisierungsfeld `%HOCHZEITSMAPPE_LINK%` statt des bisherigen Google-Drive-Links.
- Bestehende Kontakte ohne Feldwert erhalten keinen geratenen oder oeffentlichen
  Ersatzlink; ein neuer Opt-in erzeugt immer einen frischen Zugang.
- Rechtstexte und Consent-Hinweise muessen final juristisch freigegeben werden,
  bevor daraus ein Marketing-Funnel im Livebetrieb wird.
