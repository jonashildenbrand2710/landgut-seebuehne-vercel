import { bookingErrorResponse, createBooking, type BookingRequest } from "@/lib/booking-api";
import { sendMetaCompleteRegistration } from "@/lib/meta-capi";

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as BookingRequest;
    const booking = await createBooking(payload);

    if (payload.booking?.type === "phone") {
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
        funnel: "erstgespraech",
        phone: payload.contact?.phone,
        request,
        tracking
      });
    }

    return Response.json(booking, { status: 200 });
  } catch (error) {
    return bookingErrorResponse(error);
  }
}
