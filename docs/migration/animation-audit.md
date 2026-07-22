# Onepage Animation Audit

Stand: 2026-07-22

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
- Scroll-Reveals nutzen `IntersectionObserver` und die Web Animations API mit
  `640ms`, Fade und kleinem Slide/Scale. Paint-intensive Blur-Filter wurden
  entfernt.
- Card-/Text-Elemente werden dezent gestaffelt; der Gesamtversatz bleibt auf
  maximal `135ms` begrenzt.
- Mobile nutzt vertikale Reveals ohne seitlichen Slide, um Proportionen und
  Abstaende stabil zu halten.
- Oberhalb des Folds liegende Hero- und Seiteneinstiege warten nicht auf den
  Observer und blockieren dadurch weder LCP noch die erste Interaktion.
- Interne Seitenwechsel erhalten eine schmale Fortschrittsanzeige und einen
  kurzen, compositor-freundlichen Seiteneintritt. `app/loading.tsx` deckt echte
  Ladegrenzen mit einem ruhigen Fallback ab.
- Hochzeitsmappe, Besichtigungsfunnel und Bewerbung zeigen stabile Lade- und
  Submit-Zustaende, ohne dass Buttons oder Formulare ihre Groesse springen.
- `prefers-reduced-motion: reduce` deaktiviert Float, Reveal, Seitenwechsel und
  Hover-Dauern.

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

## QA 2026-07-22

- Computer-Use-Audit des lokalen Produktions-Builds ueber alle oeffentlichen
  Kernseiten, acht Ratgeberartikel, kontrollierte Alt-/Funnelseiten sowie die
  Hochzeitsmappe und den Besichtigungsablauf: 31 Routen beziehungsweise
  relevante UI-Zustaende ohne sichtbare Renderfehler.
- Mobile Responsive-Emulation `400x861`: Der Direktlink
  `/hochzeitsmappe#mappe-form` landet nach dem responsiven Reflow exakt am
  Formular. Der Besichtigungsfunnel fuehrt nach der Terminwahl weich zum
  sichtbaren Kontaktformular statt an den Footer.
- Hochzeitsmappe unter 3G-Throttling mit lokalen, nicht produktiven Testdaten bis
  zur serverseitigen Telefonnummernvalidierung geprueft. Ladeindikator,
  Fortschrittslinie, `aria-busy` und Fehlerzustand bleiben stabil.
- Footer-Prefetch deaktiviert: Im mobilen Besichtigungsablauf sank der sichtbare
  Netzwerkumfang nach dem Schrittwechsel von 62 auf 29 Requests, ohne den
  eigentlichen Seitenwechsel zu veraendern.
- Hero-Qualitaet fuer die Next-Image-Ausgabe von `85` auf `75` reduziert;
  oberhalb des Folds gibt es keine dauerhaften `will-change`- oder
  Blur-Reveal-Kosten mehr.
- `npm run lint`: gruen
- `npm run build`: gruen, 40 statische Seiten erfolgreich generiert
