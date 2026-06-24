const maxCvSize = 10 * 1024 * 1024;
const allowedCvTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg"
]);
const allowedCvExtensions = [".pdf", ".docx", ".jpg", ".jpeg"];
const resendEmailApiUrl = "https://api.resend.com/emails";

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function redirect(request: Request, status?: string) {
  const url = new URL("/bewerbung", request.url);
  if (status) {
    url.searchParams.set("status", status);
    url.hash = "bewerbungsformular";
  }
  return Response.redirect(url, 303);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidGermanPhone(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "");
  return /^(?:\+49|0049|0)\d{6,14}$/.test(normalized);
}

function getUploadedCv(value: FormDataEntryValue | null) {
  if (!value || typeof value === "string" || value.size === 0) {
    return null;
  }

  return value;
}

function isValidCvFile(file: File) {
  const lowerName = file.name.toLowerCase();
  const hasAllowedExtension = allowedCvExtensions.some((extension) => lowerName.endsWith(extension));
  const hasAllowedType = !file.type || allowedCvTypes.has(file.type);

  return hasAllowedExtension && hasAllowedType;
}

function splitEmails(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatApplicationText(payload: Record<string, string>) {
  return [
    "Neue Bewerbung über landgut-seebuehne.de/bewerbung",
    "",
    `Position: ${payload.position || "-"}`,
    `Name: ${payload.firstName} ${payload.lastName}`,
    `E-Mail: ${payload.email}`,
    `Telefon: ${payload.phone}`,
    `Startdatum: ${payload.startDate || "-"}`,
    `Lebenslauf hochgeladen: ${payload.hasCv === "true" ? "ja" : "nein"}`,
    `Eingereicht am: ${payload.submittedAt}`,
    "",
    "Bitte direkt persönlich melden."
  ].join("\n");
}

function formatApplicationHtml(payload: Record<string, string>) {
  const rows = [
    ["Position", payload.position || "-"],
    ["Name", `${payload.firstName} ${payload.lastName}`],
    ["E-Mail", payload.email],
    ["Telefon", payload.phone],
    ["Startdatum", payload.startDate || "-"],
    ["Lebenslauf hochgeladen", payload.hasCv === "true" ? "ja" : "nein"],
    ["Eingereicht am", payload.submittedAt]
  ];

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1c1d20">
      <h1 style="font-size:22px;margin:0 0 18px">Neue Bewerbung über landgut-seebuehne.de/bewerbung</h1>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th style="padding:10px 12px;border:1px solid #e7e2d8;text-align:left;background:#f6f0e8;width:180px">${escapeHtml(label)}</th>
                <td style="padding:10px 12px;border:1px solid #e7e2d8">${escapeHtml(value)}</td>
              </tr>
            `
          )
          .join("")}
      </table>
      <p style="margin-top:18px">Bitte direkt persönlich melden.</p>
    </div>
  `;
}

async function getCvAttachment(cv: File | null) {
  if (!cv) {
    return null;
  }

  const buffer = Buffer.from(await cv.arrayBuffer());

  return {
    content: buffer.toString("base64"),
    filename: cv.name
  };
}

async function forwardToEmailDelivery(payload: Record<string, string>, cv: File | null) {
  const apiKey = process.env.EMAIL_DELIVERY_API_KEY?.trim();
  const from = process.env.APPLICATION_MAIL_FROM?.trim();
  const to = splitEmails(process.env.APPLICATION_MAIL_TO);

  if (!apiKey || !from || !to.length) {
    return false;
  }

  const attachment = await getCvAttachment(cv);
  const attachments = attachment ? [attachment] : undefined;
  const subjectName = [payload.firstName, payload.lastName].filter(Boolean).join(" ");
  const replyTo = payload.email ? [payload.email] : undefined;
  const bcc = splitEmails(process.env.APPLICATION_MAIL_BCC);

  const response = await fetch(resendEmailApiUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      attachments,
      bcc: bcc.length ? bcc : undefined,
      from,
      html: formatApplicationHtml(payload),
      reply_to: replyTo,
      subject: `Neue Bewerbung${subjectName ? `: ${subjectName}` : ""}`,
      text: formatApplicationText(payload),
      to
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Application email delivery failed with status ${response.status}: ${errorText.slice(0, 220)}`);
  }

  return true;
}

async function forwardToApplicationEndpoint(payload: Record<string, string>, cv: File | null) {
  const endpoint = process.env.APPLICATION_FORM_ENDPOINT?.trim();

  if (!endpoint) {
    return false;
  }

  const body = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    body.append(key, value);
  }
  if (cv) {
    body.append("cv", cv, cv.name);
  }

  const headers: Record<string, string> = {
    accept: "application/json"
  };

  const secret = process.env.APPLICATION_FORM_SECRET?.trim();
  if (secret) {
    headers["x-application-form-secret"] = secret;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body
  });

  return response.ok;
}

async function forwardToContactFallback(payload: Record<string, string>, cv: File | null) {
  const endpoint = process.env.CONTACT_FORM_ENDPOINT?.trim();

  if (!endpoint || cv) {
    return false;
  }

  const headers: Record<string, string> = {
    accept: "application/json",
    "content-type": "application/json"
  };

  const secret = process.env.CONTACT_FORM_SECRET?.trim();
  if (secret) {
    headers["x-contact-form-secret"] = secret;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  return response.ok;
}

export function GET(request: Request) {
  return redirect(request);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  if (clean(formData.get("website"))) {
    return redirect(request, "success");
  }

  const cv = getUploadedCv(formData.get("cv"));
  const payload = {
    source: "bewerbung",
    page: "/bewerbung",
    position: clean(formData.get("position")),
    firstName: clean(formData.get("firstName")),
    lastName: clean(formData.get("lastName")),
    startDate: clean(formData.get("startDate")),
    email: clean(formData.get("email")).toLowerCase(),
    phone: clean(formData.get("phone")),
    hasCv: cv ? "true" : "false",
    submittedAt: clean(formData.get("submittedAt")) || new Date().toISOString()
  };

  if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone) {
    return redirect(request, "missing");
  }

  if (!isValidEmail(payload.email)) {
    return redirect(request, "invalid-email");
  }

  if (!isValidGermanPhone(payload.phone)) {
    return redirect(request, "invalid-phone");
  }

  if (cv && cv.size > maxCvSize) {
    return redirect(request, "file-too-large");
  }

  if (cv && !isValidCvFile(cv)) {
    return redirect(request, "invalid-file");
  }

  try {
    const applicationOk = await forwardToApplicationEndpoint(payload, cv);
    const emailOk = applicationOk ? false : await forwardToEmailDelivery(payload, cv);
    const fallbackOk = applicationOk || emailOk ? false : await forwardToContactFallback(payload, cv);

    if (!applicationOk && !emailOk && !fallbackOk) {
      return redirect(request, "integration-missing");
    }
  } catch (error) {
    console.error("Application form submission failed", error);
    return redirect(request, "integration-error");
  }

  return redirect(request, "success");
}
