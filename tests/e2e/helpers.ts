import type { Page } from "@playwright/test";

export const GOOGLE_ADS_TAG_ID = "AW-16778828961";
export const LEAD_SEND_TO = `${GOOGLE_ADS_TAG_ID}/BvNBCOHEqbcaEKG54sA-`;
export const BOOKING_SEND_TO = `${GOOGLE_ADS_TAG_ID}/8y4TCI6h0ckcEKG54sA-`;
export const BLOCKED_LABELS = ["bFVdCP3XqbcaEKG54sA-", "u8DQCOTEqbcaEKG54sA-"];
export const CONSENT_KEY = "lsb-consent-v2";

export type ExternalRequestLog = {
  gtagScriptRequests: string[];
  otherGoogleRequests: string[];
  metaRequests: string[];
};

// Endlos-Animationen (CTA-Float, ScrollReveal) machen Elemente für Playwright
// dauerhaft "not stable" — für Interaktionstests deshalb global deaktivieren.
async function disableAnimations(page: Page) {
  await page.addInitScript(() => {
    const inject = () => {
      const style = document.createElement("style");
      style.textContent =
        "*, *::before, *::after { animation: none !important; transition: none !important; }";
      document.head.appendChild(style);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", inject);
    } else {
      inject();
    }
  });
}

// Fängt sämtliche externen Tracking-Domains ab: gtag.js wird durch einen
// harmlosen Stub ersetzt (damit keine echten Conversions bei Google landen),
// alle übrigen Google-/Meta-Tracking-Endpunkte werden blockiert und gezählt.
// Deaktiviert außerdem Animationen für stabile Interaktionen.
export async function guardExternalRequests(page: Page): Promise<ExternalRequestLog> {
  await disableAnimations(page);

  const log: ExternalRequestLog = {
    gtagScriptRequests: [],
    otherGoogleRequests: [],
    metaRequests: []
  };

  await page.route(/googleadservices\.com|doubleclick\.net|google-analytics\.com|googlesyndication\.com|google\.[a-z.]+\/(pagead|ccm)\//, (route) => {
    log.otherGoogleRequests.push(route.request().url());
    void route.abort();
  });

  await page.route(/googletagmanager\.com/, (route) => {
    const url = route.request().url();
    if (url.includes("/gtag/js")) {
      log.gtagScriptRequests.push(url);
      void route.fulfill({
        contentType: "application/javascript",
        body: "window.__gtagJsStubLoads = (window.__gtagJsStubLoads || 0) + 1;"
      });
      return;
    }
    log.otherGoogleRequests.push(url);
    void route.abort();
  });

  await page.route(/connect\.facebook\.net/, (route) => {
    log.metaRequests.push(route.request().url());
    void route.fulfill({
      contentType: "application/javascript",
      body: "window.__fbevents_stub = true;"
    });
  });

  await page.route(/https:\/\/www\.facebook\.com\//, (route) => {
    log.metaRequests.push(route.request().url());
    void route.abort();
  });

  return log;
}

// Liest den dataLayer als serialisierbare Arrays (gtag pusht arguments-Objekte).
export function getDataLayer(page: Page) {
  return page.evaluate(() =>
    ((window as unknown as { dataLayer?: unknown[] }).dataLayer || []).map((entry) => {
      try {
        return Array.from(entry as ArrayLike<unknown>).map((value) =>
          value instanceof Date ? "<date>" : value
        );
      } catch {
        return [entry];
      }
    })
  );
}

export async function getConversionEvents(page: Page) {
  const entries = await getDataLayer(page);
  return entries.filter((entry) => entry[0] === "event" && entry[1] === "conversion");
}

export async function getConsentEntries(page: Page, mode: "default" | "update") {
  const entries = await getDataLayer(page);
  return entries.filter((entry) => entry[0] === "consent" && entry[1] === mode);
}

export async function presetConsent(page: Page, choice: "granted" | "denied") {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    [CONSENT_KEY, choice]
  );
}

// Browserseitige Mocks für die Booking-API: Der Next-Server und das echte CRM
// werden nie erreicht, es entsteht keine echte Buchung.
export async function mockBookingApi(
  page: Page,
  options: { failBooking?: boolean; leadId?: string } = {}
) {
  const slotStart = new Date();
  slotStart.setDate(slotStart.getDate() + 1);
  slotStart.setHours(10, 0, 0, 0);
  const slot = {
    id: "slot-e2e-1",
    start: slotStart.toISOString(),
    end: new Date(slotStart.getTime() + 30 * 60_000).toISOString(),
    timezone: "Europe/Berlin"
  };

  await page.route(/\/api\/booking\/availability$/, (route) => {
    void route.fulfill({ json: { slots: [slot] } });
  });

  await page.route(/\/api\/booking\/book$/, (route) => {
    if (options.failBooking) {
      void route.fulfill({ status: 502, json: { error: "Booking API ist gerade nicht erreichbar." } });
      return;
    }

    const payload = route.request().postDataJSON() as { eventId?: string };
    void route.fulfill({
      json: {
        booking: { eventId: payload.eventId, status: "scheduled" },
        lead: { id: options.leadId ?? "lead-booking-e2e", leadNumber: 77, status: "scheduled" },
        google_calendar: { eventId: "gcal-e2e-1", synced: true },
        tracking: { capi_ready: true, eventId: payload.eventId }
      }
    });
  });
}

// Browserseitiger Mock für den Hochzeitsmappe-POST: antwortet wie der echte
// Endpoint mit einem 303-Redirect nach /danke — ohne dass ein Lead entsteht.
export async function mockHochzeitsmappeApi(
  page: Page,
  options: { leadId?: string | null } = {}
) {
  await page.route(/\/api\/hochzeitsmappe$/, (route) => {
    const params = new URLSearchParams(route.request().postData() || "");
    const eventId = params.get("metaEventId") || "hochzeitsmappe_fallback";
    const danke = new URLSearchParams({
      event_id: eventId,
      funnel: "hochzeitsmappe",
      meta_event: "CompleteRegistration",
      source: "hochzeitsmappe"
    });
    if (options.leadId !== null) {
      danke.set("lead_id", options.leadId ?? "lead-mappe-e2e");
    }

    void route.fulfill({
      status: 303,
      headers: {
        location: new URL(`/danke?${danke.toString()}`, route.request().url()).toString()
      }
    });
  });
}

export async function fillMappeForm(page: Page) {
  await page.locator('#mappe-form input[name="firstName"]').fill("Anna");
  await page.locator('#mappe-form input[name="lastName"]').fill("Beispiel");
  await page.locator('#mappe-form input[name="email"]').fill("anna.beispiel@example.com");
  await page.locator('#mappe-form input[name="phone"]').fill("0171 2345678");
}

// Durchläuft den Buchungs-Funnel bis zum Review-Schritt.
export async function walkBookingFunnelToReview(page: Page) {
  await page.goto("/termin-buchen");
  await page.locator(".booking-week-day.is-available").first().click();
  await page.locator(".booking-slot input[name='slot']").first().check();
  await page.getByRole("button", { name: "Weiter" }).click();

  await page.locator("input[name='name']").fill("Anna Beispiel");
  await page.locator("input[name='email']").fill("anna.beispiel@example.com");
  await page.locator("input[name='phone']").fill("0171 2345678");
  await page.getByRole("button", { name: "Weiter" }).click();

  // Eckpunkte sind optional -> direkt weiter zum Review ("Prüfen").
  // exact: true, weil der Stepper einen weiteren Button "4 Prüfen" enthält.
  await page.getByRole("button", { name: "Prüfen", exact: true }).click();
}
