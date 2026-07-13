"use client";

import { useEffect } from "react";
import { CONSENT_EVENT_NAME, readStoredConsent, type ConsentChoice } from "@/lib/consent";
import { GOOGLE_ADS_TAG_ID } from "@/lib/google-ads";
import {
  activateGoogleAdsTracking,
  deactivateGoogleAdsTracking,
  ensureGtagStub
} from "@/lib/google-ads-gtag";

// Lädt gtag.js erst nach Marketing-Einwilligung (Basic Consent Mode) und
// stellt eine gespeicherte Einwilligung auf Folgeseiten wieder her. Der
// Consent-Mode-v2-Default kommt aus dem Inline-Bootstrap in app/layout.tsx.
export function GoogleAdsTag() {
  useEffect(() => {
    if (!GOOGLE_ADS_TAG_ID) return undefined;

    ensureGtagStub();

    if (readStoredConsent() === "granted") {
      activateGoogleAdsTracking();
    }

    // storeConsent() dispatcht synchron: Beim Opt-in werden noch auf derselben
    // Seite alle vier Consent-Signale aktualisiert und der Tag geladen; ein
    // Widerruf setzt sie sofort wieder auf denied.
    const onConsentChange = (event: Event) => {
      const choice = (event as CustomEvent<ConsentChoice>).detail;
      if (choice === "granted") {
        activateGoogleAdsTracking();
      } else {
        deactivateGoogleAdsTracking();
      }
    };

    window.addEventListener(CONSENT_EVENT_NAME, onConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT_NAME, onConsentChange);
  }, []);

  return null;
}
