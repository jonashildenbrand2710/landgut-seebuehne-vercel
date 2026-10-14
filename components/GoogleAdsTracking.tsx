"use client";

import { useEffect } from "react";
import { CONSENT_EVENT_NAME, readStoredConsent } from "@/lib/consent";
import {
  createGoogleAdsTracker,
  GOOGLE_ADS_CONFIG,
  registerGoogleAdsTracker
} from "@/lib/google-ads";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function GoogleAdsTracking() {
  useEffect(() => {
    if (!GOOGLE_ADS_CONFIG) return;

    const command = (...args: unknown[]) => {
      window.dataLayer ??= [];
      window.gtag ??= function () {
        // Google expects the arguments object used by its standard gtag snippet.
        window.dataLayer?.push(arguments);
      };
      window.gtag(...args);
    };
    let storage: Storage | undefined;
    try {
      storage = window.sessionStorage;
    } catch {
      // Private browsers can block access to storage entirely.
    }
    const tracker = createGoogleAdsTracker(GOOGLE_ADS_CONFIG, {
      disableAnalytics: (measurementIds) => {
        for (const id of measurementIds) window[`ga-disable-${id}`] = true;
      },
      command,
      pageLocation: () => window.location.href,
      storage,
      loadTag: (tagId) => {
        if (document.getElementById("google-ads-tag")) return;
        const script = document.createElement("script");
        script.id = "google-ads-tag";
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`;
        script.onerror = () => script.remove();
        document.head.appendChild(script);
      }
    });
    const unregister = registerGoogleAdsTracker(tracker);
    tracker.setConsent(readStoredConsent() === "granted");
    const onConsent = (event: Event) => {
      if (event instanceof CustomEvent) tracker.setConsent(event.detail === "granted");
    };
    window.addEventListener(CONSENT_EVENT_NAME, onConsent);
    return () => {
      window.removeEventListener(CONSENT_EVENT_NAME, onConsent);
      unregister();
    };
  }, []);

  return null;
}
