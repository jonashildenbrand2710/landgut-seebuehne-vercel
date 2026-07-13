import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildAdvertisingTrackingHandshake,
  GOOGLE_ADS_BLOCKED_CONVERSION_LABELS,
  GOOGLE_ADS_CONVERSIONS,
  GOOGLE_ADS_TAG_ID,
  GOOGLE_CONSENT_DEFAULT,
  GOOGLE_CONSENT_GRANTED
} from "@/lib/google-ads";

const HANDSHAKE_FILE = fileURLToPath(
  new URL("../../public/.well-known/advertising-tracking.json", import.meta.url)
);

// Exakter Vertrag aus dem Auftrag; wird vom SB_Werbung-Prüfer live gegen
// Google Ads validiert.
const EXPECTED_HANDSHAKE = {
  schemaVersion: 1,
  provider: "google-ads",
  implementation: "gtag",
  tagId: "AW-16778828961",
  noPiiInDiagnostics: true,
  consentMode: {
    version: 2,
    default: {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    },
    marketingGranted: {
      ad_storage: "granted",
      analytics_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted"
    },
    revocationSupported: true
  },
  conversionEvents: [
    {
      key: "generate_lead",
      conversionActionName: "generate_leads_conv",
      trigger: "confirmed_lead_submission",
      sendTo: "AW-16778828961/BvNBCOHEqbcaEKG54sA-",
      enhancedConversions: true,
      deduplicateWithTransactionId: true
    },
    {
      key: "book_appointment",
      conversionActionName: "Termin erfolgreich gebucht",
      trigger: "confirmed_calendar_booking",
      sendTo: "AW-16778828961/8y4TCI6h0ckcEKG54sA-",
      enhancedConversions: true,
      deduplicateWithTransactionId: true
    }
  ]
};

describe("Google-Ads-Vertragskonstanten", () => {
  it("nutzt die vereinbarte öffentliche Tag-ID", () => {
    expect(GOOGLE_ADS_TAG_ID).toBe("AW-16778828961");
  });

  it("mappt die beiden verbindlichen Conversion-Aktionen exakt", () => {
    expect(GOOGLE_ADS_CONVERSIONS.generate_lead.sendTo).toBe(
      "AW-16778828961/BvNBCOHEqbcaEKG54sA-"
    );
    expect(GOOGLE_ADS_CONVERSIONS.generate_lead.conversionActionName).toBe("generate_leads_conv");
    expect(GOOGLE_ADS_CONVERSIONS.book_appointment.sendTo).toBe(
      "AW-16778828961/8y4TCI6h0ckcEKG54sA-"
    );
    expect(GOOGLE_ADS_CONVERSIONS.book_appointment.conversionActionName).toBe(
      "Termin erfolgreich gebucht"
    );
  });

  it("feuert die gesperrten Ziele Pageview und Funnel Start nirgends", () => {
    const sendToLabels = Object.values(GOOGLE_ADS_CONVERSIONS).map((event) => event.sendTo);

    for (const blockedLabel of GOOGLE_ADS_BLOCKED_CONVERSION_LABELS) {
      expect(sendToLabels.some((sendTo) => sendTo.includes(blockedLabel))).toBe(false);
    }
  });

  it("hält alle vier Consent-Mode-v2-Signale im Default auf denied", () => {
    expect(GOOGLE_CONSENT_DEFAULT).toEqual({
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    expect(GOOGLE_CONSENT_GRANTED).toEqual({
      ad_storage: "granted",
      analytics_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted"
    });
  });
});

describe("Öffentlicher Tracking-Handshake", () => {
  it("entspricht exakt dem vereinbarten Vertrag", () => {
    expect(buildAdvertisingTrackingHandshake()).toEqual(EXPECTED_HANDSHAKE);
  });

  it("hält die statische Datei public/.well-known/advertising-tracking.json synchron", () => {
    const fileContent = JSON.parse(readFileSync(HANDSHAKE_FILE, "utf8"));
    expect(fileContent).toEqual(buildAdvertisingTrackingHandshake());
  });

  it("enthält keine Kundendaten, Tokens oder Formulardaten", () => {
    const serialized = JSON.stringify(buildAdvertisingTrackingHandshake()).toLowerCase();

    for (const forbidden of ["token", "secret", "customer", "oauth", "email", "phone", "@"]) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});
