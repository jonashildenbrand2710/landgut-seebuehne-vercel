# Onepage Animation Audit

Stand: 2026-06-19

Scope: Hauptseite `https://www.landgut-seebuehne.de/` und lokale Onepage-HTMLs
unter `docs/migration/onepage-current/pages/`.

## Onepage-Parameter

Homepage:

- `animation_type`: `slide` 5x, `zoom` 2x, `off` 10x
- `animation_duration`: vor allem `500`, `600`, `700`, vereinzelt `1700` und
  `2500`
- `animation_timing`: ueberwiegend `ease-out`
- `animation_element`: meist `true`
- Button-/Link-Transitions live sichtbar:
  - CTAs meist `filter 0.3s ease-in-out`
  - CTA-Radius meist `16px`
  - Einige Card-/Team-Links: `box-shadow 0.3s`
- Medien-Hover: `zoomIn` 3x, sonst `none`

`/hochzeitsmappe`:

- `animation_type`: `slide`, `zoom`, `fade`, mehrere `off`
- `animation_duration`: `500`, `800`, `0.3`
- `animation_timing`: `ease-out`, `ease`, `linear`

## Umsetzung im Next-Projekt

- CTAs nutzen `border-radius: 16px`, Hover-Lift, Shine-Overlay und leichte
  Float-Animation.
- Scroll-Reveals nutzen `IntersectionObserver`, `680ms ease-out`, Fade,
  leichter Slide und dezenter Blur.
- Card-/Text-Elemente bekommen gestaffelte Delays von je `70ms`.
- Mobile nutzt vertikale Reveals ohne seitlichen Slide, um Proportionen und
  Abstaende stabil zu halten.
- `prefers-reduced-motion: reduce` deaktiviert Float, Reveal und Hover-Dauern.

Bewusste Abweichung:

- Onepage nutzt vereinzelt sehr lange `2500ms` Animationen. Im Next-Projekt
  wurden diese nicht uebernommen, weil sie den Sales-Funnel traeger wirken
  lassen und beim Scrollen auf Mobile zu spaet reagieren.

## QA 2026-06-19

- `npm run lint`: gruen
- `npm run build`: gruen
- Desktop `1440x1000`, `/`: `overflow-x: 0`, 10 CTA-Elemente ohne
  Text-/Box-Ueberlauf, Scroll-Reveal initialisiert.
- Mobile `390x844`, `/`: `overflow-x: 0`, 10 CTA-Elemente ohne
  Text-/Box-Ueberlauf, CTA-Mindesthoehe 48px, Header-CTA 52x46px.
- Mobile `390x844`, `/termin-buchen`: `overflow-x: 0`, 5 CTA-Elemente ohne
  Text-/Box-Ueberlauf, CTA-Mindesthoehe 48px.
- Mobile `390x844`, `/hochzeitsmappe`: `overflow-x: 0`, 5 CTA-Elemente ohne
  Text-/Box-Ueberlauf.
- Beim Mobile-Test wurde ein 4px-Overflow durch seitliche Reveal-Offsets auf
  unteren CTA-Gruppen gefunden und behoben. Mobile Reveals starten dort jetzt
  vertikal statt horizontal.
