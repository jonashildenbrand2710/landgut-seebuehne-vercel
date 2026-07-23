---
name: code-factory-repair
description: Koordiniert in einer getrennten Cursor-Cloud-Session die automatische Reparatur eines roten Code-Factory-Reviews im bestehenden Pull Request. Verwenden, wenn die Repair-Automation durch loop-changes-requested oder durch eine menschliche Antwort auf eine kurze Linear-Entscheidungsfrage ausgelöst wird; erstellt genau ein verknüpftes Linear-Unterissue, begrenzt auf drei aufeinanderfolgende automatische Runden und übergibt die Codeänderung an code-factory-build.
---

# Review-Befunde automatisch reparieren

Arbeite standardmäßig auf Deutsch. Repariere niemals in der Review-Session und merge nie.

## 1. Kontext und Idempotenz sichern

1. Lies `AGENTS.md`, `.code-factory/factory.json`, den vollständigen PR, das Stamm-Issue, den aktuellen Review-Kommentar und vorhandene Repair-Unterissues.
2. Löse PR-Branch, fehlerhaften Head-SHA und Must-fix-Befunde eindeutig auf. Beende ohne Seiteneffekt bei Draft, falschem Repository, fehlendem Review oder bereits grünem `review.approvedLabel`.
3. Verwende `Code Factory repair of FAILED_HEAD_SHA` als Idempotenzschlüssel. Starte weder ein zweites Unterissue noch einen zweiten Agenten, wenn für denselben SHA bereits eine Reparatur läuft oder abgeschlossen ist.
4. Zähle eindeutige Repair-Marker seit dem neuesten `Code Factory human decision`. Der ursprüngliche Build zählt nicht als Reparaturrunde.

## 2. Möglichst autonom entscheiden

Triff technische Detailentscheidungen selbst. Wähle die kleinste reversible Lösung, die alle ursprünglichen `AC-N`, `NG-N`, bestehenden Projektmuster und Tests respektiert. Frage nicht nach Benennung, Code-Stil, interner Architektur oder zwischen gleichwertigen technischen Varianten.

Frage einen Menschen nur, wenn eine Antwort das sichtbare Produktverhalten oder den ursprünglichen Vertrag wesentlich ändert, Daten löscht oder migriert, Authentifizierung, Berechtigungen, Datenschutz, Zahlung, Recht oder eine irreversible externe Wirkung betrifft. Frage außerdem nach `repair.maxAutomaticRoundsPerGate` erfolglosen automatischen Runden.

Stelle in Linear genau eine kurze Frage gleichzeitig:

```md
## Kurze Entscheidung nötig

**Problem:** ein einfacher Satz ohne Fachsprache
**Empfehlung:** A — bevorzugte Lösung mit einem kurzen Grund

- A — kurze Auswirkung
- B — kurze Auswirkung
- C — nur wenn wirklich nötig

Antworte einfach mit `A`, `B` oder `C`. Ich verwende die Antwort automatisch und arbeite weiter.
```

Markiere den Stamm- und Repair-Vorgang mit `review.humanReviewLabel`. Setze bei erreichtem Rundenlimit zusätzlich `repair.limitLabel`. Schreibe `Code Factory decision requested of FAILED_HEAD_SHA` in PR und Linear. Ändere keinen Code, bis eine neue menschliche Antwort vorliegt.

Bei einem Linear-Antwort-Trigger akzeptiere nur eine Antwort eines Menschen nach der neuesten offenen Frage. Schreibe sie als `Code Factory human decision of FAILED_HEAD_SHA: ANSWER` in Stamm-Issue, Repair-Unterissue und PR. Entferne `repair.limitLabel` und `review.humanReviewLabel`; damit beginnt ein neuer Block von höchstens drei automatischen Runden.

## 3. Linear-Unterissue anlegen

Lege genau ein Unterissue pro Reparaturversuch unter dem ursprünglichen Issue an oder verwende das bereits vorhandene:

```md
# Repair RROUND/MAX: ROOT_ID

- Stamm-Issue: ROOT_ID + URL
- Pull Request: URL
- Bestehender PR-Branch: BRANCH
- Fehlgeschlagener Review-SHA: FAILED_HEAD_SHA
- Marker: Code Factory repair of FAILED_HEAD_SHA
- Auslöser: Review-Verdict oder menschliche Antwort

## Reparaturvertrag
- AC-R1: erster konkreter Must-fix-Befund
- AC-R2: weiterer Befund, falls vorhanden
- NG-R1: keine Änderung außerhalb des ursprünglichen Vertrags
- NG-R2: kein neuer Branch, kein neuer PR, kein Merge
```

Setze das Label `repair.issueLabel`, verknüpfe Stamm-Issue und PR und dokumentiere Rundenblock sowie Rundennummer. Die ursprüngliche menschliche Build-Freigabe gilt für diese in-scope Reparaturen weiter. Erwähne `@Cursor` nicht erneut und delegiere nicht an einen zweiten Agenten; die laufende Repair-Automation führt den Build selbst aus.

## 4. Build-Skill im Reparaturmodus ausführen

Setze `repair.runningLabel` und entferne `review.triggerLabel` sowie veraltete Review-Zustände. Rufe `$code-factory-build` im Reparaturmodus mit Unterissue, bestehendem PR und bestehendem PR-Branch auf.

Der Build-Skill muss ausschließlich die Must-fix-Befunde bearbeiten, Tests und Evidence erneuern und in denselben PR-Branch pushen. Nach Erfolg:

1. Schreibe `Code Factory repair round ROUND of FAILED_HEAD_SHA -> NEW_HEAD_SHA` in PR, Stamm-Issue und Unterissue.
2. Schließe das Unterissue als erledigt.
3. Entferne `repair.runningLabel`, `review.changesRequestedLabel`, `review.humanReviewLabel` und `repair.limitLabel`.
4. Setze `review.triggerLabel` als letzte Aktion. Die getrennte Review-Automation prüft den neuen SHA erneut.

Bei einem vorübergehenden Werkzeug- oder Netzausfall höchstens einmal intern erneut versuchen. Bei dauerhaft fehlendem Zugriff, Konflikten oder beschädigter Umgebung kurz in Linear erklären, `review.humanReviewLabel` setzen und stoppen.

## Harte Grenzen

- Höchstens `repair.maxAutomaticRoundsPerGate`, standardmäßig drei, ohne neue menschliche Antwort.
- Kein zweiter Reparatur-Agent für denselben fehlgeschlagenen SHA.
- Kein neuer Branch oder Pull Request im Reparaturmodus.
- Keine Änderung des Produktvertrags ohne die seltene kurze Linear-Entscheidung.
- Kein Selbstreview, kein Auto-Merge und kein Produktions-Deploy.
