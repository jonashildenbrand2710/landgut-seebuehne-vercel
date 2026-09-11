import type { Metadata } from "next";
import { BookingJourney } from "@/components/BookingFunnel";
import { getBookingFlowConfig } from "@/data/booking-flow";
import { siteConfig } from "@/data/site";
import { pageMetadata } from "@/lib/page-metadata";

const phoneFlow = getBookingFlowConfig("phone");
const tourFlow = getBookingFlowConfig("tour");

export const metadata: Metadata = pageMetadata({
  title: "Termin buchen",
  description:
    "Bucht ein Kennenlerngespräch oder eine persönliche Besichtigung am Landgut Seebühne.",
  path: "/termin-buchen"
});

export default function TerminBuchenPage() {
  return (
    <article className="booking-page">
      <div className="section-inner booking-page-inner booking-page-inner-neutral">
        <BookingJourney email={siteConfig.email} phoneFlow={phoneFlow} tourFlow={tourFlow} />
      </div>
    </article>
  );
}
