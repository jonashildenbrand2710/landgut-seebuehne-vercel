import type { BookingAppointmentType } from "@/lib/booking-api";

export type BookingFlowConfig = {
  appointmentType: BookingAppointmentType;
  description: string;
  durationMinutes: number;
  fields: BookingFlowField[];
  flowId: string;
  flowVersion: string;
  heading: string;
  rangeDays: number;
  route: string;
  sourceLabel: string;
};

export type BookingFlowField = {
  helper?: string;
  id: string;
  label: string;
  options?: string[];
  required?: boolean;
  type: "select" | "textarea" | "text";
};

const defaultFlowId = "website_booking";
const defaultFlowVersion = "2026-06-v1";
const phoneFields: BookingFlowField[] = [
  {
    id: "desiredYear",
    label: "Wunschjahr",
    options: ["2026", "2027", "2028", "Noch offen"],
    type: "select"
  },
  {
    id: "guestRange",
    label: "Gästezahl",
    options: ["15-35", "35-60", "60-90", "90-130", "130+", "Noch offen"],
    type: "select"
  },
  {
    id: "weddingType",
    label: "Art der Hochzeit",
    options: ["Trauung plus Feier", "Nur freie Trauung", "Nur Feier", "Noch offen"],
    type: "select"
  },
  {
    helper: "Optional, aber hilfreich für das Gespräch.",
    id: "note",
    label: "Was sollten wir wissen?",
    type: "textarea"
  }
];
const tourFields: BookingFlowField[] = [
  {
    id: "desiredYear",
    label: "Wunschjahr",
    options: ["2026", "2027", "2028", "Noch offen"],
    type: "select"
  },
  {
    id: "guestRange",
    label: "Gaestezahl",
    options: ["15-35", "35-60", "60-90", "90-130", "130+", "Noch offen"],
    type: "select"
  },
  {
    id: "weddingType",
    label: "Art der Hochzeit",
    options: ["Trauung plus Feier", "Nur freie Trauung", "Nur Feier", "Noch offen"],
    type: "select"
  },
  {
    helper: "Optional, aber hilfreich fuer das Gespraech.",
    id: "note",
    label: "Was sollten wir wissen?",
    type: "textarea"
  }
];

function flowIdentity() {
  return {
    flowId: process.env.CRM_BOOKING_FLOW_ID?.trim() || defaultFlowId,
    flowVersion: process.env.CRM_BOOKING_FLOW_VERSION?.trim() || defaultFlowVersion
  };
}

export function getBookingFlowConfig(appointmentType: BookingAppointmentType): BookingFlowConfig {
  const identity = flowIdentity();

  if (appointmentType === "tour") {
    return {
      ...identity,
      appointmentType: "tour",
      description:
        "Waehlt einen freien Slot in den naechsten zehn Tagen. Danach fragen wir Kontaktdaten und wenige Eckpunkte ab.",
      durationMinutes: 60,
      fields: tourFields,
      heading: "Besichtigungstermin buchen",
      rangeDays: 10,
      route: "/besichtigungstermin-buchen",
      sourceLabel: "Besichtigung"
    };
  }

  return {
    ...identity,
    appointmentType: "phone",
    description:
      "Wählt eine freie Terminzeit in den nächsten zehn Tagen. Danach fragen wir Kontaktdaten und wenige Eckpunkte ab.",
    durationMinutes: 30,
    fields: phoneFields,
    heading: "Termin wählen",
    rangeDays: 10,
    route: "/termin-buchen",
    sourceLabel: "Telefontermin"
  };
}
