# URL- und Redirect-Matrix

Arbeitsstand fuer den Vercel-Rebuild. Ziel: Keine bekannte Onepage-URL soll beim Domain-Umzug unbeabsichtigt als 404 enden.

| Alte URL | Ziel im Rebuild | Status | Indexierung | Hinweis |
|---|---|---|---|---|
| `/` | `/` | behalten | index | Startseite mit gleicher Suchintention, bessere Struktur und CTA-Fuehrung |
| `/trauung` | `/trauung` | behalten | index | Freie Trauung am See, Plan B, Ablauf |
| `/location` | `/location` | behalten | index | Location/Galerie/Ort fuer den ganzen Tag |
| `/getting-ready` | `/getting-ready` | behalten | index | Getting Ready als Ablaufvorteil |
| `/uber-uns` | `/uber-uns` | behalten | index | Bestehende Schreibweise behalten |
| `/ueber-uns` | `/uber-uns` | 301 | index Ziel | Komfort-Redirect fuer Umlautschreibweise |
| `/hochzeitsmappe` | `/hochzeitsmappe` | behalten | index | Lead-Magnet, keine Preisdetails |
| `/besichtigung` | `/besichtigung` | behalten | index | Direkte Besichtigung als primaeren Einstieg framen |
| `/termin-buchen` | `/termin-buchen` | behalten | index | Direkte Kalenderbuchung fuer eine 120-minuetige Besichtigung; Google blockiert den einstündigen Startslot |
| `/kontaktformular` | `/kontaktformular` | behalten | index | Kontakt- und Lead-Einstieg |
| `/formular` | `/formular` | behalten | index | Besichtigungs-Funnel; CTA fuehrt direkt zur Kalenderbuchung |
| `/impressum` | `/impressum` | behalten | index | Rechtsdaten vor Livegang final pruefen |
| `/danke` | `/danke` | behalten | noindex | Danke-Seite, nicht in Sitemap |
| `/preise` | `/preise` | behalten | noindex | Keine oeffentlichen Preisdetails, CTA zur Besichtigung |
| `/preise-basis` | `/preise-basis` | behalten | noindex | Keine oeffentlichen Preisdetails |
| `/quizz` | `/quizz` | Review | noindex | Alter Funnel; Zweck pruefen |
| `/chatbot` | `/chatbot` | Review | noindex | Alter Funnel/Template; Zweck pruefen |
| `/zimmerbuchung` | `/zimmerbuchung` | Review | noindex | Operative Seite; Integration pruefen |
| `/bewerbung` | `/bewerbung` | Review | noindex | Bewerbungsfunnel noch nicht final uebernommen |
| `/page-*` | `/` | 301 | index Ziel | Alte/duplizierte Onepage-Seiten, inkl. bekannter Pfade `/page-j4jy8j2l17`, `/page-2i9tl81gd9`, `/page-ha0a71x0wl` |

## Vor Livegang offen

- Datenschutzseite und Cookie-/Tracking-Hinweise final bereitstellen.
- Kalender-, CRM- und Formularintegration final anbinden.
- Search Console Export gegen diese Matrix pruefen.
- Adresse/Firma/Fax aus Impressum und internen Unterlagen final bestaetigen.
- Entscheiden, ob Review-Seiten dauerhaft `noindex` bleiben oder spaeter per 301 umgezogen werden.
