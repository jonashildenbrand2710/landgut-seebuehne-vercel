const maxCvSize = 10 * 1024 * 1024;
const allowedCvTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg"
]);
const allowedCvExtensions = [".pdf", ".docx", ".jpg", ".jpeg"];

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
    const fallbackOk = applicationOk ? false : await forwardToContactFallback(payload, cv);

    if (!applicationOk && !fallbackOk) {
      return redirect(request, "integration-missing");
    }
  } catch (error) {
    console.error("Application form submission failed", error);
    return redirect(request, "integration-error");
  }

  return redirect(request, "success");
}
