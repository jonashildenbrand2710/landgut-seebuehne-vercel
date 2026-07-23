type ActiveCampaignConfig = {
  apiBaseUrl: string;
  apiToken: string;
};

type RequestOptions = {
  body?: unknown;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  searchParams?: Record<string, string | number | undefined>;
};

type ActiveCampaignContact = {
  id?: string | number;
};

type SyncContactResponse = {
  contact?: ActiveCampaignContact;
};

type ContactListsResponse = {
  contactLists?: Array<{
    list?: string | number;
    status?: string | number;
  }>;
};

type ContactTagsResponse = {
  contactTags?: Array<{
    tag?: string | number;
  }>;
};

type FieldValueInput = {
  field: string;
  value: string;
};

type SyncContactInput = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  fieldValues?: FieldValueInput[];
};

const DEFAULT_TIMEOUT_MS = 12_000;

export class ActiveCampaignApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseBody: unknown
  ) {
    super(message);
    this.name = "ActiveCampaignApiError";
  }
}

function clean(value: string | undefined) {
  return value?.trim() ?? "";
}

function normalizeApiBaseUrl(rawApiUrl: string) {
  const withoutTrailingSlash = rawApiUrl.trim().replace(/\/+$/, "");

  if (withoutTrailingSlash.endsWith("/api/3")) {
    return withoutTrailingSlash;
  }

  return `${withoutTrailingSlash}/api/3`;
}

export function getActiveCampaignConfig(): ActiveCampaignConfig | null {
  const apiUrl = clean(process.env.ACTIVECAMPAIGN_API_URL);
  const apiToken = clean(process.env.ACTIVECAMPAIGN_API_KEY) || clean(process.env.CRM_API_KEY);

  if (!apiUrl || !apiToken) {
    return null;
  }

  return {
    apiBaseUrl: normalizeApiBaseUrl(apiUrl),
    apiToken
  };
}

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function buildUrl(config: ActiveCampaignConfig, path: string, searchParams?: RequestOptions["searchParams"]) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${config.apiBaseUrl}${normalizedPath}`);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

export async function activeCampaignRequest<T>(
  config: ActiveCampaignConfig,
  path: string,
  options: RequestOptions = {}
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(buildUrl(config, path, options.searchParams), {
      method: options.method ?? "GET",
      headers: {
        accept: "application/json",
        "Api-Token": config.apiToken,
        ...(options.body ? { "content-type": "application/json" } : {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });

    const responseBody = await parseResponse(response);

    if (!response.ok) {
      throw new ActiveCampaignApiError(
        `ActiveCampaign request failed with status ${response.status}`,
        response.status,
        responseBody
      );
    }

    return responseBody as T;
  } finally {
    clearTimeout(timeout);
  }
}

function getContactId(response: SyncContactResponse) {
  const contactId = response.contact?.id;

  if (!contactId) {
    throw new ActiveCampaignApiError("ActiveCampaign sync response did not include a contact id", 502, response);
  }

  return String(contactId);
}

function isDuplicateRelationError(error: unknown) {
  if (!(error instanceof ActiveCampaignApiError)) {
    return false;
  }

  if (![400, 409, 422].includes(error.status)) {
    return false;
  }

  const body = JSON.stringify(error.responseBody).toLowerCase();
  return body.includes("already") || body.includes("duplicate") || body.includes("exists");
}

export async function syncActiveCampaignContact(config: ActiveCampaignConfig, contact: SyncContactInput) {
  const response = await activeCampaignRequest<SyncContactResponse>(config, "/contact/sync", {
    method: "POST",
    body: { contact }
  });

  return getContactId(response);
}

export async function hasActiveCampaignContactTag(
  config: ActiveCampaignConfig,
  contactId: string,
  tagId: string
) {
  const response = await activeCampaignRequest<ContactTagsResponse>(
    config,
    `/contacts/${contactId}/contactTags`
  );

  return (response.contactTags ?? []).some((contactTag) => String(contactTag.tag) === tagId);
}

export async function isActiveCampaignContactSubscribedToList(
  config: ActiveCampaignConfig,
  contactId: string,
  listId: string
) {
  const response = await activeCampaignRequest<ContactListsResponse>(
    config,
    `/contacts/${contactId}/contactLists`
  );

  return (response.contactLists ?? []).some(
    (contactList) => String(contactList.list) === listId && String(contactList.status) === "1"
  );
}

export async function addActiveCampaignTagToContact(
  config: ActiveCampaignConfig,
  contactId: string,
  tagId: string
) {
  try {
    await activeCampaignRequest(config, "/contactTags", {
      method: "POST",
      body: {
        contactTag: {
          contact: contactId,
          tag: tagId
        }
      }
    });
  } catch (error) {
    if (!isDuplicateRelationError(error)) {
      throw error;
    }
  }
}

export async function subscribeActiveCampaignContactToList(
  config: ActiveCampaignConfig,
  contactId: string,
  listId: string
) {
  await activeCampaignRequest(config, "/contactLists", {
    method: "POST",
    body: {
      contactList: {
        contact: contactId,
        list: listId,
        status: 1
      }
    }
  });
}

export async function addActiveCampaignContactToAutomation(
  config: ActiveCampaignConfig,
  contactId: string,
  automationId: string
) {
  try {
    await activeCampaignRequest(config, "/contactAutomations", {
      method: "POST",
      body: {
        contactAutomation: {
          contact: contactId,
          automation: automationId
        }
      }
    });
  } catch (error) {
    if (!isDuplicateRelationError(error)) {
      throw error;
    }
  }
}
