# Landgut Seebuehne Brand Guideline Audit

Stand: 2026-06-19

Quelle: `/Users/corneliusaustin/Desktop/SB_brand_guideline.pdf`

## Logo

- Logo besteht aus Logomark `SB` und Logotype `Landgut Seebühne`.
- Das Logomark darf separat eingesetzt werden, der kombinierte Schriftzug ist
  die primaere Marke fuer Header/Footer.
- Clear Space: mindestens die Hoehe der Logotype-Buchstaben rund um das Logo.
- Mindestgroessen:
  - Logomark digital: 12 px
  - Kombiniertes Logo digital: 80 px
- Keine Schatten, Glow-Effekte, Proportionsaenderungen oder Platzierung auf zu
  komplexen/kontrastarmen Hintergruenden.

Umsetzung im Next-Projekt:

- Primaerlogo: `public/images/brand/landgut-seebuehne-logo.svg`
- Helle Variante: `public/images/brand/landgut-seebuehne-logo-light.svg`
- Einsatz: Header, Footer und Lead-Magnet-Block.

## Farben

Primaerfarben:

- Sage Green: `#67A490`, RGB `117 162 145`
- Ink: `#1C1D20`, RGB `28 29 32`
- Cream: `#F9F3E9`, RGB `248 243 233`

Sekundaerfarben:

- Espresso: `#261A12`
- Warm Cream: `#EBE3D3`
- Pale Mauve: `#D4CBDF`
- Brown: `#463428`, `#695142`
- Sand: `#DBD3C1`, `#BFB8A5`
- Mauve: `#B9ACCC`, `#9E8DB7`

Umsetzung im Next-Projekt:

- Basis-Tokens in `app/globals.css` auf Brand-Werte umgestellt.
- Dunkle Funnel-Flaechen nutzen `#1C1D20` bzw. `#261A12`.
- CTAs nutzen Ink/Cream statt fremder Gruen-/Blauwerte.

## Typografie

- Accent/Display: `Editorial New`
  - fuer H1/H2, Opening-Texte und Quotes
  - nicht in kleinen Groessen unter 14 pt
  - empfohlene Schnitte: Ultralight, Ultralight Italic, Regular
- Paragraph: `Inclusive Sans`
  - fuer Fliesstext und kleine Groessen
  - empfohlene Schnitte: Light, Regular, Medium, Semi-Bold, Bold
- Textbloecke sollen maximal ca. 700 px breit sein.

Umsetzung im Next-Projekt:

- `Inclusive Sans` war bereits aktiv und bleibt Body-/Paragraph-Font.
- Display-Stack nutzt `Editorial New` als bevorzugten Namen mit bestehendem
  Serif-Fallback, falls kein Webfont bereitgestellt ist.
