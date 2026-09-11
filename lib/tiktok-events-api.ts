import { createHash } from "node:crypto";
import {
  TIKTOK_EVENT_NAME,
  TIKTOK_PIXEL_ID,
  tiktokCompleteRegistrationData,
  type TikTokConversionFunnel
} from "@/lib/tiktok-events";

type TrackingRecord = Record<string, unknown>;

type SendTikTokCompleteRegistrationInput = {
  email?: string;
  eventId: string;
  eventSourceUrl: string;
  funnel: TikTokConversionFunnel;
  phone?: string;
  request: Request;
  tracking?: TrackingRecord;
};

const TIKTOK_EVENTS_API_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function trackingString(tracking: TrackingRecord | undefined, key: string) {
  return stringValue(tracking?.[key]);
}

function cookieValue(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]*)`));

  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

function clientIpAddress(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
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

  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `49${digits.slice(1)}`;
  return digits;
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
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

function compactRecord(record: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => Boolean(value)));
}

async function parseTikTokResponse(response: Response) {
  const text = await response.text();
  if (!text) return { code: response.ok ? 0 : response.status, message: "" };

  try {
    return JSON.parse(text) as { code?: number; message?: string; request_id?: string };
  } catch {
    return { code: response.status, message: text.slice(0, 300) };
  }
}

export async function sendTikTokCompleteRegistration({
  email,
  eventId,
  eventSourceUrl: rawEventSourceUrl,
  funnel,
  phone,
  request,
  tracking
}: SendTikTokCompleteRegistrationInput) {
  const accessToken = process.env.TIKTOK_EVENTS_API_TOKEN?.trim();

  if (
    !accessToken ||
    !TIKTOK_PIXEL_ID ||
    trackingString(tracking, "marketingConsent") !== "granted"
  ) {
    return { ok: false, skipped: true };
  }

  const sourceUrl = eventSourceUrl(rawEventSourceUrl, request);
  const normalizedEmail = normalizeEmail(email || "");
  const normalizedPhone = normalizePhone(phone || "");
  const testEventCode = process.env.TIKTOK_TEST_EVENT_CODE?.trim();
  const ttclid =
    trackingString(tracking, "ttclid") ||
    urlParam(sourceUrl, "ttclid") ||
    cookieValue(request, "ttclid");
  const ttp = trackingString(tracking, "ttp") || cookieValue(request, "_ttp");

  const payload = {
    event_source: "web",
    event_source_id: TIKTOK_PIXEL_ID,
    data: [
      {
        event: TIKTOK_EVENT_NAME,
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        page: compactRecord({
          referrer: trackingString(tracking, "referrer"),
          url: sourceUrl
        }),
        properties: tiktokCompleteRegistrationData[funnel],
        user: compactRecord({
          email: normalizedEmail ? hashValue(normalizedEmail) : undefined,
          ip: clientIpAddress(request),
          phone: normalizedPhone ? hashValue(normalizedPhone) : undefined,
          ttclid,
          ttp,
          user_agent: request.headers.get("user-agent")?.trim() || trackingString(tracking, "userAgent")
        })
      }
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {})
  };

  try {
    const response = await fetch(TIKTOK_EVENTS_API_URL, {
      method: "POST",
      headers: {
        "Access-Token": accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000)
    });
    const result = await parseTikTokResponse(response);
    const ok = response.ok && (typeof result.code !== "number" || result.code === 0);

    if (!ok) {
      console.error("TikTok Events API request failed", {
        code: result.code,
        message: result.message?.slice(0, 300),
        requestId: result.request_id,
        status: response.status
      });
    }

    return { ok, skipped: false };
  } catch (error) {
    console.error(
      "TikTok Events API request errored",
      error instanceof Error ? error.message : "Unknown error"
    );
    return { ok: false, skipped: false };
  }
}
