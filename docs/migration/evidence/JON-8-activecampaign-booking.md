# JON-8 – ActiveCampaign-Bestätigung nach Besichtigungsbuchung

Stand: 23.07.2026  
Getesteter Implementierungscommit: `06726fdb9d79c8b0395dfbc11eb330299ceb4bd4`

Der Evidenz-Commit ergänzt ausschließlich diesen Report und die zugehörigen
Aufnahmen. Am getesteten Anwendungscode wurde danach nichts verändert.

## Verknüpfte ActiveCampaign-Strecke

- Automation `#4 Erstgespräch_Optin`, aktiv und für Mehrfacheinstieg freigegeben
- Einstieg für neue Kontakte über Liste `#4 Erstgesprächfunnel`
- Bestehende aktive Listenkontakte werden direkt erneut in Automation `#4`
  aufgenommen
- Sofortige erste Nachricht: Kampagne `#36`
- Betreff: `%FIRSTNAME%, eure Besichtigung auf der Seebühne ist bestätigt`
- Tag `#5 Besichtigung_gebucht`

## EVD-1 – Konfiguration und Automation

Die ActiveCampaign-API wurde vor der Implementierung ausgelesen. Automation,
Liste, Tag, Feld-IDs und erste Sendestufe entsprechen der oben dokumentierten
Strecke. Die IDs werden ausschließlich als Environment Variables konfiguriert;
API-Schlüssel oder andere Secrets sind nicht im Repository enthalten.

## EVD-2 – Erste echte Besichtigungsbuchung

- Vorschau-Deployment des Implementierungscommits geöffnet
- Freien Termin am 26.07.2026 um 11:00 Uhr ausgewählt
- Buchungsflow mit dem freigegebenen Testkontakt vollständig abgesendet
- UI-Ergebnis: `Termin ist gebucht.`
- CRM-Referenz: `L-1341`
- UI-Ergebnis für die Mail: `Bestätigungsmail ... unterwegs.`
- ActiveCampaign-Automationseintritt: `4035`
- Ausgeführter Sendeblock: `43`, danach Wechsel in Warteblock `42`
- ActiveCampaign-E-Mail-Aktivität: `16`

Ergebnis: bestanden.

## EVD-3 – Wiederholung mit derselben E-Mail-Adresse

- Dieselbe Adresse erneut verwendet
- Termin von 11:00 Uhr auf 12:00 Uhr geändert
- UI erneut erfolgreich abgeschlossen
- CRM-Referenz blieb `L-1341`
- ActiveCampaign-Automationseintritt: `4036`
- Ausgeführter Sendeblock: `43`, danach Wechsel in Warteblock `42`
- ActiveCampaign-E-Mail-Aktivität: `17`
- Anschließender Verfügbarkeitscheck: 11:00 Uhr war wieder frei, 12:00 Uhr
  belegt

Ergebnis: bestanden. Eine erneute Buchung mit derselben Adresse aktualisiert den
bestehenden Lead und verschiebt dessen bestehenden Kalendertermin. Sie legt
keinen parallelen zweiten Besichtigungstermin an, löst aber erneut eine
Bestätigungsmail aus.

## EVD-4 – Ladeanimation und UI

Der finale Button wechselt während der Verarbeitung in den deaktivierten Zustand
`Besichtigung wird gebucht`. Die Ladeanzeige ist ein eigener kreisförmiger
CSS-Spinner mit linearer Transform-Animation. Im Beweisvideo ist der
Formulardurchlauf beschleunigt; Absenden, Spinner und Erfolgszustand laufen in
Echtzeit.

## Artefakte

- [Kurzes E2E-Video, öffentlich redigiert](./JON-8-activecampaign-booking-flow-redacted.mp4)
- [Erfolgszustand, öffentlich redigiert](./JON-8-booking-success-redacted.png)
- [Verfügbarkeit nach der Umbuchung](./JON-8-repeat-reschedule-availability.png)

Die öffentlich versionierten Artefakte enthalten keine sichtbaren persönlichen
Kontaktdaten. Das unredigierte Video wird dem Auftraggeber lokal in Codex
bereitgestellt.

## Qualitätsnachweise

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run audit:activecampaign`

Alle vier Prüfungen waren erfolgreich.
