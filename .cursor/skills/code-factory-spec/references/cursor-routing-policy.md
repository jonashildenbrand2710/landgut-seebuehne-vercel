# Cursor-Auto-Routing

## Verbindliche Grundregel

- Das Ausführungsmodell ist `Auto`. Wähle in Issues und Handoffs kein festes Basismodell wie GLM, Claude oder GPT.
- Der Build-Lauf nutzt standardmäßig den in `.code-factory/factory.json` konfigurierten Auto-Optimierungsmodus, normalerweise `cost`.
- Der unabhängige Review-Lauf nutzt standardmäßig `balance`.
- Die Spec beschreibt Komplexität und Risiko ausdrücklich. Cursor erhält dadurch einen klaren Auftrag; der Cursor Router wählt innerhalb von Auto das konkrete Modell nach Aufgabentyp und Komplexität.

`taskComplexity` und `risk` sind Factory-Metadaten, keine Cursor-Parameter. Die native Cursor-Linear-Integration dokumentiert `repo`, `branch` und `model`, aber keinen Parameter für den Optimierungsmodus. Erfinde daher niemals Tags wie `[optimization=cost]` oder Modellnamen wie `auto-cost`.

## Einstufung

Starte bei `niedrig` und erhöhe die Einstufung, sobald ein Kriterium der nächsten Stufe zutrifft.

| Aufgabenkomplexität | Typische Merkmale |
|---|---|
| `niedrig` | kleine, lokal begrenzte Änderung; bestehendes Muster; eindeutige ACs; keine Migration, Rechte- oder Sicherheitslogik |
| `mittel` | mehrere Module; UI plus Zustand/API; externe Integration; nicht triviale Fehlersuche; mehrere relevante Randfälle |
| `hoch` | Architektur über mehrere Bereiche; Auth, Sicherheit oder Zahlungen; Datenmigration; schwer reproduzierbarer Fehler; großer möglicher Schadensradius |

Bewerte das Risiko getrennt:

- `normal`: leicht rückgängig zu machen, gute Tests, keine sensiblen Daten
- `erhöht`: begrenzter, aber relevanter Nutzer- oder Datenimpact; Tests oder Rollback teilweise unsicher
- `kritisch`: Sicherheits-, Zahlungs-, Berechtigungs- oder irreversibles Datenrisiko

Erhöhe die Komplexität um eine Stufe, wenn Kontext fehlt, Tests schwach sind oder der Rollback unklar ist. Teile eine hohe Aufgabe möglichst in kleinere Issues. Kritische Produkt- oder Sicherheitsentscheidungen dürfen nicht an den Agent delegiert werden.

## Ausnahmemodus

Der Normalfall bleibt `Auto` mit Build-Optimierung `cost`. Empfehle nur dann eine Ausnahme:

- `balance`: mittlere oder hohe Aufgabe, bei der Fehlversuche voraussichtlich mehr kosten als ein stärkerer Erstlauf
- `intelligence`: außergewöhnlich schwierige, klar spezifizierte Hochrisiko-Aufgabe, die nicht sinnvoll weiter teilbar ist

Eine Empfehlung ändert Cursor nicht automatisch. Sie wird im Issue vermerkt. Der Dispatch darf sie nur übernehmen, wenn der entsprechende Auto-Modus im Cursor-Dashboard oder in einer getrennten Cursor Automation tatsächlich konfiguriert und überprüfbar ist. Sonst bleibt der konfigurierte Standard aktiv oder der Dispatch stoppt transparent.

## Ausgabe pro Issue

```md
## Cursor-Routing

- Modell-Policy: Auto
- Build-Optimierung: Cost
- Aufgabenkomplexität: niedrig | mittel | hoch
- Risiko: normal | erhöht | kritisch
- Ausnahmeempfehlung: keine | Balance | Intelligence
- Begründung: ein bis zwei konkrete Sätze
```
