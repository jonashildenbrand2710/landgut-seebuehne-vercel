import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { loadGoogleEnv, optionalEnv, validAccessToken } from "./google-env.mjs";

const OUT_DIR = path.join(process.cwd(), "docs", "migration", "google-search-console");

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function defaultEndDate() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 3);
  return formatDate(date);
}

function defaultStartDate(endDate) {
  const date = new Date(`${endDate}T00:00:00.000Z`);
  date.setUTCMonth(date.getUTCMonth() - 16);
  return formatDate(date);
}

function csvEscape(value) {
  const stringValue = String(value ?? "");

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replaceAll("\"", "\"\"")}"`;
  }

  return stringValue;
}

function rowsToCsv(headers, rows) {
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ].join("\n");
}

function normalizeSearchRows(response, dimensions) {
  return (response.rows ?? []).map((row) => {
    const normalized = {};

    dimensions.forEach((dimension, index) => {
      normalized[dimension] = row.keys?.[index] ?? "";
    });

    normalized.clicks = row.clicks ?? 0;
    normalized.impressions = row.impressions ?? 0;
    normalized.ctr = row.ctr ?? 0;
    normalized.position = row.position ?? 0;

    return normalized;
  });
}

async function googleRequest(pathname, options = {}) {
  const accessToken = await validAccessToken();
  const response = await fetch(`https://www.googleapis.com${pathname}`, {
    ...options,
    headers: {
      accept: "application/json",
      authorization: `Bearer ${accessToken}`,
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...options.headers
    }
  });

  const bodyText = await response.text();
  const body = bodyText ? JSON.parse(bodyText) : {};

  if (!response.ok) {
    throw new Error(`${response.status} ${pathname}: ${JSON.stringify(body).slice(0, 500)}`);
  }

  return body;
}

async function searchAnalytics(siteUrl, requestBody) {
  return googleRequest(`/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: "POST",
    body: JSON.stringify(requestBody)
  });
}

async function writeDataset(name, data) {
  await writeFile(path.join(OUT_DIR, `${name}.json`), `${JSON.stringify(data, null, 2)}\n`);
}

async function writeSearchDataset(name, dimensions, response) {
  const rows = normalizeSearchRows(response, dimensions);
  const headers = [...dimensions, "clicks", "impressions", "ctr", "position"];

  await writeDataset(name, response);
  await writeFile(path.join(OUT_DIR, `${name}.csv`), `${rowsToCsv(headers, rows)}\n`);

  return rows;
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${headers.map((header) => row[header] ?? "").join(" | ")} |`)
  ].join("\n");
}

async function writeSummary({ siteUrl, startDate, endDate, pages, queries, pageQueries }) {
  const topPages = pages.slice(0, 25).map((row) => ({
    URL: row.page,
    Klicks: Math.round(row.clicks),
    Impressionen: Math.round(row.impressions),
    Position: row.position.toFixed(1)
  }));

  const topQueries = queries.slice(0, 25).map((row) => ({
    Suchanfrage: row.query.replaceAll("|", "\\|"),
    Klicks: Math.round(row.clicks),
    Impressionen: Math.round(row.impressions),
    Position: row.position.toFixed(1)
  }));

  const topPageQueries = pageQueries.slice(0, 50).map((row) => ({
    URL: row.page,
    Suchanfrage: row.query.replaceAll("|", "\\|"),
    Klicks: Math.round(row.clicks),
    Impressionen: Math.round(row.impressions)
  }));

  const summary = `# Google Search Console Export

Quelle: \`${siteUrl}\`
Zeitraum: \`${startDate}\` bis \`${endDate}\`

## Wichtigste URLs

${markdownTable(["URL", "Klicks", "Impressionen", "Position"], topPages)}

## Wichtigste Suchanfragen

${markdownTable(["Suchanfrage", "Klicks", "Impressionen", "Position"], topQueries)}

## Suchintention pro URL

${markdownTable(["URL", "Suchanfrage", "Klicks", "Impressionen"], topPageQueries)}
`;

  await writeFile(path.join(OUT_DIR, "summary.md"), summary);
}

async function main() {
  loadGoogleEnv();

  const siteUrl = optionalEnv("GOOGLE_SEARCH_CONSOLE_SITE_URL", "sc-domain:landgut-seebuehne.de");
  const endDate = optionalEnv("GOOGLE_GSC_END_DATE", defaultEndDate());
  const startDate = optionalEnv("GOOGLE_GSC_START_DATE", defaultStartDate(endDate));
  const rowLimit = Number(optionalEnv("GOOGLE_GSC_ROW_LIMIT", "25000"));

  await mkdir(OUT_DIR, { recursive: true });

  const baseRequest = {
    startDate,
    endDate,
    rowLimit,
    type: "web",
    dataState: "final"
  };

  const sites = await googleRequest("/webmasters/v3/sites");
  await writeDataset("sites", sites);

  const sitemaps = await googleRequest(`/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`);
  await writeDataset("sitemaps", sitemaps);

  const pages = await writeSearchDataset(
    "search-pages",
    ["page"],
    await searchAnalytics(siteUrl, { ...baseRequest, dimensions: ["page"] })
  );

  const queries = await writeSearchDataset(
    "search-queries",
    ["query"],
    await searchAnalytics(siteUrl, { ...baseRequest, dimensions: ["query"] })
  );

  const pageQueries = await writeSearchDataset(
    "search-page-query",
    ["page", "query"],
    await searchAnalytics(siteUrl, { ...baseRequest, dimensions: ["page", "query"] })
  );

  await writeSearchDataset(
    "search-daily",
    ["date"],
    await searchAnalytics(siteUrl, { ...baseRequest, dimensions: ["date"] })
  );

  await writeSearchDataset(
    "search-device",
    ["device"],
    await searchAnalytics(siteUrl, { ...baseRequest, dimensions: ["device"] })
  );

  await writeSummary({ siteUrl, startDate, endDate, pages, queries, pageQueries });

  console.log(`Google Search Console export written to ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
