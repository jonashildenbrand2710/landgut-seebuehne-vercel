"use client";

import { useEffect, useSyncExternalStore } from "react";
import { CONSENT_EVENT_NAME, readStoredConsent } from "@/lib/consent";
import { GOOGLE_ADS_READY_EVENT, trackGoogleAdsLead } from "@/lib/google-ads";

function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT_NAME, onChange);
  return () => window.removeEventListener(CONSENT_EVENT_NAME, onChange);
}

export function GoogleAdsConsentField() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    () => readStoredConsent() === "granted" ? "granted" : "denied",
    () => "denied"
  );
  // Hidden inputs must be controlled: the parent's submitting-state render can
  // reset a DOM-mutated defaultValue immediately before native form.submit().
  return <input type="hidden" name="googleAdsConsent" value={consent} readOnly />;
}

export function GoogleAdsLeadConversion({ transactionId }: { transactionId: string }) {
  useEffect(() => {
    const track = () => {
      if (readStoredConsent() === "granted") trackGoogleAdsLead(transactionId);
    };
    // Handles either effect ordering, consent restoration and a later opt-in.
    window.addEventListener(GOOGLE_ADS_READY_EVENT, track);
    window.addEventListener(CONSENT_EVENT_NAME, track);
    track();
    return () => {
      window.removeEventListener(GOOGLE_ADS_READY_EVENT, track);
      window.removeEventListener(CONSENT_EVENT_NAME, track);
    };
  }, [transactionId]);
  return null;
}
