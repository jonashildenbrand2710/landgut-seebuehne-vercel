export type ConsentChoice = "granted" | "denied";

// v2: Die Marketing-Einwilligung umfasst seit der Google-Ads-Integration
// Meta Pixel UND Google Ads Conversion Tracking. Eine alte "granted"-Antwort
// galt nur für Meta und wird deshalb nicht übernommen — das Banner fragt
// erneut. Eine alte Ablehnung bleibt eine Ablehnung.
export const CONSENT_STORAGE_KEY = "lsb-consent-v2";
export const LEGACY_CONSENT_STORAGE_KEY = "lsb-consent";
export const CONSENT_EVENT_NAME = "lsb-consent-change";
export const CONSENT_OPEN_EVENT_NAME = "lsb-consent-open";

export function readStoredConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;

    const legacy = window.localStorage.getItem(LEGACY_CONSENT_STORAGE_KEY);
    if (legacy === "denied") {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
      return "denied";
    }

    return null;
  } catch {
    return null;
  }
}

export function storeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Ohne Storage gilt die Entscheidung nur für die aktuelle Seite.
  }

  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT_NAME, { detail: choice }));
}

export function openConsentBanner() {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT_NAME));
}
