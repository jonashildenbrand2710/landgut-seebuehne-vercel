// Client-seitige Google-Ads-Tracking-Schicht. Alle Aufrufe sind SSR-sicher und
// brechen ohne Marketing-Einwilligung kontrolliert ab. Vor dem Laden von
// gtag.js puffert der gtag-Stub Kommandos im dataLayer (Basic Consent Mode:
// vor Einwilligung verlässt kein Request die Seite).

import {
  GOOGLE_ADS_CONVERSIONS,
  GOOGLE_ADS_TAG_ID,
  GOOGLE_CONSENT_DEFAULT,
  GOOGLE_CONSENT_GRANTED,
  normalizeEmailForEnhancedConversions,
  normalizePhoneE164,
  type GoogleAdsConversionKey
} from "@/lib/google-ads";
import { readStoredConsent } from "@/lib/consent";

export type EnhancedConversionUserData = {
  sha256_email_address?: string;
  sha256_phone_number?: string;
};

declare global {
  interface Window {
    __lsbGcmDefaultSet?: boolean;
    __lsbGadsTagLoaded?: boolean;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_TAG_SCRIPT_URL = "https://www.googletagmanager.com/gtag/js";
const CONVERSION_STORAGE_PREFIX = "lsb-gads-conv-";
const LEAD_USER_DATA_SESSION_PREFIX = "lsb-gads-ud-";

export function ensureGtagStub() {
  if (typeof window === "undefined") return false;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // Google-Snippet-Konvention: das arguments-Objekt selbst pushen.
      window.dataLayer?.push(arguments);
    };
  }

  // Consent-Default muss vor jedem anderen Google-Kommando stehen. Das
  // Inline-Bootstrap in app/layout.tsx setzt ihn bereits; das Flag verhindert
  // Duplikate, falls dieser Code zuerst läuft (z. B. in Tests).
  if (!window.__lsbGcmDefaultSet) {
    window.__lsbGcmDefaultSet = true;
    window.gtag("consent", "default", GOOGLE_CONSENT_DEFAULT);
  }

  return true;
}

function loadGoogleAdsTagOnce() {
  if (!ensureGtagStub() || window.__lsbGadsTagLoaded) return;

  // Re-Mounts/HMR: existiert das Script-Element bereits, nicht erneut laden.
  if (document.querySelector(`script[src^="${GOOGLE_TAG_SCRIPT_URL}"]`)) {
    window.__lsbGadsTagLoaded = true;
    return;
  }

  window.__lsbGadsTagLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `${GOOGLE_TAG_SCRIPT_URL}?id=${encodeURIComponent(GOOGLE_ADS_TAG_ID)}`;
  document.head.appendChild(script);

  window.gtag?.("js", new Date());
  window.gtag?.("config", GOOGLE_ADS_TAG_ID, { allow_enhanced_conversions: true });
}

// Opt-in: erst alle vier Consent-Signale auf granted stellen (noch auf der
// aktuellen Seite, vor jeder Navigation), danach den Google Tag genau einmal
// laden und konfigurieren.
export function activateGoogleAdsTracking() {
  if (!ensureGtagStub()) return;
  window.gtag?.("consent", "update", GOOGLE_CONSENT_GRANTED);
  loadGoogleAdsTagOnce();
}

// Widerruf: alle vier Signale zurück auf denied. Conversion-Aufrufe werden
// zusätzlich über den Consent-Check in trackGoogleAdsConversion blockiert.
export function deactivateGoogleAdsTracking() {
  if (!ensureGtagStub()) return;
  window.gtag?.("consent", "update", GOOGLE_CONSENT_DEFAULT);
}

function conversionStorageKey(key: GoogleAdsConversionKey, transactionId: string) {
  return `${CONVERSION_STORAGE_PREFIX}${key}-${transactionId}`;
}

export function wasGoogleAdsConversionTracked(key: GoogleAdsConversionKey, transactionId: string) {
  try {
    return window.localStorage.getItem(conversionStorageKey(key, transactionId)) === "1";
  } catch {
    return false;
  }
}

function markGoogleAdsConversionTracked(key: GoogleAdsConversionKey, transactionId: string) {
  try {
    window.localStorage.setItem(conversionStorageKey(key, transactionId), "1");
  } catch {
    // Ohne Storage schützt weiterhin die transaction_id-Deduplizierung bei Google.
  }
}

// Feuert eine Google-Ads-Conversion ausschließlich mit stabiler, vom Backend
// bestätigter transaction_id. Ohne Einwilligung, ohne transaction_id oder bei
// bereits gemeldeter ID passiert nichts (Reload-/Re-Render-Schutz).
export function trackGoogleAdsConversion(
  key: GoogleAdsConversionKey,
  transactionId: string,
  userData?: EnhancedConversionUserData
) {
  if (typeof window === "undefined") return false;

  const stableId = transactionId?.trim();
  if (!stableId) return false;
  if (readStoredConsent() !== "granted") return false;
  if (wasGoogleAdsConversionTracked(key, stableId)) return false;
  if (!ensureGtagStub()) return false;

  // Reihenfolge im dataLayer sichern: consent update + config vor dem Event.
  activateGoogleAdsTracking();

  if (userData && (userData.sha256_email_address || userData.sha256_phone_number)) {
    window.gtag?.("set", "user_data", userData);
  }

  window.gtag?.("event", "conversion", {
    send_to: GOOGLE_ADS_CONVERSIONS[key].sendTo,
    transaction_id: stableId
  });

  markGoogleAdsConversionTracked(key, stableId);
  return true;
}

// SHA-256 (hex, lowercase) gemäß Google-Vorgabe für vorgehashte
// Enhanced-Conversion-Felder. Liefert null, wenn WebCrypto fehlt.
export async function hashEnhancedConversionValue(value: string) {
  if (!value) return null;

  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return null;

  try {
    const digest = await subtle.digest("SHA-256", new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return null;
  }
}

// Baut das user_data-Objekt für Enhanced Conversions. Verarbeitet Kontaktdaten
// nur nach Marketing-Einwilligung und gibt ausschließlich gehashte Werte
// weiter — niemals Klartext-PII.
export async function buildEnhancedConversionUserData(contact: {
  email?: string;
  phone?: string;
}): Promise<EnhancedConversionUserData | null> {
  if (typeof window === "undefined") return null;
  if (readStoredConsent() !== "granted") return null;

  const email = normalizeEmailForEnhancedConversions(contact.email || "");
  const phone = normalizePhoneE164(contact.phone || "");

  const [emailHash, phoneHash] = await Promise.all([
    email ? hashEnhancedConversionValue(email) : Promise.resolve(null),
    phone ? hashEnhancedConversionValue(phone) : Promise.resolve(null)
  ]);

  if (!emailHash && !phoneHash) return null;

  return {
    ...(emailHash ? { sha256_email_address: emailHash } : {}),
    ...(phoneHash ? { sha256_phone_number: phoneHash } : {})
  };
}

function leadUserDataSessionKey(eventId: string) {
  return `${LEAD_USER_DATA_SESSION_PREFIX}${eventId}`;
}

// Der Hochzeitsmappe-Flow ist ein nativer POST mit Redirect nach /danke. Damit
// Enhanced-Conversion-Daten die Navigation überleben, werden sie VOR dem Submit
// gehasht und nur als Hashes kurzzeitig in sessionStorage abgelegt.
export async function stashLeadUserDataForThankYouPage(
  eventId: string,
  contact: { email?: string; phone?: string }
) {
  if (typeof window === "undefined" || !eventId) return false;

  const userData = await buildEnhancedConversionUserData(contact);
  if (!userData) return false;

  try {
    window.sessionStorage.setItem(leadUserDataSessionKey(eventId), JSON.stringify(userData));
    return true;
  } catch {
    return false;
  }
}

// Liest die gehashten Lead-Kontaktdaten auf /danke aus und entfernt sie sofort.
export function takeStashedLeadUserData(eventId: string): EnhancedConversionUserData | null {
  if (typeof window === "undefined" || !eventId) return null;

  try {
    const key = leadUserDataSessionKey(eventId);
    const raw = window.sessionStorage.getItem(key);
    if (raw) window.sessionStorage.removeItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as EnhancedConversionUserData;
    const isHash = (value: unknown) => typeof value === "string" && /^[0-9a-f]{64}$/.test(value);

    return {
      ...(isHash(parsed.sha256_email_address)
        ? { sha256_email_address: parsed.sha256_email_address }
        : {}),
      ...(isHash(parsed.sha256_phone_number)
        ? { sha256_phone_number: parsed.sha256_phone_number }
        : {})
    };
  } catch {
    return null;
  }
}
