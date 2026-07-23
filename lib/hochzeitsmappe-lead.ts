import {
  addActiveCampaignContactToAutomation,
  addActiveCampaignTagToContact,
  getActiveCampaignConfig,
  hasActiveCampaignContactTag,
  isActiveCampaignContactSubscribedToList,
  subscribeActiveCampaignContactToList,
  syncActiveCampaignContact
} from "@/lib/active-campaign";

export type HochzeitsmappeLead = {
  email: string;
  firstName: string;
  intent: "hochzeitsmappe" | "preise";
  lastName: string;
  page: string;
  phone: string;
  source: "hochzeitsmappe";
  submittedAt: string;
};

type HochzeitsmappeFieldIds = {
  accessUrl?: string;
  leadMagnet?: string;
  page?: string;
  source?: string;
  submittedAt?: string;
};

type HochzeitsmappeActiveCampaignConfig = {
  automationId?: string;
  fieldIds: HochzeitsmappeFieldIds;
  listId?: string;
  priceTagId?: string;
  tagIds: string[];
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

export function getHochzeitsmappeActiveCampaignConfig(): HochzeitsmappeActiveCampaignConfig | null {
  if (!getActiveCampaignConfig()) {
    return null;
  }

  const config: HochzeitsmappeActiveCampaignConfig = {
    automationId: clean(process.env.ACTIVECAMPAIGN_HOCHZEITSMAPPE_AUTOMATION_ID),
    fieldIds: {
      accessUrl: clean(process.env.ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_ACCESS_URL_ID),
      leadMagnet: clean(process.env.ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_LEAD_MAGNET_ID),
      page: clean(process.env.ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_PAGE_ID),
      source: clean(process.env.ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_SOURCE_ID),
      submittedAt: clean(process.env.ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_SUBMITTED_AT_ID)
    },
    listId: clean(process.env.ACTIVECAMPAIGN_HOCHZEITSMAPPE_LIST_ID),
    priceTagId: clean(process.env.ACTIVECAMPAIGN_PREISE_TAG_ID),
    tagIds: splitIds(process.env.ACTIVECAMPAIGN_HOCHZEITSMAPPE_TAG_IDS)
  };

  if (!config.automationId && !config.listId && !config.priceTagId && !config.tagIds.length) {
    return null;
  }

  return config;
}

function customField(field: string | undefined, value: string) {
  if (!field) {
    return null;
  }

  return { field, value };
}

function getCustomFields(lead: HochzeitsmappeLead, fieldIds: HochzeitsmappeFieldIds) {
  return [
    customField(
      fieldIds.leadMagnet,
      lead.intent === "preise" ? "Preise und Leistungsbausteine" : "Hochzeitsmappe"
    ),
    customField(fieldIds.page, lead.page),
    customField(fieldIds.source, lead.source),
    customField(fieldIds.submittedAt, lead.submittedAt)
  ].filter((field): field is { field: string; value: string } => field !== null);
}

export async function submitHochzeitsmappeLeadToActiveCampaign(lead: HochzeitsmappeLead) {
  const activeCampaign = getActiveCampaignConfig();
  const flowConfig = getHochzeitsmappeActiveCampaignConfig();

  if (!activeCampaign || !flowConfig) {
    return null;
  }

  const contactId = await syncActiveCampaignContact(activeCampaign, {
    email: lead.email,
    fieldValues: getCustomFields(lead, flowConfig.fieldIds),
    firstName: lead.firstName,
    lastName: lead.lastName,
    phone: lead.phone
  });

  const [alreadyRequestedPrices, alreadySubscribed] = await Promise.all([
    flowConfig.priceTagId
      ? hasActiveCampaignContactTag(activeCampaign, contactId, flowConfig.priceTagId)
      : false,
    flowConfig.listId
      ? isActiveCampaignContactSubscribedToList(activeCampaign, contactId, flowConfig.listId)
      : false
  ]);

  // The dedicated price tag is the idempotency lock for this delivery. A
  // repeated form submission updates the contact but does not restart the
  // automation or resubscribe someone who has since unsubscribed.
  if (alreadyRequestedPrices) {
    return {
      automationId: flowConfig.automationId,
      contactId,
      duplicatePriceRequest: true,
      listId: flowConfig.listId,
      priceTagId: flowConfig.priceTagId,
      tagIds: flowConfig.tagIds
    };
  }

  if (flowConfig.listId && !alreadySubscribed) {
    await subscribeActiveCampaignContactToList(activeCampaign, contactId, flowConfig.listId);
  }

  for (const tagId of flowConfig.tagIds) {
    await addActiveCampaignTagToContact(activeCampaign, contactId, tagId);
  }

  // New contacts enter through the existing list-subscription trigger. Contacts
  // already subscribed to that list need a one-time direct entry so existing
  // Hochzeitsmappe leads receive the new price email as well.
  if (flowConfig.automationId && (!flowConfig.listId || alreadySubscribed)) {
    await addActiveCampaignContactToAutomation(activeCampaign, contactId, flowConfig.automationId);
  }

  // Set the idempotency tag last so an upstream failure can be retried safely.
  if (flowConfig.priceTagId) {
    await addActiveCampaignTagToContact(activeCampaign, contactId, flowConfig.priceTagId);
  }

  return {
    automationId: flowConfig.automationId,
    contactId,
    duplicatePriceRequest: false,
    listId: flowConfig.listId,
    priceTagId: flowConfig.priceTagId,
    tagIds: flowConfig.tagIds
  };
}
