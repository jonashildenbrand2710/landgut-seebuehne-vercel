---
name: code-factory-review
description: Prüft automatisch einen reviewbereiten Code-Factory-PR in einem unabhängigen Cursor-Cloud-Lauf gegen Linear-Vertrag, Finn-review, CI, Preview und Evidence. Verwenden, wenn eine Cursor Automation durch factory-review-ready, einen neuen PR-Commit oder abgeschlossene Checks ausgelöst wird. Ändert keinen Code und merged nie.
---

# Automatischer unabhängiger Review

Arbeite standardmäßig auf Deutsch. Dieser Lauf muss von der Build-Session getrennt sein.

## 1. Trigger und Stand prüfen

1. Lies `AGENTS.md`, `.code-factory/factory.json`, den PR und das verknüpfte Linear-Issue vollständig.
2. Beende ohne Seiteneffekt, wenn der PR ein Draft ist, `review.triggerLabel` fehlt, das Issue nicht eindeutig ist oder der PR nicht zum konfigurierten Repository gehört.
3. Ermittle den aktuellen Head-SHA. Beende idempotent, wenn bereits ein vollständiger PR-Kommentar `Code Factory review of HEAD_SHA` existiert.
4. Entferne keine Labels und schreibe keinen Zwischen-Verdict, solange Required Checks oder eine erforderliche Preview noch laufen. Warte begrenzt; ein `Checks completed`-Trigger darf später erneut starten.

## 2. Unabhängig prüfen

- Führe `$finn-review` für den aktuellen PR und Head-SHA aus.
- Prüfe alle `AC-N` und `NG-N`, Mergeability und die in `github.requiredChecks` konfigurierten Checks.
- Prüfe, dass Preview und Evidence exakt zum Head-SHA gehören. Öffne die Preview und teste den beschriebenen Kernfluss, wenn Browserzugriff möglich ist.
- Werte nur reproduzierbare Belege. Alte Kommentare, Videos oder Checks eines früheren SHA sind ungültig.
- Arbeite kosten- und zeiteffizient: Starte keine Subagenten, keine Bildschirmaufnahmen und erstelle keine neuen Evidence-Artefakte. Nutze die vorhandene commitgebundene Evidence und höchstens einen direkten Browser- oder HTTP-Check.
- Ist die Vercel-Preview durch SSO geschützt, dokumentiere sie als `geschützt` und verwende den grünen Deployment-Status plus aktuelle Evidence für denselben Head-SHA. Blockiere nur, wenn die Evidence fehlt oder nicht zum aktuellen Head-SHA gehört.
- Führe lokale Qualitätsbefehle nur erneut aus, wenn GitHub-Checks fehlen, rot oder nicht eindeutig dem aktuellen Head-SHA zugeordnet sind.
- Ändere keinen Code, pushe keinen Commit, öffne keinen PR und merge nie.

## 3. Commitgebundenen Verdict veröffentlichen

Poste in GitHub und im Linear-Issue:

```md
Code Factory review of HEAD_SHA

- Vertrag: grün | rot
- CI: grün | rot | ausstehend
- Finn-review: loop-approved | changes-requested
- Preview: URL | fehlt
- Evidence: aktuell | fehlt

## Muss vor Merge behoben werden
Keine. | konkrete Befunde

## Sollte bald verbessert werden
Keine. | konkrete Befunde

## Sicher zu mergen
Ja, nach menschlichem Preview-Check und ausdrücklichem Merge-Befehl. | Nein, Grund
```

Bei fünf grünen Gates: entferne `review.changesRequestedLabel`, `review.humanReviewLabel`, `repair.runningLabel` und `repair.limitLabel`, setze `review.approvedLabel`.

Bei klaren Must-fix-Befunden: entferne `review.approvedLabel`. Ermittle die Zahl der eindeutigen `Code Factory repair round`-Marker seit der neuesten `Code Factory human decision`.

- Unter `repair.maxAutomaticRoundsPerGate`: veröffentliche zuerst den vollständigen Verdict und setze danach `review.changesRequestedLabel` als letzte Aktion. Dadurch startet die getrennte `$code-factory-repair`-Automation.
- Am Limit: setze nicht `review.changesRequestedLabel`, sondern `repair.limitLabel` und `review.humanReviewLabel`. Stelle in Linear genau eine kurze Frage mit Empfehlung und den Antworten `Weiter` oder `Stop`. Bei `Weiter` beginnt nach der menschlichen Antwort ein neuer Block von höchstens drei Runden.

Entscheide technische Details selbst. Frage nur bei einer wesentlichen Änderung von sichtbarem Produktverhalten, Daten, Auth, Berechtigungen, Datenschutz, Zahlung, Recht oder irreversibler Außenwirkung. Formuliere dann in Linear genau eine kurze Frage mit höchstens drei klaren Antworten und einer empfohlenen Option. Bei fehlender Verknüpfung oder dauerhaft unprüfbarer Umgebung: entferne `review.approvedLabel`, setze `review.humanReviewLabel` und erkläre den Blocker in einfachen Sätzen.

Die Benachrichtigung und jede seltene Rückfrage laufen über Linear/Cursor. Der Mensch startet keinen Review- oder Repair-Skill; seine kurze Linear-Antwort wird vom Repair-Loop weiterverwendet. Er prüft erst den fertigen Preview-Link und gibt später den Merge ausdrücklich frei.
