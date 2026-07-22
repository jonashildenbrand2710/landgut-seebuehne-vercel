---
name: evidence-driven-testing
description: Erstellt commitgebundene, reproduzierbare Nachweise für sichtbares UI-Verhalten und veröffentlicht einen deutschen Evidence Report für Pull Request und Linear-Issue. Verwenden, wenn eine UI-Änderung anhand ihrer Akzeptanzkriterien mit Preview, Screenshots, Video oder Browser-Beobachtungen belegt werden muss.
---

# Nachweisorientiert testen

Belege nur, was im tatsächlich geöffneten Build beobachtet wurde. Ein erfolgreicher Build allein ist kein Nachweis für korrektes UI-Verhalten.

## 1. Prüfvertrag festlegen

- Lies das verknüpfte Linear-Issue und ordne jedem relevanten `AC-N` mindestens eine prüfbare Aussage `EVD-N` zu.
- Notiere Repository, Branch, vollständige Commit-SHA und die getestete Preview- oder lokale URL.
- Beschreibe Ausgangszustand, Aktionen und erwartetes sichtbares Ergebnis so, dass ein Mensch den Lauf wiederholen kann.
- Prüfe nur den aktuellen Auftrag. Nicht-Ziele `NG-N` bleiben verbindlich.

## 2. Testumgebung vorbereiten

- Öffne exakt den Deployment-Stand, der zur notierten Commit-SHA gehört.
- Stelle nötige Testdaten her, ohne Produktionsdaten oder fremde Konten zu verändern.
- Verberge Passwörter, Tokens, personenbezogene Daten und Benachrichtigungen vor jeder Aufnahme.
- Halte fehlende Zugänge, instabile Umgebungen oder nicht verfügbare Aufnahmefunktionen ausdrücklich als Einschränkung fest.

## 3. Verhalten ausführen und beobachten

Führe jede Aussage einzeln aus:

1. Zeige den relevanten Ausgangszustand.
2. Führe die notwendigen Nutzerschritte in nachvollziehbarer Reihenfolge aus.
3. Vergleiche das beobachtete Ergebnis mit `AC-N`.
4. Vergib genau einen Status: `bestanden`, `fehlgeschlagen` oder `nicht prüfbar`.
5. Sichere einen geeigneten Beleg: Screenshot für einen Zustand, Video für Bewegung oder mehrstufige Abläufe, Browser-/Testprotokoll für technische Fakten.

Behaupte keinen Erfolg, wenn das Ergebnis nicht sichtbar oder anderweitig messbar war. Ein fehlender Beleg ist `nicht prüfbar`, nicht `bestanden`.

## 4. Evidence Report schreiben

Verwende diese Struktur:

```md
## Evidence Report

- Commit: `<vollständige SHA>`
- Umgebung: `<Preview- oder lokale URL>`
- Linear: `<ISSUE-ID + URL>`
- Ergebnis: `<bestanden | fehlgeschlagen | teilweise/nicht prüfbar>`

| Evidenz | Vertrag | Schritte | Erwartet | Beobachtet | Beleg | Status |
| --- | --- | --- | --- | --- | --- | --- |
| EVD-1 | AC-1 | ... | ... | ... | ... | ... |

### Einschränkungen
- Keine, oder konkrete Lücke mit Ursache und nächstem Prüfschritt.
```

Jeder Artefakt-Link muss für Reviewer erreichbar sein. Nenne bei Video oder Screenshot kurz, welche Aussage darin an welcher Stelle sichtbar ist.

## 5. Ergebnis veröffentlichen

- Ergänze den Report am aktuellen Pull Request und verlinke ihn im Linear-Issue.
- Prüfe unmittelbar vorher erneut die PR-Head-SHA. Bei einer neuen SHA ist die alte Evidenz veraltet und der Lauf muss wiederholt werden.
- Ändere während dieses Prüflaufs keinen Produktcode. Funde werden berichtet und anschließend in einem getrennten Build-Lauf behoben.
- Merge niemals aufgrund dieses Skills. Evidence ergänzt CI und den unabhängigen Review, ersetzt beides aber nicht.
