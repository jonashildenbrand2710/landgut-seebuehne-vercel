function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function redirect(request: Request, path: string) {
  return Response.redirect(new URL(path, request.url), 303);
}

export function GET(request: Request) {
  return redirect(request, "/hochzeitsmappe");
}

export async function POST(request: Request) {
  const formData = await request.formData();

  if (clean(formData.get("website"))) {
    return redirect(request, "/danke?source=hochzeitsmappe");
  }

  const payload = {
    source: "hochzeitsmappe",
    page: "/hochzeitsmappe",
    firstName: clean(formData.get("firstName")),
    lastName: clean(formData.get("lastName")),
    email: clean(formData.get("email")),
    phone: clean(formData.get("phone")),
    submittedAt: new Date().toISOString()
  };

  if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone) {
    return redirect(request, "/hochzeitsmappe?status=missing#mappe-form");
  }

  const endpoint = process.env.CONTACT_FORM_ENDPOINT;

  if (!endpoint) {
    return redirect(request, "/kontaktformular?source=hochzeitsmappe&status=endpoint-missing");
  }

  const headers: Record<string, string> = {
    accept: "application/json",
    "content-type": "application/json"
  };

  if (process.env.CONTACT_FORM_SECRET) {
    headers["x-contact-form-secret"] = process.env.CONTACT_FORM_SECRET;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return redirect(request, "/kontaktformular?source=hochzeitsmappe&status=endpoint-error");
    }
  } catch {
    return redirect(request, "/kontaktformular?source=hochzeitsmappe&status=endpoint-error");
  }

  return redirect(request, "/danke?source=hochzeitsmappe");
}
