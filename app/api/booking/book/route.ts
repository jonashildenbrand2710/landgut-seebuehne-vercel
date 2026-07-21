import { bookingErrorResponse, createBooking, type BookingRequest } from "@/lib/booking-api";
import { sendMetaCompleteRegistration } from "@/lib/meta-capi";

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: BookingRequest;

  try {
    payload = (await request.json()) as BookingRequest;
  } catch {
    return Response.json({ error: "Anfrage enthält kein gültiges JSON." }, { status: 400 });
  }

  let booking;

  try {
    booking = await createBooking(payload);
  } catch (error) {
    return bookingErrorResponse(error);
  }

  // Tracking darf eine erfolgreich angelegte Buchung nie in einen Fehler verwandeln.
  if (payload.booking?.type === "phone" || payload.booking?.type === "tour") {
    try {
      const tracking =
        payload.tracking && typeof payload.tracking === "object" && !Array.isArray(payload.tracking)
          ? payload.tracking
          : {};
      const eventSourceUrl =
        stringValue(tracking.pageUrl) || new URL(payload.source?.page || "/termin-buchen", request.url).toString();

      await sendMetaCompleteRegistration({
        email: payload.contact?.email,
        eventId: payload.eventId,
        eventSourceUrl,
        funnel: payload.booking.type === "tour" ? "besichtigung" : "erstgespraech",
        phone: payload.contact?.phone,
        request,
        tracking
      });
    } catch (error) {
      console.error(
        "Meta CAPI tracking after booking failed",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  return Response.json(booking, { status: 200 });
}
