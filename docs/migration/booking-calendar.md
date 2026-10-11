# Buchungsregeln und manuelle Kalendersperren

Stand: 11. Oktober 2026.

Telefontermine und Besichtigungen sind an allen sieben Wochentagen von
10:00 bis 20:00 Uhr in der Zeitzone `Europe/Berlin` möglich. Telefontermine
dauern 30 Minuten, Besichtigungen 90 Minuten. Beginn ist jeweils zur vollen
oder halben Stunde; der gesamte Termin muss bis 20:00 Uhr beendet sein.

Telefontermine und Besichtigungen sind bis zu drei Wochen im Voraus auswählbar.
Der Kalender zeigt 21 Tage; der früheste Beginn bleibt ungefähr 24 Stunden
nach dem aktuellen Zeitpunkt. Sieben Tage bezeichnet die Wochentage.

## Verfügbarkeit im Google-Kalender steuern

Sperren müssen im mit `GOOGLE_CALENDAR_ID` verbundenen Kalender angelegt
und als **Beschäftigt** markiert werden:

- Ein Termin mit Start- und Endzeit blockiert alle überlappenden Telefonate
  und Besichtigungen. Beispiel: 12:00 bis 14:00 Uhr sperrt diesen Zeitraum;
  eine 90-minütige Besichtigung darf auch nicht von 11:00 bis 12:30 laufen.
- Ein ganztägiger Eintrag blockiert den gesamten lokalen Kalendertag.
- Mehrtägige oder wiederkehrende Beschäftigt-Einträge blockieren entsprechend
  alle betroffenen Tage bzw. Zeiträume.
- **Frei** markierte oder abgesagte Einträge blockieren nichts.
- Erfolgreiche Website-Buchungen blockieren ebenfalls ihren belegten Zeitraum.

Es gibt keine zusätzliche Pufferzeit. Direkt angrenzende Termine sind möglich.
Beim Laden der Verfügbarkeit und beim Abschicken der Buchung wird der
Google-Kalender geprüft. Alle Google-Ergebnisseiten werden berücksichtigt.
Die Verfügbarkeitsantwort enthält alle freien Zeitfenster im angefragten
Zeitraum und wird nicht nach einer festen Anzahl von Terminen abgeschnitten.
Ganztägige Einträge werden in der Kalender-Zeitzone einschließlich
Sommer-/Winterzeit ausgewertet; ihr Enddatum ist exklusiv.

## Wartung und Prüfung

Die produktiven Regeln stehen in
`supabase/functions/website-booking/slot-policy.ts`, die Verarbeitung der
Google-Sperren in `calendar-busy.ts`. Die lokale Vorschau in
`app/api/booking/availability/route.ts` bildet dieselben sieben Wochentage ab.

Nach Änderungen `npm run test:booking-calendar`, `npm run lint`,
`npm run typecheck` und `npm run build` ausführen. Für produktive Regeländerungen
die Supabase Edge Function `website-booking` mit allen relativen Abhängigkeiten
bereitstellen und beide Terminarten über `/api/booking/availability` prüfen.
Eine Vercel-Bereitstellung allein aktualisiert die Edge Function nicht.
