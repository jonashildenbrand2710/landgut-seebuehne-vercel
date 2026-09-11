import {
  bookingErrorResponse,
  getBookingAvailability,
  type BookingAvailabilityRequest,
  type BookingSlot
} from "@/lib/booking-api";

const berlinTimeZone = "Europe/Berlin";
const previewPolicies = {
  phone: { durationMinutes: 30, weekdays: ["Mon", "Tue", "Wed", "Thu"] as string[] },
  tour: { durationMinutes: 90, weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu"] as string[] }
} as const;

function localSlotParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    timeZone: berlinTimeZone,
    weekday: "short"
  }).formatToParts(date);
  const record = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return { hour: Number(record.hour), minute: Number(record.minute), weekday: record.weekday };
}

function previewSlots(payload: BookingAvailabilityRequest): BookingSlot[] {
  const policy = previewPolicies[payload.appointmentType];
  const from = new Date(payload.range.from);
  const to = new Date(payload.range.to);
  const cursor = new Date(Math.ceil(from.getTime() / 1_800_000) * 1_800_000);
  const slots: BookingSlot[] = [];

  while (cursor.getTime() < to.getTime()) {
    const local = localSlotParts(cursor);
    const localStartMinutes = local.hour * 60 + local.minute;
    const localEndMinutes = localStartMinutes + policy.durationMinutes;
    if (policy.weekdays.includes(local.weekday) && localStartMinutes >= 600 && localEndMinutes <= 1200) {
      const start = new Date(cursor);
      const end = new Date(start.getTime() + policy.durationMinutes * 60_000);
      slots.push({
        appointmentType: payload.appointmentType,
        durationMinutes: policy.durationMinutes,
        end: end.toISOString(),
        id: `${payload.appointmentType}_${start.toISOString()}`,
        start: start.toISOString(),
        timezone: berlinTimeZone
      });
    }
    cursor.setTime(cursor.getTime() + 1_800_000);
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
      previewEnabled && (bookingPayload.appointmentType === "phone" || bookingPayload.appointmentType === "tour")
        ? {
            appointmentType: bookingPayload.appointmentType,
            calendar_checked: false,
            from: bookingPayload.range.from,
            preview_mode: true,
            slots: previewSlots(bookingPayload),
            to: bookingPayload.range.to
          }
        : await getBookingAvailability(bookingPayload);
    return Response.json(availability, { status: 200 });
  } catch (error) {
    return bookingErrorResponse(error);
  }
}
