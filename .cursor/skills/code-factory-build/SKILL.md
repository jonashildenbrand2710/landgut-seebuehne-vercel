---
name: code-factory-build
description: Implementiert genau ein freigegebenes Linear-Issue in einem Cursor Cloud Agent, führt Projektprüfungen aus und öffnet einen Draft-PR. Verwenden, wenn Cursor ein delegiertes Code-Factory-Issue erhält oder Review-Feedback innerhalb desselben Vertrags beheben soll.
---

# Ein Issue bauen

Arbeite standardmäßig auf Deutsch mit dem Nutzer; Code, Commits und technische Bezeichner dürfen Englisch bleiben.

1. Lies `AGENTS.md`, `.code-factory/factory.json`, das vollständige Linear-Issue und alle Beziehungen.
2. Stoppe bei offenem Produktentscheid, ungelöstem Blocker, fehlenden `AC-N`/`NG-N` oder falschem Repository.
3. Erzeuge einen Branch mit Issue-ID. Implementiere nur den Vertrag; Nicht-Ziele sind bindend.
4. Ergänze relevante Tests. Führe die nicht leeren Befehle `lint`, `typecheck`, `test` und `build` aus. Nutze `start` nur für lokale oder visuelle Verifikation; lasse keinen hängenden Serverprozess zurück.
5. Öffne bei längerer Arbeit früh einen Draft-PR, aber markiere ihn noch nicht als reviewbereit.
6. Nutze `$evidence-driven-testing` für UI-Beweise. Ergänze für Backend/Logik relevante Befehlsausgaben. Prüfe Diff und Status auf Fremdänderungen und Secrets.
7. Verknüpfe das Linear-Issue und fülle die PR-Vorlage vollständig aus. Markiere den PR erst nach vollständigen Belegen als reviewbereit.
8. Poste PR- und Beweislinks im Linear-Issue und verschiebe es in den Review-Status. Der unabhängige Review-Agent verwendet anschließend `$finn-review`.

Merge niemals und aktiviere kein Auto-Merge. Bei Blockade stelle eine konkrete Frage in Linear und setze `blocked`.
