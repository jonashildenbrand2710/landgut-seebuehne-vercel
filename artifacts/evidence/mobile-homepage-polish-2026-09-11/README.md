## Evidence Report

- Commit: `0dbd647d90c952a0949ad34a8776bb533a2d00fd`
- Umgebung: `http://localhost:3019/`
- Linear: nicht verwendet (direkter lokaler Auftrag)
- Ergebnis: bestanden

| Evidenz | Vertrag | Schritte | Erwartet | Beobachtet | Beleg | Status |
| --- | --- | --- | --- | --- | --- | --- |
| EVD-1 | Mobiler Hero | Homepage bei 390 × 844 öffnen | Korrigiertes 4K-Weitwinkelbild bei unverändertem Fokus | `mobile-ai-v5-4k-corrected.jpg`, `object-position: 47% 50%` | `01-mobile-hero.jpg` | bestanden |
| EVD-2 | Karussell-Sofortstart | Von oben in den ersten Bildstreifen scrollen | Erster Slide startet ohne Intervall-Wartezeit | `scrollLeft` wechselte beim Eintritt unmittelbar von 0 über 14 auf 290 px | `carousel-immediate-start.mp4`, `02-carousel-after-entry.jpg` | bestanden |
| EVD-3 | Logo in Wasserfläche | Zum mobilen Terminabschnitt scrollen | Helles Logo nur mobil unter dem Steg im Wasser; Abschnitt kompakter | Logo sichtbar bei 672–710 px im 844-px-Viewport; Abschnittshöhe 800 px | `03-availability-water-logo.jpg` | bestanden |

### Einschränkungen

- Die Prüfung erfolgte lokal gegen den oben genannten Commit. Vercel Preview und Production werden nach dem Push beziehungsweise manuellen Merge separat geprüft.
