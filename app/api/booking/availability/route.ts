import {
  bookingErrorResponse,
  getBookingAvailability,
  type BookingAvailabilityRequest,
  type BookingSlot
} from "@/lib/booking-api";

const berlinTimeZone = "Europe/Berlin";
const tourHours = new Set([10, 11, 12, 13, 14, 15, 16, 17]);
const tourWeekdays = new Set(["Sun", "Mon", "Tue", "Wed", "Thu"]);

function localSlotParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    hourCycle: "h23",
    timeZone: berlinTimeZone,
    weekday: "short"
  }).formatToParts(date);
  const record = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return { hour: Number(record.hour), weekday: record.weekday };
}

function previewTourSlots(payload: BookingAvailabilityRequest): BookingSlot[] {
  const from = new Date(payload.range.from);
  const to = new Date(payload.range.to);
  const cursor = new Date(Math.ceil(from.getTime() / 3_600_000) * 3_600_000);
  const slots: BookingSlot[] = [];

  while (cursor.getTime() < to.getTime()) {
    const local = localSlotParts(cursor);
    if (tourWeekdays.has(local.weekday) && tourHours.has(local.hour)) {
      const start = new Date(cursor);
      const end = new Date(start.getTime() + 120 * 60_000);
      slots.push({
        appointmentType: "tour",
        durationMinutes: 120,
        end: end.toISOString(),
        id: `tour_${start.toISOString()}`,
        start: start.toISOString(),
        timezone: berlinTimeZone
      });
    }
    cursor.setTime(cursor.getTime() + 3_600_000);
  }

  return slots;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Anfrage enthält kein gültiges JSON." }, { status: 400 });
  }

  try {
    const bookingPayload = payload as BookingAvailabilityRequest;
    const previewEnabled =
      process.env.NODE_ENV !== "production" && process.env.BOOKING_AVAILABILITY_PREVIEW === "true";
    const availability =
      previewEnabled && bookingPayload.appointmentType === "tour"
        ? {
            appointmentType: "tour",
            calendar_checked: false,
            from: bookingPayload.range.from,
            preview_mode: true,
            slots: previewTourSlots(bookingPayload),
            to: bookingPayload.range.to
          }
        : await getBookingAvailability(bookingPayload);
    return Response.json(availability, { status: 200 });
  } catch (error) {
    return bookingErrorResponse(error);
  }
}
