import fs from "node:fs";

const ENV_FILES = [".env.local", ".env"];

function stripQuotes(value) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function loadEnvFile(path) {
  if (!fs.existsSync(path)) {
    return;
  }

  const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");

    if (!process.env[key]) {
      process.env[key] = stripQuotes(valueParts.join("="));
    }
  }
}

for (const envFile of ENV_FILES) {
  loadEnvFile(envFile);
}

const rawApiUrl = process.env.ACTIVECAMPAIGN_API_URL?.trim();
const apiToken = process.env.ACTIVECAMPAIGN_API_KEY?.trim() || process.env.CRM_API_KEY?.trim();

if (!rawApiUrl || !apiToken) {
  console.error(
    "Missing ACTIVECAMPAIGN_API_URL and ACTIVECAMPAIGN_API_KEY. CRM_API_KEY is accepted as API key fallback."
  );
  process.exit(1);
}

const apiBaseUrl = rawApiUrl.replace(/\/+$/, "").endsWith("/api/3")
  ? rawApiUrl.replace(/\/+$/, "")
  : `${rawApiUrl.replace(/\/+$/, "")}/api/3`;

async function activeCampaignRequest(path, searchParams = {}) {
  const url = new URL(`${apiBaseUrl}${path}`);

  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "Api-Token": apiToken
    }
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`${response.status} ${path}: ${body.slice(0, 240)}`);
  }

  return body ? JSON.parse(body) : {};
}

function printSection(title, items, mapper) {
  console.log(`\n${title}`);

  if (!items.length) {
    console.log("  none");
    return;
  }

  for (const item of items) {
    console.log(`  ${mapper(item)}`);
  }
}

const resources = [
  {
    key: "campaigns",
    path: "/campaigns",
    title: "Campaigns",
    mapper: (item) => `#${item.id} ${item.name ?? item.sdate ?? "(unnamed)"} status=${item.status ?? "unknown"}`
  },
  {
    key: "automations",
    path: "/automations",
    title: "Automations",
    mapper: (item) => `#${item.id} ${item.name ?? "(unnamed)"} status=${item.status ?? "unknown"}`
  },
  {
    key: "lists",
    path: "/lists",
    title: "Lists",
    mapper: (item) => `#${item.id} ${item.name ?? "(unnamed)"} sender=${item.sender_name ?? "unknown"}`
  },
  {
    key: "tags",
    path: "/tags",
    title: "Tags",
    mapper: (item) => `#${item.id} ${item.tag ?? "(unnamed)"}`
  },
  {
    key: "fields",
    path: "/fields",
    title: "Contact Fields",
    mapper: (item) => `#${item.id} ${item.title ?? item.perstag ?? "(unnamed)"} type=${item.type ?? "unknown"}`
  }
];

for (const resource of resources) {
  try {
    const response = await activeCampaignRequest(resource.path, { limit: 100 });
    printSection(resource.title, response[resource.key] ?? [], resource.mapper);
  } catch (error) {
    console.error(`\n${resource.title}`);
    console.error(`  ${error.message}`);
  }
}

console.log("\nHochzeitsmappe env mapping");
console.log(
  [
    "ACTIVECAMPAIGN_HOCHZEITSMAPPE_AUTOMATION_ID",
    "ACTIVECAMPAIGN_HOCHZEITSMAPPE_LIST_ID",
    "ACTIVECAMPAIGN_HOCHZEITSMAPPE_TAG_IDS",
    "ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_ACCESS_URL_ID",
    "ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_LEAD_MAGNET_ID",
    "ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_PAGE_ID",
    "ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_SOURCE_ID",
    "ACTIVECAMPAIGN_HOCHZEITSMAPPE_FIELD_SUBMITTED_AT_ID"
  ]
    .map((key) => `  ${key}=${process.env[key] ? "(set)" : "(empty)"}`)
    .join("\n")
);
