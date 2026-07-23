---
name: code-factory-build
description: Implementiert genau ein freigegebenes Linear-Issue in einem Cursor Cloud Agent, führt Projektprüfungen aus und öffnet einen Draft-PR. Verwenden, wenn Cursor ein delegiertes Code-Factory-Issue erhält oder Review-Feedback innerhalb desselben Vertrags beheben soll.
---

# Ein Issue bauen oder denselben PR reparieren

Arbeite standardmäßig auf Deutsch mit dem Nutzer; Code, Commits und technische Bezeichner dürfen Englisch bleiben.

1. Lies `AGENTS.md`, `.code-factory/factory.json`, das vollständige Linear-Issue und alle Beziehungen. Beachte den Abschnitt `Cursor-Routing`; die Modell-Policy bleibt `Auto` und ein festes Basismodell darf nicht angefordert werden.
2. Erkenne den Modus: Ein `repair.issueLabel`-Unterissue mit verknüpftem PR bedeutet **Reparaturmodus**, andernfalls **Erstbau**.
3. Stoppe nur bei ungelöstem externem Blocker oder einer Produktentscheidung nach der engen Regel des `$code-factory-repair`. Technische Detailentscheidungen selbst treffen.
4. Im Erstbau einen Branch mit Issue-ID erzeugen. Im Reparaturmodus zwingend den bestehenden PR-Branch auschecken; keinen neuen Branch und keinen neuen PR erzeugen. Nur die Must-fix-Befunde des aktuellen Review-SHA innerhalb des ursprünglichen Vertrags umsetzen.
5. Ergänze relevante Tests. Führe alle nicht leeren Befehle aus `commands` aus.
6. Öffne nur im Erstbau bei längerer Arbeit früh einen Draft-PR, aber markiere ihn noch nicht als reviewbereit.
7. Nutze `$evidence-driven-testing` für UI-Beweise. Ergänze für Backend/Logik relevante Befehlsausgaben. Prüfe Diff und Status auf Fremdänderungen und Secrets.
8. Verknüpfe das Linear-Issue und fülle beziehungsweise aktualisiere die PR-Vorlage. Im Reparaturmodus müssen Unterissue, fehlerhafter SHA und neuer SHA nachvollziehbar sein.
9. Entferne vor dem Reparatur-Push `review.triggerLabel`, damit die PR-pushed-Automation nicht zu früh prüft. Entferne nach einem neuen Commit veraltete Labels `review.approvedLabel` und `review.changesRequestedLabel`.
10. Markiere den PR erst nach vollständigen Belegen als reviewbereit. Setze danach als letzte Build-Aktion `review.triggerLabel`. Dieses Label startet die getrennte Cursor-Automation mit `$code-factory-review`.
11. Poste PR-, Preview- und Beweislinks im Stamm-Issue und gegebenenfalls Repair-Unterissue und verschiebe das Stamm-Issue in den Review-Status. Starte `$finn-review` niemals in dieser Build-Session; die unabhängige Automation übernimmt ihn.

Merge niemals und aktiviere kein Auto-Merge. Wenn das Review-Trigger-Label nicht gesetzt werden kann, poste den Blocker in Linear und setze `needs-human-review`; behaupte nicht, der Review laufe. Produktfragen ausschließlich im kurzen Format des `$code-factory-repair` stellen; technische Detailfragen selbst entscheiden.
