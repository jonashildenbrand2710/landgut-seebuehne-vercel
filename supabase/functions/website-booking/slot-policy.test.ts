import assert from "node:assert/strict";
import test from "node:test";
import {
  appointmentPolicies,
  parseAppointmentType,
  slotEndMatchesPolicy,
  slotIsBlocked,
  slotMatchesPolicy,
  type BusyCalendarInterval,
} from "./slot-policy.ts";

const at = (hour: number, minute = 0, date = "2026-07-22") =>
  new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+02:00`);
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

test("phone policy allows Monday through Thursday in 30-minute steps", () => {
  const policy = appointmentPolicies.phone;
  assert.equal(policy.durationMinutes, 30);
  assert.equal(slotMatchesPolicy(at(10), policy, "Europe/Berlin"), true);
  assert.equal(slotMatchesPolicy(at(19, 30), policy, "Europe/Berlin"), true);
  assert.equal(slotMatchesPolicy(at(19, 45), policy, "Europe/Berlin"), false);
  assert.equal(slotMatchesPolicy(at(10, 0, "2026-07-24"), policy, "Europe/Berlin"), false);
  assert.equal(slotMatchesPolicy(at(10, 0, "2026-07-26"), policy, "Europe/Berlin"), false);
});

test("tour policy adds Sunday and reserves the full 90 minutes", () => {
  const policy = appointmentPolicies.tour;
  assert.equal(policy.durationMinutes, 90);
  assert.equal(policy.stepMinutes, 30);
  assert.equal(slotMatchesPolicy(at(10, 0, "2026-07-26"), policy, "Europe/Berlin"), true);
  assert.equal(slotMatchesPolicy(at(18, 30), policy, "Europe/Berlin"), true);
  assert.equal(slotMatchesPolicy(at(19), policy, "Europe/Berlin"), false);
  assert.equal(slotMatchesPolicy(at(10, 0, "2026-07-25"), policy, "Europe/Berlin"), false);
});

test("a busy event overlapping any part of a tour blocks that tour", () => {
  const busy = [{ id: "wedding", start: at(11), end: at(20) }];
  assert.equal(slotIsBlocked(busy, at(10), at(11, 30)), true);
  assert.equal(slotIsBlocked(busy, at(9, 30), at(11)), false);
});

test("only supported appointment types are accepted", () => {
  assert.equal(parseAppointmentType("phone"), "phone");
  assert.equal(parseAppointmentType("tour"), "tour");
  assert.equal(parseAppointmentType("custom"), null);
  assert.equal(parseAppointmentType(undefined), null);
});

test("client-provided end times cannot change the policy duration", () => {
  assert.equal(slotEndMatchesPolicy(at(10), at(10, 30), appointmentPolicies.phone), true);
  assert.equal(slotEndMatchesPolicy(at(10), at(11), appointmentPolicies.phone), false);
  assert.equal(slotEndMatchesPolicy(at(10), at(11, 30), appointmentPolicies.tour), true);
  assert.equal(slotEndMatchesPolicy(at(10), at(11), appointmentPolicies.tour), false);
});
