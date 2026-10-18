import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";
import { createGoogleAdsLeadReceipt, verifyGoogleAdsLeadReceipt } from "../lib/google-ads-lead-receipt.ts";

process.env.HOCHZEITSMAPPE_MAGIC_LINK_SECRET = "test-only-key-that-is-at-least-32-characters";
Object.assign(process.env, {
  NEXT_PUBLIC_GOOGLE_ADS_ENABLED: "true", NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-123456789",
  NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL: "booking", NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: "lead"
});
const { createGoogleAdsTracker } = await import("../lib/google-ads.ts");

test("server receipt authenticates a persisted ID without exposing it or contact details", () => {
  const receipt = createGoogleAdsLeadReceipt("crm-lead-123", 1000);
  const verified = verifyGoogleAdsLeadReceipt(receipt, 1001);
  assert.match(verified.transactionId, /^lead_[a-f0-9]{64}$/);
  const decoded = Buffer.from(receipt.split(".")[0], "base64url").toString();
  assert.equal(decoded.includes("crm-lead-123"), false);
  assert.equal(createGoogleAdsLeadReceipt("", 1000), null);
  assert.equal(verifyGoogleAdsLeadReceipt(receipt, 2800), null);
  assert.equal(verifyGoogleAdsLeadReceipt(receipt, 999), null);
  const [body, signature] = receipt.split(".");
  assert.equal(verifyGoogleAdsLeadReceipt(`${body}.${signature.slice(0, -2)}XX`, 1001), null);
  assert.deepEqual(verifyGoogleAdsLeadReceipt(createGoogleAdsLeadReceipt("crm-lead-123", 1010), 1011), verified);
});

test("lead conversions require consent, a configured label and a server receipt ID; retries deduplicate", () => {
  const commands = [];
  const storage = new Map();
  const config = { tagId: "AW-123456789", bookingLabel: "booking", leadLabel: "lead" };
  const host = {
    command: (...args) => commands.push(args), disableAnalytics: () => {}, loadTag: () => {},
    pageLocation: () => "https://venue.example/hochzeitsmappe/online?token=private&email=private",
    storage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) }
  };
  const id = verifyGoogleAdsLeadReceipt(createGoogleAdsLeadReceipt("persisted-lead")).transactionId;
  const tracker = createGoogleAdsTracker(config, host);
  assert.equal(tracker.trackLead(id), false);
  tracker.setConsent(true);
  assert.equal(tracker.trackLead("button-click"), false);
  assert.equal(tracker.trackLead(id), true);
  assert.equal(tracker.trackLead(id), false);
  const replay = createGoogleAdsTracker(config, host);
  replay.setConsent(true);
  assert.equal(replay.trackLead(id), false);
  tracker.setConsent(false);
  assert.equal(tracker.trackLead(`lead_${"a".repeat(64)}`), false);
  const events = commands.filter(([kind]) => kind === "event");
  assert.deepEqual(events, [["event", "conversion", {
    send_to: "AW-123456789/lead", transaction_id: id,
    page_location: "https://venue.example/hochzeitsmappe/online", page_referrer: ""
  }]]);
  const noLabel = createGoogleAdsTracker({ ...config, leadLabel: undefined }, host);
  noLabel.setConsent(true);
  assert.equal(noLabel.trackLead(id), false);
});

// Resolve the same @/ imports as Next.js while exercising the real route handler.
const root = new URL("../", import.meta.url);
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const url = new URL(`${specifier.slice(2)}.ts`, root);
    if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
  }
  if (specifier === "next/server") return nextResolve("next/server.js", context);
  return nextResolve(specifier, context);
}, load(url, context, nextLoad) {
  if (url.startsWith(root.href) && url.endsWith(".ts")) {
    return {
      format: "module", shortCircuit: true,
      source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
      }).outputText
    };
  }
  return nextLoad(url, context);
} });

test("real lead route issues a receipt only after CRM persistence and delivery succeed", async (t) => {
  // All network calls are intercepted. Tests never send mail, create live leads,
  // or submit artificial conversions to Google.
  Object.assign(process.env, {
    NEXT_PUBLIC_GOOGLE_ADS_ENABLED: "true", NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-123456789",
    NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL: "booking", NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: "lead",
    SUPABASE_FUNCTIONS_URL: "https://crm.example/functions/v1", HOCHZEITSMAPPE_ACCESS_TOKEN: "test-only",
    CONTACT_FORM_ENDPOINT: "https://delivery.example/lead", ACTIVECAMPAIGN_API_KEY: "",
    CRM_API_KEY: "", META_CAPI_ACCESS_TOKEN: "", NEXT_PUBLIC_SITE_URL: "https://venue.example"
  });
  const { POST } = await import("../app/api/hochzeitsmappe/route.ts");
  let crmStatus = 200;
  let deliveryStatus = 200;
  let crmBody = { lead_id: "persisted-123" };
  const requests = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    requests.push([String(url), init.method]);
    if (String(url) === "https://crm.example/functions/v1/hochzeitsmappe-leads") {
      return Response.json(init.method === "POST" ? crmBody : {}, { status: crmStatus });
    }
    if (String(url) === "https://delivery.example/lead") return new Response("", { status: deliveryStatus });
    if (String(url) === "https://activecampaign.example/api/3/contact/sync") return Response.json({ contact: { id: "test-contact" } });
    if (String(url) === "https://activecampaign.example/api/3/contactAutomations") return Response.json({ contactAutomation: { id: "test-delivery" } });
    throw new Error("Unexpected external request in isolated tracking test");
  });
  const request = (consent = "granted", extra = {}) => {
    const data = new FormData();
    for (const [key, value] of Object.entries({ firstName: "Test", lastName: "Only", email: "test@example.invalid", phone: "+491234567890", googleAdsConsent: consent, ...extra })) data.set(key, value);
    return new Request("https://venue.example/api/hochzeitsmappe", { method: "POST", body: data });
  };
  const success = await POST(request());
  assert.equal(success.status, 303);
  const cookie = success.headers.get("set-cookie");
  assert.match(cookie, /lsb_ads_lead=/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /Path=\/hochzeitsmappe\/online/);
  assert.ok(verifyGoogleAdsLeadReceipt(cookie.split(";")[0].slice("lsb_ads_lead=".length)));
  assert.equal(success.headers.get("location").includes("lead_"), false);
  assert.equal((await POST(request("denied"))).headers.get("set-cookie"), null);
  assert.equal((await POST(request("granted", { email: "invalid" }))).headers.get("set-cookie"), null);
  assert.equal((await POST(request("granted", { website: "spam" }))).headers.get("set-cookie"), null);
  crmBody = {};
  assert.equal((await POST(request())).headers.get("set-cookie"), null);
  crmStatus = 503;
  assert.equal((await POST(request())).headers.get("set-cookie"), null);
  crmStatus = 200;
  crmBody = { lead_id: "persisted-123" };
  deliveryStatus = 503;
  assert.equal((await POST(request())).headers.get("set-cookie"), null);
  // The production ActiveCampaign path must issue the same receipt as fallback.
  Object.assign(process.env, {
    ACTIVECAMPAIGN_API_URL: "https://activecampaign.example", ACTIVECAMPAIGN_API_KEY: "test-only",
    ACTIVECAMPAIGN_HOCHZEITSMAPPE_AUTOMATION_ID: "1", ACTIVECAMPAIGN_HOCHZEITSMAPPE_LIST_ID: "",
    ACTIVECAMPAIGN_HOCHZEITSMAPPE_TAG_IDS: ""
  });
  assert.match((await POST(request())).headers.get("set-cookie"), /lsb_ads_lead=/);
  assert.ok(requests.length > 0);
});
