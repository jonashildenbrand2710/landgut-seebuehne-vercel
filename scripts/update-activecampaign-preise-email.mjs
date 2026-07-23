import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const CAMPAIGN_ID = "43";
const SUBJECT = "Eure Preise & Leistungsbausteine für die Seebühne";
const PREHEADER = "Entdeckt in Ruhe, welche Möglichkeiten zu eurem Fest passen.";
const PRICES_URL = "https://kennenlernen.landgut-seebuehne.de/auftrag-info";
const CONTENT_TABLE_MARKER =
  '<table cellpadding="0" cellspacing="0" class="es-content"';

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
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(
      `ActiveCampaign ${options.method ?? "GET"} ${path} fehlgeschlagen (${response.status}): ${JSON.stringify(responseBody)}`
    );
  }

  return responseBody;
}

function paragraph(content, { bold = false, greeting = false } = {}) {
  const fontSize = greeting ? 16 : 14;
  const lineHeight = greeting ? 24 : 21;
  const text = bold ? `<strong>${content}</strong>` : content;

  return `<p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:${lineHeight}px;color:#333333;font-size:${fontSize}px">${text}</p>`;
}

function spacer() {
  return paragraph("<br>");
}

function buildContentTable() {
  const content = [
    paragraph("Hallo %FIRSTNAME%,", { greeting: true }),
    spacer(),
    paragraph(
      "wie schön, dass ihr die Hochzeitsmappe der Seebühne angesehen habt und nun den nächsten Schritt gehen möchtet."
    ),
    spacer(),
    paragraph(
      "Über den folgenden Link findet ihr unsere Übersicht mit Preisen und Leistungsbausteinen. Dort könnt ihr euch in Ruhe ansehen, welche Möglichkeiten es für eure Hochzeit gibt und welche Bausteine zu eurem Fest passen."
    ),
    spacer(),
    paragraph(
      `<a href="${PRICES_URL}" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#6B3A3C;font-size:14px"><strong>Preise &amp; Leistungsbausteine ansehen</strong></a>`
    ),
    spacer(),
    paragraph(
      "Nehmt euch am besten ein paar Minuten Zeit für die Übersicht. Wenn ihr danach das Gefühl habt, dass die Seebühne der richtige Ort für euch sein könnte, ist eine persönliche Besichtigung der nächste sinnvolle Schritt."
    ),
    spacer(),
    paragraph(
      "Falls beim Lesen Fragen entstehen, antwortet einfach direkt auf diese E-Mail."
    ),
    spacer(),
    paragraph("Herzliche Grüße"),
    paragraph("Christine Hildenbrand", { bold: true }),
    paragraph("Landgut Seebühne Mittelfranken", { bold: true })
  ].join("");

  return `${CONTENT_TABLE_MARKER} align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr><td align="center" style="padding:0;Margin:0"><table bgcolor="#ffffff" class="es-content-body" align="left" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:550px"><tr><td align="left" style="padding:20px 20px 0;Margin:0"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:510px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0">${content}</td></tr></table></td></tr></table></td></tr></table></td></tr></table>`;
}

function replaceBodyContent(html) {
  const contentStart = html.indexOf(CONTENT_TABLE_MARKER);
  const footerStart = html.indexOf(CONTENT_TABLE_MARKER, contentStart + 1);

  if (contentStart < 0 || footerStart < 0) {
    throw new Error("Die erwartete E-Mail-Struktur mit getrenntem Inhalts- und Footer-Block fehlt.");
  }

  return `${html.slice(0, contentStart)}${buildContentTable()}${html.slice(footerStart)}`;
}

function buildText(existingText) {
  const footerStart = existingText.indexOf("Wenn du keine weiteren Informationen");
  const footer = footerStart >= 0 ? existingText.slice(footerStart).trim() : "";
  const body = [
    "Hallo %FIRSTNAME%,",
    "",
    "wie schön, dass ihr die Hochzeitsmappe der Seebühne angesehen habt und nun den nächsten Schritt gehen möchtet.",
    "",
    "Über den folgenden Link findet ihr unsere Übersicht mit Preisen und Leistungsbausteinen. Dort könnt ihr euch in Ruhe ansehen, welche Möglichkeiten es für eure Hochzeit gibt und welche Bausteine zu eurem Fest passen.",
    "",
    "Preise & Leistungsbausteine ansehen",
    PRICES_URL,
    "",
    "Nehmt euch am besten ein paar Minuten Zeit für die Übersicht. Wenn ihr danach das Gefühl habt, dass die Seebühne der richtige Ort für euch sein könnte, ist eine persönliche Besichtigung der nächste sinnvolle Schritt.",
    "",
    "Falls beim Lesen Fragen entstehen, antwortet einfach direkt auf diese E-Mail.",
    "",
    "Herzliche Grüße",
    "Christine Hildenbrand",
    "Landgut Seebühne Mittelfranken"
  ].join("\n");

  return footer ? `${body}\n\n${footer}` : body;
}

function isUpdated(message) {
  return (
    message.subject === SUBJECT &&
    message.preheader_text === PREHEADER &&
    message.html.includes(PRICES_URL) &&
    message.html.includes("Falls beim Lesen Fragen entstehen") &&
    !message.html.includes("drive.google.com") &&
    !message.html.includes("wa.me/")
  );
}

function verificationState(message) {
  return {
    bodyUpdated: message.html.includes("Falls beim Lesen Fragen entstehen"),
    oldDriveLinkRemoved: !message.html.includes("drive.google.com"),
    oldWhatsAppLinkRemoved: !message.html.includes("wa.me/"),
    preheaderUpdated: message.preheader_text === PREHEADER,
    pricesUrlPresent: message.html.includes(PRICES_URL),
    subjectUpdated: message.subject === SUBJECT
  };
}

const campaignMessages = await activeCampaign(
  `/campaigns/${CAMPAIGN_ID}/campaignMessages`
);
const relation = campaignMessages.campaignMessages?.[0];

if (!relation?.messageid) {
  throw new Error(`Kampagne ${CAMPAIGN_ID} enthält keine verknüpfte Nachricht.`);
}

const messageId = String(relation.messageid);
const { message: current } = await activeCampaign(`/messages/${messageId}`);

if (isUpdated(current)) {
  console.log(
    JSON.stringify(
      {
        campaignId: CAMPAIGN_ID,
        messageId,
        status: "already-up-to-date",
        subject: current.subject,
        preheader: current.preheader_text,
        pricesUrl: PRICES_URL
      },
      null,
      2
    )
  );
  process.exit(0);
}

if (!shouldApply) {
  console.log(
    JSON.stringify(
      {
        campaignId: CAMPAIGN_ID,
        messageId,
        status: "preview",
        currentSubject: current.subject,
        nextSubject: SUBJECT,
        nextPreheader: PREHEADER,
        pricesUrl: PRICES_URL
      },
      null,
      2
    )
  );
  process.exit(0);
}

const previous = {
  fromemail: current.fromemail,
  fromname: current.fromname,
  html: current.html,
  preheader_text: current.preheader_text,
  reply2: current.reply2,
  subject: current.subject,
  text: current.text
};
const next = {
  ...previous,
  html: replaceBodyContent(current.html),
  preheader_text: PREHEADER,
  subject: SUBJECT,
  text: buildText(current.text ?? "")
};

await activeCampaign(`/messages/${messageId}`, {
  method: "PUT",
  body: { message: next }
});

const { message: verified } = await activeCampaign(`/messages/${messageId}`);

if (!isUpdated(verified)) {
  const failedVerification = verificationState(verified);

  await activeCampaign(`/messages/${messageId}`, {
    method: "PUT",
    body: { message: previous }
  });
  throw new Error(
    `Die Verifikation ist fehlgeschlagen; die vorherige Nachricht wurde wiederhergestellt: ${JSON.stringify(failedVerification)}`
  );
}

console.log(
  JSON.stringify(
    {
      campaignId: CAMPAIGN_ID,
      footerPreserved:
        verified.html.includes("%UNSUBSCRIBELINK%") &&
        verified.html.includes("%SENDER-INFO-SINGLELINE%"),
      messageId,
      preheader: verified.preheader_text,
      pricesUrl: PRICES_URL,
      senderPreserved:
        verified.fromemail === previous.fromemail &&
        verified.fromname === previous.fromname &&
        verified.reply2 === previous.reply2,
      status: "updated-and-verified",
      subject: verified.subject
    },
    null,
    2
  )
);
