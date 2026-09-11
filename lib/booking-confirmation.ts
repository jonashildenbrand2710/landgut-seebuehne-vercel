import nodemailer from "nodemailer";
import {
  addActiveCampaignTagToContact,
  getActiveCampaignConfig,
  getActiveCampaignContactListStatus,
  startActiveCampaignContactAutomation,
  subscribeActiveCampaignContactToList,
  syncActiveCampaignContact
} from "@/lib/active-campaign";
import type {
  BookingAppointmentType,
  BookingRequest,
  BookingResponse
} from "@/lib/booking-api";
import {
  buildBookingCalendarInvite,
  buildBookingConfirmationEmail
} from "@/lib/booking-confirmation-content";

type DeliveryProvider = "activecampaign" | "smtp";

type FlowConfig = {
  automationId?: string;
  listId?: string;
  tagIds: string[];
};

type ActiveCampaignBookingConfig = {
  fieldIds: {
    appointmentType?: string;
    leadNumber?: string;
    slotEnd?: string;
    slotStart?: string;
    status?: string;
    website?: string;
  };
  flows: Record<BookingAppointmentType, FlowConfig>;
};

export type BookingConfirmationResult = {
  activeCampaignContactId?: string;
  deliveryProvider: DeliveryProvider;
  providerReference?: string;
};

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function splitValues(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (!value) return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function splitName(name: string) {
  const [firstName = "", ...lastNameParts] = name.trim().split(/\s+/);
  return { firstName, lastName: lastNameParts.join(" ") };
}

function customField(field: string | undefined, value: string | undefined) {
  return field && value ? { field, value } : null;
}

function flowPrefix(type: BookingAppointmentType) {
  return type === "tour" ? "TOUR" : "PHONE";
}

function flowConfig(type: BookingAppointmentType): FlowConfig {
  const prefix = flowPrefix(type);
  const legacy = type === "tour";

  return {
    automationId:
      clean(process.env[`ACTIVECAMPAIGN_BOOKING_${prefix}_AUTOMATION_ID`]) ||
      (legacy ? clean(process.env.ACTIVECAMPAIGN_BOOKING_AUTOMATION_ID) : undefined),
    listId:
      clean(process.env[`ACTIVECAMPAIGN_BOOKING_${prefix}_LIST_ID`]) ||
      (legacy ? clean(process.env.ACTIVECAMPAIGN_BOOKING_LIST_ID) : undefined),
    tagIds: splitValues(process.env[`ACTIVECAMPAIGN_BOOKING_${prefix}_TAG_IDS`]).length
      ? splitValues(process.env[`ACTIVECAMPAIGN_BOOKING_${prefix}_TAG_IDS`])
      : legacy
        ? splitValues(process.env.ACTIVECAMPAIGN_BOOKING_TAG_IDS)
        : []
  };
}

function activeCampaignBookingConfig(): ActiveCampaignBookingConfig | null {
  if (!getActiveCampaignConfig()) return null;

  return {
    fieldIds: {
      appointmentType: clean(process.env.ACTIVECAMPAIGN_BOOKING_FIELD_APPOINTMENT_TYPE_ID),
      leadNumber: clean(process.env.ACTIVECAMPAIGN_BOOKING_FIELD_LEAD_NUMBER_ID),
      slotEnd: clean(process.env.ACTIVECAMPAIGN_BOOKING_FIELD_SLOT_END_ID),
      slotStart: clean(process.env.ACTIVECAMPAIGN_BOOKING_FIELD_SLOT_START_ID),
      status: clean(process.env.ACTIVECAMPAIGN_BOOKING_FIELD_STATUS_ID),
      website: clean(process.env.ACTIVECAMPAIGN_BOOKING_FIELD_WEBSITE_ID)
    },
    flows: {
      phone: flowConfig("phone"),
      tour: flowConfig("tour")
    }
  };
}

function appointmentLabel(type: BookingAppointmentType) {
  return type === "tour" ? "Besichtigung" : "Telefontermin";
}

function bookingFieldValues(
  payload: BookingRequest,
  booking: BookingResponse,
  config: ActiveCampaignBookingConfig
) {
  const type = payload.booking.type;
  const leadNumber =
    typeof booking.lead?.leadNumber === "number"
      ? String(booking.lead.leadNumber)
      : undefined;

  return [
    customField(config.fieldIds.leadNumber, leadNumber),
    customField(config.fieldIds.status, `${appointmentLabel(type)} gebucht`),
    customField(config.fieldIds.website, payload.source?.page || "/termin-buchen"),
    customField(config.fieldIds.appointmentType, type),
    customField(config.fieldIds.slotStart, payload.booking.slot.start),
    customField(config.fieldIds.slotEnd, payload.booking.slot.end)
  ].filter((field): field is { field: string; value: string } => field !== null);
}

async function syncBookingToActiveCampaign(
  payload: BookingRequest,
  booking: BookingResponse,
  startAutomation: boolean
) {
  const activeCampaign = getActiveCampaignConfig();
  const config = activeCampaignBookingConfig();
  if (!activeCampaign || !config) return null;

  const { firstName, lastName } = splitName(payload.contact.name);
  const contactId = await syncActiveCampaignContact(activeCampaign, {
    email: payload.contact.email.trim().toLowerCase(),
    fieldValues: bookingFieldValues(payload, booking, config),
    firstName,
    lastName,
    phone: payload.contact.phone.trim()
  });
  const selectedFlow = config.flows[payload.booking.type];

  for (const tagId of selectedFlow.tagIds) {
    await addActiveCampaignTagToContact(activeCampaign, contactId, tagId);
  }

  if (!startAutomation) return { contactId };
  if (!selectedFlow.automationId || !selectedFlow.listId) {
    throw new Error(`ActiveCampaign ${payload.booking.type} confirmation is not configured.`);
  }

  const listStatus = await getActiveCampaignContactListStatus(
    activeCampaign,
    contactId,
    selectedFlow.listId
  );

  // A new list subscription is the automation trigger. Existing subscribers
  // enter directly so a moved/rebooked appointment receives a fresh confirmation.
  if (listStatus !== "1") {
    await subscribeActiveCampaignContactToList(activeCampaign, contactId, selectedFlow.listId);
    return { contactId, providerReference: `list:${selectedFlow.listId}` };
  }

  const automationEntryId = await startActiveCampaignContactAutomation(
    activeCampaign,
    contactId,
    selectedFlow.automationId
  );

  return {
    contactId,
    providerReference: automationEntryId ? `automation-entry:${automationEntryId}` : undefined
  };
}

async function sendViaSmtp(payload: BookingRequest) {
  const host = clean(process.env.SMTP_HOST);
  const port = Number.parseInt(process.env.SMTP_PORT ?? "465", 10);
  const user = clean(process.env.SMTP_USER);
  const pass = clean(process.env.SMTP_PASSWORD);
  const from = clean(process.env.BOOKING_MAIL_FROM) || clean(process.env.APPLICATION_MAIL_FROM) || user;
  const replyTo = clean(process.env.BOOKING_MAIL_REPLY_TO) || from;

  if (!host || !Number.isFinite(port) || !user || !pass || !from) {
    throw new Error("SMTP booking confirmation is not configured.");
  }

  const secure = parseBoolean(process.env.SMTP_SECURE, port === 465);
  const content = buildBookingConfirmationEmail(payload);
  const transporter = nodemailer.createTransport({
    auth: { pass, user },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    host,
    port,
    requireTLS: !secure,
    secure,
    socketTimeout: 15_000
  });
  const bcc = splitValues(process.env.BOOKING_MAIL_BCC);
  const info = await transporter.sendMail({
    attachments: [
      {
        content: buildBookingCalendarInvite(payload),
        contentType: "text/calendar; charset=utf-8; method=PUBLISH",
        filename: "termin-landgut-seebuehne.ics"
      }
    ],
    bcc: bcc.length ? bcc : undefined,
    from,
    html: content.html,
    messageId: `<booking-${payload.eventId}@landgut-seebuehne.de>`,
    replyTo,
    subject: content.subject,
    text: content.text,
    to: payload.contact.email
  });

  return info.messageId;
}

function configuredProvider(): DeliveryProvider {
  return process.env.BOOKING_CONFIRMATION_PROVIDER?.trim().toLowerCase() === "activecampaign"
    ? "activecampaign"
    : "smtp";
}

export async function submitBookingConfirmation(
  payload: BookingRequest,
  booking: BookingResponse
): Promise<BookingConfirmationResult> {
  const deliveryProvider = configuredProvider();

  if (deliveryProvider === "activecampaign") {
    const activeCampaignResult = await syncBookingToActiveCampaign(payload, booking, true);
    if (!activeCampaignResult) {
      throw new Error("ActiveCampaign booking confirmation is not configured.");
    }
    return {
      activeCampaignContactId: activeCampaignResult.contactId,
      deliveryProvider,
      providerReference: activeCampaignResult.providerReference
    };
  }

  // With SMTP delivery, ActiveCampaign remains the CRM/segmentation system.
  // It deliberately does not start an automation, preventing duplicate mails.
  const activeCampaignSync = syncBookingToActiveCampaign(payload, booking, false);
  const [activeCampaignResult, providerReference] = await Promise.all([
    activeCampaignSync.catch((error) => {
      console.error(
        "ActiveCampaign booking contact sync failed",
        error instanceof Error ? error.message : "Unknown error"
      );
      return null;
    }),
    sendViaSmtp(payload)
  ]);

  if (!activeCampaignResult) {
    console.error(
      "Booking confirmation was sent, but ActiveCampaign contact sync is unavailable"
    );
  }

  return {
    activeCampaignContactId: activeCampaignResult?.contactId,
    deliveryProvider,
    providerReference
  };
}
