# Modularer Parallelplan fuer den Onepage-zu-Vercel-Rebuild

Stand: 2026-06-19

Zweck: Diese Datei ist der zentrale Arbeitsplan fuer mehrere Codex-Kontexte oder Threads. Neue Threads sollen diese Datei zuerst lesen, bevor sie am Rebuild, an SEO, Bildern, Tracking, Formularen oder Launch-Vorbereitung arbeiten.

## Ziel

Die bestehende Onepage-Website von Landgut Seebuehne soll kontrolliert auf eine eigene Next.js/Vercel-Seite uebertragen werden.

Prioritaet:

1. Bestehenden Wert sichern.
2. Die aktuelle Landingpage strukturell und inhaltlich moeglichst nah nachbauen.
3. URLs, Suchsignale, Tracking, Formulare und Conversion-Wege erhalten.
4. Erst danach SEO-, KI-SEO-, Ratgeber- und Design-Ausbau kontrolliert verbessern.

## Grundprinzipien

- Werterhalt vor Wachstum.
- Erst 1:1-Rebuild, dann Optimierung.
- Domain moeglichst behalten: `https://www.landgut-seebuehne.de`.
- Alte URLs nicht unbeabsichtigt 404en lassen.
- Preisdetails nicht neu oeffentlich hervorheben oder indexierbar machen.
- CTA fuehrt primaer zu Erstgespraech, Telefontermin oder Hochzeitsmappe.
- Besichtigung nur als moeglicher naechster Schritt nach Erstgespraech formulieren.
- Keine generische Imagebroschuere bauen: Die Startseite bleibt zuerst eine lange Sales-Landingpage.
- Blog/Ratgeber bleibt auf der Hauptdomain unter `/hochzeitsratgeber`.

## Aktueller Projektstand

Projektordner:

`/Volumes/PROJEKTE/first app/landgut-seebuehne-vercel`

Technischer Stand:

- Next.js/Vercel-Projekt ist angelegt.
- App Router, TypeScript, zentrale Datenstruktur und Komponenten existieren.
- Onepage-Crawl existiert unter `docs/migration/onepage-current/`.
- 21 Onepage-Seiten wurden inventarisiert.
- Die lokale Bildablage wurde auf die aktuell verwendeten Website-Motive reduziert.
- Die grosse Rohbildsammlung ist nicht mehr dauerhaft im Projekt; bei Bedarf gezielt neu aus Inventar/Scripts aufbauen.
- URL-/Redirect-Matrix: `docs/migration/url-matrix.md`.
- Livegang-Checkliste: `docs/migration/livegang-checklist.md`.
- Bild-Workflow: `docs/migration/image-workflow.md`.
- Rebuild-Verfahren: `docs/migration/rebuild-procedure.md`.
- Echte Landingpage-Struktur: `docs/migration/live-page-structure.md`.
- `sitemap.xml`, `robots.txt`, `llms.txt`, Canonicals und `noindex`-Logik sind angelegt.

Wichtigster offener Punkt:

Die aktuelle Startseite im Code ist noch zu ruhig und SEO-seitig gedacht. Sie muss als naechstes naeher an die echte lange Onepage-Sales-Landingpage gebracht werden.

## Echte Reihenfolge der aktuellen Landingpage

Quelle: `docs/migration/live-page-structure.md`

1. Hero: exklusive Location in Mittelfranken, natuerlich heiraten zwischen Wiesen, Wald und See
2. Social Proof: bestbewertete Paare, Bekannt-aus-Logos, Bildslider
3. Lead Magnet: Hochzeitsmappe und erste Termin-/Verfuegbarkeits-CTA
4. Sechs Versprechen: Exklusivitaet, digitale Betreuung, Individualitaet, Naturkulisse, Nachhaltigkeit, transparente Preise
5. Bildslider/Impressionen
6. Wedding Bundles: Tiny Wedding, Classic Wedding, Signature Wedding
7. Familienunternehmen: Geschichte, Gastgeberfamilie, Teamleader
8. Bewertungen und Paarstimmen
9. Problemteil: typische Warnsignale bei Hochzeitslocations
10. Loesungsteil: acht konkrete Gegenargumente und Vorteile der Seebuehne
11. Mini-Galerie und Instagram-Verweis
12. Offene-Fragen-CTA mit Ansprechpartnerin
13. FAQ
14. Footer mit KI-Assistent, Galerie, Wuensche, Impressum, Testimonials, Buchung, FAQ, Jobs und Kontakt

## Moduluebersicht

### Modul 1: Technische Sicherung der Onepage

Status: Teilweise erledigt.

Ziel:
HTML, Texte, Links, Bilder, Metadaten, alte URLs, Sitemap, Robots, `llms.txt` und grobe Section-Reihenfolge sichern.

Vorhanden:

- `scripts/crawl-onepage.mjs`
- `docs/migration/onepage-current/inventory.json`
- gecrawlte HTML-Seiten der indexierten Kernseiten unter `docs/migration/onepage-current/pages/`

Noch zu tun:

- Formulare genauer aus HTML und Onepage-Backend pruefen.
- Tracking-/Custom-Code aus Onepage-Backend sichern.
- SEO-Felder je Seite aus Onepage-Backend bestaetigen.

Braucht:

- Oeffentliche Website reicht fuer Basis-Crawl.
- Onepage-Login oder eingeloggte Browser-Sitzung fuer Backend-Einstellungen.

Kann parallel laufen mit:

- Modul 2, 5, 6.

### Modul 2: Visuelle Sicherung

Status: Offen.

Ziel:
Screenshots als visuelle Wahrheit sichern, weil HTML allein Layout, Abstaende, Bildausschnitte, mobile Wirkung und Slider-Zustaende nicht sauber genug abbildet.

Braucht:

- 1 Fullpage-Screenshot Desktop der Startseite.
- 1 Fullpage-Screenshot Mobile der Startseite.
- 2 bis 3 Screenshots von Slidern/Galerien in weiteren Zustaenden.
- Screenshots von Popups, Formularen oder Cookiebanner, falls vorhanden.

Kann parallel laufen mit:

- Modul 1, 5, 6.

### Modul 3: Startseite 1:1 als Komponenten

Status: Naechster zentraler Umsetzungsblock.

Ziel:
Die Startseite wird als lange Sales-Landingpage nachgebaut. Erst Inhalt und Struktur, dann Designnaehe.

Vorgeschlagene Komponenten:

- `LandingHero`
- `ProofStrip`
- `LeadMagnetSection`
- `PromiseGrid`
- `ImageSlider`
- `WeddingBundles`
- `FamilyStory`
- `Testimonials`
- `ProblemSigns`
- `SolutionAdvantages`
- `MiniGallery`
- `PersonalCta`
- `LandingFaq`
- `LandingFooterLinks`

Umsetzungsregel:

Die Reihenfolge aus `docs/migration/live-page-structure.md` bleibt zuerst bestehen. Keine kreative Neustruktur, bevor die 1:1-Basis steht.

Braucht:

- Freigabe: Texte 1:1 oder sanft glaetten?
- Freigabe: welche Bilder muessen bleiben?
- Screenshots aus Modul 2.
- Onepage-HTML und Seitenstruktur aus Modul 1.

Kann parallel vorbereitet werden mit:

- Modul 6 Bildauswahl.
- Modul 4 CTA-/Formular-Klaerung.

Chronologische Abhaengigkeit:

- Sollte erst finalisiert werden, wenn Modul 1 und 2 ausreichend Material liefern.

### Modul 4: Formulare, CTAs, Kalender, Tracking

Status: Offen.

Ziel:
Alle Conversion-Wege erhalten: Kontaktformular, Hochzeitsmappe, Terminbuchung, Danke-Seiten, Tracking-Events.

Zu pruefen:

- Welche Formulare gibt es?
- Welche Felder gibt es?
- Wohin gehen Formular-E-Mails?
- Welche Danke-Seiten werden genutzt?
- Gibt es versteckte Felder?
- Gibt es Calendly, CRM, Meta Pixel, Google Analytics, GTM, Cookiebanner oder Custom Code?
- Werden UTM-Parameter weitergegeben?
- Gibt es Weiterleitungen nach Formularabsendung?

Braucht:

- Onepage-Backend-Zugang oder eingeloggte Browser-Sitzung.
- Zugriff auf Termin-/Kalender-Tool, falls separat.
- Zugriff auf Analytics/GTM/Meta Pixel, falls Tracking final uebernommen werden soll.

Kann parallel vorbereitet werden mit:

- Modul 3.
- Modul 5.

Chronologische Abhaengigkeit:

- Muss vor Preview-Abnahme und Livegang final sein.

### Modul 5: SEO-Migration und URL-Sicherheit

Status: Teilweise erledigt.

Ziel:
Keine bekannten Onepage-URLs verlieren, Suchsignale erhalten und Indexierbarkeit kontrollieren.

Vorhanden:

- `docs/migration/url-matrix.md`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/llms.txt/route.ts`
- Redirects in `next.config.ts`
- `noindex`-Logik fuer interne/problematische Seiten

Zu pruefen:

- Search Console Top-Seiten.
- Search Console Top-Queries.
- Indexierte Seiten.
- 404-Fehler.
- Externe Links.
- Sitemap-Status.
- Alte Onepage-URLs, die Google noch kennt.

Braucht:

- Google Search Console Zugriff fuer `landgut-seebuehne.de`.
- Optional Analytics-Zugriff fuer meistbesuchte Seiten und Conversion-Daten.
- Entscheidung zu Review-Seiten wie `/quizz`, `/chatbot`, `/zimmerbuchung`, `/bewerbung`.

Kann parallel laufen mit:

- Modul 1, 2, 6.

### Modul 6: Bilder und Assets

Status: Teilweise erledigt.

Ziel:
Bilder lokal sichern, passende Motive auswaehlen, Rechte pruefen, finale Dateinamen und Alt-Texte setzen.

Vorhanden:

- Kuratierte, aktuell verwendete Bilder unter `public/images/site/`
- Kontaktuebersicht: `docs/migration/onepage-contact-sheet.jpg`
- Bildverknuepfung in `data/site.ts`
- Bild-Workflow in `docs/migration/image-workflow.md`

Zu tun:

- Endgueltige Hero-/Section-Bilder fuer die lange Landingpage waehlen.
- Nutzungsrechte und Fotografen-Credits pruefen.
- Raw-Dateien optional in sprechende Namen kopieren.
- Alt-Texte fuer finale Bilder pflegen.
- Bildgroessen optimieren.

Braucht:

- Entscheidung: welche Bilder muessen bleiben?
- Rechte-/Fotografenfreigabe.
- Optional bessere Originalbilder.

Kann parallel laufen mit:

- Modul 1, 2, 3, 5.

### Modul 7: Vercel, Domain und DNS

Status: Vorbereitet, aber nicht final.

Ziel:
Preview deployen, Vercel-Projekt verbinden, Domain sauber umziehen.

Bekannter Stand:

- Vercel CLI ist installiert.
- Im anderen Thread wurde festgestellt: keine sichere lokale Vercel-Authentifizierung vorhanden.

Braucht:

- Vercel-Login oder Einladung ins Vercel-Team/Projekt.
- Jonas/DNS-Kontakt oder DNS-Zugang.
- Konkrete DNS-Eintraege werden erst nach Vercel-Domain-Setup final.

Sicherheitsregel:

Keine Passwoerter direkt in den Chat schreiben. Besser:

- User loggt sich selbst im Browser ein.
- Temporaren Teamzugang erstellen.
- DNS-Eintraege von Codex formulieren lassen und an Jonas weitergeben.

Chronologische Abhaengigkeit:

- Erst nach erfolgreicher Preview-QA und Formular-/Tracking-Klaerung live umstellen.

### Modul 8: Launch-QA und Monitoring

Status: Offen.

Ziel:
Vor und nach Livegang technische, visuelle und SEO-relevante Fehler finden.

Vor Livegang testen:

- Vercel Preview.
- Desktop und Mobile.
- Alle Kernseiten.
- Alle alten URLs aus `docs/migration/onepage-current/inventory.json`.
- 301-Redirects.
- `noindex` fuer interne Seiten.
- Sitemap enthaelt nur indexierbare Zielseiten.
- Robots erlaubt Crawling.
- Canonicals zeigen auf finale Domain.
- Formulare und Danke-Seiten.
- Tracking und Consent.
- Kalenderlinks.
- Impressum und Datenschutz.

Nach Livegang testen:

- Startseite und Kernseiten mit HTTP-Status.
- Alte `page-*` URLs auf 301.
- Search Console URL-Pruefung fuer `/`, `/location`, `/trauung`, `/termin-buchen`.
- Sitemap neu einreichen.
- 404- und Redirect-Monitoring.
- Leads und Tracking pruefen.

Monitoring:

- 2 bis 8 Wochen Search Console beobachten.
- Woechentlich Klicks, Impressionen, Indexierung, 404s, Redirects und Top-Queries pruefen.

Braucht:

- Livegang-Datum.
- Search Console Zugriff.
- Analytics/GTM Zugriff.

## Empfohlene Thread-Aufteilung

Wenn mehrere Threads parallel arbeiten, diese Aufteilung nutzen:

### Thread A: Landingpage-Rebuild

Aufgabe:
Startseite in alter Sales-Dramaturgie nachbauen.

Muss lesen:

- `docs/migration/modularer-parallelplan.md`
- `docs/migration/live-page-structure.md`
- `docs/migration/onepage-current/pages/home.html`
- `data/site.ts`
- `components/PageSections.tsx`
- `components/Hero.tsx`
- `app/page.tsx`

Ergebnis:
Komponenten und Daten fuer die lange Startseite.

### Thread B: SEO und URL-Migration

Aufgabe:
URL-Matrix, Redirects, noindex, Sitemap, Robots, Canonicals, Search Console Export pruefen.

Muss lesen:

- `docs/migration/modularer-parallelplan.md`
- `docs/migration/url-matrix.md`
- `docs/migration/rebuild-procedure.md`
- `docs/migration/livegang-checklist.md`
- `next.config.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/llms.txt/route.ts`

Ergebnis:
Finale URL-/SEO-Migrationsliste und technische Aenderungen.

### Thread C: Bilder und visuelle Referenz

Aufgabe:
Bilder sortieren, finale Motive waehlen, Screenshots auswerten, Alt-Texte vorbereiten.

Muss lesen:

- `docs/migration/modularer-parallelplan.md`
- `docs/migration/image-workflow.md`
- `docs/migration/onepage-contact-sheet.jpg`
- `data/site.ts`

Ergebnis:
Finale Bildliste, Alt-Texte, Optimierungsbedarf.

### Thread D: Formulare, Tracking und Onepage-Backend

Aufgabe:
Unsichtbare Onepage-Einstellungen sichern und in den Rebuild uebertragen.

Muss lesen:

- `docs/migration/modularer-parallelplan.md`
- `docs/migration/rebuild-procedure.md`
- `docs/migration/livegang-checklist.md`

Braucht zusaetzlich:

- Onepage-Login oder eingeloggte Browser-Sitzung.
- Analytics/GTM/Meta Pixel Zugriff, falls Tracking final gesetzt wird.
- Kalender-/Terminbuchung-Zugang, falls getrennt.

Ergebnis:
Formular-, Tracking-, Danke-Seiten- und Consent-Migrationsliste.

### Thread E: Launch und Vercel

Aufgabe:
Vercel Preview, Domain, DNS, Livegang-QA und Monitoring vorbereiten.

Muss lesen:

- `docs/migration/modularer-parallelplan.md`
- `docs/migration/livegang-checklist.md`
- `docs/migration/url-matrix.md`

Braucht zusaetzlich:

- Vercel-Zugang.
- DNS-Kontakt Jonas oder DNS-Zugang.
- Search Console Zugriff.

Ergebnis:
Preview-URL, DNS-Plan, Livegang-Check, Monitoring-Plan.

## Was vom User konkret gebraucht wird

Sofort hilfreich:

- Desktop-Fullpage-Screenshot der aktuellen Startseite.
- Mobile-Fullpage-Screenshot der aktuellen Startseite.
- Screenshots von Slidern/Galerien in weiteren Zustaenden.
- Onepage-Zugang per eingeloggter Browser-Sitzung oder temporaerem Nutzer.
- Entscheidung: Texte 1:1 uebernehmen oder sanft verbessern?
- Entscheidung: welche Bilder muessen bleiben?
- Search Console Zugriff.

Vor Livegang:

- Vercel-Zugang oder Team-Einladung.
- DNS-Kontakt Jonas oder DNS-Zugang.
- Analytics/GTM/Meta Pixel Zugriff.
- Finale Formular- und Empfaengerfreigabe.
- Impressum/Datenschutz final freigeben.
- Bildrechte/Fotografen-Credits bestaetigen.
- Livegang-Termin.

## Prompt fuer neue Threads

Wenn ein neuer Codex-Thread in diesem Projekt startet, diesen Prompt verwenden:

```markdown
Bitte lies zuerst:

- `docs/migration/modularer-parallelplan.md`
- danach die in deinem Modul genannten Dateien

Arbeite im Projekt:
`/Volumes/PROJEKTE/first app/landgut-seebuehne-vercel`

Ziel bleibt:
Onepage-Website von Landgut Seebuehne kontrolliert auf Next.js/Vercel uebertragen. Erst Werterhalt und 1:1-Rebuild, dann Optimierung.

Bitte nicht frei neu strukturieren, solange die aktuelle lange Onepage-Sales-Landingpage noch nicht sauber nachgebaut ist.

Sag zuerst kurz, welches Modul du uebernimmst und welche Dateien du gelesen hast.
```

## Definition of Done fuer den 1:1-Grundrebuild

Der 1:1-Grundrebuild ist erst fertig, wenn:

- Die Startseite die echte Sales-Dramaturgie abbildet.
- Desktop und Mobile visuell gegen Screenshots geprueft sind.
- Alle wichtigen CTAs auf korrekte Ziele zeigen.
- Formulare, Kalenderlinks und Danke-Seiten geklaert sind.
- Alle bekannten alten URLs behandelt sind.
- `npm run lint` und `npm run build` erfolgreich laufen.
- Sitemap, Robots, Canonicals und `noindex`-Seiten geprueft sind.
- Keine wichtigen Seiten versehentlich aus der Sitemap fehlen.
- Keine internen/problematischen Seiten versehentlich indexierbar sind.
- Bildrechte und finale Bildauswahl mindestens fuer Livegang geklaert sind.

## Nicht vergessen

`llms.txt` ist ein hilfreicher Zusatz fuer KI-Systeme, aber kein Ersatz fuer echte Inhalte, technische SEO, Sitemap, Search Console, strukturierte Daten und klare Seitenarchitektur.

KI-SEO bedeutet hier nicht Trick-Marketing. Es bedeutet: klare, konkrete, gut belegbare Antworten auf echte Fragen von Paaren, sauber in die Website eingebettet.
