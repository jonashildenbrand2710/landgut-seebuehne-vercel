"use client";

import { openConsentBanner } from "@/lib/consent";
import { META_PIXEL_ID } from "@/lib/meta-events";
import { TIKTOK_PIXEL_ID } from "@/lib/tiktok-events";
import { GOOGLE_ADS_CONFIG } from "@/lib/google-ads";

// Erlaubt den Widerruf/die Aenderung der Marketing-Einwilligung (DSGVO Art. 7 Abs. 3).
export function CookieSettingsButton() {
  if (!META_PIXEL_ID && !TIKTOK_PIXEL_ID && !GOOGLE_ADS_CONFIG) return null;

  return (
    <button className="cookie-settings-button" onClick={openConsentBanner} type="button">
      Cookie-Einstellungen
    </button>
  );
}
