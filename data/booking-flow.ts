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
  type: "guest-slider" | "select";
};

const defaultFlowId = "website_booking";
const defaultFlowVersion = "2026-09-neutral-v1";
const sharedFields: BookingFlowField[] = [
  {
    id: "desiredYear",
    label: "In welchem Jahr möchtet ihr heiraten?",
    options: ["2027", "2028", "2029", "Noch offen"],
    required: true,
    type: "select"
  },
  {
    id: "guestRange",
    label: "Mit wie vielen Gästen möchtet ihr ungefähr feiern?",
    required: true,
    type: "guest-slider"
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
        "Erlebt das Landgut persönlich und klärt gemeinsam mit uns euren individuellen Kostenrahmen.",
      durationMinutes: 90,
      fields: sharedFields,
      heading: "Landgut live erleben",
      rangeDays: 10,
      route: "/termin-buchen",
      sourceLabel: "Besichtigung",
      stepMinutes: 30
    };
  }

  return {
    ...identity,
    appointmentType: "phone",
    description:
      "Am Telefon sprechen wir über Preise und freie Hochzeitstermine und geben euch eine persönliche Einschätzung.",
    durationMinutes: 30,
    fields: sharedFields,
    heading: "Kurz kennenlernen",
    rangeDays: 10,
    route: "/termin-buchen",
    sourceLabel: "Telefontermin",
    stepMinutes: 30
  };
}
