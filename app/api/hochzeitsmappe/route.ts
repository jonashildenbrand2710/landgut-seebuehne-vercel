import {
  createHochzeitsmappeLeadInSupabase,
  sanitizeError,
  updateHochzeitsmappeLeadActiveCampaignStatus,
  type UpdateHochzeitsmappeLeadActiveCampaignStatusPayload
} from "@/lib/hochzeitsmappe-crm";
import { submitHochzeitsmappeLeadToActiveCampaign } from "@/lib/hochzeitsmappe-lead";
import { normalizeMetaEventId, sendMetaCompleteRegistration } from "@/lib/meta-capi";

const activeCampaignFlowDetails = {
  automation: "Wedding-Report Optin",
  tags: ["Report_Hochzeitsmappe", "Hochzeitsmappe"]
};

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function redirect(request: Request, path: string) {
  return Response.redirect(new URL(path, request.url), 303);
}

function dankePath(eventId: string) {
  const params = new URLSearchParams({
    event_id: eventId,
    funnel: "hochzeitsmappe",
    meta_event: "CompleteRegistration",
    source: "hochzeitsmappe"
  });

  return `/danke?${params.toString()}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function forwardToFallbackEndpoint(payload: Record<string, string>) {
  const endpoint = process.env.CONTACT_FORM_ENDPOINT;

  if (!endpoint) {
    return false;
  }

  const headers: Record<string, string> = {
    accept: "application/json",
    "content-type": "application/json"
  };

  if (process.env.CONTACT_FORM_SECRET) {
    headers["x-contact-form-secret"] = process.env.CONTACT_FORM_SECRET;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  return response.ok;
}

async function updateActiveCampaignStatus(payload: UpdateHochzeitsmappeLeadActiveCampaignStatusPayload) {
  try {
    await updateHochzeitsmappeLeadActiveCampaignStatus(payload);
  } catch (error) {
    console.error("Hochzeitsmappe CRM status update failed", sanitizeError(error));
  }
}

function metaTrackingFromForm(formData: FormData) {
  return {
    fbclid: clean(formData.get("fbclid")),
    fbc: clean(formData.get("fbc")),
    fbp: clean(formData.get("fbp")),
    meta_ad_id: clean(formData.get("meta_ad_id")),
    meta_adset_id: clean(formData.get("meta_adset_id")),
    meta_campaign_id: clean(formData.get("meta_campaign_id")),
    meta_placement: clean(formData.get("meta_placement")),
    pageUrl: clean(formData.get("pageUrl")),
    referrer: clean(formData.get("referrer")),
    submittedAt: clean(formData.get("submittedAt")),
    userAgent: clean(formData.get("userAgent")),
    utm_campaign: clean(formData.get("utm_campaign")),
    utm_content: clean(formData.get("utm_content")),
    utm_medium: clean(formData.get("utm_medium")),
    utm_source: clean(formData.get("utm_source")),
    utm_term: clean(formData.get("utm_term"))
  };
}

async function sendHochzeitsmappeConversion(
  request: Request,
  formData: FormData,
  payload: { email: string; phone: string },
  eventId: string
) {
  const tracking = metaTrackingFromForm(formData);

  await sendMetaCompleteRegistration({
    email: payload.email,
    eventId,
    eventSourceUrl: tracking.pageUrl || new URL("/hochzeitsmappe", request.url).toString(),
    funnel: "hochzeitsmappe",
    phone: payload.phone,
    request,
    tracking
  });
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
    source: "hochzeitsmappe" as const,
    page: "/hochzeitsmappe",
    firstName: clean(formData.get("firstName")),
    lastName: clean(formData.get("lastName")),
    email: clean(formData.get("email")).toLowerCase(),
    phone: clean(formData.get("phone")),
    submittedAt: clean(formData.get("submittedAt")) || new Date().toISOString()
  };
  const metaEventId = normalizeMetaEventId(clean(formData.get("metaEventId")), "hochzeitsmappe");

  if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone) {
    return redirect(request, "/hochzeitsmappe?status=missing#mappe-form");
  }

  if (!isValidEmail(payload.email)) {
    return redirect(request, "/hochzeitsmappe?status=invalid-email#mappe-form");
  }

  let crmLead;

  try {
    crmLead = await createHochzeitsmappeLeadInSupabase(payload);
  } catch (error) {
    console.error("Hochzeitsmappe CRM lead create failed", sanitizeError(error));
    return redirect(request, "/kontaktformular?source=hochzeitsmappe&status=integration-error");
  }

  try {
    const activeCampaignResult = await submitHochzeitsmappeLeadToActiveCampaign(payload);

    if (!activeCampaignResult) {
      const fallbackOk = await forwardToFallbackEndpoint(payload);

      await updateActiveCampaignStatus({
        error: fallbackOk
          ? "ActiveCampaign configuration missing; fallback endpoint accepted lead"
          : "ActiveCampaign configuration missing",
        leadId: crmLead.lead_id,
        status: "failed"
      });

      if (!fallbackOk) {
        return redirect(request, "/kontaktformular?source=hochzeitsmappe&status=integration-missing");
      }

      await sendHochzeitsmappeConversion(request, formData, payload, metaEventId);

      return redirect(request, dankePath(metaEventId));
    }

    await updateActiveCampaignStatus({
      activeCampaign: {
        ...activeCampaignFlowDetails,
        automationId: activeCampaignResult.automationId,
        listId: activeCampaignResult.listId
      },
      contactId: activeCampaignResult.contactId,
      leadId: crmLead.lead_id,
      status: "success"
    });
  } catch (error) {
    const message = sanitizeError(error);

    await updateActiveCampaignStatus({
      error: message,
      leadId: crmLead.lead_id,
      status: "failed"
    });

    console.error("Hochzeitsmappe lead integration failed", message);
    return redirect(request, "/kontaktformular?source=hochzeitsmappe&status=integration-error");
  }

  await sendHochzeitsmappeConversion(request, formData, payload, metaEventId);

  return redirect(request, dankePath(metaEventId));
}
