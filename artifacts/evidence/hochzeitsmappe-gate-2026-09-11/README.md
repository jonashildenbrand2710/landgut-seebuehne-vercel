# Evidence: Hochzeitsmappe hinter Zugangs-Gate

- Datum: 2026-09-11
- Implementierungs-Commit: `dbece7b`
- Tracking-Commit: `a895092`
- Branch: `codex/hochzeitsmappe-gated-flow`
- Umgebung: lokaler Next.js-Server mit isolierten CRM-/Fallback-Mocks
- Vercel-Preview: `https://landgut-seebuehne-vercel-cpeyrrhxu-jonas-projects-ac40f00f.vercel.app`
- Linear: nicht verwendet, entsprechend der ausdruecklichen Nutzerentscheidung
- Gesamtergebnis: bestanden

## Nachweise

| ID | Erwartetes Verhalten | Pruefung | Ergebnis | Artefakt |
| --- | --- | --- | --- | --- |
| EVD-1 | Ohne Zugang ist die eigentliche Mappe nicht sichtbar. | Direkter Aufruf von `/hochzeitsmappe/online` ohne Cookie. | 307-Weiterleitung auf `/hochzeitsmappe`; `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`. | `01-landing.jpg` |
| EVD-2 | Das Formular schaltet den Zugang unmittelbar frei. | Formular mit synthetischen Testdaten abgesendet; Weiterleitung und Reload geprueft. | Formular fuehrt ueber den Magic-Link automatisch zu `/hochzeitsmappe/online`; Reload bleibt dank HttpOnly-Cookie in der Mappe. | `02-form.jpg`, `03-form-filled.jpg`, `04-guide.jpg`, `gate-erfolgsflow.mp4` |
| EVD-3 | CRM und Versand erhalten den persoenlichen Zugangslink. | Lokaler Request gegen isolierte Testendpunkte. | Sequenz `POST /hochzeitsmappe-leads`, `POST /fallback`, `PATCH /hochzeitsmappe-leads`; der Fallback-Payload enthaelt `accessUrl`. | Terminalprotokoll der lokalen Verifikation |
| EVD-4 | In der Mappe werden keine Preise mehr angeboten. | Sichtpruefung und DOM-Abfrage der geschuetzten Mappe. | Kein Preis-Anforderungs-CTA; der Abschluss verlinkt auf `/termin-buchen` fuer Telefonat oder Besichtigung. | `05-next-step.jpg` |
| EVD-5 | Alte Preiswege liefern keine Preisansicht mehr. | Header-/Redirect-Pruefung. | `/preise`, `/preise-basis` und `/danke-preise` antworten mit 301 auf `/termin-buchen`; `/intern/hochzeitsmappe-alt` mit 301 auf `/hochzeitsmappe`. | Terminalprotokoll der lokalen Verifikation |
| EVD-6 | Oeffentliche und geschuetzte URLs sind SEO-seitig getrennt. | Lokale Sitemap und Metadaten geprueft. | `/hochzeitsmappe` ist in der Sitemap; `/hochzeitsmappe/online` und alte Preiswege sind nicht enthalten. | Build- und Sitemap-Protokoll |
| EVD-7 | Die erfolgreiche Registrierung wird Meta als Conversion gemeldet. | Erfolgsredirect und Tracking-Payload geprueft. | Server-CAPI und consent-abhaengiger Browser-Pixel verwenden dasselbe `CompleteRegistration`-Event mit identischer Event-ID zur Deduplizierung. | Lokales Request- und Browserprotokoll |

## Qualitaetspruefungen

- `npm run lint`: bestanden
- `npm run typecheck`: bestanden
- `npm run build`: bestanden
- Vercel-Preview-Build: bestanden
- Preview-Browserpruefung: Landingpage, Zugangsschutz und Alt-Redirects bestanden
- Browser-Konsole im geprueften Erfolgsflow: keine flow-blockierenden Fehler

## Bewusste Grenzen

- Die Live-Nachricht in ActiveCampaign wurde noch nicht veraendert. Das Update-Skript ist vorbereitet und im Vorschaumodus geprueft. Das produktive Umschalten vor dem Website-Rollout wuerde bei aktuellen Live-Anfragen einen noch nicht befuellten Link verwenden.
- Die externe Alt-URL `https://kennenlernen.landgut-seebuehne.de/auftrag-info` liegt ausserhalb dieses Repositories und wurde nicht veraendert.
- Das Video ist eine Sequenz der direkt im Browser aufgenommenen, tatsaechlich geprueften Flow-Zustaende.
