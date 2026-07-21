import { createClient } from "jsr:@supabase/supabase-js@2";
import { slotIsBlocked, type BusyCalendarInterval } from "./slot-policy.ts";

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

const calendarScope = "https://www.googleapis.com/auth/calendar.events";
const googleTokenUrl = "https://oauth2.googleapis.com/token";
const googleCalendarApiBase = "https://www.googleapis.com/calendar/v3";
const defaultTimeZone = "Europe/Berlin";
const defaultAppointmentType = "phone";
const defaultSlotDurationMinutes = 30;
const defaultSlotStepMinutes = 30;
const tourCalendarSlotMinutes = 60;
const maxAvailabilityRangeDays = 45;
const maxAvailabilitySlots = 120;

type GoogleConfig = {
  calendarId: string;
  clientEmail: string;
  privateKey: string;
};

type LeadRecord = {
  id: string;
  lead_number: number | null;
  booking_status: string;
  couple_name: string;
  email: string;
  phone: string;
  desired_date: string | null;
  desired_year: string | null;
  guest_range: string | null;
  wedding_type: string | null;
  priorities: string[] | null;
  budget_range: string | null;
  readiness: string | null;
  preferred_call_window: string | null;
  note: string | null;
  lead_score: number;
  lead_grade: string;
  lead_status: string;
  package_fit: string;
  investment_note: string;
  form_data: Record<string, unknown>;
  briefing: Record<string, unknown>;
  calendly_prefill: string | null;
  calendly_event_start_time: string | null;
  calendly_event_end_time: string | null;
  calendly_scheduled_at: string | null;
  google_calendar_event_id: string | null;
  tour_event_end_time: string | null;
  tour_event_start_time: string | null;
  tour_google_calendar_event_id: string | null;
  tour_google_calendar_synced_at: string | null;
  tour_scheduled_at: string | null;
};

type BookingWindow = {
  end: string;
  start: string;
  weekdays: number[];
};

const leadSelect = `
  id,
  lead_number,
  booking_status,
  couple_name,
  email,
  phone,
  desired_date,
  desired_year,
  guest_range,
  wedding_type,
  priorities,
  budget_range,
  readiness,
  preferred_call_window,
  note,
  lead_score,
  lead_grade,
  lead_status,
  package_fit,
  investment_note,
  form_data,
  briefing,
  calendly_prefill,
  calendly_event_start_time,
  calendly_event_end_time,
  calendly_scheduled_at,
  google_calendar_event_id,
  tour_scheduled_at,
  tour_event_start_time,
  tour_event_end_time,
  tour_google_calendar_event_id,
  tour_google_calendar_synced_at
`;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    status,
  });
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function asNumber(value: unknown, fallback: number) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function compactRecord(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && !value.trim()) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  );
}

function compact(items: Array<string | null | undefined>) {
  return items.filter((item): item is string => Boolean(item && item.trim()));
}

function normalizeEmail(value: unknown) {
  return asString(value).toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function textAnswer(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(textAnswer).filter(Boolean).join(", ");
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return asString(value);
}

function answerEntries(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        const record = asRecord(item);
        const key = asString(record.id) || asString(record.key) || asString(record.name) || asString(record.label);
        const label = asString(record.label) || asString(record.question) || asString(record.name) || key;
        const answer = textAnswer(record.value ?? record.answer ?? record.response);
        return key || label || answer ? { answer, key: key || label, label: label || key } : null;
      })
      .filter((item): item is { answer: string; key: string; label: string } => Boolean(item));
  }

  const record = asRecord(value);
  return Object.entries(record).map(([key, item]) => ({
    answer: textAnswer(item),
    key,
    label: key,
  }));
}

function answerByKeys(answers: unknown, keys: string[]) {
  const normalizedKeys = keys.map((key) => key.toLowerCase());
  for (const entry of answerEntries(answers)) {
    const haystack = `${entry.key} ${entry.label}`.toLowerCase();
    if (normalizedKeys.some((key) => haystack.includes(key)) && entry.answer) {
      return entry.answer;
    }
  }
  return "";
}

function stringArrayAnswer(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(textAnswer).filter(Boolean);
  }
  const text = textAnswer(value);
  return text ? text.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

function requiredString(value: unknown, label: string) {
  const text = asString(value);
  if (!text) return { error: `${label} fehlt.`, ok: false } as const;
  return { ok: true, value: text } as const;
}

function parseDate(value: unknown) {
  const text = asString(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function addMinutes(value: Date, minutes: number) {
  return new Date(value.getTime() + minutes * 60 * 1000);
}

function minutesFromTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function appointmentDuration(payload: Record<string, unknown>) {
  const booking = asRecord(payload.booking);
  return Math.min(
    180,
    Math.max(
      15,
      asNumber(
        booking.durationMinutes ?? booking.duration_minutes ?? payload.durationMinutes,
        defaultSlotDurationMinutes,
      ),
    ),
  );
}

function appointmentType(payload: Record<string, unknown>) {
  const booking = asRecord(payload.booking);
  return asString(booking.type) || asString(booking.appointmentType) || asString(payload.appointmentType) || defaultAppointmentType;
}

function appointmentLabel(type: string) {
  return type === "tour" ? "Besichtigungstermin" : "Telefontermin";
}

function googleConfig(): GoogleConfig {
  const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID")?.trim();
  const clientEmail = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL")?.trim();
  const privateKey = Deno.env.get("GOOGLE_PRIVATE_KEY")?.trim();

  if (!calendarId || !clientEmail || !privateKey || privateKey.includes("PASTE_")) {
    throw new Error("Google Calendar Secrets fehlen.");
  }

  return { calendarId, clientEmail, privateKey };
}

function supabaseAdmin() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase Admin-Umgebung fehlt.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

function requireWebsiteToken(req: Request) {
  const expectedToken = Deno.env.get("WEBSITE_BOOKING_ACCESS_TOKEN")?.trim();
  if (!expectedToken || expectedToken.startsWith("replace-") || expectedToken.startsWith("PASTE_")) {
    return { error: "WEBSITE_BOOKING_ACCESS_TOKEN fehlt.", ok: false, status: 500 } as const;
  }

  const providedToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!providedToken || providedToken !== expectedToken) {
    return { error: "Website Booking Zugriffscode ist ungueltig.", ok: false, status: 401 } as const;
  }

  return { ok: true } as const;
}

function base64Url(value: string | ArrayBuffer) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function pemToArrayBuffer(pem: string) {
  const normalized = pem
    .replace(/^['"]|['"]$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
}

async function getGoogleAccessToken(config: GoogleConfig) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      aud: googleTokenUrl,
      exp: now + 3600,
      iat: now,
      iss: config.clientEmail,
      scope: calendarScope,
    }),
  );
  const signingInput = `${header}.${claim}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(config.privateKey),
    { hash: "SHA-256", name: "RSASSA-PKCS1-v1_5" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  );
  const assertion = `${signingInput}.${base64Url(signature)}`;
  const response = await fetch(googleTokenUrl, {
    body: new URLSearchParams({
      assertion,
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.access_token) {
    throw new Error(
      payload?.error_description || payload?.error || "Google Access Token konnte nicht erstellt werden.",
    );
  }

  return payload.access_token as string;
}

async function googleCalendarRequest(
  token: string,
  calendarId: string,
  path: string,
  options: RequestInit = {},
) {
  const response = await fetch(
    `${googleCalendarApiBase}/calendars/${encodeURIComponent(calendarId)}${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    },
  );
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.error || "Google Calendar Anfrage fehlgeschlagen.");
  }

  return payload;
}

function defaultBookingWindows(): BookingWindow[] {
  // Besichtigungen starten Sonntag bis Donnerstag stuendlich von 10:00 bis 17:00 Uhr.
  // Das Fenster endet um 19:00 Uhr, damit auch der letzte 120-Minuten-Termin hineinpasst.
  return [{ end: "19:00", start: "10:00", weekdays: [0, 1, 2, 3, 4] }];
}

function bookingWindows(): BookingWindow[] {
  const raw = Deno.env.get("WEBSITE_BOOKING_WINDOWS")?.trim();
  if (!raw) return defaultBookingWindows();

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultBookingWindows();
    const windows = parsed
      .map((item) => {
        const record = asRecord(item);
        const weekdays = Array.isArray(record.weekdays)
          ? record.weekdays.map((day) => Number(day)).filter((day) => day >= 0 && day <= 6)
          : [];
        return {
          end: asString(record.end),
          start: asString(record.start),
          weekdays,
        };
      })
      .filter((item) => item.weekdays.length && minutesFromTime(item.start) !== null && minutesFromTime(item.end) !== null);
    return windows.length ? windows : defaultBookingWindows();
  } catch {
    return defaultBookingWindows();
  }
}

function localParts(date: Date, timeZone = defaultTimeZone) {
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

function slotInBookingWindow(start: Date, durationMinutes: number, windows: BookingWindow[]) {
  const end = addMinutes(start, durationMinutes);
  const startParts = localParts(start);
  const endParts = localParts(end);
  if (startParts.dateKey !== endParts.dateKey) return false;

  const startMinutes = startParts.hour * 60 + startParts.minute;
  const endMinutes = endParts.hour * 60 + endParts.minute;
  return windows.some((window) => {
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

function roundUpToStep(date: Date, stepMinutes: number) {
  const stepMs = stepMinutes * 60 * 1000;
  return new Date(Math.ceil(date.getTime() / stepMs) * stepMs);
}

function eventTime(value: unknown) {
  const record = asRecord(value);
  return asString(record.dateTime) || asString(record.date);
}

async function busyCalendarIntervals(
  accessToken: string,
  calendarId: string,
  from: Date,
  to: Date,
  excludeEventId = "",
) {
  const params = new URLSearchParams({
    orderBy: "startTime",
    singleEvents: "true",
    timeMax: to.toISOString(),
    timeMin: from.toISOString(),
  });
  const payload = await googleCalendarRequest(accessToken, calendarId, `/events?${params}`);
  const events = Array.isArray(payload.items) ? payload.items.map(asRecord) : [];

  return events
    .filter((event) => asString(event.id) !== excludeEventId)
    .filter((event) => asString(event.status) !== "cancelled")
    .filter((event) => asString(event.transparency) !== "transparent")
    .map((event) => ({
      end: parseDate(eventTime(event.end)),
      id: asString(event.id),
      start: parseDate(eventTime(event.start)),
    }))
    .filter((event): event is BusyCalendarInterval => Boolean(event.start && event.end));
}

async function slotAvailable(
  accessToken: string,
  calendarId: string,
  start: Date,
  end: Date,
  excludeEventId = "",
) {
  const busy = await busyCalendarIntervals(accessToken, calendarId, start, end, excludeEventId);
  return !slotIsBlocked(busy, start, end);
}

function availabilityRange(payload: Record<string, unknown>) {
  const range = asRecord(payload.range);
  const from =
    parseDate(range.from) ||
    parseDate(payload.from) ||
    parseDate(payload.start) ||
    roundUpToStep(new Date(), defaultSlotStepMinutes);
  const to =
    parseDate(range.to) ||
    parseDate(payload.to) ||
    parseDate(payload.end) ||
    addMinutes(from, 14 * 24 * 60);
  const maxTo = addMinutes(from, maxAvailabilityRangeDays * 24 * 60);
  return {
    from,
    to: to.getTime() > maxTo.getTime() ? maxTo : to,
  };
}

function slotLabel(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    timeZone: defaultTimeZone,
    weekday: "short",
  }).format(date);
}

async function handleAvailability(payload: Record<string, unknown>) {
  const config = googleConfig();
  const accessToken = await getGoogleAccessToken(config);
  const { from, to } = availabilityRange(payload);
  if (to.getTime() <= from.getTime()) {
    return jsonResponse({ error: "Zeitraum ist ungueltig." }, 400);
  }

  const durationMinutes = appointmentDuration(payload);
  const type = appointmentType(payload);
  const stepMinutes = Math.max(15, asNumber(payload.stepMinutes, defaultSlotStepMinutes));
  const windows = bookingWindows();
  const busy = await busyCalendarIntervals(accessToken, config.calendarId, from, to);
  const slots: Array<Record<string, unknown>> = [];

  for (
    let cursor = roundUpToStep(from, stepMinutes);
    cursor.getTime() < to.getTime() && slots.length < maxAvailabilitySlots;
    cursor = addMinutes(cursor, stepMinutes)
  ) {
    const end = addMinutes(cursor, durationMinutes);
    const calendarSlotEnd = addMinutes(cursor, type === "tour" ? tourCalendarSlotMinutes : durationMinutes);
    if (end.getTime() > to.getTime()) continue;
    if (!slotInBookingWindow(cursor, durationMinutes, windows)) continue;
    if (slotIsBlocked(busy, cursor, calendarSlotEnd)) continue;

    slots.push({
      appointmentType: type,
      durationMinutes,
      end: end.toISOString(),
      id: `${type}_${cursor.toISOString()}`,
      label: slotLabel(cursor),
      start: cursor.toISOString(),
      timezone: defaultTimeZone,
    });
  }

  return jsonResponse({
    appointmentType: type,
    calendar_checked: true,
    from: from.toISOString(),
    slots,
    to: to.toISOString(),
  });
}

function bookingTimes(payload: Record<string, unknown>) {
  const booking = asRecord(payload.booking);
  const slot = asRecord(booking.slot);
  const start =
    parseDate(slot.start) ||
    parseDate(booking.slotStart) ||
    parseDate(booking.start) ||
    parseDate(payload.slotStart);
  const end =
    parseDate(slot.end) ||
    parseDate(booking.slotEnd) ||
    parseDate(booking.end) ||
    (start ? addMinutes(start, appointmentDuration(payload)) : null);

  return { end, start };
}

function normalizeTracking(value: unknown) {
  const tracking = asRecord(value);
  const utm = asRecord(tracking.utm);
  const directUtm = compactRecord({
    campaign: asString(tracking.utm_campaign),
    content: asString(tracking.utm_content),
    medium: asString(tracking.utm_medium),
    source: asString(tracking.utm_source),
    term: asString(tracking.utm_term),
  });

  return compactRecord({
    ...tracking,
    fbc: asString(tracking.fbc),
    fbclid: asString(tracking.fbclid),
    fbp: asString(tracking.fbp),
    landingPageUrl: asString(tracking.landingPageUrl) || asString(tracking.landing_page_url),
    pageUrl: asString(tracking.pageUrl) || asString(tracking.page_url),
    referrer: asString(tracking.referrer),
    userAgent: asString(tracking.userAgent) || asString(tracking.user_agent),
    utm: compactRecord({ ...directUtm, ...utm }),
  });
}

function sourceContext(tracking: Record<string, unknown>, flowId: string) {
  const utm = asRecord(tracking.utm);
  const campaign = asString(utm.campaign);
  const source = asString(utm.source);
  const medium = asString(utm.medium);
  const label = campaign || source || "Website Booking";
  return {
    callHint:
      "Termin wurde ueber die eigene Website-Booking-API gebucht. Funnel-Antworten sind Kontext, keine automatische Gewichtung.",
    campaignName: campaign || null,
    category: "website",
    label,
    summary: compact([
      `Flow: ${flowId || "unbekannt"}`,
      source ? `Quelle: ${source}` : null,
      medium ? `Medium: ${medium}` : null,
      campaign ? `Kampagne: ${campaign}` : null,
    ]).join(" - "),
  };
}

function leadReference(lead: Pick<LeadRecord, "id" | "lead_number">) {
  return typeof lead.lead_number === "number" && Number.isFinite(lead.lead_number)
    ? `L-${String(lead.lead_number).padStart(4, "0")}`
    : lead.id;
}

function buildBriefing({
  answers,
  appointmentType,
  flowId,
  tracking,
}: {
  answers: unknown;
  appointmentType: string;
  flowId: string;
  tracking: Record<string, unknown>;
}) {
  const label = appointmentLabel(appointmentType);

  if (appointmentType === "tour") {
    return {
      focus: [
        "Besichtigung aus eigener Website-Buchung bestaetigen.",
        "Funnel-Antworten zur Vorbereitung des Rundgangs nutzen.",
        "Fragen zu Datum, Gaestezahl und Hochzeitsrahmen vor Ort klaeren.",
      ],
      followUpDraft:
        "Hallo, vielen Dank fuer eure Terminbuchung. Wir freuen uns darauf, euch das Landgut Seebuehne bei der Besichtigung persoenlich zu zeigen und eure Fragen vor Ort zu klaeren.",
      grade: "B-Lead",
      motive: `Hat aktiv einen ${label} ueber die Website gebucht.`,
      nextQuestions: [
        "Wunschdatum und Flexibilitaet bestaetigen.",
        "Gaestezahl und gewuenschten Hochzeitsrahmen einordnen.",
        "Offene Fragen fuer den Rundgang sammeln.",
      ],
      recommendedAction: "Besichtigung vorbereiten und Kontext im CRM fortschreiben.",
      risks: [],
      score: 50,
      sourceContext: sourceContext(tracking, flowId),
      status: "Website-Besichtigung gebucht",
      summary: `Hat ueber die eigene Website-Booking-API einen ${label} gebucht. Antworten: ${answerEntries(answers).length}`,
    };
  }

  return {
    focus: [
      `${label} aus eigener Website-Buchung bestaetigen.`,
      "Funnel-Antworten als Voreindruck nutzen, nicht als harte Bewertung.",
      "Naechsten Schritt Richtung Besichtigung oder Angebot klaeren.",
    ],
    followUpDraft:
      "Hallo, vielen Dank fuer eure Terminbuchung. Wir freuen uns auf das kurze Kennenlernen und klaeren im Gespraech direkt Datum, Gaestezahl und den passenden Rahmen.",
    grade: "B-Lead",
    motive: `Hat aktiv einen ${label} ueber die Website gebucht.`,
    nextQuestions: [
      "Wunschdatum und Flexibilitaet bestaetigen.",
      "Gaestezahl, Budgetrahmen und Entscheidungsstand einordnen.",
      "Passenden naechsten Schritt festlegen.",
    ],
    recommendedAction: "Telefontermin wahrnehmen und Kontext im CRM fortschreiben.",
    risks: [],
    score: 50,
    sourceContext: sourceContext(tracking, flowId),
    status: "Website-Termin gebucht",
    summary: `Hat ueber die eigene Website-Booking-API einen ${label} gebucht. Antworten: ${answerEntries(answers).length}`,
  };
}

function calendarDescription({
  answers,
  booking,
  contact,
  eventId,
  flowId,
  lead,
  tracking,
}: {
  answers: unknown;
  booking: Record<string, unknown>;
  contact: Record<string, unknown>;
  eventId: string;
  flowId: string;
  lead: LeadRecord;
  tracking: Record<string, unknown>;
}) {
  const answerLines = answerEntries(answers)
    .filter((entry) => entry.answer)
    .slice(0, 16)
    .map((entry) => `- ${entry.label}: ${entry.answer}`);
  const utm = asRecord(tracking.utm);
  const label = appointmentLabel(asString(booking.type) || asString(booking.appointmentType) || defaultAppointmentType);

  return compact([
    `${label} aus der eigenen Website-Booking-API.`,
    "",
    `Lead-Referenz: ${leadReference(lead)}`,
    `Lead-ID: ${lead.id}`,
    `Name: ${lead.couple_name || asString(contact.name)}`,
    `Telefon: ${lead.phone || asString(contact.phone)}`,
    `E-Mail: ${lead.email || asString(contact.email)}`,
    `Terminart: ${asString(booking.type) || asString(booking.appointmentType) || defaultAppointmentType}`,
    `Flow: ${flowId || "offen"}`,
    eventId ? `Event-ID: ${eventId}` : null,
    "",
    asString(utm.source) || asString(utm.medium) || asString(utm.campaign)
      ? `Herkunft: ${compact([
          asString(utm.source),
          asString(utm.medium),
          asString(utm.campaign),
        ]).join(" / ")}`
      : null,
    asString(tracking.landingPageUrl) ? `Landingpage: ${asString(tracking.landingPageUrl)}` : null,
    "",
    answerLines.length ? "Antworten" : null,
    ...answerLines,
  ]).join("\n");
}

function googleBookingEventBody({
  answers,
  booking,
  contact,
  end,
  eventId,
  flowId,
  lead,
  start,
  tracking,
}: {
  answers: unknown;
  booking: Record<string, unknown>;
  contact: Record<string, unknown>;
  end: Date;
  eventId: string;
  flowId: string;
  lead: LeadRecord;
  start: Date;
  tracking: Record<string, unknown>;
}) {
  const type = asString(booking.type) || asString(booking.appointmentType) || defaultAppointmentType;
  const label = appointmentLabel(type);

  return {
    colorId: type === "tour" ? "10" : "2",
    description: calendarDescription({ answers, booking, contact, eventId, flowId, lead, tracking }),
    end: { dateTime: end.toISOString(), timeZone: defaultTimeZone },
    extendedProperties: {
      private: compactRecord({
        eventId,
        flowId,
        leadId: lead.id,
        leadNumber: leadReference(lead),
        source: "website-booking",
      }),
    },
    start: { dateTime: start.toISOString(), timeZone: defaultTimeZone },
    summary: `${leadReference(lead)} - ${lead.couple_name} - ${label}`,
  };
}

async function upsertGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventId: string | null,
  body: Record<string, unknown>,
) {
  const path = eventId
    ? `/events/${encodeURIComponent(eventId)}?sendUpdates=none`
    : "/events?sendUpdates=none";
  const payload = await googleCalendarRequest(accessToken, calendarId, path, {
    body: JSON.stringify(body),
    method: eventId ? "PATCH" : "POST",
  });
  return asString(payload.id) || eventId || "";
}

async function findExistingLead(
  supabase: ReturnType<typeof supabaseAdmin>,
  eventId: string,
  email: string,
) {
  if (eventId) {
    const { data, error } = await supabase
      .from("leads")
      .select(leadSelect)
      .eq("booking_event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<LeadRecord>();
    if (error) throw error;
    if (data) return data;
  }

  const { data, error } = await supabase
    .from("leads")
    .select(leadSelect)
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<LeadRecord>();
  if (error) throw error;
  return data;
}

function nextBookingStatus(existingStatus: string | null | undefined, type: string) {
  if (existingStatus === "won") return existingStatus;
  if (type === "tour") return "tour_planned";
  return "scheduled";
}

function buildLeadPayload({
  answers,
  booking,
  contact,
  end,
  eventId,
  existing,
  flowId,
  flowVersion,
  start,
  tracking,
}: {
  answers: unknown;
  booking: Record<string, unknown>;
  contact: Record<string, unknown>;
  end: Date;
  eventId: string;
  existing: LeadRecord | null;
  flowId: string;
  flowVersion: string;
  start: Date;
  tracking: Record<string, unknown>;
}) {
  const existingFormData = asRecord(existing?.form_data);
  const websiteBooking = {
    answers,
    booking,
    contact,
    eventId,
    flowId,
    flowVersion,
    receivedAt: new Date().toISOString(),
    tracking,
  };
  const guestRange =
    asString(booking.guestRange) ||
    answerByKeys(answers, ["guest", "gast", "gaeste", "personen"]) ||
    existing?.guest_range ||
    null;
  const desiredDate =
    asString(booking.desiredDate) ||
    answerByKeys(answers, ["desireddate", "wunschdatum", "datum", "hochzeitstermin"]) ||
    existing?.desired_date ||
    null;
  const desiredYear =
    asString(booking.desiredYear) ||
    answerByKeys(answers, ["desiredyear", "wunschjahr", "jahr"]) ||
    desiredDate?.match(/\b20\d{2}\b/)?.[0] ||
    existing?.desired_year ||
    null;
  const weddingType =
    asString(booking.weddingType) ||
    answerByKeys(answers, ["weddingtype", "art", "trauung", "feier"]) ||
    existing?.wedding_type ||
    null;
  const budgetRange =
    asString(booking.budgetRange) ||
    answerByKeys(answers, ["budget", "invest", "preis"]) ||
    existing?.budget_range ||
    null;
  const priorities =
    stringArrayAnswer(asRecord(answers).priorities || asRecord(answers).important || asRecord(answers).focus);
  const note =
    asString(booking.note) ||
    answerByKeys(answers, ["notiz", "note", "message", "nachricht"]) ||
    existing?.note ||
    null;

  const bookingType = asString(booking.type) || asString(booking.appointmentType) || defaultAppointmentType;
  const typeSpecificCalendarFields =
    bookingType === "tour"
      ? {
          tour_event_end_time: end.toISOString(),
          tour_event_start_time: start.toISOString(),
          tour_scheduled_at: start.toISOString(),
        }
      : {
          calendly_event_end_time: end.toISOString(),
          calendly_event_start_time: start.toISOString(),
          calendly_invitee_email: normalizeEmail(contact.email),
          calendly_invitee_name: asString(contact.name),
          calendly_scheduled_at: start.toISOString(),
        };
  const label = appointmentLabel(bookingType);

  return {
    booking_confirmed_at: new Date().toISOString(),
    booking_canceled_at: null,
    booking_event_id: eventId || null,
    booking_flow_id: flowId || null,
    booking_flow_version: flowVersion || null,
    booking_payload: websiteBooking,
    booking_slot_end: end.toISOString(),
    booking_slot_start: start.toISOString(),
    booking_source: "website",
    booking_type: bookingType,
    booking_status: nextBookingStatus(existing?.booking_status, bookingType),
    briefing: buildBriefing({ answers, appointmentType: bookingType, flowId, tracking }),
    budget_range: budgetRange,
    calendly_last_event: "website_booking.booked",
    calendly_prefill: compact([
      `${label} aus Website Booking ohne Calendly`,
      `Flow: ${flowId || "offen"}`,
      `Name: ${asString(contact.name)}`,
      `Telefon: ${asString(contact.phone)}`,
      `E-Mail: ${normalizeEmail(contact.email)}`,
      `Termin: ${start.toISOString()}`,
      ...answerEntries(answers).slice(0, 12).map((entry) => `${entry.label}: ${entry.answer}`),
    ]).join("\n"),
    couple_name: asString(contact.name),
    date_flexibility: desiredDate ? "fixed" : existing?.date_flexibility || null,
    desired_date: desiredDate,
    desired_year: desiredYear,
    email: normalizeEmail(contact.email),
    form_data: {
      ...existingFormData,
      booking: {
        ...(asRecord(existingFormData.booking)),
        latest: websiteBooking,
      },
      funnelVariant: flowId || asString(existingFormData.funnelVariant) || "website_booking",
      lead_timeline: [
        {
          at: new Date().toISOString(),
          source: "website_booking",
          title: `${label} ueber Website gebucht`,
          updated_fields: ["booking_status", "booking_slot_start", "google_calendar_event_id"],
        },
        ...(Array.isArray(existingFormData.lead_timeline) ? existingFormData.lead_timeline : []),
      ].slice(0, 20),
      source: "website_booking",
      tracking: {
        ...asRecord(existingFormData.tracking),
        ...tracking,
      },
      website_booking: websiteBooking,
    },
    guest_range: guestRange,
    investment_note:
      "Website-Booking: Funnel-Antworten werden als Voreindruck gespeichert, aber nicht automatisch gewichtet.",
    lead_grade: existing?.lead_grade || "B-Lead",
    lead_score: existing?.lead_score ?? 50,
    lead_status: "Website-Termin gebucht",
    note,
    package_fit: existing?.package_fit || "Noch nicht bewertet",
    phone: asString(contact.phone),
    preferred_call_window: asString(booking.preferredCallWindow) || "Website-Slot gebucht",
    priorities: priorities.length ? priorities : existing?.priorities || [],
    readiness: asString(booking.readiness) || answerByKeys(answers, ["readiness", "entscheidung", "stand"]) || "Termin gebucht",
    source: "website_booking",
    ...typeSpecificCalendarFields,
    wedding_type: weddingType,
  };
}

async function saveLead(
  supabase: ReturnType<typeof supabaseAdmin>,
  existing: LeadRecord | null,
  payload: Record<string, unknown>,
) {
  const result = existing
    ? await supabase.from("leads").update(payload).eq("id", existing.id).select(leadSelect).single<LeadRecord>()
    : await supabase.from("leads").insert(payload).select(leadSelect).single<LeadRecord>();
  const { data, error } = result;
  if (error || !data) throw new Error(error?.message || "Lead konnte nicht gespeichert werden.");
  return data;
}

async function updateLeadCalendarResult(
  supabase: ReturnType<typeof supabaseAdmin>,
  leadId: string,
  updates: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", leadId)
    .select(leadSelect)
    .single<LeadRecord>();
  if (error || !data) throw new Error(error?.message || "Lead konnte nach Calendar-Sync nicht aktualisiert werden.");
  return data;
}

async function handleBook(payload: Record<string, unknown>) {
  const contact = asRecord(payload.contact);
  const booking = asRecord(payload.booking);
  const answers = payload.answers ?? {};
  const tracking = normalizeTracking(payload.tracking);
  const flowId = asString(payload.flowId) || asString(payload.flow_id) || "website_booking";
  const flowVersion = asString(payload.flowVersion) || asString(payload.flow_version) || "1";
  const eventId = asString(payload.eventId) || asString(payload.event_id) || crypto.randomUUID();
  const nameResult = requiredString(contact.name || contact.coupleName || contact.couple_name, "Name");
  const email = normalizeEmail(contact.email);
  const phoneResult = requiredString(contact.phone, "Telefon");
  const { end, start } = bookingTimes(payload);

  if (!nameResult.ok) return jsonResponse({ error: nameResult.error }, 400);
  if (!email || !isValidEmail(email)) return jsonResponse({ error: "E-Mail ist ungueltig." }, 400);
  if (!phoneResult.ok) return jsonResponse({ error: phoneResult.error }, 400);
  if (!start || !end || end.getTime() <= start.getTime()) {
    return jsonResponse({ error: "Gueltiger Slot mit start/end ist erforderlich." }, 400);
  }

  const config = googleConfig();
  const accessToken = await getGoogleAccessToken(config);
  const supabase = supabaseAdmin();
  const existing = await findExistingLead(supabase, eventId, email);
  const type = appointmentType(payload);
  const calendarEnd = type === "tour" ? addMinutes(start, tourCalendarSlotMinutes) : end;
  const excludeEventId = type === "tour" ? existing?.tour_google_calendar_event_id || "" : existing?.google_calendar_event_id || "";
  const isFree = await slotAvailable(accessToken, config.calendarId, start, calendarEnd, excludeEventId);
  if (!isFree) {
    return jsonResponse({
      code: "slot_unavailable",
      error: "Der Slot ist nicht mehr frei.",
    }, 409);
  }

  const leadPayload = buildLeadPayload({
    answers,
    booking,
    contact: {
      ...contact,
      email,
      name: nameResult.value,
      phone: phoneResult.value,
    },
    end,
    eventId,
    existing,
    flowId,
    flowVersion,
    start,
    tracking,
  });
  let lead = await saveLead(supabase, existing, leadPayload);

  try {
    const googleEventId = await upsertGoogleEvent(
      accessToken,
      config.calendarId,
      type === "tour" ? existing?.tour_google_calendar_event_id || null : existing?.google_calendar_event_id || null,
      googleBookingEventBody({
        answers,
        booking,
        contact,
        end: calendarEnd,
        eventId,
        flowId,
        lead,
        start,
        tracking,
      }),
    );
    const calendarUpdates =
      type === "tour"
        ? {
            google_calendar_error: null,
            tour_google_calendar_event_id: googleEventId,
            tour_google_calendar_synced_at: new Date().toISOString(),
          }
        : {
            google_calendar_error: null,
            google_calendar_event_id: googleEventId,
            google_calendar_synced_at: new Date().toISOString(),
          };
    lead = await updateLeadCalendarResult(supabase, lead.id, {
      ...calendarUpdates,
    });

    return jsonResponse({
      booking: {
        eventId,
        flowId,
        flowVersion,
        slot: {
          end: end.toISOString(),
          start: start.toISOString(),
          timezone: defaultTimeZone,
        },
        status: "scheduled",
      },
      lead: {
        id: lead.id,
        leadNumber: lead.lead_number,
        status: lead.booking_status,
      },
      google_calendar: {
        eventId: googleEventId,
        synced: true,
      },
      tracking: {
        capi_ready: Boolean(eventId),
        eventId,
        next_step: "Serverseitiges CAPI CompleteRegistration/Lead Event kann nach erfolgreichem Booking hier angestossen werden.",
      },
    }, existing ? 200 : 201);
  } catch (error) {
    await updateLeadCalendarResult(supabase, lead.id, {
      google_calendar_error: error instanceof Error ? error.message : "Google Calendar Sync fehlgeschlagen.",
      google_calendar_synced_at: new Date().toISOString(),
    }).catch(() => null);

    return jsonResponse({
      error: error instanceof Error ? error.message : "Google Calendar Termin konnte nicht erstellt werden.",
      lead_id: lead.id,
    }, 502);
  }
}

async function payloadFromRequest(req: Request, url: URL) {
  if (req.method === "GET") {
    return Object.fromEntries(url.searchParams.entries());
  }
  return asRecord(await req.json().catch(() => null));
}

function endpointFrom(url: URL, payload: Record<string, unknown>) {
  const parts = url.pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";
  if (last === "availability" || last === "book") return last;
  return asString(payload.action) || asString(payload.endpoint);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  if (!["GET", "POST"].includes(req.method)) {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const auth = requireWebsiteToken(req);
  if (!auth.ok) return jsonResponse({ error: auth.error }, auth.status);

  const url = new URL(req.url);
  const payload = await payloadFromRequest(req, url);
  const endpoint = endpointFrom(url, payload);

  try {
    if (endpoint === "availability") {
      return await handleAvailability(payload);
    }

    if (endpoint === "book") {
      if (req.method !== "POST") return jsonResponse({ error: "Booking erfordert POST." }, 405);
      return await handleBook(payload);
    }

    return jsonResponse({ error: "Unbekannter website-booking Endpoint." }, 404);
  } catch (error) {
    return jsonResponse({
      error: error instanceof Error ? error.message : "Website Booking Anfrage fehlgeschlagen.",
    }, 500);
  }
});
