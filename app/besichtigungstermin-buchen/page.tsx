import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { BookingFunnel } from "@/components/BookingFunnel";
import { getBookingFlowConfig } from "@/data/booking-flow";
import { siteConfig } from "@/data/site";

const flow = getBookingFlowConfig("tour");

export const metadata: Metadata = {
  title: "Besichtigungstermin buchen",
  description:
    "Bucht direkt einen freien Besichtigungstermin am Landgut Seebühne. Die Verfügbarkeit wird live mit dem Kalender abgeglichen.",
  robots: {
    follow: true,
    index: false
  }
};

export default function BesichtigungsterminBuchenPage() {
  return (
    <article className="booking-page">
      <div className="section-inner booking-page-inner">
        <div className="booking-page-copy">
          <p className="eyebrow dark">Landgut vor Ort erleben</p>
          <h1>Besichtigung buchen</h1>
          <p>
            Wählt direkt einen passenden Termin. Danach fragen wir Kontaktdaten und
            wenige Eckpunkte ab, damit euer Termin sofort im Kalender landet und
            wir euren Besuch passend vorbereiten können.
          </p>
          <p className="booking-page-alternative">
            Ihr möchtet noch nicht gleich zur Besichtigung kommen oder habt vorab
            Fragen? Schreibt uns gern eine E-Mail an{" "}
            <Link href={`mailto:${siteConfig.email}`}>{siteConfig.email}</Link>. Auf
            Wunsch vereinbaren wir darüber auch einen Telefontermin zum Austausch.
          </p>
          <div className="booking-page-points" aria-label="Was euch erwartet">
            <span>
              <CalendarClock aria-hidden="true" size={16} />
              120 Minuten vor Ort
            </span>
            <span>
              <MapPin aria-hidden="true" size={16} />
              {siteConfig.address.legal}
            </span>
            <span>
              <ShieldCheck aria-hidden="true" size={16} />
              Live-Verfügbarkeit
            </span>
            <span>
              <CheckCircle2 aria-hidden="true" size={16} />
              Direkt im Kalender
            </span>
          </div>
        </div>
        <BookingFunnel {...flow} />
      </div>
    </article>
  );
}
