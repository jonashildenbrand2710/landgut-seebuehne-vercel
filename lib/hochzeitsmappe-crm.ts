import type { HochzeitsmappeLead } from "@/lib/hochzeitsmappe-lead";

type SupabaseLeadCreateResponse = {
  activecampaign_status?: unknown;
  deduped?: unknown;
  lead_id?: unknown;
  lead_number?: unknown;
  source?: unknown;
};

export type HochzeitsmappeCrmLead = {
  activecampaign_status?: string;
  deduped?: boolean;
  lead_id: string;
  lead_number?: number;
  source?: string;
};

export type UpdateHochzeitsmappeLeadActiveCampaignStatusPayload = {
  activeCampaign?: {
    automation: string;
    automationId?: string;
    listId?: string;
    tags: string[];
  };
  contactId?: string;
  error?: string;
  leadId: string;
  status: "failed" | "success";
};

const DEFAULT_TIMEOUT_MS = 12_000;

export function requireEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function sanitizeError(error: unknown) {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown integration error";

  const redacted = message
    .replace(/[\r\n\t]+/g, " ")
    .replace(/Bearer\s+[\w.+/=-]+/gi, "Bearer [redacted]")
    .replace(/Api-Token\s*[:=]\s*[\w.+/=-]+/gi, "Api-Token [redacted]")
    .replace(
      /(api[_-]?key|authorization|secret|token)(["']?\s*[:=]\s*["']?)[^"',\s}]+/gi,
      "$1$2[redacted]"
    )
    .trim();

  return redacted.slice(0, 300) || "Unknown integration error";
}

function getEndpoint() {
  return `${requireEnv("SUPABASE_FUNCTIONS_URL").replace(/\/+$/, "")}/hochzeitsmappe-leads`;
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

async function requestSupabaseFunction<T>(method: "PATCH" | "POST", body: unknown) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(getEndpoint(), {
      method,
      headers: {
        accept: "application/json",
        authorization: `Bearer ${requireEnv("HOCHZEITSMAPPE_ACCESS_TOKEN")}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const responseBody = await parseResponse(response);

    if (!response.ok) {
      throw new Error(`Hochzeitsmappe CRM request failed with status ${response.status}`);
    }

    return responseBody as T;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeLeadResponse(response: SupabaseLeadCreateResponse | null) {
  if (!response || typeof response.lead_id !== "string" || !response.lead_id) {
    throw new Error("Hochzeitsmappe CRM create response did not include a lead_id");
  }

  return {
    activecampaign_status:
      typeof response.activecampaign_status === "string" ? response.activecampaign_status : undefined,
    deduped: typeof response.deduped === "boolean" ? response.deduped : undefined,
    lead_id: response.lead_id,
    lead_number: typeof response.lead_number === "number" ? response.lead_number : undefined,
    source: typeof response.source === "string" ? response.source : undefined
  } satisfies HochzeitsmappeCrmLead;
}

export async function createHochzeitsmappeLeadInSupabase(payload: HochzeitsmappeLead) {
  const response = await requestSupabaseFunction<SupabaseLeadCreateResponse>("POST", payload);

  return normalizeLeadResponse(response);
}

export async function updateHochzeitsmappeLeadActiveCampaignStatus(
  payload: UpdateHochzeitsmappeLeadActiveCampaignStatusPayload
) {
  await requestSupabaseFunction("PATCH", payload);
}
