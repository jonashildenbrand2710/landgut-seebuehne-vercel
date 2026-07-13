// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_EVENT_NAME,
  CONSENT_STORAGE_KEY,
  LEGACY_CONSENT_STORAGE_KEY,
  readStoredConsent,
  storeConsent
} from "@/lib/consent";

beforeEach(() => {
  window.localStorage.clear();
});

describe("Consent-Speicher v2 mit Migration", () => {
  it("liefert null ohne gespeicherte Entscheidung", () => {
    expect(readStoredConsent()).toBeNull();
  });

  it("liest v2-Entscheidungen direkt", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    expect(readStoredConsent()).toBe("granted");

    window.localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
    expect(readStoredConsent()).toBe("denied");
  });

  it("übernimmt eine alte Ablehnung dauerhaft (Banner erscheint nicht erneut)", () => {
    window.localStorage.setItem(LEGACY_CONSENT_STORAGE_KEY, "denied");

    expect(readStoredConsent()).toBe("denied");
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("denied");
  });

  it("übernimmt eine alte Zustimmung NICHT, weil sie Google Ads nicht umfasste", () => {
    window.localStorage.setItem(LEGACY_CONSENT_STORAGE_KEY, "granted");

    // null = unentschieden -> Banner fragt mit erweitertem Umfang erneut.
    expect(readStoredConsent()).toBeNull();
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });

  it("ignoriert unbekannte Werte", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "kaputt");
    expect(readStoredConsent()).toBeNull();
  });
});

describe("storeConsent", () => {
  it("schreibt v2-Key und dispatcht das Consent-Event synchron", () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_EVENT_NAME, listener);

    storeConsent("granted");

    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("granted");
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toBe("granted");

    window.removeEventListener(CONSENT_EVENT_NAME, listener);
  });
});
