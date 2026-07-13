"use client";

import { openConsentBanner } from "@/lib/consent";
import { META_PIXEL_ID } from "@/lib/meta-events";

// Erlaubt den Widerruf/die Aenderung der Marketing-Einwilligung (DSGVO Art. 7 Abs. 3).
export function CookieSettingsButton() {
  if (!META_PIXEL_ID) return null;

  return (
    <button className="cookie-settings-button" onClick={openConsentBanner} type="button">
      Cookie-Einstellungen
    </button>
  );
}
