# Bildablage und Verknuepfung

## Aktueller Stand

- Die Website verwendet nur die kuratierten Bilder, die in `data/site.ts` in
  `imageLibrary` verknuepft sind.
- Die aktuell verwendeten Website-Bilder liegen als sprechend benannte,
  komprimierte Motive unter `public/images/site/`.
- Das grosse Onepage-Roharchiv liegt nicht mehr dauerhaft in `public/images/`.
  Wenn es fuer eine gezielte Entscheidung erneut gebraucht wird, kann es aus dem
  Onepage-Inventar und den Scripts wieder aufgebaut werden.
- Die Kontaktuebersicht der gecrawlten Bilder liegt in `docs/migration/onepage-contact-sheet.jpg`.

## Arbeitsweise

1. Neue oder freigegebene Bilder immer zuerst in `public/images/` ablegen.
2. Fuer langfristig verwendete Bilder sprechende Dateinamen verwenden, zum Beispiel `trauung-am-see.jpg`.
3. Die Verknuepfung in `data/site.ts` aktualisieren.
4. Alt-Texte dort direkt mitpflegen.
5. Nach Bildaenderungen `npm run build` ausfuehren und die betroffenen Seiten visuell pruefen.

## Vor Livegang klaeren

- Nutzungsrechte und Fotografen-Credits der uebernommenen Onepage-Bilder bestaetigen.
- Nur final verwendete Motive dauerhaft im Projekt behalten.
- Optional die finalen Motive aus `public/images/onepage/raw/` in sprechend benannte Dateien kopieren.
