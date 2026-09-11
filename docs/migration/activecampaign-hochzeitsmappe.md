# ActiveCampaign: Hochzeitsmappe

Stand: 2026-09-11

## Zielbild

Die oeffentliche URL `/hochzeitsmappe` ist eine indexierbare Landingpage mit
Opt-in-Formular. Die eigentliche Online-Hochzeitsmappe liegt geschuetzt unter
`/hochzeitsmappe/online` und ist nur mit einem gueltigen Zugangscookie sichtbar.

Preise und Leistungsbausteine werden weder auf der Website noch per E-Mail
ausgeliefert. Am Ende der Mappe fuehrt der CTA zu `/termin-buchen`, wo zwischen
Telefonat und Besichtigung gewaehlt wird.

## Zugangs- und E-Mail-Flow

1. `/hochzeitsmappe` zeigt Landingpage, Vorschau und Formular.
2. `POST /api/hochzeitsmappe` prueft Honeypot und Pflichtfelder.
3. Die Route erzeugt einen 90 Tage gueltigen, AES-256-GCM-verschluesselten
   Magic-Link ohne lesbare Kontaktdaten.
4. Der Lead wird ueber die Supabase Edge Function `POST /hochzeitsmappe-leads`
   gespeichert oder anhand der normalisierten E-Mail aktualisiert.
5. Der Kontakt wird in ActiveCampaign mit `POST /contact/sync` angelegt oder
   aktualisiert.
6. Der persoenliche Link wird in das Kontaktfeld `Hochzeitsmappe Zugangslink`
   (`%HOCHZEITSMAPPE_LINK%`) geschrieben.
7. Optionale Hochzeitsmappen-Tags werden gesetzt und der Kontakt wird in die
   konfigurierte Liste aufgenommen. Die Listenanmeldung startet fuer neue
   Kontakte die Automation `Hochzeitsmappe Opt-in`.
8. Bereits abonnierte Kontakte werden direkt erneut in die Automation aufgenommen,
   damit auch auf einem neuen Geraet ein frischer Zugangslink versendet wird.
9. Nach erfolgreicher Verarbeitung leitet die Website sofort ueber den Magic-Link
   weiter. Dieser setzt ein sicheres HttpOnly-Cookie und oeffnet
   `/hochzeitsmappe/online`.
10. Die erste ActiveCampaign-Mail enthaelt denselben persoenlichen Link, damit die
    Mappe spaeter erneut geoeffnet werden kann.

Ohne ActiveCampaign-Konfiguration bleibt `CONTACT_FORM_ENDPOINT` als Fallback
erhalten. Der Zugriff im Browser wird auch im Fallback-Fall direkt freigeschaltet,
wenn CRM und Fallback den Lead akzeptiert haben.

## Alte Preiswege

- `/preise`, `/preise-basis` und `/danke-preise` leiten dauerhaft auf
  `/termin-buchen` weiter.
- `/intern/hochzeitsmappe-alt` leitet dauerhaft auf die neue Landingpage
  `/hochzeitsmappe` weiter.
- Die alte externe Preis-Landingpage
  `https://kennenlernen.landgut-seebuehne.de/auftrag-info` muss ausserhalb dieses
  Repositories deaktiviert oder ebenfalls auf `/termin-buchen` weitergeleitet
  werden.

## Env-Variablen

```env
SUPABASE_FUNCTIONS_URL=
HOCHZEITSMAPPE_ACCESS_TOKEN=
HOCHZEITSMAPPE_MAGIC_LINK_SECRET=
ACTIVECAMPAIGN_API_URL=
ACTIVECAMPAIGN_API_KEY=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_AUTOMATION_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_LIST_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_TAG_IDS=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_ACCESS_URL_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_LEAD_MAGNET_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_PAGE_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_SOURCE_ID=
ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_SUBMITTED_AT_ID=
```

`HOCHZEITSMAPPE_MAGIC_LINK_SECRET` muss mindestens 32 zufaellige Zeichen lang
sein. Alle Variablen in diesem Abschnitt sind server-only.

## ActiveCampaign-Pruefung und Mail-Update

Der read-only Account-Audit laeuft mit:

```bash
npm run audit:activecampaign
```

Die geplante neue erste Mail kann ohne Aenderung als Vorschau geprueft werden:

```bash
npm run update:activecampaign:hochzeitsmappe
```

Die produktive Nachricht wird erst mit ausdruecklichem `--apply` aktualisiert.
Dabei bleiben Absender, Antwortadresse, Abmeldelink und Footer unveraendert.

### Vorbereiteter Wortlaut der ersten Mail

- Betreff: `Eure persoenliche Hochzeitsmappe der Seebuehne`
- Preheader: `Oeffnet euren persoenlichen Online-Begleiter fuer die Hochzeit am See.`
- Button: `Persoenliche Hochzeitsmappe oeffnen`
- Ziel: ActiveCampaign-Personalisierungsfeld `%HOCHZEITSMAPPE_LINK%`

Der Text erklaert den Online-Hochzeitsbegleiter und weist darauf hin, dass der
persoenliche Link 90 Tage gueltig bleibt. Preisuebersicht, Preis-Link und
Preis-CTA sind vollstaendig entfernt.
