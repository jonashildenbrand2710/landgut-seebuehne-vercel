export type BookingConfirmationPayload = {
  booking: {
    slot: {
      end: string;
      start: string;
      timezone?: string;
    };
    type: "phone" | "tour";
  };
  contact: {
    name: string;
    phone: string;
  };
  eventId: string;
};

export type BookingConfirmationEmailContent = {
  html: string;
  subject: string;
  text: string;
};

const venueAddress = "Hauptstraße 32, 91487 Vestenbergsgreuth";
const defaultTimeZone = "Europe/Berlin";

function splitName(name: string) {
  const [firstName = ""] = name.trim().split(/\s+/);
  return { firstName };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatAppointment(startValue: string, endValue: string, timeZone: string) {
  const start = new Date(startValue);
  const end = new Date(endValue);
  const date = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeZone
  }).format(start);
  const time = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone
  });

  return `${date}, ${time.format(start)}–${time.format(end)} Uhr`;
}

export function buildBookingConfirmationEmail(
  payload: BookingConfirmationPayload
): BookingConfirmationEmailContent {
  const type = payload.booking.type;
  const { firstName } = splitName(payload.contact.name);
  const greeting = firstName ? `Hallo ${firstName},` : "Hallo,";
  const timeZone = payload.booking.slot.timezone || defaultTimeZone;
  const appointment = formatAppointment(
    payload.booking.slot.start,
    payload.booking.slot.end,
    timeZone
  );
  const isTour = type === "tour";
  const title = isTour
    ? "Eure Besichtigung auf der Seebühne ist bestätigt"
    : "Euer Telefontermin mit der Seebühne ist bestätigt";
  const intro = isTour
    ? "euer Besichtigungstermin ist fest in unserem Kalender eingetragen. Wir freuen uns darauf, euch das Landgut persönlich zu zeigen."
    : "euer Telefontermin ist fest in unserem Kalender eingetragen. Wir melden uns zur vereinbarten Zeit telefonisch bei euch.";
  const detailRows = isTour
    ? [
        ["Termin", appointment],
        ["Ort", `Landgut Seebühne, ${venueAddress}`],
        ["Dauer", "ca. 90 Minuten"]
      ]
    : [
        ["Termin", appointment],
        ["Telefonnummer", payload.contact.phone],
        ["Dauer", "ca. 30 Minuten"]
      ];
  const detailText = detailRows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const rows = detailRows
    .map(
      ([label, value]) =>
        `<tr><th style="padding:10px 12px;border:1px solid #e7e2d8;text-align:left;background:#f6f0e8;width:145px">${escapeHtml(label)}</th><td style="padding:10px 12px;border:1px solid #e7e2d8">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return {
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#28231f;max-width:640px"><p>${escapeHtml(greeting)}</p><p>${escapeHtml(intro)}</p><h1 style="font-size:24px;line-height:1.25;margin:24px 0 16px">${escapeHtml(title)}</h1><table style="border-collapse:collapse;width:100%;margin-bottom:22px">${rows}</table><p>Falls ihr den Termin ändern müsst oder noch eine Frage habt, antwortet einfach direkt auf diese E-Mail.</p><p>Herzliche Grüße<br><strong>Christine Hildenbrand</strong><br><strong>Landgut Seebühne Mittelfranken</strong></p></div>`,
    subject: `${firstName ? `${firstName}, ` : ""}${isTour ? "eure Besichtigung" : "euer Telefontermin"} auf der Seebühne ist bestätigt`,
    text: [
      greeting,
      "",
      intro,
      "",
      title,
      detailText,
      "",
      "Falls ihr den Termin ändern müsst oder noch eine Frage habt, antwortet einfach direkt auf diese E-Mail.",
      "",
      "Herzliche Grüße",
      "Christine Hildenbrand",
      "Landgut Seebühne Mittelfranken"
    ].join("\n")
  };
}

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function icsDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildBookingCalendarInvite(payload: BookingConfirmationPayload, now = new Date()) {
  const isTour = payload.booking.type === "tour";
  const title = isTour ? "Besichtigung Landgut Seebühne" : "Telefontermin Landgut Seebühne";
  const description = isTour
    ? "Persönliche Besichtigung des Landgut Seebühne."
    : `Telefonisches Kennenlernen. Wir melden uns unter ${payload.contact.phone}.`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Landgut Seebuehne//Website Booking//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcs(payload.eventId)}@landgut-seebuehne.de`,
    `DTSTAMP:${icsDate(now.toISOString())}`,
    `DTSTART:${icsDate(payload.booking.slot.start)}`,
    `DTEND:${icsDate(payload.booking.slot.end)}`,
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    ...(isTour ? [`LOCATION:${escapeIcs(venueAddress)}`] : []),
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}
