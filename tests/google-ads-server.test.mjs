import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";

const root = new URL("../", import.meta.url);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const url = new URL(`${specifier.slice(2)}.ts`, root);
      if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
    }
    if (specifier === "next/server") return nextResolve("next/server.js", context);
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith(root.href) && url.endsWith(".ts")) return {
      format: "module", shortCircuit: true,
      source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
      }).outputText
    };
    return nextLoad(url, context);
  }
});
Object.assign(process.env, {
  NEXT_PUBLIC_META_PIXEL_ID: "123456789",
  NEXT_PUBLIC_GOOGLE_ADS_ENABLED: "true", NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-123456789",
  NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL: "booking", NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: "lead",
  NEXT_PUBLIC_GOOGLE_ADS_SERVER_ENABLED: "true", GOOGLE_ADS_SERVER_ENABLED: "true",
  GOOGLE_DATA_MANAGER_CLIENT_ID: "test-client", GOOGLE_DATA_MANAGER_CLIENT_SECRET: "test-secret",
  GOOGLE_DATA_MANAGER_REFRESH_TOKEN: "test-refresh", GOOGLE_DATA_MANAGER_CUSTOMER_ID: "1234567890",
  GOOGLE_DATA_MANAGER_LOGIN_CUSTOMER_ID: "9876543210", GOOGLE_DATA_MANAGER_LEAD_ACTION_ID: "123",
  GOOGLE_DATA_MANAGER_BOOKING_ACTION_ID: "456", HOCHZEITSMAPPE_MAGIC_LINK_SECRET: "test-only-map-secret-at-least-32-characters",
  SUPABASE_FUNCTIONS_URL: "https://crm.example/functions/v1", HOCHZEITSMAPPE_ACCESS_TOKEN: "test-only",
  CONTACT_FORM_ENDPOINT: "https://delivery.example/lead", ACTIVECAMPAIGN_API_KEY: "", CRM_API_KEY: "",
  META_CAPI_ACCESS_TOKEN: "", TIKTOK_EVENTS_API_TOKEN: "", NEXT_PUBLIC_SITE_URL: "https://venue.example",
  CRM_BOOKING_API_URL: "https://booking.example", CRM_BOOKING_API_TOKEN: "test-only",
  BOOKING_CONFIRMATION_PROVIDER: "activecampaign"
});
const { readGoogleAdsAttribution, parseGoogleAdsAttribution, captureGoogleAdsAttribution, browserGoogleAdsAttribution, GOOGLE_ADS_ATTRIBUTION_KEY } = await import("../lib/google-ads-attribution.ts");
const { googleAdsServerPayload, googleAdsServerConfig, sendGoogleAdsServerConversion } = await import("../lib/google-ads-server.ts");
const { createGoogleAdsLeadReceipt, verifyGoogleAdsLeadReceipt } = await import("../lib/google-ads-lead-receipt.ts");
const { CONSENT_STORAGE_KEY } = await import("../lib/consent.ts");
const config = googleAdsServerConfig();
const event = { kind: "lead", transactionId: `lead_${"a".repeat(64)}`, consent: "granted", attribution: { gclid: "test-click" } };

test("no click information is read without consent; attribution expires and ignores unrelated data", () => {
  const storage = { getItem: () => { throw new Error("must not read"); } };
  assert.deepEqual(readGoogleAdsAttribution(false, "https://venue.example/?gclid=private", storage), {});
  assert.deepEqual(parseGoogleAdsAttribution({ gclid: "good_id", gbraid: "another_click", email: "private@example.invalid" }), { gclid: "good_id" });
  assert.deepEqual(parseGoogleAdsAttribution({ gclid: "private@example.invalid" }), {});
  const saved = { getItem: () => JSON.stringify({ capturedAt: 1000, click: { wbraid: "saved_click" } }) };
  assert.deepEqual(readGoogleAdsAttribution(true, "https://venue.example/booking", saved, 1001), { wbraid: "saved_click" });
  assert.deepEqual(readGoogleAdsAttribution(true, "https://venue.example/booking", saved, 1000 + 30*24*60*60*1000), {});
  assert.deepEqual(readGoogleAdsAttribution(true, "https://venue.example/?gclid=new_click", saved, 1001), { gclid: "new_click" });
});

test("consented navigation keeps click attribution in this tab; rejection removes it", (t) => {
  const session = new Map();
  const consent = new Map([[CONSENT_STORAGE_KEY, "granted"]]);
  const previousWindow = globalThis.window;
  t.after(() => { if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow; });
  globalThis.window = {
    location: { href: "https://venue.example/?gclid=landing_click" },
    sessionStorage: { getItem: (k) => session.get(k), setItem: (k,v) => session.set(k,v), removeItem: (k) => session.delete(k) },
    localStorage: { getItem: (k) => consent.get(k) }
  };
  captureGoogleAdsAttribution(true);
  window.location.href = "https://venue.example/termin-buchen";
  assert.deepEqual(browserGoogleAdsAttribution(), { gclid: "landing_click" });
  consent.set(CONSENT_STORAGE_KEY, "denied");
  assert.deepEqual(browserGoogleAdsAttribution(), {});
  captureGoogleAdsAttribution(false);
  assert.equal(session.has(GOOGLE_ADS_ATTRIBUTION_KEY), false);
});

test("server events require explicit consent and an opaque transaction, send only allowed fields", () => {
  for (const consent of [undefined, "denied", "", true, "GRANTED"]) assert.equal(googleAdsServerPayload({ ...event, consent }, config), null);
  assert.equal(googleAdsServerPayload({ ...event, attribution: {} }, config), null);
  assert.equal(googleAdsServerPayload({ ...event, transactionId: "test@example.invalid" }, config), null);
  const payload = googleAdsServerPayload({ ...event, attribution: { gclid: "test-click", email: "private@example.invalid", phone: "private" } }, config, new Date("2026-10-18T10:00:00Z"));
  assert.deepEqual(payload.events, [{ eventSource: "WEB", eventTimestamp: "2026-10-18T10:00:00.000Z", transactionId: event.transactionId, adIdentifiers: { gclid: "test-click" } }]);
  assert.deepEqual(payload.consent, { adUserData: "CONSENT_GRANTED", adPersonalization: "CONSENT_DENIED" });
  assert.equal(JSON.stringify(payload).includes("private"), false);
  assert.equal(payload.destinations[0].productDestinationId, "123");
});

test("direct delivery retries transient errors with identical IDs and keeps failures out of the enquiry result", async (t) => {
  const sent = [];
  let status = 503;
  t.mock.method(console, "info", () => {});
  t.mock.method(console, "error", () => {});
  t.mock.method(globalThis, "fetch", async (url, init) => {
    if (String(url) === "https://oauth2.googleapis.com/token") return Response.json({ access_token: "test-only", expires_in: 3600, scope: "https://www.googleapis.com/auth/datamanager" });
    assert.equal(String(url), "https://datamanager.googleapis.com/v1/events:ingest");
    sent.push(JSON.parse(init.body));
    if (sent.length === 1) return Response.json({ error: { status: "UNAVAILABLE" } }, { status: 503 });
    return status === 200 ? Response.json({ requestId: "test-request" }) : Response.json({ error: { status: "PERMISSION_DENIED" } }, { status });
  });
  status = 200;
  assert.deepEqual(await sendGoogleAdsServerConversion(event), { status: "accepted", requestId: "test-request" });
  assert.deepEqual(sent[0], sent[1]);
  const before = sent.length;
  assert.equal((await sendGoogleAdsServerConversion({ ...event, consent: "denied" })).status, "skipped");
  assert.equal(sent.length, before);
  status = 403;
  assert.equal((await sendGoogleAdsServerConversion(event)).status, "failed");
  assert.equal(sent.length, before + 1);
  process.env.GOOGLE_ADS_SERVER_ENABLED = "false";
  assert.equal((await sendGoogleAdsServerConversion(event)).status, "disabled");
  process.env.GOOGLE_ADS_SERVER_ENABLED = "true";
});

test("confirmed lead route sends the exact browser receipt ID; invalid, denied and failed enquiries never upload", async (t) => {
  const { POST } = await import("../app/api/hochzeitsmappe/route.ts");
  let deliveryStatus = 200;
  const uploads = [];
  t.mock.method(console, "info", () => {});
  t.mock.method(console, "error", () => {});
  t.mock.method(globalThis, "fetch", async (url, init) => {
    const href = String(url);
    if (href === "https://crm.example/functions/v1/hochzeitsmappe-leads") return Response.json(init.method === "POST" ? { lead_id: "crm-123" } : {});
    if (href === "https://delivery.example/lead") return new Response("", { status: deliveryStatus });
    if (href === "https://datamanager.googleapis.com/v1/events:ingest") { uploads.push(JSON.parse(init.body)); return Response.json({ requestId: "test-request" }); }
    throw new Error("Unexpected external request");
  });
  const request = (extra = {}) => {
    const form = new FormData();
    for (const [k,v] of Object.entries({ firstName: "Test", lastName: "Only", email: "test@example.invalid", phone: "+491234567890", googleAdsConsent: "granted", googleAdsAttribution: '{"gclid":"test-click"}', ...extra })) form.set(k,v);
    return new Request("https://venue.example/api/hochzeitsmappe", { method: "POST", body: form });
  };
  const result = await POST(request());
  const receipt = result.headers.get("set-cookie").split(";")[0].slice("lsb_ads_lead=".length);
  assert.equal(uploads[0].events[0].transactionId, verifyGoogleAdsLeadReceipt(receipt).transactionId);
  assert.equal(uploads[0].events[0].transactionId, verifyGoogleAdsLeadReceipt(createGoogleAdsLeadReceipt("crm-123")).transactionId);
  await POST(request({ googleAdsConsent: "denied" }));
  await POST(request({ googleAdsAttribution: "{}" }));
  await POST(request({ email: "bad" }));
  deliveryStatus = 503;
  await POST(request());
  assert.equal(uploads.length, 1);
});

test("booking route uploads only confirmed calendar bookings with explicit consent; Ads failure leaves booking successful", async (t) => {
  const { POST } = await import("../app/api/booking/book/route.ts");
  let synced = true;
  let adsStatus = 200;
  const uploads = [];
  t.mock.method(console, "info", () => {});
  t.mock.method(console, "error", () => {});
  t.mock.method(globalThis, "fetch", async (url, init) => {
    if (String(url) === "https://booking.example/book") return Response.json({ booking: { status: "confirmed" }, google_calendar: { synced, eventId: synced ? "calendar-confirmed" : undefined } });
    if (String(url) === "https://datamanager.googleapis.com/v1/events:ingest") { uploads.push(JSON.parse(init.body)); return adsStatus === 200 ? Response.json({ requestId: "test-request" }) : Response.json({ error: { status: "PERMISSION_DENIED" } }, { status: adsStatus }); }
    throw new Error("Unexpected external request");
  });
  const id = "erstgespraech_12345678-1234-1234-1234-123456789012";
  const request = (consent = "granted") => new Request("https://venue.example/api/booking/book", { method: "POST", body: JSON.stringify({
    eventId: id, booking: { type: "phone", slot: { start: "2026-11-01T10:00:00Z", end: "2026-11-01T10:30:00Z" } },
    contact: { email: "test@example.invalid", phone: "+491234567890", name: "Test Only" },
    tracking: { marketingConsent: consent, googleAdsAttribution: { gclid: "test-click" } }, source: { page: "/termin-buchen" }
  }) });
  assert.equal((await POST(request())).status, 200);
  assert.equal(uploads[0].events[0].transactionId, id);
  assert.equal(uploads[0].destinations[0].productDestinationId, "456");
  await POST(request("denied"));
  synced = false;
  await POST(request());
  assert.equal(uploads.length, 1);
  synced = true; adsStatus = 403;
  assert.equal((await POST(request())).status, 200);
  assert.equal(uploads.length, 2);
});


test("Meta server delivery also requires explicit opt-in, independently of its access token", async (t) => {
  const { sendMetaCompleteRegistration } = await import("../lib/meta-capi.ts");
  process.env.META_CAPI_ACCESS_TOKEN = "test-meta-token";
  const requests = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    requests.push({ url: String(url), body: JSON.parse(init.body) });
    return Response.json({ events_received: 1 });
  });
  const input = {
    email: "test@example.invalid", eventId: "test-event", eventSourceUrl: "https://venue.example/hochzeitsmappe",
    funnel: "hochzeitsmappe", request: new Request("https://venue.example/api/hochzeitsmappe")
  };
  for (const marketingConsent of [undefined, "denied", "", true]) {
    assert.equal((await sendMetaCompleteRegistration({ ...input, tracking: { marketingConsent } })).skipped, true);
  }
  assert.equal(requests.length, 0);
  assert.equal((await sendMetaCompleteRegistration({ ...input, tracking: { marketingConsent: "granted" } })).skipped, false);
  assert.equal(requests.length, 1);
  process.env.META_CAPI_ACCESS_TOKEN = "";
});
