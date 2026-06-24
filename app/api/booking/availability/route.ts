import { bookingErrorResponse, getBookingAvailability } from "@/lib/booking-api";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const availability = await getBookingAvailability(payload);
    return Response.json(availability, { status: 200 });
  } catch (error) {
    return bookingErrorResponse(error);
  }
}
