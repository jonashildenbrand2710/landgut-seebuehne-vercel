import { bookingErrorResponse, createBooking, type BookingRequest } from "@/lib/booking-api";
import { submitBookingConfirmation } from "@/lib/booking-confirmation";
import { sendMetaCompleteRegistration } from "@/lib/meta-capi";
import { sendTikTokCompleteRegistration } from "@/lib/tiktok-events-api";

export const runtime = "nodejs";

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

  if (process.env.NODE_ENV !== "production" && process.env.BOOKING_AVAILABILITY_PREVIEW === "true") {
    return Response.json(
      {
        booking: {
          eventId: payload.eventId,
          flowId: payload.flowId,
          flowVersion: payload.flowVersion,
          slot: payload.booking.slot,
          status: "preview"
        },
        google_calendar: {
          synced: false
        },
        lead: {
          leadNumber: null,
          status: "preview"
        }
      },
      { status: 200 }
    );
  }

  let booking;

  try {
    booking = await createBooking(payload);
  } catch (error) {
    return bookingErrorResponse(error);
  }

  let confirmationEmail: NonNullable<typeof booking.confirmation_email>;

  try {
    const result = await submitBookingConfirmation(payload, booking);
    confirmationEmail = {
      provider: result.deliveryProvider,
      status: "queued"
    };
  } catch (error) {
    confirmationEmail = { status: "failed" };
    console.error(
      "Booking confirmation delivery failed",
      error instanceof Error ? error.message : "Unknown error"
    );
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

  // TikTok optimiert auf erfolgreiche Buchungen aus demselben Termin-Funnel.
  if (payload.booking?.type === "phone" || payload.booking?.type === "tour") {
    try {
      const tracking =
        payload.tracking && typeof payload.tracking === "object" && !Array.isArray(payload.tracking)
          ? payload.tracking
          : {};
      const eventSourceUrl =
        stringValue(tracking.pageUrl) || new URL(payload.source?.page || "/termin-buchen", request.url).toString();

      await sendTikTokCompleteRegistration({
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
        "TikTok Events API tracking after booking failed",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  return Response.json(
    {
      ...booking,
      confirmation_email: confirmationEmail
    },
    { status: 200 }
  );
}
