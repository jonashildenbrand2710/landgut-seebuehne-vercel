export type ConsentChoice = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "lsb-consent";
export const CONSENT_EVENT_NAME = "lsb-consent-change";

export function readStoredConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
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
