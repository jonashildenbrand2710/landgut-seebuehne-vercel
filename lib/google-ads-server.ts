import { GOOGLE_ADS_CONFIG } from "@/lib/google-ads";
import { GOOGLE_ADS_SERVER_CLIENT_ENABLED, parseGoogleAdsAttribution } from "@/lib/google-ads-attribution";

export type GoogleAdsServerEvent = {
  kind: "lead" | "booking";
  transactionId: string;
  consent: unknown;
  attribution: unknown;
};

type ServerConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId: string;
  loginCustomerId: string;
  leadActionId: string;
  bookingActionId: string;
};

export function googleAdsServerConfig(): ServerConfig | null {
  const values = {
    clientId: process.env.GOOGLE_DATA_MANAGER_CLIENT_ID?.trim() || "",
    clientSecret: process.env.GOOGLE_DATA_MANAGER_CLIENT_SECRET?.trim() || "",
    refreshToken: process.env.GOOGLE_DATA_MANAGER_REFRESH_TOKEN?.trim() || "",
    customerId: process.env.GOOGLE_DATA_MANAGER_CUSTOMER_ID?.trim() || "",
    loginCustomerId: process.env.GOOGLE_DATA_MANAGER_LOGIN_CUSTOMER_ID?.trim() || "",
    leadActionId: process.env.GOOGLE_DATA_MANAGER_LEAD_ACTION_ID?.trim() || "",
    bookingActionId: process.env.GOOGLE_DATA_MANAGER_BOOKING_ACTION_ID?.trim() || ""
  };
  if (!GOOGLE_ADS_CONFIG || !GOOGLE_ADS_SERVER_CLIENT_ENABLED || process.env.GOOGLE_ADS_SERVER_ENABLED !== "true" || Object.values(values).some((v) => !v) ||
    !/^\d{10}$/.test(values.customerId) || !/^\d{10}$/.test(values.loginCustomerId) ||
    !/^\d+$/.test(values.leadActionId) || !/^\d+$/.test(values.bookingActionId)) return null;
  return values;
}

export function googleAdsServerPayload(event: GoogleAdsServerEvent, config: ServerConfig, now = new Date()) {
  // An absent, rejected or withdrawn opt-in must never inherit account defaults.
  if (event.consent !== "granted") return null;
  const validId = event.kind === "lead" ? /^lead_[a-f0-9]{64}$/ : /^(erstgespraech|besichtigung)_[a-f0-9-]{36}$/;
  if (!validId.test(event.transactionId)) return null;
  const adIdentifiers = parseGoogleAdsAttribution(event.attribution);
  if (!Object.keys(adIdentifiers).length) return null;
  return {
    destinations: [{
      operatingAccount: { accountType: "GOOGLE_ADS", accountId: config.customerId },
      loginAccount: { accountType: "GOOGLE_ADS", accountId: config.loginCustomerId },
      productDestinationId: event.kind === "lead" ? config.leadActionId : config.bookingActionId
    }],
    consent: { adUserData: "CONSENT_GRANTED", adPersonalization: "CONSENT_DENIED" },
    events: [{ eventSource: "WEB", eventTimestamp: now.toISOString(), transactionId: event.transactionId, adIdentifiers }]
  };
}

let cachedToken: { token: string; expires: number; clientId: string; refreshToken: string } | undefined;
async function accessToken(config: ServerConfig) {
  if (cachedToken && cachedToken.clientId === config.clientId && cachedToken.refreshToken === config.refreshToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.token;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, refresh_token: config.refreshToken, grant_type: "refresh_token" }),
    cache: "no-store", signal: AbortSignal.timeout(4_000)
  });
  const body = await response.json();
  if (!response.ok || typeof body.access_token !== "string" || !body.scope?.split(" ").includes("https://www.googleapis.com/auth/datamanager")) throw new Error("data_manager_oauth_unavailable");
  cachedToken = { token: body.access_token, expires: Date.now() + Math.min(Number(body.expires_in) || 300, 3600) * 1000, clientId: config.clientId, refreshToken: config.refreshToken };
  return cachedToken.token;
}

export async function sendGoogleAdsServerConversion(event: GoogleAdsServerEvent) {
  const config = googleAdsServerConfig();
  if (!config) return { status: "disabled" as const };
  const payload = googleAdsServerPayload(event, config);
  if (!payload) return { status: "skipped" as const };
  try {
    const token = await accessToken(config);
    // Retrying the exact timestamp and transaction ID is safe within one action.
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch("https://datamanager.googleapis.com/v1/events:ingest", {
        method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify(payload), cache: "no-store", signal: AbortSignal.timeout(4_000)
      });
      const body = await response.json().catch(() => ({}));
      if (response.ok && typeof body.requestId === "string" && body.requestId) {
        // No customer data, click identifiers or event payloads in logs.
        console.info("Google Ads server conversion accepted", { kind: event.kind, requestId: body.requestId, warnings: Array.isArray(body.fieldWarnings) ? body.fieldWarnings.length : 0 });
        return { status: "accepted" as const, requestId: body.requestId };
      }
      if (attempt === 0 && (response.status === 429 || response.status >= 500)) continue;
      console.error("Google Ads server conversion rejected", { kind: event.kind, status: response.status, code: body.error?.status || "missing_request_id" });
      return { status: "failed" as const };
    }
  } catch {
    console.error("Google Ads server conversion unavailable", { kind: event.kind });
  }
  return { status: "failed" as const };
}
