import { bookingErrorResponse, getBookingAvailability } from "@/lib/booking-api";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Anfrage enthält kein gültiges JSON." }, { status: 400 });
  }

  try {
    const availability = await getBookingAvailability(payload as Parameters<typeof getBookingAvailability>[0]);
    return Response.json(availability, { status: 200 });
  } catch (error) {
    return bookingErrorResponse(error);
  }
}
