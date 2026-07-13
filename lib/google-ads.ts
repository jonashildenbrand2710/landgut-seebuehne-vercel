// Zentrale Google-Ads-Konstanten: einzige Quelle für Tag-ID, Conversion-Labels,
// Consent-Mode-Zustände und den öffentlichen Tracking-Handshake. Läuft auf
// Server und Client (keine Browser-APIs).

// Öffentliche Mess-ID (kein Secret). Über NEXT_PUBLIC_GOOGLE_ADS_ID
// überschreibbar, damit Staging-Umgebungen ein eigenes Konto nutzen könnten.
export const GOOGLE_ADS_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || "AW-16778828961";

export type GoogleAdsConversionKey = "generate_lead" | "book_appointment";

export type GoogleAdsConversionEvent = {
  conversionActionName: string;
  deduplicateWithTransactionId: true;
  enhancedConversions: true;
  key: GoogleAdsConversionKey;
  sendTo: string;
  trigger: string;
};

export const GOOGLE_ADS_CONVERSIONS: Record<GoogleAdsConversionKey, GoogleAdsConversionEvent> = {
  generate_lead: {
    conversionActionName: "generate_leads_conv",
    deduplicateWithTransactionId: true,
    enhancedConversions: true,
    key: "generate_lead",
    sendTo: `${GOOGLE_ADS_TAG_ID}/BvNBCOHEqbcaEKG54sA-`,
    trigger: "confirmed_lead_submission"
  },
  book_appointment: {
    conversionActionName: "Termin erfolgreich gebucht",
    deduplicateWithTransactionId: true,
    enhancedConversions: true,
    key: "book_appointment",
    sendTo: `${GOOGLE_ADS_TAG_ID}/8y4TCI6h0ckcEKG54sA-`,
    trigger: "confirmed_calendar_booking"
  }
};

// Diese beiden Ziele sind im Ads-Konto noch gebotsrelevant und dürfen von der
// Website bewusst NICHT ausgelöst werden (würden Maximize Conversions mit
// minderwertigen Signalen trainieren). Nur als Sperrliste für Tests gedacht.
export const GOOGLE_ADS_BLOCKED_CONVERSION_LABELS = [
  "bFVdCP3XqbcaEKG54sA-", // Pageview
  "u8DQCOTEqbcaEKG54sA-" // Funnel Start
] as const;

export const GOOGLE_CONSENT_DEFAULT = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
} as const;

export const GOOGLE_CONSENT_GRANTED = {
  ad_storage: "granted",
  analytics_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted"
} as const;

// Wird als Inline-Script früh im Dokument ausgeführt: dataLayer + gtag-Stub
// anlegen und den Consent-Mode-v2-Default setzen, bevor irgendein anderes
// Google-Kommando läuft. gtag.js selbst lädt erst nach Einwilligung
// (Basic Consent Mode), daher entstehen hier keine Netzwerk-Requests.
export const GOOGLE_CONSENT_BOOTSTRAP_SCRIPT = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
if (!window.__lsbGcmDefaultSet) {
  window.__lsbGcmDefaultSet = true;
  window.gtag("consent", "default", ${JSON.stringify(GOOGLE_CONSENT_DEFAULT)});
}
`.trim();

// Enhanced Conversions: E-Mail-Normalisierung laut Google-Vorgabe.
export function normalizeEmailForEnhancedConversions(email: string) {
  return email.trim().toLowerCase();
}

// Enhanced Conversions: Telefonnummern nach E.164. Deutsche 0-Präfix-Nummern
// werden auf +49 normalisiert (gleiche Annahme wie in lib/meta-capi.ts).
export function normalizePhoneE164(phone: string) {
  const trimmed = phone.trim();
  if (!trimmed) return "";

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 6) return "";

  if (hasPlus) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `+49${digits.slice(1)}`;
  return `+${digits}`;
}

// Vertrag für GET /.well-known/advertising-tracking.json. Wird vom
// Ads-Orchestrierungsprojekt (SB_Werbung) live gegen Google Ads geprüft.
export function buildAdvertisingTrackingHandshake() {
  return {
    schemaVersion: 1,
    provider: "google-ads",
    implementation: "gtag",
    tagId: GOOGLE_ADS_TAG_ID,
    noPiiInDiagnostics: true,
    consentMode: {
      version: 2,
      default: GOOGLE_CONSENT_DEFAULT,
      marketingGranted: GOOGLE_CONSENT_GRANTED,
      revocationSupported: true
    },
    conversionEvents: [
      GOOGLE_ADS_CONVERSIONS.generate_lead,
      GOOGLE_ADS_CONVERSIONS.book_appointment
    ].map((event) => ({
      key: event.key,
      conversionActionName: event.conversionActionName,
      trigger: event.trigger,
      sendTo: event.sendTo,
      enhancedConversions: event.enhancedConversions,
      deduplicateWithTransactionId: event.deduplicateWithTransactionId
    }))
  };
}
