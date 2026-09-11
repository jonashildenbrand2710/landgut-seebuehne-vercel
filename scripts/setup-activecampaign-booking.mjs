import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const apiUrl = process.env.ACTIVECAMPAIGN_API_URL?.trim().replace(/\/+$/, "");
const apiToken =
  process.env.ACTIVECAMPAIGN_API_KEY?.trim() || process.env.CRM_API_KEY?.trim();
const shouldApply = process.argv.includes("--apply");

if (!apiUrl || !apiToken) {
  throw new Error("ActiveCampaign API URL oder API-Key fehlt.");
}

async function activeCampaign(path, options = {}) {
  const response = await fetch(`${apiUrl}/api/3${path}`, {
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      accept: "application/json",
      "Api-Token": apiToken,
      ...(options.body ? { "content-type": "application/json" } : {})
    }
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      `ActiveCampaign ${options.method ?? "GET"} ${path} fehlgeschlagen (${response.status}): ${JSON.stringify(body).slice(0, 260)}`
    );
  }

  return body;
}

const desiredTags = [
  {
    description: "Erfolgreiche Besichtigungsbuchung über den Website-Terminflow",
    env: "ACTIVECAMPAIGN_BOOKING_TOUR_TAG_IDS",
    name: "Besichtigung_gebucht"
  },
  {
    description: "Erfolgreiche Telefontermin-Buchung über den Website-Terminflow",
    env: "ACTIVECAMPAIGN_BOOKING_PHONE_TAG_IDS",
    name: "Telefontermin_gebucht"
  }
];

const desiredFields = [
  {
    env: "ACTIVECAMPAIGN_BOOKING_FIELD_APPOINTMENT_TYPE_ID",
    perstag: "BOOKING_TERMINART",
    title: "Booking Terminart",
    type: "text"
  },
  {
    env: "ACTIVECAMPAIGN_BOOKING_FIELD_SLOT_START_ID",
    perstag: "BOOKING_TERMIN_START",
    title: "Booking Termin Start",
    type: "datetime"
  },
  {
    env: "ACTIVECAMPAIGN_BOOKING_FIELD_SLOT_END_ID",
    perstag: "BOOKING_TERMIN_ENDE",
    title: "Booking Termin Ende",
    type: "datetime"
  }
];

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

const [{ tags = [] }, { fields = [] }] = await Promise.all([
  activeCampaign("/tags?limit=100"),
  activeCampaign("/fields?limit=100")
]);

async function ensureTag(definition) {
  const existing = tags.find((tag) => normalize(tag.tag) === normalize(definition.name));
  if (existing) return { ...definition, id: String(existing.id), status: "existing" };
  if (!shouldApply) return { ...definition, status: "would-create" };

  const result = await activeCampaign("/tags", {
    method: "POST",
    body: {
      tag: {
        description: definition.description,
        tag: definition.name,
        tagType: "contact"
      }
    }
  });
  return { ...definition, id: String(result.tag.id), status: "created" };
}

async function ensureField(definition) {
  const existing = fields.find(
    (field) =>
      normalize(field.title) === normalize(definition.title) ||
      normalize(field.perstag) === normalize(definition.perstag)
  );
  if (existing) return { ...definition, id: String(existing.id), status: "existing" };
  if (!shouldApply) return { ...definition, status: "would-create" };

  const result = await activeCampaign("/fields", {
    method: "POST",
    body: {
      field: {
        descript: "Automatisch aus dem Website-Terminflow gepflegt.",
        ordernum: 0,
        perstag: definition.perstag,
        relations: [{ relid: 0 }],
        title: definition.title,
        type: definition.type,
        visible: 1
      }
    }
  });
  return { ...definition, id: String(result.field.id), status: "created" };
}

const tagResults = [];
for (const definition of desiredTags) tagResults.push(await ensureTag(definition));

const fieldResults = [];
for (const definition of desiredFields) fieldResults.push(await ensureField(definition));

const result = {
  applied: shouldApply,
  env: Object.fromEntries(
    [...tagResults, ...fieldResults]
      .filter((item) => item.id)
      .map((item) => [item.env, item.id])
  ),
  fields: fieldResults.map(({ env, id, status, title, type }) => ({ env, id, status, title, type })),
  note:
    "ActiveCampaign-Automationen können über die öffentliche API gestartet, aber nicht vollständig erstellt oder verdrahtet werden. Für ActiveCampaign-Versand je Funnel werden zwei aktive Automationen samt eigener Listen benötigt.",
  tags: tagResults.map(({ env, id, name, status }) => ({ env, id, name, status }))
};

console.log(JSON.stringify(result, null, 2));
