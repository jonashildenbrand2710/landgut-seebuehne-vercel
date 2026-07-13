import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import {
  BLOCKED_LABELS,
  BOOKING_SEND_TO,
  CONSENT_KEY,
  fillMappeForm,
  getConsentEntries,
  getConversionEvents,
  getDataLayer,
  guardExternalRequests,
  GOOGLE_ADS_TAG_ID,
  LEAD_SEND_TO,
  mockBookingApi,
  mockHochzeitsmappeApi,
  presetConsent,
  walkBookingFunnelToReview
} from "./helpers";

const DENIED = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
};

const GRANTED = {
  ad_storage: "granted",
  analytics_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted"
};

test.describe("Consent Mode v2 und Tag-Ladeverhalten", () => {
  test("ohne gespeicherten Consent: alle vier Signale denied, keine Google-Requests", async ({ page }) => {
    const log = await guardExternalRequests(page);
    await page.goto("/");

    const defaults = await getConsentEntries(page, "default");
    expect(defaults).toHaveLength(1);
    expect(defaults[0][2]).toEqual(DENIED);

    // Der Consent-Default ist das allererste Google-Kommando.
    const dataLayer = await getDataLayer(page);
    expect(dataLayer[0]).toEqual(["consent", "default", DENIED]);

    expect(log.gtagScriptRequests).toHaveLength(0);
    expect(log.otherGoogleRequests).toHaveLength(0);
    await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  });

  test("'Nur notwendige' lädt weder Google Tag noch Meta Pixel und feuert keine Conversion", async ({ page }) => {
    const log = await guardExternalRequests(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Nur notwendige" }).click();
    await expect
      .poll(() => page.evaluate((key) => window.localStorage.getItem(key), CONSENT_KEY))
      .toBe("denied");

    expect(log.gtagScriptRequests).toHaveLength(0);
    expect(log.metaRequests).toHaveLength(0);
    expect(await getConversionEvents(page)).toHaveLength(0);
    await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
    await expect(page.locator('script[src*="connect.facebook.net"]')).toHaveCount(0);
  });

  test("'Einverstanden' setzt Consent auf granted, lädt den Google Tag genau einmal und bewahrt Meta", async ({ page }) => {
    const log = await guardExternalRequests(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Einverstanden" }).click();

    // Noch auf derselben Seite: Update auf granted, danach Tag-Load.
    await expect.poll(() => getConsentEntries(page, "update").then((u) => u.length)).toBe(1);
    expect((await getConsentEntries(page, "update"))[0][2]).toEqual(GRANTED);

    await expect.poll(() => log.gtagScriptRequests.length).toBe(1);
    expect(log.gtagScriptRequests[0]).toContain(`id=${GOOGLE_ADS_TAG_ID}`);
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1);

    const configs = (await getDataLayer(page)).filter(
      (entry) => entry[0] === "config" && entry[1] === GOOGLE_ADS_TAG_ID
    );
    expect(configs).toHaveLength(1);

    // Meta Pixel bleibt erhalten (fbevents.js wird weiterhin angefordert).
    await expect.poll(() => log.metaRequests.length).toBeGreaterThan(0);

    // Folgeseite: Einwilligung wird wiederhergestellt, Banner bleibt weg,
    // der Tag wird für das neue Dokument erneut genau einmal geladen.
    await page.goto("/hochzeitsmappe");
    await expect(page.getByRole("button", { name: "Einverstanden" })).toHaveCount(0);
    await expect.poll(() => log.gtagScriptRequests.length).toBe(2);
    expect((await getConsentEntries(page, "update"))[0][2]).toEqual(GRANTED);
  });

  test("Widerruf über Cookie-Einstellungen setzt denied und blockiert spätere Events", async ({ page }) => {
    const log = await guardExternalRequests(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Einverstanden" }).click();
    await expect.poll(() => log.gtagScriptRequests.length).toBe(1);

    await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
    await page.getByRole("button", { name: "Nur notwendige" }).click();

    await expect
      .poll(() => page.evaluate((key) => window.localStorage.getItem(key), CONSENT_KEY))
      .toBe("denied");
    const updates = await getConsentEntries(page, "update");
    expect(updates[updates.length - 1][2]).toEqual(DENIED);

    // Spätere Conversion-Gelegenheiten feuern nicht mehr.
    await page.goto("/danke?lead_id=revoked-lead-1&event_id=evt-revoked");
    expect(await getConversionEvents(page)).toHaveLength(0);
  });
});

test.describe("Lead-Conversion (generate_leads_conv) auf /hochzeitsmappe", () => {
  test("serverseitig bestätigter Lead feuert genau einmal mit stabiler transaction_id", async ({ page }) => {
    const log = await guardExternalRequests(page);
    await presetConsent(page, "granted");
    await mockHochzeitsmappeApi(page, { leadId: "lead-mappe-e2e-1" });

    await page.goto("/hochzeitsmappe");
    await fillMappeForm(page);
    await page.getByRole("button", { name: "Jetzt Hochzeitsmappe erhalten" }).click();

    await page.waitForURL(/\/danke\?/);
    await expect.poll(() => getConversionEvents(page).then((c) => c.length)).toBe(1);

    const conversions = await getConversionEvents(page);
    expect(conversions[0][2]).toEqual({
      send_to: LEAD_SEND_TO,
      transaction_id: "lead-mappe-e2e-1"
    });

    // Enhanced Conversions: user_data enthält ausschließlich SHA-256-Hashes.
    const dataLayer = await getDataLayer(page);
    const userDataEntries = dataLayer.filter(
      (entry) => entry[0] === "set" && entry[1] === "user_data"
    );
    expect(userDataEntries).toHaveLength(1);
    const userData = userDataEntries[0][2] as Record<string, string>;
    expect(userData.sha256_email_address).toMatch(/^[0-9a-f]{64}$/);
    expect(userData.sha256_phone_number).toMatch(/^[0-9a-f]{64}$/);

    // Keine Klartext-PII und keine gesperrten Ziele im dataLayer oder der URL.
    const serialized = JSON.stringify(dataLayer);
    expect(serialized).not.toContain("anna.beispiel@example.com");
    expect(serialized).not.toContain("2345678");
    for (const label of BLOCKED_LABELS) {
      expect(serialized).not.toContain(label);
    }
    expect(page.url()).not.toContain("anna");
    expect(page.url()).not.toContain("%40");

    // Der sessionStorage-Zwischenspeicher ist nach dem Event geleert.
    const stashedKeys = await page.evaluate(() =>
      Object.keys(window.sessionStorage).filter((key) => key.startsWith("lsb-gads-ud-"))
    );
    expect(stashedKeys).toHaveLength(0);

    // Reload der Bestätigungsseite erzeugt kein Duplikat.
    await page.reload();
    await page.waitForTimeout(800);
    expect(await getConversionEvents(page)).toHaveLength(0);

    expect(log.otherGoogleRequests).toHaveLength(0);
  });

  test("ohne persistierten Lead (kein lead_id) feuert keine Conversion", async ({ page }) => {
    await guardExternalRequests(page);
    await presetConsent(page, "granted");
    await mockHochzeitsmappeApi(page, { leadId: null });

    await page.goto("/hochzeitsmappe");
    await fillMappeForm(page);
    await page.getByRole("button", { name: "Jetzt Hochzeitsmappe erhalten" }).click();

    await page.waitForURL(/\/danke\?/);
    await page.waitForTimeout(800);
    expect(await getConversionEvents(page)).toHaveLength(0);
  });

  test("vor Consent werden keine Enhanced-Conversion-Daten verarbeitet und nichts gefeuert", async ({ page }) => {
    const log = await guardExternalRequests(page);
    await mockHochzeitsmappeApi(page, { leadId: "lead-mappe-e2e-2" });

    await page.goto("/hochzeitsmappe");
    await fillMappeForm(page);
    await page.getByRole("button", { name: "Jetzt Hochzeitsmappe erhalten" }).click();

    await page.waitForURL(/\/danke\?/);
    await page.waitForTimeout(800);

    expect(await getConversionEvents(page)).toHaveLength(0);
    expect(log.gtagScriptRequests).toHaveLength(0);

    const stashedKeys = await page.evaluate(() =>
      Object.keys(window.sessionStorage).filter((key) => key.startsWith("lsb-gads-ud-"))
    );
    expect(stashedKeys).toHaveLength(0);

    const userDataEntries = (await getDataLayer(page)).filter(
      (entry) => entry[0] === "set" && entry[1] === "user_data"
    );
    expect(userDataEntries).toHaveLength(0);
  });
});

test.describe("Buchungs-Conversion (Termin erfolgreich gebucht) auf /termin-buchen", () => {
  test("serverseitig bestätigte Buchung feuert genau einmal mit stabiler transaction_id", async ({ page }) => {
    const log = await guardExternalRequests(page);
    await presetConsent(page, "granted");
    await mockBookingApi(page, { leadId: "lead-booking-e2e-1" });

    await walkBookingFunnelToReview(page);
    await page.getByRole("button", { name: "Termin buchen" }).click();

    await expect(page.getByRole("heading", { name: "Termin ist gebucht." })).toBeVisible();
    await expect.poll(() => getConversionEvents(page).then((c) => c.length)).toBe(1);

    const conversions = await getConversionEvents(page);
    expect(conversions[0][2]).toEqual({
      send_to: BOOKING_SEND_TO,
      transaction_id: "lead-booking-e2e-1"
    });

    const dataLayer = await getDataLayer(page);
    const userDataEntries = dataLayer.filter(
      (entry) => entry[0] === "set" && entry[1] === "user_data"
    );
    expect(userDataEntries).toHaveLength(1);
    const userData = userDataEntries[0][2] as Record<string, string>;
    expect(userData.sha256_email_address).toMatch(/^[0-9a-f]{64}$/);
    expect(userData.sha256_phone_number).toMatch(/^[0-9a-f]{64}$/);

    const serialized = JSON.stringify(dataLayer);
    expect(serialized).not.toContain("anna.beispiel@example.com");
    for (const label of BLOCKED_LABELS) {
      expect(serialized).not.toContain(label);
    }

    expect(log.otherGoogleRequests).toHaveLength(0);
  });

  test("API-Fehler erzeugt keine Conversion", async ({ page }) => {
    await guardExternalRequests(page);
    await presetConsent(page, "granted");
    await mockBookingApi(page, { failBooking: true });

    await walkBookingFunnelToReview(page);
    await page.getByRole("button", { name: "Termin buchen" }).click();

    await expect(page.locator(".booking-error")).toBeVisible();
    await page.waitForTimeout(500);
    expect(await getConversionEvents(page)).toHaveLength(0);
  });

  test("Client-Validierungsfehler erzeugt keine Conversion", async ({ page }) => {
    await guardExternalRequests(page);
    await presetConsent(page, "granted");
    await mockBookingApi(page);

    await page.goto("/termin-buchen");
    await page.locator(".booking-week-day.is-available").first().click();
    await page.locator(".booking-slot input[name='slot']").first().check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.locator("input[name='name']").fill("Anna Beispiel");
    await page.locator("input[name='email']").fill("keine-mail");
    await page.locator("input[name='phone']").fill("123");

    // Der Funnel blockiert den nächsten Schritt und meldet die Fehler.
    await expect(page.getByRole("button", { name: "Weiter" })).toBeDisabled();
    await expect(page.locator(".booking-field-message").first()).toBeVisible();
    expect(await getConversionEvents(page)).toHaveLength(0);
  });
});

test.describe("Öffentlicher Tracking-Handshake und Landingpages", () => {
  test("/.well-known/advertising-tracking.json liefert exakt den Vertrag", async ({ request }) => {
    const response = await request.get("/.well-known/advertising-tracking.json");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(response.headers()["cache-control"]).toBe("public, max-age=300");

    const expected = JSON.parse(
      readFileSync(
        fileURLToPath(new URL("../../public/.well-known/advertising-tracking.json", import.meta.url)),
        "utf8"
      )
    );
    expect(await response.json()).toEqual(expected);
  });

  test("alle fünf relevanten Seiten antworten erfolgreich", async ({ request }) => {
    for (const path of ["/", "/termin-buchen", "/kontaktformular", "/formular", "/hochzeitsmappe"]) {
      const response = await request.get(path);
      expect(response.status(), `${path} sollte 200 liefern`).toBe(200);
    }
  });
});
