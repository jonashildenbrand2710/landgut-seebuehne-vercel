import {
  createHochzeitsmappeLeadInSupabase,
  sanitizeError,
  updateHochzeitsmappeLeadActiveCampaignStatus,
  type UpdateHochzeitsmappeLeadActiveCampaignStatusPayload
} from "@/lib/hochzeitsmappe-crm";
import { submitHochzeitsmappeLeadToActiveCampaign } from "@/lib/hochzeitsmappe-lead";
import {
  createHochzeitsmappeAccessToken,
  createHochzeitsmappeAccessUrl
} from "@/lib/hochzeitsmappe-access";
import { normalizeMetaEventId, sendMetaCompleteRegistration } from "@/lib/meta-capi";

const activeCampaignFlowDetails = {
  automation: "Hochzeitsmappe Opt-in",
  tags: ["Hochzeitsmappe_Optin", "Hochzeitsmappe"]
};

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function redirect(request: Request, path: string) {
  return Response.redirect(new URL(path, request.url), 303);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "");
  return /^\+?\d{6,15}$/.test(normalized);
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
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return redirect(request, "/hochzeitsmappe?status=missing#mappe-form");
  }

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

  if (!isValidPhone(payload.phone)) {
    return redirect(request, "/hochzeitsmappe?status=invalid-phone#mappe-form");
  }

  let accessToken: string;
  let emailAccessUrl: string;

  try {
    accessToken = createHochzeitsmappeAccessToken(payload.email);
    emailAccessUrl = createHochzeitsmappeAccessUrl(
      accessToken,
      process.env.NEXT_PUBLIC_SITE_URL?.trim() || new URL(request.url).origin
    );
  } catch (error) {
    console.error("Hochzeitsmappe access link create failed", sanitizeError(error));
    return redirect(request, "/kontaktformular?source=hochzeitsmappe&status=integration-error");
  }

  const immediateAccessUrl = createHochzeitsmappeAccessUrl(accessToken, request.url);
  const deliveryPayload = {
    ...payload,
    accessUrl: emailAccessUrl
  };

  let crmLead;

  try {
    crmLead = await createHochzeitsmappeLeadInSupabase(payload);
  } catch (error) {
    console.error("Hochzeitsmappe CRM lead create failed", sanitizeError(error));
    return redirect(request, "/kontaktformular?source=hochzeitsmappe&status=integration-error");
  }

  // Supabase deduplicates Hochzeitsmappe leads by normalized email. A repeated
  // submission must not start the ActiveCampaign automation (and its email) again.
  if (crmLead.deduped) {
    console.info("Hochzeitsmappe duplicate submission suppressed", {
      activeCampaignStatus: crmLead.activecampaign_status,
      leadId: crmLead.lead_id
    });
    return Response.redirect(immediateAccessUrl, 303);
  }

  try {
    const activeCampaignResult = await submitHochzeitsmappeLeadToActiveCampaign(deliveryPayload);

    if (!activeCampaignResult) {
      const fallbackOk = await forwardToFallbackEndpoint(deliveryPayload);

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

      return Response.redirect(immediateAccessUrl, 303);
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

  return Response.redirect(immediateAccessUrl, 303);
}
