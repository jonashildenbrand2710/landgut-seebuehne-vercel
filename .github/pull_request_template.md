## Linear

- Issue: <!-- ISSUE-ID + URL -->
- Ziel: <!-- ein Satz -->

## Vertrag

- [ ] AC-1 — <!-- Beleg -->
- [ ] NG-1 bleibt unverändert — <!-- Beleg -->
- Andere Verhaltensänderungen: keine

## Automatisierte Prüfungen

- <!-- Befehl -->: <!-- Ergebnis -->

## Preview und Beweise

- Preview: <!-- URL oder begründetes nicht zutreffend -->
- Screenshots/Video/Logs: <!-- Links -->
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
- [ ] `factory-review-ready` wird erst nach vollständigen Belegen gesetzt
- [ ] Automatischer unabhängiger `$code-factory-review` steht noch aus oder ist für den aktuellen SHA verlinkt
- [ ] Rote Reviews werden höchstens drei Runden automatisch über `$code-factory-repair` im selben PR nachgebessert
- [ ] Draft-PR; Mensch entscheidet über Merge
