import { readStoredConsent } from "@/lib/consent";

export type GoogleAdsAttribution = Partial<Record<"gclid" | "gbraid" | "wbraid", string>>;
export const GOOGLE_ADS_ATTRIBUTION_KEY = "lsb-google-ads-click-v1";
const maxAgeMs = 30 * 24 * 60 * 60 * 1000;
const clickKeys = ["gclid", "gbraid", "wbraid"] as const;
export const GOOGLE_ADS_SERVER_CLIENT_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_ADS_SERVER_ENABLED === "true";

export function parseGoogleAdsAttribution(value: unknown): GoogleAdsAttribution {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: GoogleAdsAttribution = {};
  for (const key of clickKeys) {
    const id = (value as Record<string, unknown>)[key];
    if (typeof id === "string" && /^[A-Za-z0-9_-]{1,512}$/.test(id)) result[key] = id;
  }
  // The API accepts GCLID or a braid, not multiple identifiers for different clicks.
  if (result.gclid) return { gclid: result.gclid };
  if (result.wbraid) return { wbraid: result.wbraid };
  return result.gbraid ? { gbraid: result.gbraid } : {};
}

function fromUrl(href: string) {
  try {
    const params = new URL(href).searchParams;
    return parseGoogleAdsAttribution(Object.fromEntries(clickKeys.map((key) => [key, params.get(key)])));
  } catch {
    return {};
  }
}

export function readGoogleAdsAttribution(
  granted: boolean,
  href: string,
  storage?: Pick<Storage, "getItem">,
  now = Date.now()
): GoogleAdsAttribution {
  if (!granted) return {};
  const current = fromUrl(href);
  if (Object.keys(current).length) return current;
  try {
    const saved = JSON.parse(storage?.getItem(GOOGLE_ADS_ATTRIBUTION_KEY) || "null");
    if (!saved || !Number.isFinite(saved.capturedAt) || saved.capturedAt > now || now - saved.capturedAt >= maxAgeMs) return {};
    return parseGoogleAdsAttribution(saved.click);
  } catch {
    return {};
  }
}

export function captureGoogleAdsAttribution(granted: boolean) {
  if (!GOOGLE_ADS_SERVER_CLIENT_ENABLED || typeof window === "undefined") return;
  try {
    if (!granted) {
      window.sessionStorage.removeItem(GOOGLE_ADS_ATTRIBUTION_KEY);
      return;
    }
    const click = fromUrl(window.location.href);
    if (Object.keys(click).length) window.sessionStorage.setItem(GOOGLE_ADS_ATTRIBUTION_KEY, JSON.stringify({ click, capturedAt: Date.now() }));
  } catch {
    // Blocked storage still permits attribution from the current page's URL.
  }
}

export function browserGoogleAdsAttribution() {
  if (!GOOGLE_ADS_SERVER_CLIENT_ENABLED || typeof window === "undefined") return {};
  const granted = readStoredConsent() === "granted";
  let storage: Storage | undefined;
  try { storage = window.sessionStorage; } catch { /* Storage can be unavailable. */ }
  return readGoogleAdsAttribution(granted, window.location.href, storage);
}
