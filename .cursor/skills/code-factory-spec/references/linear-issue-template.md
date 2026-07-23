# Linear-Issue-Vertrag

Verwende pro Issue genau diese Gliederung:

```md
## Ziel

Ein bis zwei Sätze zum beobachtbaren Nutzer- oder Geschäftsergebnis.

## Kontext

Relevanter Ist-Zustand und warum die Änderung jetzt nötig ist.

## Akzeptanzkriterien

- [ ] AC-1 — Beobachtbares, eindeutig prüfbares Ergebnis
- [ ] AC-2 — Weiteres Ergebnis

## Nicht-Ziele

- NG-1 — Verhalten, das ausdrücklich unverändert bleibt
- NG-2 — Späterer oder ausgeschlossener Umfang

## Randfälle

- Leerzustand, Rechte, Fehler und Rückwärtskompatibilität

## Relevante Dateien

- `pfad/datei` — Bedeutung

## Technischer Handoff

- Repository: `OWNER/REPO`
- PR-Zielbranch: `STAGING_BRANCH`
- Produktionsbranch: `PRODUCTION_BRANCH` (in diesem Issue nicht verändern)
- Qualitätsbefehle: aus `.code-factory/factory.json`
- Agent-Regeln: `AGENTS.md` und `.cursor/skills/`

## Cursor-Routing

- Modell-Policy: Auto
- Build-Optimierung: Cost | Balance | Intelligence (tatsächlicher Wert aus `.code-factory/factory.json`)
- Aufgabenkomplexität: niedrig | mittel | hoch
- Risiko: normal | erhöht | kritisch
- Ausnahmeempfehlung: keine | Balance | Intelligence
- Begründung: ein bis zwei konkrete Sätze

## Test-Erwartungen

- Automatisierte Tests, die ergänzt oder ausgeführt werden müssen
- Erforderliche UI-/API-Beweise; bei UI oder sichtbarer Funktionalität mindestens ein direkt verlinktes Erfolgs-Video auf der Vercel-Preview
- Merge-ready-Nachricht in diesem Issue: PR, Staging-Preview, Video, Evidence Report, Greptile-Verdict und Head-SHA

## Evidence-Prüfvertrag vor dem Build

- EVD-1 → AC-1: Ausgangszustand, Nutzeraktion, sichtbar erwartetes Ergebnis und geeigneter Beleg
- EVD-2 → AC-2: Ausgangszustand, Nutzeraktion, sichtbar erwartetes Ergebnis und geeigneter Beleg
- Der Build-Agent konkretisiert diese Aussagen mit `$evidence-driven-testing`, bevor er Produktcode ändert.

## Factory-Lernen

- Build, Review und Repair dürfen nicht sensible, verifizierte Factory-Lektionen in Cursor Automation Memory speichern.
- Memory ist nur ein Hinweis und darf `AC-N`, `NG-N`, `AGENTS.md` oder `.code-factory/factory.json` nicht überschreiben.
- Dieser einzelne Lauf darf keinen Skill selbst verändern. Erst wiederkehrende unabhängige Signale dürfen einen Draft-PR im zentralen Factory-Repository vorschlagen; Merge bleibt menschlich.

## So prüft ein Mensch das Ergebnis

1. Konkreter Startzustand
2. Konkrete Aktion
3. Exakt erwartetes Ergebnis mit Zuordnung zu AC-N

## Abhängigkeiten

- Blockiert durch: keine | ISSUE-ID
- Blockiert: keine | ISSUE-ID
```

Regeln:

- Jedes `AC-N` beschreibt Verhalten, keine Implementierungsaktivität.
- Jedes `NG-N` ist bindend.
- Jedes sichtbare `AC-N` besitzt mindestens ein zugeordnetes `EVD-N`.
- Kein `AC-N` darf ein `NG-N` voraussetzen.
- Ein Issue bleibt unter einem Agent-Arbeitstag.
- Ein Agent darf keine offenen Produktfragen beantworten müssen.
- Die Routing-Einstufung folgt `cursor-routing-policy.md`; sie nennt kein festes Basismodell.
- Die `Factory-Lernen`-Klausel bleibt in jedem Issue erhalten und ist keine Freigabe für automatische Skill-Änderungen.
