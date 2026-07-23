---
name: greploop
description: Repariert einen bestehenden GitHub-Pull-Request iterativ anhand aktueller Greptile-Befunde, erneuert Tests und Evidence und lässt Greptile höchstens fünfmal prüfen, bis 5/5 und keine offenen Kommentare erreicht sind. Verwenden, wenn die Code-Factory-Repair-Automation einen roten Greptile-Review übernimmt; nicht für Erstbau, Issue-Erstellung oder Merge.
---

# Greploop für die Code Factory

Arbeite auf Deutsch. Dieser Skill ist die GitHub-/Code-Factory-Anpassung des MIT-lizenzierten Greploop-Skills von Greptile AI. Er baut keine neue Funktion aus einem Linear-Issue, sondern repariert ausschließlich einen bereits vorhandenen Pull Request.

## 1. Voraussetzungen und Stand sichern

- Lies `references/github-review-cycle.md` vollständig und verwende dessen commitgebundene GitHub-Abfragen.
- Lies `AGENTS.md`, `.code-factory/factory.json`, den vollständigen PR, das verknüpfte Linear-Issue und den aktuellen Evidence Report.
- Prüfe, dass die Greptile GitHub App für das Repository installiert und der Code indexiert ist. Die npm-CLI ist für diesen GitHub-Loop nicht erforderlich.
- Löse PR-Nummer, bestehenden PR-Branch und vollständige Head-SHA exakt auf. Erzeuge keinen neuen Branch und keinen neuen PR.
- Prüfe, dass der PR auf `github.pullRequestBaseBranch` und nicht direkt auf Produktion zielt.
- Verwende `Greploop review of HEAD_SHA` und `Greploop repair of FAILED_HEAD_SHA` als Idempotenzmarker. Starte keinen parallelen Lauf für denselben Stand.
- Lies `review.requiredScore`, `review.requireZeroUnresolvedComments` und `repair.maxGreptileReviewIterations` aus der Factory-Konfiguration. Im Standard sind das `5/5`, `true` und `5`.

## 2. Höchstens fünf Greptile-Zyklen ausführen

Zähle eine bereits vorliegende aktuelle Greptile-Prüfung als erste Iteration. Fordere niemals dieselbe Prüfung doppelt an.

Für jede Iteration:

1. Ermittle die aktuelle Head-SHA.
2. Suche den neuesten Greptile-Check, allgemeinen Greptile-Kommentar, PR-Review und alle offenen Greptile-Threads für exakt diese SHA. Verwende bei bearbeiteten Kommentaren den neuesten `updated_at`-Stand.
3. Läuft Greptile bereits, warte begrenzt auf den Abschluss. Fehlt für die aktuelle SHA eine Prüfung, poste genau einmal `@greptile review` und warte höchstens zehn Minuten. Bei Timeout nicht mit alten Ergebnissen weiterarbeiten.
4. Beende erfolgreich nur bei `5/5` und null offenen Greptile-Kommentaren.
5. Ist das konfigurierte Maximum erreicht, ändere keinen Code mehr. Setze `repair.limitLabel` und `review.humanReviewLabel`, liste die verbliebenen Befunde in Linear und stoppe.
6. Ordne jeden behebbaren Befund dem ursprünglichen `AC-N`/`NG-N`-Vertrag zu. Repariere nur die kleinste reversible Ursache innerhalb dieses Vertrags.
7. Löse einen Thread erst, nachdem die Änderung oder eine überprüfbare technische Begründung im Thread dokumentiert wurde. Produkt-, Sicherheits-, Daten- oder Berechtigungsfragen niemals still als Fehlalarm schließen.
8. Führe alle nicht leeren Befehle aus `commands` aus. Bei UI oder sichtbarer Funktionalität muss `$evidence-driven-testing` den betroffenen Vertrag auf dem neuen Commit erneut belegen und mindestens ein direkt erreichbares Erfolgs-Video liefern; alte Evidence gilt nach jedem Commit als veraltet.
9. Committe und pushe ausschließlich auf den bestehenden PR-Branch. Veröffentliche `Greploop repair iteration N of FAILED_HEAD_SHA -> NEW_HEAD_SHA` in PR und Linear.
10. Kehre mit der neuen SHA zu Schritt 1 zurück. Greptile prüft dadurch den tatsächlich reparierten Stand.

Ein neuer Commit darf erst an Greptile übergeben werden, wenn Qualitätsbefehle, Preview-Deployment und der neue commitgebundene Evidence Report vorliegen oder ein konkreter externer Blocker dokumentiert wurde.

## 3. Ergebnis übergeben

Veröffentliche in PR und Linear:

```md
Greploop complete of HEAD_SHA

- Greptile-Iterationen: N/5
- Ergebnis: 5/5 | Limit erreicht | blockiert
- Offene Greptile-Kommentare: N
- CI: grün | rot | ausstehend
- Evidence: aktuell | fehlt
- Erfolgs-Video: URL | nicht zutreffend bei reiner Backend-Änderung
- Preview: URL | fehlt
```

Bei Erfolg entferne `repair.runningLabel`, `review.changesRequestedLabel`, `repair.limitLabel` und `review.humanReviewLabel`. Setze danach `review.triggerLabel` als letzte Aktion, damit die getrennte Review-Automation nur noch das kleine aktuelle CI-/Preview-Gate prüft und den Preview-Link an den Menschen sendet.

## Harte Grenzen

- Höchstens fünf Greptile-Prüfungen pro automatischem Greploop-Lauf.
- Kein Erstbau, kein neues Produkt-Issue, kein neuer PR, kein Auto-Merge und kein Produktions-Deploy.
- Keine Änderung außerhalb des ursprünglichen Linear-Vertrags.
- Keine Erfolgsmeldung mit veraltetem SHA, fehlender Evidence, fehlendem UI-Video oder offenen Greptile-Kommentaren.
- Keine Secrets, personenbezogenen Daten oder Kundendaten in Logs, Aufnahmen, PR oder Linear.
