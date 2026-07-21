import assert from "node:assert/strict";
import test from "node:test";
import { slotIsBlocked, type BusyCalendarInterval } from "./slot-policy.ts";

const at = (hour: number) => new Date(`2026-07-22T${String(hour).padStart(2, "0")}:00:00+02:00`);
const interval = (id: string, startHour: number, endHour: number): BusyCalendarInterval => ({
  end: at(endHour),
  id,
  start: at(startHour),
});

test("a one-hour calendar event blocks the matching start slot", () => {
  const busy = [interval("private", 10, 11)];
  assert.equal(slotIsBlocked(busy, at(10), at(11)), true);
});

test("the next hourly start remains available", () => {
  const busy = [interval("private", 10, 11)];
  assert.equal(slotIsBlocked(busy, at(11), at(12)), false);
});

test("two calendar entries block two consecutive start slots", () => {
  const busy = [interval("private-1", 10, 11), interval("private-2", 11, 12)];
  assert.equal(slotIsBlocked(busy, at(10), at(11)), true);
  assert.equal(slotIsBlocked(busy, at(11), at(12)), true);
  assert.equal(slotIsBlocked(busy, at(12), at(13)), false);
});

test("a partial overlap blocks the entire affected start slot", () => {
  const busy = [{ id: "private", start: at(10), end: new Date("2026-07-22T10:30:00+02:00") }];
  assert.equal(slotIsBlocked(busy, at(10), at(11)), true);
});
