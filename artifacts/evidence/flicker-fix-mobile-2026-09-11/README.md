# Evidence: ruhiger Reload und Scroll-Motion

Stand: 2026-09-11
Basis-Commit: `347d905ac81af768e3a5a2ffcce2df244b055d6e`
Nachweis: lokaler Produktions-Build mit den noch nicht committeten Änderungen

## Prüfvertrag

- EVD-1: Ein Hard-Reload zeigt sofort den vollständigen Hero, ohne vorgeschalteten Loader oder Footer-Sprung.
- EVD-2: Interne Navigation bleibt animiert; nur der initiale Hard-Reload überspringt das nachträgliche Page-Fade.
- EVD-3: Schnelles mobiles Scrollen behält dezente Reveal-Bewegung, ohne kartenweises Nachflattern.
- EVD-4: Auto-Karussells laufen nur bei ausreichender Sichtbarkeit und pausieren während des Seitenscrollens.
- EVD-5: Mobile Vollflächen-Effekte bleiben visuell hochwertig, ohne Blur- und Bildfilter-Compositing im Scrollpfad.

Nicht verändert: Inhalte, CTAs, URLs, Tracking-Entscheidungen und Formularverhalten.

## Reproduzierbarer UI-Nachweis

`mobile-reload-scroll-success.mp4` zeigt bei 390 × 844 Pixeln:

1. Hard-Reload des Produktions-Builds;
2. stabilen Hero und von Anfang an reservierten Consent-Hinweis;
3. schnellen Scroll durch die lange Startseite;
4. gruppierte, dezente Reveals ohne globalen Seiten-Swap;
5. stabilen Abschluss im Footer.

Die Kontaktübersicht `review-contact-sheet.jpg` zeigt neun gleichmäßig verteilte Frames des Videos.

## Browserbefunde

- Mobile Hard-Reload: Hero direkt sichtbar, keine Loader-Zwischenansicht.
- Mobile und Desktop: keine Console-Warnungen oder -Fehler.
- Schnelles mobiles Scrollen: sichtbare Karussells pausiert (`data-carousel-animating` nicht gesetzt).
- Sichtbarkeitstest: erstes sichtbares Karussell bewegte sich von `scrollLeft = 0` auf `603.5`; das zweite Offscreen-Karussell blieb bei `0`.
- Interne Navigation: CTA führte korrekt nach `/termin-buchen`; die Route-Entry-Animation bleibt für Pfadwechsel aktiv.

## Qualitätsbefehle

- `npm run lint` — bestanden
- `npm run typecheck` — bestanden
- `npm run build` — bestanden, 43 statische Seiten generiert
- Build-HTML — weder `.page-loading` noch der alte Text „Der nächste Blick …“ noch ein `B:0`-Fallback vorhanden

## Lighthouse (lokaler Produktions-Build)

| Profil | Performance | FCP | LCP | Speed Index | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 0,77 | 1,21 s | 6,61 s | 1,27 s | 61 ms | **0** |
| Desktop | 0,98 | 0,33 s | 1,13 s | 0,33 s | 0 ms | **0** |

Der frühere Produktionsbefund lag auf beiden Profilen bei `CLS 0,279`. Die lokalen Messungen sind wegen unterschiedlicher Host-/Netzwerkbedingungen kein Deployment-Benchmark; sie belegen hier vor allem, dass der Loader-/Footer-Swap und die nachträgliche Consent-Insertion keinen Layout Shift mehr erzeugen.
