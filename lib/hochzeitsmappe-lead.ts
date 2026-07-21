import {
  addActiveCampaignContactToAutomation,
  addActiveCampaignTagToContact,
  getActiveCampaignConfig,
  subscribeActiveCampaignContactToList,
  syncActiveCampaignContact
} from "@/lib/active-campaign";

export type HochzeitsmappeLead = {
  email: string;
  firstName: string;
  lastName: string;
  page: string;
  phone: string;
  source: "hochzeitsmappe";
  submittedAt: string;
};

export type HochzeitsmappeDeliveryLead = HochzeitsmappeLead & {
  accessUrl: string;
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
    tagIds: splitIds(process.env.ACTIVECAMPAIGN_HOCHZEITSMAPPE_TAG_IDS)
  };

  if (!config.automationId && !config.listId && !config.tagIds.length) {
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

function getCustomFields(lead: HochzeitsmappeDeliveryLead, fieldIds: HochzeitsmappeFieldIds) {
  return [
    customField(fieldIds.accessUrl, lead.accessUrl),
    customField(fieldIds.leadMagnet, "Hochzeitsmappe"),
    customField(fieldIds.page, lead.page),
    customField(fieldIds.source, lead.source),
    customField(fieldIds.submittedAt, lead.submittedAt)
  ].filter((field): field is { field: string; value: string } => field !== null);
}

export async function submitHochzeitsmappeLeadToActiveCampaign(lead: HochzeitsmappeDeliveryLead) {
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

  for (const tagId of flowConfig.tagIds) {
    await addActiveCampaignTagToContact(activeCampaign, contactId, tagId);
  }

  if (flowConfig.listId) {
    await subscribeActiveCampaignContactToList(activeCampaign, contactId, flowConfig.listId);
  }

  // The configured Hochzeitsmappe automation starts when the contact subscribes
  // to its list. Adding the contact directly as well would create two automation
  // entries and can send the first email twice. Keep the direct start as a
  // fallback for setups that intentionally do not use a list trigger.
  if (flowConfig.automationId && !flowConfig.listId) {
    await addActiveCampaignContactToAutomation(activeCampaign, contactId, flowConfig.automationId);
  }

  return {
    automationId: flowConfig.automationId,
    contactId,
    listId: flowConfig.listId,
    tagIds: flowConfig.tagIds
  };
}
