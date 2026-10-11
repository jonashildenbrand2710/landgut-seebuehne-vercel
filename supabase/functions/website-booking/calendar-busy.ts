import type { BusyCalendarInterval } from "./slot-policy.ts";

export type GoogleCalendarPage = {
  items?: unknown[];
  nextPageToken?: string;
  timeZone?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function calendarEventTime(value: unknown, timeZone: string): Date | null {
  const record = asRecord(value);
  if (typeof record.dateTime === "string") {
    const date = new Date(record.dateTime);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof record.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(record.date)) return null;

  // Google's all-day dates describe local calendar days, with an exclusive end.
  // Resolve midnight in the calendar zone instead of interpreting the date as UTC.
  const midnight = Date.parse(`${record.date}T00:00:00Z`);
  if (Number.isNaN(midnight)) return null;
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone,
    year: "numeric",
  });
  let candidate = midnight;
  for (let attempt = 0; attempt < 3; attempt++) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(candidate)).map((part) => [part.type, part.value]));
    const represented = Date.UTC(
      Number(parts.year), Number(parts.month) - 1, Number(parts.day),
      Number(parts.hour), Number(parts.minute), Number(parts.second),
    );
    const next = midnight - (represented - candidate);
    if (next === candidate) break;
    candidate = next;
  }
  return new Date(candidate);
}

export async function loadBusyCalendarIntervals(
  fetchPage: (pageToken: string) => Promise<GoogleCalendarPage>,
  defaultTimeZone: string,
  excludeEventId = "",
): Promise<BusyCalendarInterval[]> {
  const busy: BusyCalendarInterval[] = [];
  let pageToken = "";
  do {
    const page = await fetchPage(pageToken);
    const timeZone = page.timeZone || defaultTimeZone;
    for (const item of page.items || []) {
      const event = asRecord(item);
      if (event.id === excludeEventId || event.status === "cancelled" || event.transparency === "transparent") continue;
      const start = calendarEventTime(event.start, timeZone);
      const end = calendarEventTime(event.end, timeZone);
      if (start && end && end.getTime() > start.getTime()) {
        busy.push({ end, id: typeof event.id === "string" ? event.id : "", start });
      }
    }
    pageToken = page.nextPageToken || "";
  } while (pageToken);
  return busy;
}
