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
  stepMinutes: number;
};

export type BookingFlowField = {
  helper?: string;
  id: string;
  label: string;
  options?: string[];
  required?: boolean;
  type: "month-slider" | "optional-date" | "select" | "textarea" | "text";
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
    id: "guestRange",
    label: "Wie viele Personen plant ihr?",
    options: ["15–35", "36–60", "61–90", "91–130", "Mehr als 130", "Noch offen"],
    required: true,
    type: "select"
  },
  {
    id: "desiredYear",
    label: "In welchem Jahr möchtet ihr heiraten?",
    options: ["2026", "2027", "2028", "Noch offen"],
    required: true,
    type: "select"
  },
  {
    helper: "Unsere Hauptsaison reicht von April bis Oktober.",
    id: "preferredMonth",
    label: "Welcher Zeitraum passt für euch?",
    options: ["April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "Noch offen"],
    required: true,
    type: "month-slider"
  },
  {
    helper: "Nur wenn ihr bereits ein konkretes Datum im Blick habt.",
    id: "desiredDate",
    label: "Habt ihr schon einen Wunschtermin?",
    type: "optional-date"
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
        "Wählt einen freien Besichtigungstermin in den nächsten zehn Tagen. Danach fragen wir Kontaktdaten und wenige Eckpunkte ab.",
      durationMinutes: 120,
      fields: tourFields,
      heading: "Besichtigungstermin buchen",
      rangeDays: 10,
      route: "/termin-buchen",
      sourceLabel: "Besichtigung",
      stepMinutes: 60
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
    sourceLabel: "Telefontermin",
    stepMinutes: 30
  };
}
