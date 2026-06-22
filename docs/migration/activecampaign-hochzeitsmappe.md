# ActiveCampaign: Hochzeitsmappe

Stand: 2026-06-21

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
3. Lead via Supabase Edge Function `POST /hochzeitsmappe-leads` speichern.
4. Nur wenn der CRM-Lead gespeichert wurde: Kontakt via ActiveCampaign
   `POST /contact/sync` upserten.
5. Optionale Custom Fields mitschreiben.
6. Optionale Tags setzen.
7. Optionale Liste abonnieren.
8. Optionale Automation starten.
9. CRM-Lead via Supabase Edge Function `PATCH /hochzeitsmappe-leads` mit
   `activecampaign_status = "success"` oder `"failed"` aktualisieren.
10. Redirect nach `/danke?source=hochzeitsmappe` oder bei Integrationsfehlern
    wie bisher nach `/kontaktformular`.

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
ACTIVECAMPAIGN_API_URL=
ACTIVECAMPAIGN_API_KEY=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_AUTOMATION_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_LIST_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_TAG_IDS=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_LEAD_MAGNET_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_PAGE_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_SOURCE_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_SUBMITTED_AT_ID=
```

`SUPABASE_FUNCTIONS_URL` und `HOCHZEITSMAPPE_ACCESS_TOKEN` sind server-only
Website-Variablen und duerfen kein `NEXT_PUBLIC_` erhalten. Derselbe Token muss
zur Supabase Edge Function passen.
`ACTIVECAMPAIGN_HOCHZEITSMAPPE_TAG_IDS` ist kommasepariert.
`CRM_API_KEY` bleibt als Fallback fuer `ACTIVECAMPAIGN_API_KEY` unterstuetzt.

## Account-Audit ohne Secrets im Output

Wenn die ActiveCampaign-Zugangsdaten lokal oder in der Shell gesetzt sind:

```bash
npm run audit:activecampaign
```

Das Skript listet Kampagnen, Automationen, Listen, Tags und Kontaktfelder mit
IDs. Es gibt keine API-Tokens und keine Kontakt-Personendaten aus.

## Offene operative Punkte

- Die konkrete Automation oder Tag-Trigger-Logik muss im ActiveCampaign-Account
  mit den drei bestehenden Kampagnen abgeglichen werden.
- Die erste E-Mail der Automation sollte die Hochzeitsmappe senden und als
  Absender die freigegebene Domain-Adresse verwenden.
- Rechtstexte und Consent-Hinweise muessen final juristisch freigegeben werden,
  bevor daraus ein Marketing-Funnel im Livebetrieb wird.
