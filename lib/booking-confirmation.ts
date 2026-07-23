import {
  addActiveCampaignTagToContact,
  getActiveCampaignConfig,
  getActiveCampaignContactListStatus,
  startActiveCampaignContactAutomation,
  subscribeActiveCampaignContactToList,
  syncActiveCampaignContact
} from "@/lib/active-campaign";
import type { BookingRequest, BookingResponse } from "@/lib/booking-api";

type BookingActiveCampaignConfig = {
  automationId: string;
  fieldIds: {
    leadNumber?: string;
    status?: string;
    website?: string;
  };
  listId: string;
  tagIds: string[];
};

export type BookingConfirmationResult = {
  automationEntryId?: string;
  contactId: string;
  entryMode: "automation" | "list";
};

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function splitIds(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitName(name: string) {
  const [firstName = "", ...lastNameParts] = name.trim().split(/\s+/);

  return {
    firstName,
    lastName: lastNameParts.join(" ")
  };
}

function customField(field: string | undefined, value: string | undefined) {
  if (!field || !value) {
    return null;
  }

  return { field, value };
}

export function getBookingActiveCampaignConfig(): BookingActiveCampaignConfig | null {
  if (!getActiveCampaignConfig()) {
    return null;
  }

  const automationId = clean(process.env.ACTIVECAMPAIGN_BOOKING_AUTOMATION_ID);
  const listId = clean(process.env.ACTIVECAMPAIGN_BOOKING_LIST_ID);

  if (!automationId || !listId) {
    return null;
  }

  return {
    automationId,
    fieldIds: {
      leadNumber: clean(process.env.ACTIVECAMPAIGN_BOOKING_FIELD_LEAD_NUMBER_ID),
      status: clean(process.env.ACTIVECAMPAIGN_BOOKING_FIELD_STATUS_ID),
      website: clean(process.env.ACTIVECAMPAIGN_BOOKING_FIELD_WEBSITE_ID)
    },
    listId,
    tagIds: splitIds(process.env.ACTIVECAMPAIGN_BOOKING_TAG_IDS)
  };
}

function bookingFieldValues(
  payload: BookingRequest,
  booking: BookingResponse,
  config: BookingActiveCampaignConfig
) {
  const leadNumber =
    typeof booking.lead?.leadNumber === "number"
      ? String(booking.lead.leadNumber)
      : undefined;

  return [
    customField(config.fieldIds.leadNumber, leadNumber),
    customField(config.fieldIds.status, "Besichtigung gebucht"),
    customField(config.fieldIds.website, payload.source?.page || "/termin-buchen")
  ].filter((field): field is { field: string; value: string } => field !== null);
}

export async function submitBookingConfirmationToActiveCampaign(
  payload: BookingRequest,
  booking: BookingResponse
): Promise<BookingConfirmationResult | null> {
  if (payload.booking?.type !== "tour") {
    return null;
  }

  const activeCampaign = getActiveCampaignConfig();
  const flowConfig = getBookingActiveCampaignConfig();

  if (!activeCampaign || !flowConfig) {
    return null;
  }

  const { firstName, lastName } = splitName(payload.contact.name);
  const contactId = await syncActiveCampaignContact(activeCampaign, {
    email: payload.contact.email.trim().toLowerCase(),
    fieldValues: bookingFieldValues(payload, booking, flowConfig),
    firstName,
    lastName,
    phone: payload.contact.phone.trim()
  });

  for (const tagId of flowConfig.tagIds) {
    await addActiveCampaignTagToContact(activeCampaign, contactId, tagId);
  }

  const listStatus = await getActiveCampaignContactListStatus(
    activeCampaign,
    contactId,
    flowConfig.listId
  );

  if (listStatus !== "1") {
    await subscribeActiveCampaignContactToList(
      activeCampaign,
      contactId,
      flowConfig.listId
    );

    return {
      contactId,
      entryMode: "list"
    };
  }

  const automationEntryId = await startActiveCampaignContactAutomation(
    activeCampaign,
    contactId,
    flowConfig.automationId
  );

  return {
    automationEntryId,
    contactId,
    entryMode: "automation"
  };
}
