---
name: code-factory-review
description: Fordert in einem vom Build getrennten Cursor-Cloud-Lauf den commitgebundenen Greptile-Review an, übergibt rote Befunde an Greploop und prüft bei 5/5 nur noch CI, Evidence und Preview. Verwenden, wenn eine Cursor Automation durch factory-review-ready, einen neuen PR-Commit oder abgeschlossene Checks ausgelöst wird; ändert keinen Code und merged nie.
---

# Greptile-Review und kleines Abschluss-Gate

Arbeite auf Deutsch. Dieser Lauf muss von Build und Greploop-Reparatur getrennt sein.

## 1. Trigger und Stand prüfen

1. Lies `AGENTS.md`, `.code-factory/factory.json`, den PR und das verknüpfte Linear-Issue vollständig.
2. Beende ohne Seiteneffekt, wenn der PR ein Draft ist, `review.triggerLabel` fehlt, das Issue nicht eindeutig ist, dem verknüpften Linear-Issue das Label `linear.readyLabel` fehlt, der PR nicht zum konfigurierten Repository gehört oder `repair.runningLabel` gesetzt ist.
3. Ermittle die vollständige Head-SHA. Beende idempotent, wenn bereits ein vollständiger Kommentar `Code Factory review of HEAD_SHA` existiert.
4. Prüfe, dass der aktuelle Evidence Report und die Preview exakt zu dieser SHA gehören. Alte Belege sind ungültig.

## 2. Greptile unabhängig prüfen lassen

1. Suche für die Head-SHA Greptile-Check, neuesten allgemeinen Greptile-Kommentar, PR-Review und offene Greptile-Threads.
2. Läuft der Greptile-Check, warte begrenzt. Fehlt er, prüfe erneut `review.triggerLabel` am PR und `linear.readyLabel` am Linear-Issue und poste nur bei beiden Gates genau einmal `@greptile review` zusammen mit dem Marker `Greploop review of HEAD_SHA`.
3. Verwende nur das Ergebnis der aktuellen SHA. Erforderlich sind `review.requiredScore` und bei `review.requireZeroUnresolvedComments` null offene Greptile-Kommentare.
4. Bei roten Greptile-Befunden: veröffentliche die aktuelle Score-/Befundzusammenfassung in PR und Linear, entferne `review.approvedLabel` und setze `review.changesRequestedLabel` als letzte Aktion. Die getrennte Repair-Automation übernimmt mit `$greploop`.
5. Wenn `repair.limitLabel` oder `review.humanReviewLabel` gesetzt ist, starte keine weitere Reparatur und erkläre die verbliebenen Befunde in Linear.

Ändere keinen Code, löse keine Review-Threads, pushe nichts, öffne keinen PR und merge nie.

## 3. Kleines CI-/Preview-Gate

Erst nach Greptile `5/5` und null offenen Kommentaren:

1. **CI:** Alle in `github.requiredChecks` konfigurierten Checks sind für die Head-SHA erfolgreich und der PR besitzt keinen Konflikt.
2. **Zielbranch:** Der PR zielt auf `github.pullRequestBaseBranch` und niemals direkt auf Produktion.
3. **Evidence:** Der Evidence Report weist alle erforderlichen `EVD-N` für dieselbe SHA als bestanden aus. Bei sichtbarer Funktionalität ist mindestens ein direkt erreichbares Erfolgs-Video vorhanden.
4. **Preview:** Das erfolgreiche Preview-Deployment gehört zur Head-SHA, entspricht `preview.environment` und ist erreichbar oder nachvollziehbar durch Provider-Status plus aktuelle Evidence belegt.

Führe keine zweite Code-Review-Liste und keine neue Aufnahme durch. Dieses Gate kontrolliert nur die bereits erzeugten Ergebnisse.

## 4. Verdict und Preview veröffentlichen

Poste in GitHub und im Linear-Stamm-Issue:

```md
Code Factory review of HEAD_SHA

- Greptile: 5/5 | rot | fehlt
- Offene Greptile-Kommentare: N
- CI: grün | rot | ausstehend
- Evidence: aktuell | fehlt
- Preview: URL | fehlt
- Erfolgs-Video: URL | nicht zutreffend
- Pull Request: URL
- Merge-Ziel: STAGING_BRANCH
- Ergebnis: merge-bereit | Reparatur läuft | Mensch nötig
```

Bei grünem Gate entferne `review.changesRequestedLabel`, `repair.runningLabel`, `repair.limitLabel` und `review.humanReviewLabel`, setze `review.approvedLabel` und sende über `notifications.provider` eine Merge-ready-Nachricht mit direkten URLs für PR, Staging-Preview, Evidence Report und Erfolgs-Video sowie Greptile-Verdict, Head-SHA und Zielbranch. Formuliere ausdrücklich: „Bitte Preview und Video prüfen; Merge erst nach deinem ausdrücklichen Befehl.“

Bei fehlender Verknüpfung, dauerhaft unprüfbarer Umgebung oder rotem Abschluss-Gate setze `review.humanReviewLabel` und erkläre den Blocker in einfachen Sätzen.

Speichere höchstens eine abstrahierte, nicht sensible `Factory lesson`. Ein einzelner Lauf darf keinen Skill verändern. Kein Auto-Merge und kein Produktions-Deploy.
