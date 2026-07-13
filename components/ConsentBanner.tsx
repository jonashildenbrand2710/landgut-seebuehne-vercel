"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { META_PIXEL_ID } from "@/lib/meta-events";
import { GOOGLE_ADS_TAG_ID } from "@/lib/google-ads";
import {
  CONSENT_OPEN_EVENT_NAME,
  readStoredConsent,
  storeConsent,
  type ConsentChoice
} from "@/lib/consent";

const marketingConfigured = Boolean(META_PIXEL_ID || GOOGLE_ADS_TAG_ID);

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!marketingConfigured) return;

    // Nach dem ersten Paint einblenden: vermeidet Hydration-Differenzen,
    // weil der Server den localStorage-Stand nicht kennen kann.
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(readStoredConsent() === null);
    });

    // "Cookie-Einstellungen" im Footer oeffnet das Banner erneut (Widerruf).
    const reopen = () => setIsVisible(true);
    window.addEventListener(CONSENT_OPEN_EVENT_NAME, reopen);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(CONSENT_OPEN_EVENT_NAME, reopen);
    };
  }, []);

  if (!isVisible) return null;

  const choose = (choice: ConsentChoice) => {
    storeConsent(choice);
    setIsVisible(false);
  };

  return (
    <aside className="consent-banner" role="region" aria-label="Cookie- und Tracking-Hinweis">
      <div className="consent-banner-inner">
        <p>
          Wir möchten mit eurem Einverständnis Marketing-Cookies für Meta Pixel und Google Ads
          Conversion-Tracking (inkl. Google Consent Mode und Enhanced Conversions mit gehashten
          Kontaktdaten) nutzen, um unsere Anzeigen besser zu steuern. Notwendige Funktionen kommen
          ohne Tracking aus. <Link href="/datenschutz">Mehr im Datenschutz</Link>
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
