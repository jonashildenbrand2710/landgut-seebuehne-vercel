export type BusyCalendarInterval = {
  end: Date;
  id: string;
  start: Date;
};

export type BookingAppointmentType = "phone" | "tour";

export type BookingWindow = {
  end: string;
  start: string;
  weekdays: number[];
};

export type AppointmentPolicy = {
  durationMinutes: number;
  stepMinutes: number;
  windows: BookingWindow[];
};

export const appointmentPolicies: Record<BookingAppointmentType, AppointmentPolicy> = {
  phone: {
    durationMinutes: 30,
    stepMinutes: 30,
    windows: [{ end: "20:00", start: "10:00", weekdays: [1, 2, 3, 4] }],
  },
  tour: {
    durationMinutes: 90,
    stepMinutes: 30,
    windows: [{ end: "20:00", start: "10:00", weekdays: [0, 1, 2, 3, 4] }],
  },
};

export function parseAppointmentType(value: unknown): BookingAppointmentType | null {
  return value === "phone" || value === "tour" ? value : null;
}

function minutesFromTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function localParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    timeZone,
    weekday: "short",
    year: "numeric",
  }).formatToParts(date);
  const record = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const weekdayMap: Record<string, number> = {
    Fri: 5,
    Mon: 1,
    Sat: 6,
    Sun: 0,
    Thu: 4,
    Tue: 2,
    Wed: 3,
  };

  return {
    dateKey: `${record.year}-${record.month}-${record.day}`,
    hour: Number(record.hour),
    minute: Number(record.minute),
    weekday: weekdayMap[record.weekday] ?? -1,
  };
}

export function slotMatchesPolicy(start: Date, policy: AppointmentPolicy, timeZone: string) {
  const end = new Date(start.getTime() + policy.durationMinutes * 60 * 1000);
  const startParts = localParts(start, timeZone);
  const endParts = localParts(end, timeZone);
  if (startParts.dateKey !== endParts.dateKey) return false;

  const startMinutes = startParts.hour * 60 + startParts.minute;
  const endMinutes = endParts.hour * 60 + endParts.minute;
  if (startMinutes % policy.stepMinutes !== 0) return false;

  return policy.windows.some((window) => {
    const windowStart = minutesFromTime(window.start);
    const windowEnd = minutesFromTime(window.end);
    return (
      window.weekdays.includes(startParts.weekday) &&
      windowStart !== null &&
      windowEnd !== null &&
      startMinutes >= windowStart &&
      endMinutes <= windowEnd
    );
  });
}

export function slotEndMatchesPolicy(start: Date, end: Date, policy: AppointmentPolicy) {
  return end.getTime() === start.getTime() + policy.durationMinutes * 60 * 1000;
}

function overlaps(leftStart: Date, leftEnd: Date, rightStart: Date, rightEnd: Date) {
  return leftStart.getTime() < rightEnd.getTime() && leftEnd.getTime() > rightStart.getTime();
}

export function slotIsBlocked(
  busy: BusyCalendarInterval[],
  start: Date,
  end: Date,
) {
  return busy.some((event) => overlaps(start, end, event.start, event.end));
}
