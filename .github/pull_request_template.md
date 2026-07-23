## Linear

- Issue: <!-- ISSUE-ID + URL -->
- Ziel: <!-- ein Satz -->
- Merge-Ziel: `staging`

## Vertrag

- [ ] AC-1 — <!-- Beleg -->
- [ ] NG-1 bleibt unverändert — <!-- Beleg -->
- Andere Verhaltensänderungen: keine

## Automatisierte Prüfungen

- <!-- Befehl -->: <!-- Ergebnis -->

## Preview und Beweise

- Preview: <!-- URL oder begründetes nicht zutreffend -->
- Screenshots/Video/Logs: <!-- Links -->
- Direktes Erfolgs-Video: <!-- Pflicht bei UI oder sichtbarer Funktionalität; sonst begründen -->
- Evidence Report: <!-- Ergebnis von evidence-driven-testing -->
- Manuelle Prüfschritte:
  1. <!-- Schritt -->

## Risiko

- Einstufung: Niedrig | Mittel | Hoch
- Cursor-Routing: Auto / <!-- Cost, Balance oder Intelligence -->
- Rollback: <!-- Vorgehen -->

## Agent-Gates

- [ ] Keine Secrets oder Fremdänderungen
- [ ] Evidence gehört zum aktuellen Commit
- [ ] PR zielt auf den konfigurierten Staging-Branch
- [ ] Merge-ready-Linear-Nachricht enthält PR, Preview, direktes Video, Evidence und Greptile-Verdict
- [ ] `factory-review-ready` wird erst nach vollständigen Belegen gesetzt
- [ ] Automatischer unabhängiger `$code-factory-review` steht noch aus oder ist für den aktuellen SHA verlinkt
- [ ] Rote Greptile-Reviews werden über `$greploop` mit höchstens fünf Greptile-Prüfungen im selben PR nachgebessert
- [ ] Automation Memory enthält höchstens abstrahierte, nicht sensible Factory-Lektionen und überschreibt keinen Projektvertrag
- [ ] Wiederkehrende Factory-Probleme werden nur als Draft-PR im zentralen Factory-Repository vorgeschlagen
- [ ] Draft-PR; Mensch entscheidet über Merge
