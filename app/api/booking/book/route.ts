import { bookingErrorResponse, createBooking } from "@/lib/booking-api";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const booking = await createBooking(payload);
    return Response.json(booking, { status: 200 });
  } catch (error) {
    return bookingErrorResponse(error);
  }
}
