# Bestätigungsmails für Website-Termine

Stand: 11.09.2026

## Zielbild

Nach einer erfolgreichen Buchung über `/termin-buchen` erhält der Kontakt eine
eigene Bestätigung für genau den gewählten Funnel:

- Besichtigung: Termin, Adresse und Dauer von ca. 90 Minuten
- Telefontermin: Termin, angerufene Telefonnummer und Dauer von ca. 30 Minuten

Beide Nachrichten enthalten zusätzlich eine `.ics`-Kalenderdatei. Ein Fehler
beim Mailversand macht die bereits erfolgreiche CRM- und Kalenderbuchung nicht
rückgängig. Die Erfolgsseite weist in diesem Fall darauf hin, nicht erneut zu
buchen.

## Aktiver Versandweg: Jonas SMTP

`BOOKING_CONFIRMATION_PROVIDER=smtp` verschickt beide Transaktionsmails über die
bereits eingerichteten `SMTP_*`-Variablen. ActiveCampaign bleibt parallel für
Kontakt-Synchronisierung, Funnel-Tags und Buchungsfelder zuständig. Es wird in
diesem Modus bewusst keine ActiveCampaign-Automation gestartet, damit keine
doppelte Bestätigung entsteht.

Die Produktions-SMTP-Verbindung wurde mit `transporter.verify()` geprüft. Dabei
wurde keine E-Mail verschickt.

Die Inhalte und Kalenderdateien lassen sich ohne externe Nebenwirkungen prüfen:

```bash
npm run test:booking-confirmations
```

Der Test deckt beide Funneltexte, Zeitzone, HTML-Escaping sowie die getrennten
`.ics`-Inhalte ab.

## ActiveCampaign-Auftrennung

Vorhanden beziehungsweise angelegt:

- Tag `Besichtigung_gebucht` (`#5`)
- Tag `Telefontermin_gebucht` (`#16`)
- Feld `Booking Terminart` (`#6`)
- Feld `Booking Termin Start` (`#7`)
- Feld `Booking Termin Ende` (`#8`)
- bestehende Felder für Lead-Nummer, Status und Website

Die öffentliche ActiveCampaign-API kann Kontakte synchronisieren, Listen
abonnieren und aktive Automationen starten. Sie kann eine neue Automation mit
Starttrigger und Sendeschritten jedoch nicht vollständig erstellen und
verdrahten. Deshalb ist der sichere sofortige Produktionsweg SMTP.

Wenn später vollständig auf ActiveCampaign-Versand umgestellt werden soll:

1. Eine eigene Liste und eine aktive Automation für Besichtigungen verwenden.
2. Eine zweite eigene Liste und Automation für Telefontermine erstellen.
3. In jede Automation genau eine sofortige Bestätigungsmail legen.
4. Mehrfacheinstieg aktivieren, damit Umbuchungen erneut bestätigt werden.
5. Die sechs Flow-Variablen `ACTIVECAMPAIGN_BOOKING_{TOUR|PHONE}_*` setzen.
6. Erst nach einem Test beider Flows `BOOKING_CONFIRMATION_PROVIDER` auf
   `activecampaign` ändern.

Neue Kontakte gelangen über den Listen-Trigger in die jeweilige Automation.
Bereits aktive Listenkontakte werden direkt erneut in die Automation aufgenommen.
So entsteht beim ersten Eintritt keine Doppelmail, eine spätere Umbuchung wird
aber erneut bestätigt.

## Konfiguration

```dotenv
BOOKING_CONFIRMATION_PROVIDER=smtp
BOOKING_MAIL_FROM=Landgut Seebühne <mail@landgut-seebuehne.de>
BOOKING_MAIL_REPLY_TO=mail@landgut-seebuehne.de
BOOKING_MAIL_BCC=

ACTIVECAMPAIGN_BOOKING_TOUR_AUTOMATION_ID=
ACTIVECAMPAIGN_BOOKING_TOUR_LIST_ID=
ACTIVECAMPAIGN_BOOKING_TOUR_TAG_IDS=5
ACTIVECAMPAIGN_BOOKING_PHONE_AUTOMATION_ID=
ACTIVECAMPAIGN_BOOKING_PHONE_LIST_ID=
ACTIVECAMPAIGN_BOOKING_PHONE_TAG_IDS=16
ACTIVECAMPAIGN_BOOKING_FIELD_APPOINTMENT_TYPE_ID=6
ACTIVECAMPAIGN_BOOKING_FIELD_SLOT_START_ID=7
ACTIVECAMPAIGN_BOOKING_FIELD_SLOT_END_ID=8
```

`npm run setup:activecampaign:booking` prüft die benötigten Tags und Felder
schreibgeschützt. Mit `npm run setup:activecampaign:booking:apply` werden nur
fehlende Einträge angelegt; der Lauf ist wiederholbar.

## Checkliste vor dem Produktionsdeployment

1. `npm run test:booking-confirmations`, `npm run lint`, `npm run typecheck` und
   `npm run build` müssen grün sein.
2. Die Production-Variablen in Vercel müssen vollständig sein; der aktive
   Provider bleibt `smtp`.
3. Nach dem Deployment eine Besichtigung und einen Telefontermin mit einer
   kontrollierten Testadresse buchen.
4. Eingang, Absender, Antwortadresse, Terminwerte und `.ics`-Import prüfen.
5. In ActiveCampaign kontrollieren, dass jeweils nur der passende Funnel-Tag
   sowie Terminart, Start und Ende gespeichert wurden.
6. Erst danach reale Buchungen über die Landingpages freigeben beziehungsweise
   den Testkontakt und die Testkalendereinträge bereinigen.
