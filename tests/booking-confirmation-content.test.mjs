import assert from "node:assert/strict";
import test from "node:test";

import {
  buildBookingCalendarInvite,
  buildBookingConfirmationEmail
} from "../lib/booking-confirmation-content.ts";

function bookingPayload(type, overrides = {}) {
  return {
    booking: {
      slot: {
        end: "2026-09-13T10:30:00.000Z",
        start: "2026-09-13T09:00:00.000Z",
        timezone: "Europe/Berlin"
      },
      type
    },
    contact: {
      name: "Lea Beispiel",
      phone: "+49 170 1234567"
    },
    eventId: `booking_${type}_test`,
    ...overrides
  };
}

test("erstellt die Besichtigungsbestätigung mit Ort und 90 Minuten", () => {
  const content = buildBookingConfirmationEmail(bookingPayload("tour"));

  assert.equal(content.subject, "Lea, eure Besichtigung auf der Seebühne ist bestätigt");
  assert.match(content.text, /Sonntag, 13\. September 2026, 11:00–12:30 Uhr/);
  assert.match(content.text, /Landgut Seebühne, Hauptstraße 32, 91487 Vestenbergsgreuth/);
  assert.match(content.text, /Dauer: ca\. 90 Minuten/);
  assert.doesNotMatch(content.text, /Telefonnummer:/);
});

test("erstellt die Telefonbestätigung mit Telefonnummer und 30 Minuten", () => {
  const content = buildBookingConfirmationEmail(bookingPayload("phone"));

  assert.equal(content.subject, "Lea, euer Telefontermin auf der Seebühne ist bestätigt");
  assert.match(content.text, /Telefonnummer: \+49 170 1234567/);
  assert.match(content.text, /Dauer: ca\. 30 Minuten/);
  assert.doesNotMatch(content.text, /Ort: Landgut/);
});

test("maskiert Kontaktdaten in der HTML-Mail", () => {
  const payload = bookingPayload("phone", {
    contact: {
      name: "<Lea>",
      phone: "<script>alert(1)</script>"
    }
  });
  const content = buildBookingConfirmationEmail(payload);

  assert.match(content.html, /Hallo &lt;Lea&gt;,/);
  assert.match(content.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(content.html, /<script>/);
});

test("erstellt für eine Besichtigung eine importierbare Kalenderdatei mit Ort", () => {
  const invite = buildBookingCalendarInvite(
    bookingPayload("tour"),
    new Date("2026-09-11T10:00:00.000Z")
  );

  assert.match(invite, /^BEGIN:VCALENDAR\r\n/);
  assert.match(invite, /UID:booking_tour_test@landgut-seebuehne\.de/);
  assert.match(invite, /DTSTART:20260913T090000Z/);
  assert.match(invite, /DTEND:20260913T103000Z/);
  assert.match(invite, /LOCATION:Hauptstraße 32\\, 91487 Vestenbergsgreuth/);
  assert.match(invite, /STATUS:CONFIRMED/);
  assert.match(invite, /END:VCALENDAR$/);
});

test("erstellt für den Telefontermin eine Kalenderdatei ohne falschen Veranstaltungsort", () => {
  const invite = buildBookingCalendarInvite(
    bookingPayload("phone"),
    new Date("2026-09-11T10:00:00.000Z")
  );

  assert.match(invite, /SUMMARY:Telefontermin Landgut Seebühne/);
  assert.match(invite, /Wir melden uns unter \+49 170 1234567\./);
  assert.doesNotMatch(invite, /LOCATION:/);
});
