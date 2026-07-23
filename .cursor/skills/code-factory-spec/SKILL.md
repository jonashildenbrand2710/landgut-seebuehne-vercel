---
name: code-factory-spec
description: Verwandelt eine rohe Produkt- oder Code-Idee in Codex, Cursor Desktop, Cloud oder Mobile durch ein deutschsprachiges, repo-informiertes Interview in ein oder mehrere ausführbare Linear-Issues. Verwenden, wenn eine Idee geklärt, in kleine Agent-Aufträge zerlegt, mit Akzeptanzkriterien, Nicht-Zielen und sicheren Factory-Lernklauseln versehen oder für Cursor Cloud Agents vorbereitet werden soll. Interaktiv; niemals unbeaufsichtigt starten.
---

# Spezifikations-Interview

Erzeuge einen belastbaren Vertrag zwischen Mensch, Codex und Cloud-Agent. Antworte standardmäßig auf Deutsch, auch wenn Code und Feldnamen englisch sind.

## 1. Kontext erforschen

- Lies `.code-factory/factory.json`. Fehlt die Datei, schlage zuerst `$code-factory-setup` vor.
- Lies `references/linear-issue-template.md` vollständig.
- Lies `references/cursor-routing-policy.md` vollständig.
- Untersuche relevante Dateien, bestehende Muster, Tests und technische Einschränkungen.
- Frage nichts, was Repository oder Konfiguration eindeutig beantworten.
- Prüfe, ob `learning` aktiviert ist. Automation Memory darf den Issue-Vertrag niemals überschreiben.

## 2. In kurzen Runden interviewen

Stelle pro Runde ein bis drei echte Produktfragen. Gib konkrete Optionen und nenne deine Empfehlung zuerst. Kläre insbesondere:

- sichtbares Verhalten und betroffene Nutzer
- Rechte, leere Zustände und Fehlerfälle
- Datenmigration oder Rückwärtskompatibilität
- bewusste Nicht-Ziele
- Definition von „fertig“, manuelle Prüfschritte und beobachtbare `EVD-N`-Nachweise für jedes sichtbare `AC-N`

Verwende die Konfidenzfrage: „Könnten zwei unabhängige Agents daraus dasselbe beobachtbare Ergebnis bauen?“ Frage weiter, solange die Antwort Nein lautet. Begrenze die Zahl der Runden nicht künstlich.

## 3. Richtig schneiden

- Halte ein Issue auf höchstens einen Agent-Arbeitstag.
- Trenne unabhängige Änderungen in parallele Issues.
- Verknüpfe abhängige Issues ausdrücklich als Blocker/blocked-by und ordne sie.
- Lege bei mehreren Issues eine kurze gemeinsame Zielbeschreibung an, aber wiederhole den vollständigen Vertrag pro Issue.
- Stufe jedes Issue nach `references/cursor-routing-policy.md` ein. Beginne kostenbewusst, erhöhe aber Komplexität oder Risiko bei unklarem Kontext, schwachen Tests oder schwierigem Rollback.
- Teile hohe Aufgaben weiter, wenn dadurch kein künstlicher Integrationsbruch entsteht. Ein festes Basismodell darf die Spec nicht auswählen.

## 4. Entwurf bestätigen

Zeige vor jeder externen Änderung alle vollständigen Issue-Entwürfe. Jeder Entwurf braucht stabile IDs `AC-N`, `NG-N` und für sichtbare Kriterien `EVD-N`, nachvollziehbare Testschritte, Repository, Base-Branch, einen begründeten `Cursor-Routing`-Block und die unveränderte `Factory-Lernen`-Klausel aus der Vorlage. Erhalte eine eindeutige Freigabe zum Anlegen.

Erstelle danach die Issues über Linear MCP im konfigurierten Team und setze Beziehungen. Melde Identifier und URLs zurück.

## Harte Gates

- Delegiere nicht an Cursor.
- Weise Cursor nicht als Agent zu und erwähne `@Cursor` nicht.
- Setze `agent-ready` nicht.
- Erfinde keine Produktentscheidung.
- Leite aus dem Interview keine globale Skill-Änderung ab. Wiederkehrende Factory-Verbesserungen laufen getrennt über `Code Factory Learning` und einen menschlich zu mergenden Draft-PR.

Die nächste menschliche Aktion ist eine Prüfung in Linear oder der explizite Aufruf von `$code-factory-dispatch`.
