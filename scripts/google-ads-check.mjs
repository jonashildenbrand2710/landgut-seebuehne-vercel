import dns from "node:dns/promises";

import { googleScopes, loadGoogleEnv, optionalEnv, validAccessToken } from "./google-env.mjs";

const results = [];

function record(status, area, message, detail = "") {
  results.push({ status, area, message, detail });
}

function normalizeCustomerId(value) {
  return value.replaceAll("-", "").trim();
}

function apiVersion() {
  const configured = optionalEnv("GOOGLE_ADS_API_VERSION", "v24").trim();
  return configured.startsWith("v") ? configured : `v${configured}`;
}

function normalizeDnsName(value) {
  return value.replace(/\.$/, "").toLowerCase();
}

async function resolveDns(hostname, type) {
  try {
    if (type === "A") {
      return await dns.resolve4(hostname);
    }

    if (type === "CNAME") {
      return await dns.resolveCname(hostname);
    }
  } catch (error) {
    if (["ENODATA", "ENOTFOUND"].includes(error.code)) {
      return [];
    }

    throw error;
  }

  return [];
}

async function checkDns({ apexHost, wwwHost }) {
  const expectedA = optionalEnv("VERCEL_EXPECTED_APEX_A", "76.76.21.21");
  const expectedWwwCname = normalizeDnsName(
    optionalEnv("VERCEL_EXPECTED_WWW_CNAME", "cname.vercel-dns-0.com")
  );
  const acceptedWwwA = optionalEnv("VERCEL_ACCEPTED_WWW_A", expectedA);

  try {
    const apexA = await resolveDns(apexHost, "A");
    const detail = apexA.length ? apexA.join(", ") : "no A record";

    if (apexA.includes(expectedA)) {
      record("OK", "DNS", `${apexHost} has expected Vercel A record.`, detail);
    } else {
      record("FAIL", "DNS", `${apexHost} does not resolve to the expected Vercel A record.`, detail);
    }
  } catch (error) {
    record("FAIL", "DNS", `Could not resolve A records for ${apexHost}.`, error.message);
  }

  try {
    const wwwA = await resolveDns(wwwHost, "A");
    const wwwCname = await resolveDns(wwwHost, "CNAME");
    const normalizedCnames = wwwCname.map((value) => normalizeDnsName(value));
    const detail = [
      wwwCname.length ? `CNAME ${wwwCname.join(", ")}` : "no CNAME",
      wwwA.length ? `A ${wwwA.join(", ")}` : "no A"
    ].join("; ");

    if (normalizedCnames.includes(expectedWwwCname)) {
      record("OK", "DNS", `${wwwHost} has expected Vercel CNAME.`, detail);
    } else if (acceptedWwwA && wwwA.includes(acceptedWwwA)) {
      record("OK", "DNS", `${wwwHost} has accepted Vercel A record.`, detail);
    } else if (wwwA.length) {
      record("WAIT", "DNS", `${wwwHost} resolves, but not through the expected CNAME.`, detail);
    } else {
      record("FAIL", "DNS", `${wwwHost} does not resolve.`, detail);
    }
  } catch (error) {
    record("FAIL", "DNS", `Could not resolve DNS records for ${wwwHost}.`, error.message);
  }
}

async function headWithRedirects(startUrl, limit = 5) {
  const chain = [];
  let currentUrl = startUrl;

  for (let index = 0; index <= limit; index += 1) {
    const response = await fetch(currentUrl, {
      method: "HEAD",
      redirect: "manual"
    });
    const location = response.headers.get("location");

    chain.push({
      url: currentUrl,
      status: response.status,
      location
    });

    if (response.status < 300 || response.status >= 400 || !location) {
      return chain;
    }

    currentUrl = new URL(location, currentUrl).toString();
  }

  throw new Error(`Too many redirects for ${startUrl}`);
}

function chainSummary(chain) {
  return chain
    .map((entry) => `${entry.status} ${entry.url}${entry.location ? ` -> ${entry.location}` : ""}`)
    .join(" | ");
}

async function checkHttp({ apexHost, canonicalSiteUrl }) {
  const apexUrl = `https://${apexHost}/`;

  try {
    const chain = await headWithRedirects(apexUrl);
    const finalEntry = chain.at(-1);
    const finalUrl = new URL(finalEntry.url);
    const canonicalUrl = new URL(canonicalSiteUrl);
    const okStatus = finalEntry.status >= 200 && finalEntry.status < 400;
    const canonicalHost = finalUrl.hostname === canonicalUrl.hostname;

    if (okStatus && canonicalHost && chain.length > 1) {
      record("OK", "HTTP", `${apexUrl} redirects to the canonical host.`, chainSummary(chain));
    } else if (okStatus && canonicalHost) {
      record("OK", "HTTP", `${apexUrl} is reachable on the canonical host.`, chainSummary(chain));
    } else {
      record("FAIL", "HTTP", `${apexUrl} does not finish on the canonical host.`, chainSummary(chain));
    }
  } catch (error) {
    record("FAIL", "HTTP", `${apexUrl} is not reachable.`, error.message);
  }

  for (const path of ["/", "/robots.txt", "/sitemap.xml", "/impressum"]) {
    const url = `${canonicalSiteUrl}${path}`;

    try {
      const chain = await headWithRedirects(url);
      const finalEntry = chain.at(-1);

      if (finalEntry.status >= 200 && finalEntry.status < 300) {
        record("OK", "HTTP", `${url} returns HTTP ${finalEntry.status}.`, chainSummary(chain));
      } else {
        record("FAIL", "HTTP", `${url} did not return HTTP 2xx.`, chainSummary(chain));
      }
    } catch (error) {
      record("FAIL", "HTTP", `${url} is not reachable.`, error.message);
    }
  }
}

function googleAdsHeaders(accessToken, developerToken, loginCustomerId = "") {
  return {
    accept: "application/json",
    authorization: `Bearer ${accessToken}`,
    "developer-token": developerToken,
    ...(loginCustomerId ? { "login-customer-id": loginCustomerId } : {})
  };
}

function googleAdsErrorSummary(body) {
  const error = body?.error;

  if (!error) {
    return "Unknown Google Ads API error.";
  }

  const apiErrors = error.details
    ?.flatMap((detail) => detail.errors ?? [])
    ?.map((entry) => Object.keys(entry.errorCode ?? {}).join(",") || entry.message)
    ?.filter(Boolean);

  return [error.code, error.status, apiErrors?.[0] || error.message].filter(Boolean).join(" ");
}

function isWaitingForAdsAccess(body, status) {
  const summary = googleAdsErrorSummary(body).toLowerCase();

  return (
    status === 403 &&
    (summary.includes("developer_token") ||
      summary.includes("developer token") ||
      summary.includes("api has not been used") ||
      summary.includes("permission_denied"))
  );
}

async function googleAdsRequest(pathname, options = {}) {
  const response = await fetch(`https://googleads.googleapis.com/${apiVersion()}${pathname}`, options);
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  return { response, body };
}

async function checkGoogleAdsApi() {
  const scopes = googleScopes();
  const adsScope = "https://www.googleapis.com/auth/adwords";
  const developerToken = optionalEnv("GOOGLE_ADS_DEVELOPER_TOKEN");
  const customerId = normalizeCustomerId(optionalEnv("GOOGLE_ADS_CUSTOMER_ID"));
  const loginCustomerId = normalizeCustomerId(optionalEnv("GOOGLE_ADS_LOGIN_CUSTOMER_ID"));

  if (!scopes.includes(adsScope)) {
    record("WAIT", "Google Ads API", `OAuth scope ${adsScope} is not configured.`);
    return;
  }

  if (!developerToken) {
    record("WAIT", "Google Ads API", "Missing GOOGLE_ADS_DEVELOPER_TOKEN.");
    return;
  }

  let accessToken;

  try {
    accessToken = await validAccessToken();
  } catch (error) {
    record("WAIT", "Google Ads API", "Missing or expired Google OAuth token.", error.message);
    return;
  }

  try {
    const { response, body } = await googleAdsRequest("/customers:listAccessibleCustomers", {
      headers: googleAdsHeaders(accessToken, developerToken)
    });

    if (response.ok) {
      record(
        "OK",
        "Google Ads API",
        "Read-only accessible-customer check succeeded.",
        `${body.resourceNames?.length ?? 0} accessible customer resource(s)`
      );
    } else if (isWaitingForAdsAccess(body, response.status)) {
      record("WAIT", "Google Ads API", "WAIT Production API access.", googleAdsErrorSummary(body));
      return;
    } else {
      record("FAIL", "Google Ads API", "Accessible-customer check failed.", googleAdsErrorSummary(body));
      return;
    }
  } catch (error) {
    record("FAIL", "Google Ads API", "Accessible-customer check failed.", error.message);
    return;
  }

  if (!customerId) {
    record("WAIT", "Google Ads API", "Missing GOOGLE_ADS_CUSTOMER_ID for account-level read check.");
    return;
  }

  try {
    const { response, body } = await googleAdsRequest(`/customers/${customerId}/googleAds:searchStream`, {
      method: "POST",
      headers: {
        ...googleAdsHeaders(accessToken, developerToken, loginCustomerId),
        "content-type": "application/json"
      },
      body: JSON.stringify({
        query:
          "SELECT customer.id, customer.descriptive_name, customer.currency_code, customer.time_zone FROM customer LIMIT 1"
      })
    });

    if (response.ok) {
      record("OK", "Google Ads API", "Read-only customer query succeeded.");
    } else if (isWaitingForAdsAccess(body, response.status)) {
      record("WAIT", "Google Ads API", "WAIT Production API access.", googleAdsErrorSummary(body));
    } else {
      record("FAIL", "Google Ads API", "Read-only customer query failed.", googleAdsErrorSummary(body));
    }
  } catch (error) {
    record("FAIL", "Google Ads API", "Read-only customer query failed.", error.message);
  }
}

function printResults() {
  for (const result of results) {
    const detail = result.detail ? ` (${result.detail})` : "";
    console.log(`[${result.status}] ${result.area}: ${result.message}${detail}`);
  }

  const fails = results.filter((result) => result.status === "FAIL").length;
  const waits = results.filter((result) => result.status === "WAIT").length;
  const ok = results.filter((result) => result.status === "OK").length;

  console.log(`\nSummary: ${ok} OK, ${waits} WAIT, ${fails} FAIL`);

  if (fails > 0) {
    process.exitCode = 1;
  }
}

async function main() {
  loadGoogleEnv();

  const canonicalSiteUrl = optionalEnv("NEXT_PUBLIC_SITE_URL", "https://www.landgut-seebuehne.de").replace(
    /\/$/,
    ""
  );
  const canonicalHost = new URL(canonicalSiteUrl).hostname;
  const apexHost = optionalEnv("GOOGLE_ADS_CHECK_APEX_HOST", "landgut-seebuehne.de");
  const wwwHost = optionalEnv("GOOGLE_ADS_CHECK_WWW_HOST", canonicalHost);

  await checkDns({ apexHost, wwwHost });
  await checkHttp({ apexHost, canonicalSiteUrl });
  await checkGoogleAdsApi();
  printResults();
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
