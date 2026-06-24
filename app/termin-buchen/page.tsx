import type { Metadata } from "next";
import { CalendarClock, CheckCircle2, ShieldCheck } from "lucide-react";
import { BookingFunnel } from "@/components/BookingFunnel";
import { getBookingFlowConfig } from "@/data/booking-flow";

const flow = getBookingFlowConfig("phone");

export const metadata: Metadata = {
  title: "Telefontermin buchen",
  description:
    "Bucht einen freien Telefontermin mit dem Landgut Seebühne. Die Verfügbarkeit wird direkt mit dem Kalender abgeglichen.",
  alternates: {
    canonical: "/termin-buchen"
  }
};

export default function TerminBuchenPage() {
  return (
    <article className="booking-page">
      <div className="section-inner booking-page-inner">
        <div className="booking-page-copy">
          <p className="eyebrow dark">Erstgespräch</p>
          <h1>Termin buchen</h1>
          <p>
            Wählt eine freie Terminzeit für euer Erstgespräch aus. Danach
            reichen Kontaktdaten und wenige Eckpunkte, damit der Termin direkt
            im Kalender landet.
          </p>
          <div className="booking-page-points" aria-label="Was euch erwartet">
            <span>
              <CalendarClock aria-hidden="true" size={16} />
              30 Minuten
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
