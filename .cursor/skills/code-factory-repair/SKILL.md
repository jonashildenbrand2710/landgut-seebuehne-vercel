---
name: code-factory-repair
description: Startet in einer getrennten Cursor-Cloud-Session den Greploop für einen roten Greptile-Review, verfolgt den Lauf in genau einem Linear-Unterissue und stoppt nach höchstens fünf Greptile-Iterationen. Verwenden, wenn die Repair-Automation durch loop-changes-requested ausgelöst wird; arbeitet nur im bestehenden Pull Request und merged nie.
---

# Greploop-Reparatur koordinieren

Arbeite auf Deutsch. Diese Automation ist nur die sichere Hülle um `$greploop`; sie führt keinen zweiten eigenen Reparatur-Loop aus.

## 1. Kontext und Idempotenz sichern

1. Lies `AGENTS.md`, `.code-factory/factory.json`, den vollständigen PR, das Stamm-Issue, den aktuellen Greptile-Review und vorhandene Repair-Unterissues.
2. Löse PR-Branch, fehlgeschlagene Head-SHA, Greptile-Score und offene Greptile-Kommentare eindeutig auf.
3. Beende ohne Seiteneffekt bei Draft, falschem Repository, fehlendem Review, bereits grünem `review.approvedLabel`, gesetztem `repair.runningLabel` oder bestehendem Marker `Greploop repair of FAILED_HEAD_SHA`.
4. Beende bei `repair.limitLabel`, solange kein Mensch ausdrücklich einen neuen Greploop-Lauf für genau diesen PR freigegeben hat. Das automatische Limit bleibt fünf.

## 2. Ein Linear-Unterissue für den Lauf führen

Erstelle oder verwende genau ein Unterissue mit `repair.issueLabel`:

```md
# Greploop Repair: ROOT_ID

- Stamm-Issue: ROOT_ID + URL
- Pull Request: URL
- Bestehender PR-Branch: BRANCH
- Start-SHA: FAILED_HEAD_SHA
- Marker: Greploop repair of FAILED_HEAD_SHA
- Maximum: 5 Greptile-Iterationen

## Reparaturvertrag
- aktuelle Greptile-Must-fix-Befunde
- ursprüngliche AC-N und NG-N bleiben bindend
- kein neuer Branch, kein neuer PR, kein Merge
```

Die ursprüngliche menschliche Build-Freigabe gilt für diese in-scope Reparaturen weiter. Setze `repair.runningLabel`, entferne `review.triggerLabel` und `review.approvedLabel`.

## 3. Greploop ausführen

Rufe `$greploop` für den bestehenden PR auf. Der Skill:

- verwendet den aktuellen Greptile-Review als erste Iteration,
- repariert nur aktuelle Greptile-Befunde,
- führt Qualitätsbefehle aus,
- erneuert `$evidence-driven-testing` für jeden neuen Commit,
- pusht auf denselben PR-Branch,
- lässt Greptile erneut prüfen,
- stoppt bei `5/5` und null offenen Kommentaren oder spätestens nach fünf Iterationen.

Starte `$code-factory-build` nicht erneut und delegiere nicht an einen weiteren Agenten.

## 4. Abschluss

Bei Erfolg dokumentiere die End-SHA und schließe das Unterissue. `$greploop` setzt danach `review.triggerLabel`; die getrennte Review-Automation prüft nur noch CI, aktuelle Evidence und Preview und sendet die Merge-ready-Nachricht.

Am Limit setze `repair.limitLabel` und `review.humanReviewLabel`, entferne `repair.runningLabel` und stelle in Linear genau eine kurze Frage:

```md
Greploop hat fünf Prüfungen erreicht. Es sind noch N konkrete Befunde offen.
Empfehlung: menschlich prüfen.
Antworte mit `Weiter`, um einen neuen ausdrücklich freigegebenen Lauf zu starten, oder `Stop`.
```

Eine Antwort hebt das vergangene Limit nicht rückwirkend auf. `Weiter` ist eine neue menschliche Freigabe für einen neuen Lauf mit erneut höchstens fünf Greptile-Iterationen.

Nutze Automation Memories nur als Hypothesen und speichere höchstens eine abstrahierte, nicht sensible `Factory lesson`. Kein neuer Branch, kein neuer PR, kein Auto-Merge, kein Produktions-Deploy und keine Änderung des Produktvertrags ohne menschliche Entscheidung.
