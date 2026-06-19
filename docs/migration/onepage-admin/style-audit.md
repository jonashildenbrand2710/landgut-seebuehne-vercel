# Onepage Admin Style Audit

Stand: 2026-06-19

Scope: Onepage-Projekt `Landgut Seebühne` mit Hauptdomain
`www.landgut-seebuehne.de`, Schwerpunkt Homepage
`Natürlich heiraten - Landgut Seebühne` und ergänzend `/hochzeitsmappe`.
Die Werte wurden read-only aus Onepage-Admin, Editor-Preview und der
öffentlich gerenderten Seite gelesen.

## Schriften

- Headline-Schrift: `Noto Serif Georgian`
  - Hero/Desktop: ca. `48px`, `700`, `line-height 61.4px`
  - Hero/Mobile: ca. `25.4px`, `700`, `line-height 32.5px`
  - Section-Headlines: meist `48px` Desktop, `25.4px` Mobile
  - Subheadline/kleinere Serif-Labels: ca. `20px`, `600`
- Sans-Schrift: `Inclusive Sans`
  - Fliesstext und Buttons: meist `15px` bis `18px`
  - CTA-Buttons: `15px`, `17px` oder `18px`, Gewicht `700`
  - Eyebrow/Label-Texte: `14px` bis `16px`, Gewicht `700`, oft
    `letter-spacing: 0.5px`
- Fallback/Altbestand: `Times` erscheint weiterhin auf einigen generischen
  Footer-/Navigations-Elementen, wirkt aber nicht wie die aktive
  Marken-Haupttypografie.

## Farbpalette

Gesehene, wiederkehrende Originalwerte:

- `#67a490`: primaerer Gruen-/Sage-CTA, Hero-CTA
- `#9e8db7`: violetter CTA-/Accent-Ton
- `#f9f3e9`: heller Creme-/Papier-Hintergrund
- `#1c1d20`: dunkler Ink-/Textton
- `#262626`: dunkler CTA-/Button-Hintergrund
- `#000000`: dunkle Section-/Overlay-Basis
- `#ffffff`: Text auf dunklen Bild- und Farbflächen

Gesehene Opazitaeten:

- Weiss als gedimmter Text: etwa `rgba(255,255,255,0.49-0.5)`
- Schwarz als gedimmter Text/Overlay: etwa `rgba(0,0,0,0.58)`

## Buttons

- Primaerer Hero-CTA:
  - Hintergrund `#67a490`
  - Text `#ffffff`
  - `Inclusive Sans`, `15px`, `700`
  - `border-radius: 16px`
  - Mindesthoehe ca. `56px`, Padding ca. `7px 28px`
  - mehrlagiger Schatten mit gruenem Akzent
- Dunkler Mappe-CTA:
  - Hintergrund `#262626`
  - Text `#ffffff`
  - `Inclusive Sans`, `17px`, `700`
  - `border-radius: 16px`
  - Mindesthoehe ca. `61px`, Padding ca. `8px 31px`
- Violette CTAs:
  - Hintergrund `#9e8db7`
  - Text `#ffffff`
  - `border-radius: 16px` fuer grosse CTAs, `8px` fuer Karten-CTAs
  - Schatten mit violettem Akzent
- Helle Karten-CTAs:
  - Hintergrund `#f9f3e9`
  - Text `#1c1d20`
  - `border-radius: 8px`

## Layout- und Section-Muster

- Hero:
  - Vollflaechiges Bild mit dunklem Overlay
  - Weisse Serif-H1, Sans-Subline, gruenem CTA
  - Trust-Zeile mit Sternen und Presse-/Logo-Leiste
- Dunkle Bereiche:
  - Schwarze bzw. sehr dunkle Hintergruende
  - Text in `#ffffff` oder `#f9f3e9`
  - Eyebrow-Labels in Sans, uppercase/labelartig
- Helle Bereiche:
  - Creme-Hintergrund `#f9f3e9`
  - Text `#1c1d20`
  - Karten mit weissen/hellen Flaechen und weichen Schatten
- Rundungen:
  - Sehr haeufig `0px` fuer reine Layout-Elemente
  - `4px` fuer kleine Badges/Details
  - `8px` fuer Karten-CTAs und kompakte Elemente
  - `16px` fuer Haupt-Buttons
  - `100px` fuer Pillen/kreisnahe Badges
- Custom CSS:
  - Onepage `Code > Styles` ist leer.

## Hinweise fuer Next-Umsetzung

- Die bereits vorhandene Next-Seite nutzt eine eigene, kuratierte Palette.
  Wenn noch naeher ans Onepage-Original gegangen werden soll, sollten die
  oben genannten Farben als benannte Tokens in `app/globals.css` ergaenzt
  und dann gezielt auf Homepage-Komponenten angewendet werden.
- Typografisch ist `Noto Serif Georgian` fuer Headlines und `Inclusive Sans`
  fuer Sans-/CTA-Texte die klarste Originalnaehe.
