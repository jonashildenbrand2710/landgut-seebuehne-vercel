import { googleAdsServerConfig } from "@/lib/google-ads-server";
import {
  GOOGLE_ADS_CONFIG,
  GOOGLE_ADS_DENIED_CONSENT,
  GOOGLE_ADS_MEASUREMENT_CONSENT
} from "@/lib/google-ads";
import { isGoogleAdsLeadReceiptConfigured } from "@/lib/google-ads-lead-receipt";

export const dynamic = "force-dynamic";

export function GET() {
  if (!GOOGLE_ADS_CONFIG?.leadLabel || !isGoogleAdsLeadReceiptConfigured()) {
    return Response.json({ provider: "google-ads", configured: false }, { status: 503 });
  }
  const { tagId, bookingLabel, leadLabel } = GOOGLE_ADS_CONFIG;
  return Response.json({
    schemaVersion: 1,
    provider: "google-ads",
    implementation: "gtag",
    serverDelivery: {
      provider: "google-data-manager",
      enabled: googleAdsServerConfig() !== null,
      requiresConsent: true,
      identifiers: ["gclid", "gbraid", "wbraid"],
      contactDataSent: false,
      deduplicatesWithBrowser: true
    },
    tagId,
    noPiiInDiagnostics: true,
    consentMode: {
      version: 2,
      default: GOOGLE_ADS_DENIED_CONSENT,
      marketingGranted: GOOGLE_ADS_MEASUREMENT_CONSENT,
      revocationSupported: true
    },
    conversionEvents: [
      {
        key: "generate_lead",
        conversionActionName: "generate_leads_conv",
        trigger: "confirmed_lead_submission",
        sendTo: `${tagId}/${leadLabel}`,
        enhancedConversions: false,
        deduplicateWithTransactionId: true
      },
      {
        key: "book_appointment",
        conversionActionName: "Termin erfolgreich gebucht",
        trigger: "confirmed_calendar_booking",
        sendTo: `${tagId}/${bookingLabel}`,
        enhancedConversions: false,
        deduplicateWithTransactionId: true
      }
    ]
  }, { headers: { "Cache-Control": "public, max-age=300" } });
}
