# AGENTS.md

## Projektziel

Dieses Projekt baut die Website von Landgut Seebuehne als selbst gehostete
Next.js/Vercel-Seite neu auf. Ziel ist eine fertige, wartbare Website, die nicht
mehr vom Onepage-Page-Builder abhaengt und von Codex oder anderen Agents
gepflegt, erweitert und beobachtet werden kann.

Die Arbeit soll moeglichst autonom passieren: Agents sollen Quellen pruefen,
kleine sinnvolle Entscheidungen selbst treffen, Code umsetzen, testen und nur
dann nachfragen, wenn rechtliche Freigaben, echte Secrets, DNS-Zugriff oder
inhaltliche Geschaeftsentscheidungen fehlen.

## Arbeitsbild

Stellt euch das Projekt wie ein Haus vor:

- `docs/migration/*.md` ist der Bauplan.
- `data/site.ts` und `data/articles.ts` sind die sortierten Inhalte.
- `app/*` sind die fertigen Raeume und URLs.
- `components/*` sind wiederverwendbare Bauteile.
- `public/images/*` ist die kuratierte Bildkiste.
- `next.config.ts`, `app/sitemap.ts`, `app/robots.ts` und `app/llms.txt/route.ts`
  sind Wegweiser fuer Browser, Google, LLMs und alte URLs.

Nicht jedes alte Onepage-Detail muss wieder in den Neubau. Zuerst zaehlen die
indexierten Seiten, die Domain-Reputation, die Conversion-Wege und ein stabiler
Vercel-Betrieb.

## Quellenreihenfolge

1. Diese Datei.
2. Verifizierte Markdown-Dateien in `docs/migration/`.
3. Strukturierte Inhalte in `data/site.ts` und `data/articles.ts`.
4. URL- und Indexierungsstand in `docs/migration/url-matrix.md`,
   `docs/migration/onepage-current/inventory.json` und der aktuellen Sitemap.
5. Alte Onepage-HTMLs nur gezielt als Belegquelle verwenden, nicht als
   Dauereinladung, die komplette Altseite neu auszulesen.

Wenn Quellen sich widersprechen, gilt: indexierte Hauptseiten, Livegang-Sicherheit
und die aktuellere Projektentscheidung gehen vor.

## Prioritaeten

### P0: Nichts kaputtmachen

- Keine Secrets committen.
- Keine wichtigen URLs versehentlich auf 404 laufen lassen.
- Keine noindex-Markierung auf wichtige oeffentliche Seiten setzen.
- Keine Preisdetails, Vertragsdetails oder internen Funnel-Informationen
  oeffentlich machen, wenn sie nicht freigegeben sind.

### P1: Indexierte Seiten zuerst

Zuerst diese Seiten pflegen und verbessern:

- `/`
- `/location`
- `/trauung`
- `/getting-ready`
- `/uber-uns`
- `/hochzeitsmappe`
- `/besichtigung`
- `/termin-buchen`
- `/kontaktformular`
- `/formular`
- `/impressum`
- `/hochzeitsratgeber`
- `/hochzeitsratgeber/hochzeitslocation-besichtigen-fragen`
- `/hochzeitsratgeber/freie-trauung-am-see`

Diese Seiten sollen in Sitemap, Canonicals, Navigation, internen Links und
sichtbaren CTAs sauber funktionieren.

### P2: Alte URLs sicher behandeln

Review- oder interne Seiten bleiben nur kontrolliert erreichbar:

- `/danke`
- `/preise`
- `/preise-basis`
- `/quizz`
- `/chatbot`
- `/zimmerbuchung`
- `/bewerbung`

Sie duerfen nicht unbeabsichtigt in die Sitemap oder als SEO-Seiten ausgebaut
werden. Alte `page-*` URLs sollen per 301 weiterleiten, nicht 404en.

### P3: Design und Inhalte modular halten

- Inhalte bevorzugt in `data/site.ts` oder `data/articles.ts` pflegen.
- Wiederkehrende UI in `components/*` kapseln.
- Neue Seiten nur anlegen, wenn Suchintention, Quelle und CTA klar sind.
- Kein Page-Builder-Denken nachbauen: lieber wenige klare Datenstrukturen als
  viele einmalige Sonderbloecke.

### P4: Integrationen ueber Environment Variables

Secrets und externe IDs gehoeren in `.env.local` und in Vercel Project Settings,
nicht in den Code. Siehe `.env.example`.

Oeffentliche Browser-Werte brauchen `NEXT_PUBLIC_*`.
Private Server-Werte duerfen kein `NEXT_PUBLIC_` haben.

Typische Variablen:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BOOKING_URL`
- `NEXT_PUBLIC_ALT_BOOKING_URL`
- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_GSC_VERIFICATION`
- `NEXT_PUBLIC_BING_VERIFICATION`
- `CONTACT_FORM_ENDPOINT`
- `CONTACT_FORM_SECRET`
- `CRM_API_KEY`
- `EMAIL_DELIVERY_API_KEY`
- `INDEXNOW_KEY`

Wenn eine Integration gebaut wird, zuerst die Variable in `.env.example`
dokumentieren, dann Code bauen, dann lokal und in Vercel setzen.

### P5: Monitoring und Pflege

Nach jedem groesseren Schritt pruefen:

- Wenn `node_modules` fehlt, zuerst `npm install` ausfuehren.
- `npm run lint`
- `npm run build`
- wichtige URLs lokal oder in Vercel Preview
- `sitemap.xml`, `robots.txt`, `llms.txt`
- Redirects aus `next.config.ts`
- Formular-, Kalender- und Trackingwege

Nach Livegang: Search Console, 404s, Redirects, Formular-Conversions und
Indexierung beobachten.

## Agentische Arbeitsweise

Agents sollen in kleinen Zyklen arbeiten:

1. Relevante Quellen lesen.
2. Entscheidung kurz begruenden.
3. Code oder Inhalt aendern.
4. Tests/Build ausfuehren.
5. Ergebnis und offene Risiken knapp dokumentieren.

Nicht auf perfekte Vorgaben warten, wenn eine sichere Annahme moeglich ist.
Nachfragen nur bei:

- echten Zugangsdaten oder Secrets
- DNS/Vercel-Projektzugriff
- rechtlichen Texten wie Datenschutz/Impressum
- Preis-, Paket- oder Vertragsinhalten
- unklaren Livegang-Entscheidungen

## Bild- und Altmaterial-Regel

Das Projekt soll leicht bleiben. Kuratierte und verwendete Bilder bleiben in
`public/images/`. Grosse ungenutzte Roharchive, lokale Build-Ordner und
Installationsartefakte gehoeren nicht in den Arbeitsstand.

Wenn spaeter weitere Bilder gebraucht werden:

1. Erst pruefen, ob die Kontaktuebersicht oder die vorhandenen Migrationsnotizen
   reichen.
2. Dann gezielt einzelne Motive wiederherstellen oder neu beschaffen.
3. Danach mit sprechendem Dateinamen und Alt-Text in `data/site.ts` verknuepfen.

## Definition of Done

Das Projekt ist im Zielzustand, wenn:

- die indexierten Hauptseiten in Vercel funktionieren
- alte relevante URLs weiterleiten oder kontrolliert erreichbar sind
- Sitemap, Robots, Canonicals und `llms.txt` stimmen
- noindex-Seiten nicht in der Sitemap stehen
- Formulare, Kalender, Tracking und Danke-Wege getestet sind
- Secrets in Vercel/.env liegen, nicht im Code
- die Seite ohne Onepage-Page-Builder betrieben, gepflegt und erweitert werden
  kann
- ein Agent mit dieser Datei und den Markdown-Quellen weiterarbeiten kann, ohne
  die komplette Altseite erneut auslesen zu muessen

## Code Factory

Lies vor jeder Änderung `.code-factory/factory.json` und das verknüpfte Linear-Issue.

- Nutzerkommunikation standardmäßig auf Deutsch.
- Cursor-Modell-Policy ist `Auto`; keine festen Anbieter- oder Modellnamen anfordern. Aufgabenkomplexität und Risiko aus dem Linear-Issue beachten.
- Genau ein Linear-Issue pro Pull Request.
- Feature- und Fix-PRs zielen auf `github.pullRequestBaseBranch`; niemals direkt auf den Produktions-`github.baseBranch`.
- `AC-N` vollständig umsetzen; `NG-N` bindend erhalten.
- Bestehende Architektur und Projektregeln haben Vorrang.
- Alle konfigurierten, nicht leeren Qualitätsbefehle ausführen.
- UI-/API-Verhalten mit reproduzierbaren Belegen dokumentieren.
- `$evidence-driven-testing` vor dem ersten Code als `EVD-N`-Prüfvertrag und nach jedem neuen Commit als tatsächlichen UI-Nachweis verwenden.
- Für UI oder sichtbare Funktionalität mindestens ein direkt erreichbares Video zum aktuellen SHA erzeugen.
- Greptile läuft ausschließlich im Code-Factory-Flow: `.greptile/config.json` deaktiviert automatische Reviews und Commit-Trigger. Nur der getrennte Review-Lauf darf Greptile anfordern, wenn am Linear-Issue weiterhin `linear.readyLabel` und am PR `review.triggerLabel` gesetzt sind.
- Greptile ist die externe Code-Review-Instanz. Ein roter Greptile-Review startet die getrennte Repair-Automation mit `$greploop`; höchstens `repair.maxGreptileReviewIterations` Greptile-Prüfungen pro menschlicher Freigabe.
- Nach vollständigem Build und Evidence `review.triggerLabel` setzen; eine Cursor Automation startet `$code-factory-review` in einem getrennten Agent-Lauf.
- Review-Agenten dürfen keinen Code ändern oder mergen. Bei behebbaren Must-fix-Befunden setzt der Review als letzte Aktion `repair.triggerLabel`; eine zweite Automation startet `$code-factory-repair`.
- Repair-Agenten verwenden `$greploop`, arbeiten auf demselben PR-Branch und dürfen weder neuen PR noch Merge erzeugen. Nach fünf Greptile-Prüfungen ist eine neue menschliche Linear-Antwort erforderlich.
- Build, Review und Repair dürfen relevante Cursor Automation Memories nur als überprüfbare Hypothesen nutzen. Aktuelles Issue, `AGENTS.md`, Factory-Konfiguration und aktuelle Belege haben Vorrang.
- Pro Lauf höchstens eine abstrahierte, nicht sensible `Factory lesson` mit Scope, Symptom, verifizierter Ursache, wiederverwendbarer Heuristik, Beleg und Gültigkeitsbedingung speichern.
- Keine Secrets, personenbezogenen Daten, Kundendaten, vollständigen Prompts oder ungeprüften Produktentscheidungen in Automation Memory ablegen.
- Skills niemals aufgrund eines einzelnen Laufs selbst verändern. Erst mindestens `learning.minimumIndependentSignals` unabhängige Signale dürfen über `Code Factory Learning` einen Draft-PR im zentralen `learning.sourceRepository` vorschlagen.
- Learning darf kein Produkt-Repository ändern, keine globalen Skills installieren, nicht direkt auf `main` pushen und niemals mergen.
- Technische Details selbst entscheiden. Menschen nur am Rundenlimit oder bei wesentlichem Produkt-, Daten-, Auth-, Datenschutz-, Zahlungs-, Rechts- oder Irreversibilitätsentscheid kurz in Linear fragen; eine Frage gleichzeitig, einfache Antworten.
- Neue PR-Commits lösen einen neuen commitgebundenen Review aus.
- Bei grünem Review im Linear-Stamm-Issue eine Merge-ready-Nachricht mit PR, Vercel-Staging-Preview, direktem Video, Evidence Report, Greptile-Score und Zielbranch posten.
- Keine Secrets in Code, Logs, Issues, PRs oder Aufnahmen.
- Branch und Draft-PR erstellen; niemals selbst mergen oder Auto-Merge aktivieren.
- Bei den seltenen erlaubten Produktfragen eine kurze deutsche Frage mit Empfehlung und höchstens drei direkt beantwortbaren Optionen in Linear stellen.
