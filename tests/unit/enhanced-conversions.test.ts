import { describe, expect, it } from "vitest";
import { normalizeEmailForEnhancedConversions, normalizePhoneE164 } from "@/lib/google-ads";
import { hashEnhancedConversionValue } from "@/lib/google-ads-gtag";

describe("E-Mail-Normalisierung für Enhanced Conversions", () => {
  it("trimmt und schreibt klein", () => {
    expect(normalizeEmailForEnhancedConversions("  Anna.Muster@Example.DE ")).toBe(
      "anna.muster@example.de"
    );
  });

  it("lässt leere Werte leer", () => {
    expect(normalizeEmailForEnhancedConversions("   ")).toBe("");
  });
});

describe("Telefon-Normalisierung nach E.164", () => {
  it("wandelt deutsche 0-Präfix-Nummern auf +49", () => {
    expect(normalizePhoneE164("0171 234 56 78")).toBe("+491712345678");
  });

  it("behält vorhandene Ländervorwahl mit +", () => {
    expect(normalizePhoneE164("+49 9163 - 1455")).toBe("+4991631455");
    expect(normalizePhoneE164("+41 79 123 45 67")).toBe("+41791234567");
  });

  it("wandelt 00-Präfix in +", () => {
    expect(normalizePhoneE164("0049 171 2345678")).toBe("+491712345678");
  });

  it("verwirft zu kurze oder leere Eingaben", () => {
    expect(normalizePhoneE164("123")).toBe("");
    expect(normalizePhoneE164("")).toBe("");
  });
});

describe("SHA-256-Hashing gemäß Google-Vorgabe", () => {
  it("liefert lowercase Hex-SHA-256", async () => {
    // Bekannter Vektor: sha256("test@example.com")
    expect(await hashEnhancedConversionValue("test@example.com")).toBe(
      "973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b"
    );
  });

  it("hasht keine leeren Werte", async () => {
    expect(await hashEnhancedConversionValue("")).toBeNull();
  });
});
