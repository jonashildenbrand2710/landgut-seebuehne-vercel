import assert from "node:assert/strict";
import test from "node:test";
import { createGoogleAdsTracker, googleAdsConfigFromValues, googleAdsPageLocation, registerGoogleAdsTracker, trackGoogleAdsBooking } from "../lib/google-ads.ts";

const config = { tagId: "AW-123456789", bookingLabel: "booking-label" };
const confirmed = { booking: { status: "scheduled" }, google_calendar: { synced: true, eventId: "calendar-event" } };

function harness(storage = undefined) {
  const calls = [];
  const loads = [];
  const tracker = createGoogleAdsTracker(config, {
    command: (...args) => calls.push(args),
    loadTag: (tagId) => loads.push(tagId),
    pageLocation: () => "https://venue.example/termin-buchen?gclid=click-id&access_token=private",
    storage
  });
  return { calls, loads, tracker };
}

test("activation requires an explicit flag, valid Ads ID and booking label", () => {
  assert.equal(googleAdsConfigFromValues({ tagId: config.tagId, bookingLabel: config.bookingLabel }), null);
  assert.equal(googleAdsConfigFromValues({ enabled: "true", tagId: "G-123", bookingLabel: "booking" }), null);
  assert.equal(googleAdsConfigFromValues({ enabled: "true", tagId: config.tagId, bookingLabel: "<script>" }), null);
  assert.deepEqual(googleAdsConfigFromValues({ enabled: "true", ...config }), config);
});

test("no Google calls, script loads or conversion storage before consent", () => {
  const { calls, loads, tracker } = harness({ getItem: () => { throw new Error("must not read"); }, setItem: () => { throw new Error("must not write"); } });
  tracker.setConsent(false);
  assert.equal(tracker.trackBooking(confirmed, "booking-1", "tour"), false);
  assert.deepEqual(calls, []);
  assert.deepEqual(loads, []);
});

test("Google consent is configured before the first script load", () => {
  const { calls, loads, tracker } = harness();
  tracker.setConsent(true);
  assert.deepEqual(calls[0].slice(0, 2), ["consent", "default"]);
  assert.equal(calls[2][2].ad_storage, "granted");
  assert.equal(calls[2][2].ad_personalization, "denied");
  assert.equal(calls[4][2].allow_enhanced_conversions, false);
  tracker.setConsent(true);
  assert.deepEqual(loads, [config.tagId]);
});

test("preview and unconfirmed calendar bookings do not become conversions", () => {
  const { calls, tracker } = harness();
  tracker.setConsent(true);
  for (const booking of [{}, { booking: { status: "preview" }, google_calendar: confirmed.google_calendar }, { google_calendar: { synced: false, eventId: "event" } }, { google_calendar: { synced: true } }]) {
    assert.equal(tracker.trackBooking(booking, "booking-1", "phone"), false);
  }
  assert.equal(calls.filter(([command]) => command === "event").length, 0);
});

test("a confirmed phone or tour booking queues one conversion without contact data", () => {
  const { calls, tracker } = harness();
  tracker.setConsent(true);
  assert.equal(tracker.trackBooking(confirmed, "booking-1", "phone"), true);
  assert.equal(tracker.trackBooking(confirmed, "booking-1", "phone"), false);
  assert.equal(tracker.trackBooking(confirmed, "booking-2", "tour"), true);
  const events = calls.filter(([command]) => command === "event");
  assert.equal(events.length, 2);
  assert.deepEqual(events[0], ["event", "conversion", {
    send_to: "AW-123456789/booking-label",
    transaction_id: "booking-1",
    appointment_type: "phone",
    page_location: "https://venue.example/termin-buchen?gclid=click-id",
    page_referrer: ""
  }]);
});

test("persistent transaction guard prevents replay by a new tracker", () => {
  const records = new Map();
  const storage = { getItem: (key) => records.get(key), setItem: (key, value) => records.set(key, value) };
  const first = harness(storage);
  first.tracker.setConsent(true);
  assert.equal(first.tracker.trackBooking(confirmed, "booking-1", "tour"), true);
  const second = harness(storage);
  second.tracker.setConsent(true);
  assert.equal(second.tracker.trackBooking(confirmed, "booking-1", "tour"), false);
});

test("withdrawal blocks future conversions even if the tag is loaded", () => {
  const { calls, tracker } = harness();
  tracker.setConsent(true);
  tracker.setConsent(false);
  assert.equal(tracker.trackBooking(confirmed, "booking-1", "tour"), false);
  assert.equal(calls.at(-1)[2].ad_storage, "denied");
  assert.equal(calls.filter(([command]) => command === "event").length, 0);
});

test("private query strings and hashes are removed while attribution IDs survive", () => {
  assert.equal(googleAdsPageLocation("https://venue.example/map?token=secret&email=private&gclid=click&gbraid=braid#private"), "https://venue.example/map?gclid=click&gbraid=braid");
});

test("a broken advertising integration cannot throw into the booking flow", () => {
  const tracker = createGoogleAdsTracker(config, {
    command: (command) => { if (command === "event") throw new Error("blocked tracker"); },
    loadTag: () => {},
    pageLocation: () => "https://venue.example/termin-buchen"
  });
  tracker.setConsent(true);
  const unregister = registerGoogleAdsTracker(tracker);
  assert.equal(trackGoogleAdsBooking(confirmed, "booking-1", "phone"), false);
  unregister();
});
