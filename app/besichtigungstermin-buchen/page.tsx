import type { Metadata } from "next";
import { BookingFunnel } from "@/components/BookingFunnel";
import { getBookingFlowConfig } from "@/data/booking-flow";

const flow = getBookingFlowConfig("tour");

export const metadata: Metadata = {
  title: "Besichtigungstermin buchen",
  description:
    "Bucht einen freien Besichtigungstermin mit dem Landgut Seebuehne. Die Verfuegbarkeit wird mit dem Kalender abgeglichen.",
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
          <p className="eyebrow dark">Besichtigung</p>
          <h1>Besichtigungstermin buchen</h1>
          <p>
            Waehlt einen passenden Slot. Danach fragen wir Kontaktdaten und
            wenige Eckpunkte ab und legen den Termin im Kalender an.
          </p>
        </div>
        <BookingFunnel {...flow} />
      </div>
    </article>
  );
}
