import assert from "node:assert/strict";
import test from "node:test";
import { loadBusyCalendarIntervals, type GoogleCalendarPage } from "./calendar-busy.ts";
import { slotIsBlocked } from "./slot-policy.ts";

const at = (time: string) => new Date(`2026-10-16T${time}:00+02:00`);
const timed = (id: string, start = "11:00", end = "12:00") => ({
  end: { dateTime: at(end).toISOString() }, id, start: { dateTime: at(start).toISOString() },
});
const allDay = (start: string, end: string) => ({
  end: { date: end }, id: "all-day", start: { date: start },
});
const intervals = (items: unknown[], timeZone = "Europe/Berlin") =>
  loadBusyCalendarIntervals(async () => ({ items, timeZone }), "Europe/Berlin");

test("a manual timed block affects both appointment types only when they overlap", async () => {
  const busy = await intervals([timed("manual")]);
  assert.equal(slotIsBlocked(busy, at("10:30"), at("11:00")), false);
  assert.equal(slotIsBlocked(busy, at("11:00"), at("11:30")), true);
  assert.equal(slotIsBlocked(busy, at("10:00"), at("11:30")), true);
  assert.equal(slotIsBlocked(busy, at("12:00"), at("13:30")), false);
});

test("an all-day block covers the whole local day and leaves adjacent days available", async () => {
  const busy = await intervals([allDay("2026-10-16", "2026-10-17")]);
  assert.equal(busy[0].start.toISOString(), "2026-10-15T22:00:00.000Z");
  assert.equal(busy[0].end.toISOString(), "2026-10-16T22:00:00.000Z");
  assert.equal(slotIsBlocked(busy, at("10:00"), at("10:30")), true);
  assert.equal(slotIsBlocked(busy, at("18:30"), at("20:00")), true);
  assert.equal(slotIsBlocked(busy, new Date("2026-10-15T18:30:00+02:00"), new Date("2026-10-15T20:00:00+02:00")), false);
  assert.equal(slotIsBlocked(busy, new Date("2026-10-17T10:00:00+02:00"), new Date("2026-10-17T11:30:00+02:00")), false);
});

test("multi-day blocks respect Google's exclusive end date", async () => {
  const busy = await intervals([allDay("2026-10-16", "2026-10-19")]);
  assert.equal(slotIsBlocked(busy, new Date("2026-10-18T18:30:00+02:00"), new Date("2026-10-18T20:00:00+02:00")), true);
  assert.equal(slotIsBlocked(busy, new Date("2026-10-19T10:00:00+02:00"), new Date("2026-10-19T11:30:00+02:00")), false);
});

test("all-day blocks keep local midnight across both daylight-saving transitions", async () => {
  const spring = await intervals([allDay("2026-03-29", "2026-03-30")]);
  assert.equal(spring[0].start.toISOString(), "2026-03-28T23:00:00.000Z");
  assert.equal(spring[0].end.toISOString(), "2026-03-29T22:00:00.000Z");
  const autumn = await intervals([allDay("2026-10-25", "2026-10-26")]);
  assert.equal(autumn[0].start.toISOString(), "2026-10-24T22:00:00.000Z");
  assert.equal(autumn[0].end.toISOString(), "2026-10-25T23:00:00.000Z");
});

test("free, cancelled and the current rescheduled event do not block availability", async () => {
  const busy = await loadBusyCalendarIntervals(async () => ({ items: [
    { ...allDay("2026-10-16", "2026-10-17"), transparency: "transparent" },
    { ...timed("cancelled"), status: "cancelled" },
    timed("current"),
    timed("busy"),
  ] }), "Europe/Berlin", "current");
  assert.deepEqual(busy.map((event) => event.id), ["busy"]);
});

test("blocks on later Google result pages are included, even after an empty page", async () => {
  const requested: string[] = [];
  const pages: Record<string, GoogleCalendarPage> = {
    "": { items: [timed("first")], nextPageToken: "second" },
    second: { items: [], nextPageToken: "third" },
    third: { items: [allDay("2026-10-16", "2026-10-17")] },
  };
  const busy = await loadBusyCalendarIntervals(async (token) => {
    requested.push(token);
    return pages[token];
  }, "Europe/Berlin");
  assert.deepEqual(requested, ["", "second", "third"]);
  assert.deepEqual(busy.map((event) => event.id), ["first", "all-day"]);
});
