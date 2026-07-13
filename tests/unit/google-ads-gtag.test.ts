// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";
import {
  GOOGLE_ADS_BLOCKED_CONVERSION_LABELS,
  GOOGLE_ADS_TAG_ID,
  GOOGLE_CONSENT_DEFAULT,
  GOOGLE_CONSENT_GRANTED
} from "@/lib/google-ads";
import {
  activateGoogleAdsTracking,
  buildEnhancedConversionUserData,
  deactivateGoogleAdsTracking,
  ensureGtagStub,
  takeStashedLeadUserData,
  trackGoogleAdsConversion
} from "@/lib/google-ads-gtag";

function dataLayerEntries() {
  return (window.dataLayer || []).map((entry) => Array.from(entry as ArrayLike<unknown>));
}

function conversionEntries() {
  return dataLayerEntries().filter((entry) => entry[0] === "event" && entry[1] === "conversion");
}

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.dataLayer = [];
  window.gtag = undefined;
  window.__lsbGcmDefaultSet = false;
  window.__lsbGadsTagLoaded = false;
  document
    .querySelectorAll('script[src^="https://www.googletagmanager.com/gtag/js"]')
    .forEach((node) => node.remove());
});

describe("gtag-Stub und Consent Mode v2", () => {
  it("setzt den Consent-Default (alle vier Signale denied) vor allen anderen Kommandos", () => {
    ensureGtagStub();

    expect(dataLayerEntries()[0]).toEqual(["consent", "default", GOOGLE_CONSENT_DEFAULT]);
  });

  it("setzt den Default nicht doppelt", () => {
    ensureGtagStub();
    ensureGtagStub();

    const defaults = dataLayerEntries().filter(
      (entry) => entry[0] === "consent" && entry[1] === "default"
    );
    expect(defaults).toHaveLength(1);
  });

  it("aktualisiert beim Opt-in alle vier Signale auf granted und lädt den Tag genau einmal", () => {
    activateGoogleAdsTracking();
    activateGoogleAdsTracking();

    const updates = dataLayerEntries().filter(
      (entry) => entry[0] === "consent" && entry[1] === "update"
    );
    expect(updates[0]).toEqual(["consent", "update", GOOGLE_CONSENT_GRANTED]);

    const scripts = document.querySelectorAll(
      'script[src^="https://www.googletagmanager.com/gtag/js"]'
    );
    expect(scripts).toHaveLength(1);

    const configs = dataLayerEntries().filter(
      (entry) => entry[0] === "config" && entry[1] === GOOGLE_ADS_TAG_ID
    );
    expect(configs).toHaveLength(1);
    expect(configs[0][2]).toEqual({ allow_enhanced_conversions: true });
  });

  it("setzt beim Widerruf alle vier Signale zurück auf denied", () => {
    activateGoogleAdsTracking();
    deactivateGoogleAdsTracking();

    const updates = dataLayerEntries().filter(
      (entry) => entry[0] === "consent" && entry[1] === "update"
    );
    expect(updates[updates.length - 1]).toEqual(["consent", "update", GOOGLE_CONSENT_DEFAULT]);
  });
});

describe("trackGoogleAdsConversion", () => {
  it("bricht ohne Marketing-Einwilligung kontrolliert ab", () => {
    expect(trackGoogleAdsConversion("generate_lead", "lead-1")).toBe(false);
    expect(conversionEntries()).toHaveLength(0);

    window.localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
    expect(trackGoogleAdsConversion("generate_lead", "lead-1")).toBe(false);
    expect(conversionEntries()).toHaveLength(0);
  });

  it("bricht ohne stabile transaction_id ab (keine persistierte Entität)", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");

    expect(trackGoogleAdsConversion("generate_lead", "")).toBe(false);
    expect(trackGoogleAdsConversion("generate_lead", "   ")).toBe(false);
    expect(conversionEntries()).toHaveLength(0);
  });

  it("feuert mit Einwilligung genau einmal pro transaction_id", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");

    expect(trackGoogleAdsConversion("book_appointment", "booking-1")).toBe(true);
    // Re-Render/Reload-Simulation: gleiche ID darf nicht erneut feuern.
    expect(trackGoogleAdsConversion("book_appointment", "booking-1")).toBe(false);

    const conversions = conversionEntries();
    expect(conversions).toHaveLength(1);
    expect(conversions[0][2]).toEqual({
      send_to: `${GOOGLE_ADS_TAG_ID}/8y4TCI6h0ckcEKG54sA-`,
      transaction_id: "booking-1"
    });
  });

  it("übergibt Enhanced-Conversion-Daten als user_data vor dem Conversion-Event", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");

    trackGoogleAdsConversion("generate_lead", "lead-2", {
      sha256_email_address: "a".repeat(64)
    });

    const entries = dataLayerEntries();
    const userDataIndex = entries.findIndex(
      (entry) => entry[0] === "set" && entry[1] === "user_data"
    );
    const conversionIndex = entries.findIndex(
      (entry) => entry[0] === "event" && entry[1] === "conversion"
    );

    expect(userDataIndex).toBeGreaterThan(-1);
    expect(conversionIndex).toBeGreaterThan(userDataIndex);
    expect(entries[userDataIndex][2]).toEqual({ sha256_email_address: "a".repeat(64) });
  });

  it("verwendet niemals die gesperrten Labels Pageview/Funnel Start", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    trackGoogleAdsConversion("generate_lead", "lead-3");
    trackGoogleAdsConversion("book_appointment", "booking-3");

    const serialized = JSON.stringify(dataLayerEntries());
    for (const blockedLabel of GOOGLE_ADS_BLOCKED_CONVERSION_LABELS) {
      expect(serialized).not.toContain(blockedLabel);
    }
  });
});

describe("Enhanced-Conversion-Daten (user_data)", () => {
  it("verarbeitet Kontaktdaten ohne Einwilligung nicht", async () => {
    const userData = await buildEnhancedConversionUserData({
      email: "anna@example.com",
      phone: "0171 2345678"
    });

    expect(userData).toBeNull();
  });

  it("liefert mit Einwilligung ausschließlich SHA-256-Hashes, keine Klartext-PII", async () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");

    const userData = await buildEnhancedConversionUserData({
      email: " Anna@Example.com ",
      phone: "0171 2345678"
    });

    expect(userData).not.toBeNull();
    expect(userData?.sha256_email_address).toMatch(/^[0-9a-f]{64}$/);
    expect(userData?.sha256_phone_number).toMatch(/^[0-9a-f]{64}$/);

    const serialized = JSON.stringify(userData);
    expect(serialized).not.toContain("@");
    expect(serialized).not.toContain("anna");
    expect(serialized).not.toContain("2345678");
  });

  it("liest gestashte Lead-Daten nur einmal und validiert das Hash-Format", () => {
    const valid = "b".repeat(64);
    window.sessionStorage.setItem(
      "lsb-gads-ud-evt-1",
      JSON.stringify({ sha256_email_address: valid, sha256_phone_number: "klartext@mail.de" })
    );

    const first = takeStashedLeadUserData("evt-1");
    expect(first).toEqual({ sha256_email_address: valid });
    // Klartext-ähnliche Werte werden verworfen, der Eintrag ist danach gelöscht.
    expect(takeStashedLeadUserData("evt-1")).toBeNull();
    expect(window.sessionStorage.getItem("lsb-gads-ud-evt-1")).toBeNull();
  });
});
