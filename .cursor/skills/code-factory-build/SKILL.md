---
name: code-factory-build
description: Implementiert genau ein freigegebenes Linear-Issue in einem Cursor Cloud Agent und verwendet evidence-driven-testing bereits vor dem ersten Code als Prüfvertrag sowie nach dem Build als commitgebundenen Nachweis. Verwenden, wenn Cursor ein delegiertes Code-Factory-Issue erstmals baut; Greptile-Review und Greploop-Reparatur laufen danach getrennt.
---

# Ein Issue evidence-getrieben bauen

Arbeite standardmäßig auf Deutsch mit dem Nutzer; Code, Commits und technische Bezeichner dürfen Englisch bleiben.

## 1. Evidence als Baugrundlage festlegen

1. Lies `AGENTS.md`, `.code-factory/factory.json`, das vollständige Linear-Issue, alle Beziehungen und den Abschnitt `Cursor-Routing`.
2. Löse jedes `AC-N` und `NG-N` auf. Nutze `$evidence-driven-testing` vor der Implementierung, um jedem sichtbaren Akzeptanzkriterium eine Aussage `EVD-N` mit Ausgangszustand, Handlung, erwartetem Ergebnis und vorgesehenem Beleg zuzuordnen.
3. Plane automatisierte Tests und UI-/Browser-Evidence gemeinsam. Die spätere Aufnahme ergänzt Tests, ersetzt sie aber nicht.
4. Stoppe nur bei einem ungelösten externen Blocker oder einer wesentlichen Produkt-, Daten-, Auth-, Berechtigungs-, Datenschutz-, Zahlungs-, Rechts- oder irreversiblen Entscheidung. Technische Details selbst entscheiden.

## 2. Genau den Vertrag bauen

1. Erzeuge einen Branch mit Issue-ID und öffne bei längerer Arbeit früh einen Draft-PR gegen `github.pullRequestBaseBranch`.
2. Implementiere nur den kleinsten Stand, der alle `AC-N` erfüllt und alle `NG-N` bewahrt. Ergänze die vorab geplanten Tests.
3. Führe alle nicht leeren Befehle aus `commands` aus. Prüfe Diff und Status auf Fremdänderungen und Secrets.
4. Committe und pushe den prüfbaren Stand. Warte auf das zu dieser vollständigen SHA gehörende Preview-Deployment.

## 3. Build-/Evidence-Loop schließen

1. Führe `$evidence-driven-testing` auf der Preview für exakt die aktuelle Head-SHA aus.
2. Bei `fehlgeschlagen`: repariere den kleinsten Befund innerhalb desselben Build-Laufs, führe Tests erneut aus, committe und wiederhole Evidence für die neue SHA.
3. Bei `nicht prüfbar`: dokumentiere Ursache und nächsten Prüfschritt. Behaupte kein Grün und übergib nicht an Greptile, solange eine erforderliche Aussage unbelegt ist.
4. Beende den Build-Loop erst, wenn alle erforderlichen `EVD-N` bestanden sind, die Qualitätsbefehle grün sind und Preview, Evidence Report sowie bei UI oder sichtbarer Funktionalität mindestens ein direkt erreichbares Erfolgs-Video dem aktuellen Commit zugeordnet sind.

## 4. Unabhängigen Review starten

1. Verknüpfe das Linear-Issue und fülle die PR-Vorlage mit Befehlen, Preview und Evidence.
2. Poste PR-, Preview- und Beweislinks im Linear-Issue und verschiebe es in den Review-Status.
3. Entferne veraltete Review-/Repair-Labels. Setze `review.triggerLabel` erst als letzte Build-Aktion.
4. Starte Greptile oder `$greploop` niemals in dieser Build-Session. Die getrennte Review-Automation fordert den ersten Greptile-Review an; nur bei roten Befunden übernimmt die getrennte Greploop-Repair-Automation.

Nutze relevante Automation Memories nur als Hypothesen. Speichere höchstens eine abstrahierte, belegte und nicht sensible `Factory lesson`; ändere wegen eines einzelnen Laufs keinen Skill.

Merge niemals, aktiviere kein Auto-Merge und deploye nicht in Produktion. Wenn das Review-Trigger-Label nicht gesetzt werden kann, poste den Blocker in Linear und setze `review.humanReviewLabel`.
