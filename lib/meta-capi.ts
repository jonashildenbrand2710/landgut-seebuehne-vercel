import { createHash, randomUUID } from "node:crypto";
import {
  META_EVENT_NAME,
  META_GRAPH_API_VERSION,
  META_PIXEL_ID,
  metaConversionCustomData,
  type MetaConversionFunnel
} from "@/lib/meta-events";

type TrackingRecord = Record<string, unknown>;

type SendMetaCompleteRegistrationInput = {
  email?: string;
  eventId: string;
  eventSourceUrl: string;
  funnel: MetaConversionFunnel;
  phone?: string;
  request: Request;
  tracking?: TrackingRecord;
};

const marketingParamNames = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "meta_campaign_id",
  "meta_adset_id",
  "meta_ad_id",
  "meta_placement"
] as const;

export function createMetaServerEventId(funnel: MetaConversionFunnel) {
  return `${funnel}_${randomUUID()}`;
}

export function normalizeMetaEventId(value: string, funnel: MetaConversionFunnel) {
  const trimmed = value.trim();

  if (/^[a-z0-9_:-]{1,160}$/i.test(trimmed)) {
    return trimmed;
  }

  return createMetaServerEventId(funnel);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function recordValue(value: unknown): TrackingRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as TrackingRecord) : {};
}

function trackingString(tracking: TrackingRecord | undefined, key: string) {
  return stringValue(tracking?.[key]);
}

function nestedTrackingString(tracking: TrackingRecord | undefined, parent: string, key: string) {
  return stringValue(recordValue(tracking?.[parent])[key]);
}

function cookieValue(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]*)`));

  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

function clientIpAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    ""
  );
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  // Meta erwartet Nummern mit Ländervorwahl; deutsche 0-Präfix-Nummern werden auf +49 normalisiert.
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `49${digits.slice(1)}`;
  return digits;
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function fbcFromFbclid(fbclid: string, capturedAt: string) {
  if (!fbclid) return "";
  const capturedTime = Date.parse(capturedAt);
  const timestamp = Number.isFinite(capturedTime) ? capturedTime : Date.now();

  return `fb.1.${timestamp}.${fbclid}`;
}

function userAgent(request: Request, tracking: TrackingRecord | undefined) {
  return request.headers.get("user-agent")?.trim() || trackingString(tracking, "userAgent");
}

function eventSourceUrl(input: string, request: Request) {
  try {
    return new URL(input).toString();
  } catch {
    try {
      return new URL(input || "/", request.url).toString();
    } catch {
      return request.url;
    }
  }
}

function urlParam(url: string, key: string) {
  try {
    return new URL(url).searchParams.get(key) || "";
  } catch {
    return "";
  }
}

function fbp(request: Request, tracking: TrackingRecord | undefined) {
  return trackingString(tracking, "fbp") || cookieValue(request, "_fbp");
}

function fbc(request: Request, tracking: TrackingRecord | undefined, sourceUrl: string) {
  const fbclid = trackingString(tracking, "fbclid") || urlParam(sourceUrl, "fbclid");
  return (
    trackingString(tracking, "fbc") ||
    cookieValue(request, "_fbc") ||
    fbcFromFbclid(fbclid, trackingString(tracking, "capturedAt"))
  );
}

function marketingData(tracking: TrackingRecord | undefined, sourceUrl: string) {
  const data: Record<string, string> = {};

  for (const key of marketingParamNames) {
    const nestedKey = key.startsWith("utm_") ? key.replace("utm_", "") : key.replace("meta_", "");
    const nestedParent = key.startsWith("utm_") ? "utm" : "meta";
    const value =
      trackingString(tracking, key) ||
      nestedTrackingString(tracking, nestedParent, nestedKey) ||
      urlParam(sourceUrl, key);

    if (value) {
      data[key] = value;
    }
  }

  return data;
}

function compactRecord(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value);
    })
  );
}

async function parseMetaResponse(response: Response) {
  const text = await response.text();
  if (!text) return "";

  try {
    return JSON.stringify(JSON.parse(text));
  } catch {
    return text;
  }
}

export async function sendMetaCompleteRegistration({
  email,
  eventId,
  eventSourceUrl: rawEventSourceUrl,
  funnel,
  phone,
  request,
  tracking
}: SendMetaCompleteRegistrationInput) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();

  if (!accessToken || !META_PIXEL_ID) {
    return { ok: false, skipped: true };
  }

  const sourceUrl = eventSourceUrl(rawEventSourceUrl, request);
  const normalizedEmail = normalizeEmail(email || "");
  const normalizedPhone = normalizePhone(phone || "");
  const endpoint = new URL(`https://graph.facebook.com/${META_GRAPH_API_VERSION}/${META_PIXEL_ID}/events`);
  const testEventCode = process.env.META_TEST_EVENT_CODE?.trim();
  endpoint.searchParams.set("access_token", accessToken);

  const payload = {
    data: [
      {
        action_source: "website",
        custom_data: {
          ...metaConversionCustomData[funnel],
          ...marketingData(tracking, sourceUrl)
        },
        event_id: eventId,
        event_name: META_EVENT_NAME,
        event_source_url: sourceUrl,
        event_time: Math.floor(Date.now() / 1000),
        user_data: compactRecord({
          client_ip_address: clientIpAddress(request),
          client_user_agent: userAgent(request, tracking),
          em: normalizedEmail ? [hashValue(normalizedEmail)] : undefined,
          fbc: fbc(request, tracking, sourceUrl),
          fbp: fbp(request, tracking),
          ph: normalizedPhone ? [hashValue(normalizedPhone)] : undefined
        })
      }
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {})
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000)
    });

    if (!response.ok) {
      const responseBody = await parseMetaResponse(response);
      console.error("Meta CAPI request failed", {
        body: responseBody.slice(0, 500),
        status: response.status
      });
    }

    return { ok: response.ok, skipped: false };
  } catch (error) {
    console.error("Meta CAPI request errored", error instanceof Error ? error.message : "Unknown error");
    return { ok: false, skipped: false };
  }
}
