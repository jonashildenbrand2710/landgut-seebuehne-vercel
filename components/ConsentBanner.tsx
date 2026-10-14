"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { META_PIXEL_ID } from "@/lib/meta-events";
import { TIKTOK_PIXEL_ID } from "@/lib/tiktok-events";
import { GOOGLE_ADS_CONFIG } from "@/lib/google-ads";
import {
  CONSENT_OPEN_EVENT_NAME,
  storeConsent,
  type ConsentChoice
} from "@/lib/consent";

export function ConsentBanner() {
  const providers = [
    META_PIXEL_ID && "Meta Pixel",
    TIKTOK_PIXEL_ID && "TikTok Pixel",
    GOOGLE_ADS_CONFIG && "Google Ads"
  ].filter((provider): provider is string => typeof provider === "string" && provider.length > 0);
  const providerLabel = providers.length > 1
    ? `${providers.slice(0, -1).join(", ")} und ${providers.at(-1)}`
    : providers[0];
  const trackingConfigured = providers.length > 0;
  const [isVisible, setIsVisible] = useState(trackingConfigured);

  useEffect(() => {
    if (!trackingConfigured) return;

    // "Cookie-Einstellungen" im Footer oeffnet das Banner erneut (Widerruf).
    const reopen = () => {
      delete document.documentElement.dataset.consentStored;
      setIsVisible(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT_NAME, reopen);

    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT_NAME, reopen);
    };
  }, [trackingConfigured]);

  if (!isVisible) return null;

  const choose = (choice: ConsentChoice) => {
    document.documentElement.dataset.consentStored = "true";
    storeConsent(choice);
    setIsVisible(false);
  };

  return (
    <aside className="consent-banner" role="region" aria-label="Cookie- und Tracking-Hinweis">
      <div className="consent-banner-inner">
        <p>
          Wir möchten mit eurem Einverständnis Marketing-Cookies ({providerLabel})
          nutzen, um die Wirkung unserer Anzeigen zu messen und Kampagnen zu optimieren.
          Notwendige Funktionen kommen ohne Tracking aus.{" "}
          <Link href="/datenschutz">Mehr im Datenschutz</Link>
        </p>
        <div className="consent-banner-actions">
          <button className="button primary" onClick={() => choose("granted")} type="button">
            <span>Einverstanden</span>
          </button>
          <button className="button secondary" onClick={() => choose("denied")} type="button">
            <span>Nur notwendige</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
