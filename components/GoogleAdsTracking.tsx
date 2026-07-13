"use client";

import { useEffect } from "react";
import { readStoredConsent } from "@/lib/consent";
import {
  stashLeadUserDataForThankYouPage,
  takeStashedLeadUserData,
  trackGoogleAdsConversion
} from "@/lib/google-ads-gtag";

// Feuert die Lead-Conversion (generate_leads_conv) auf /danke. Der lead_id-
// Query-Parameter wird nur vom Server-Endpoint /api/hochzeitsmappe gesetzt,
// nachdem der Lead tatsächlich in der CRM-Datenbank persistiert wurde —
// Validierungsfehler, Honeypot-Treffer und Integrationsfehler erreichen diesen
// Pfad nicht. Reloads sind über die transaction_id-Deduplizierung abgesichert.
export function GoogleAdsLeadConversionFromQuery() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const leadId = params.get("lead_id")?.trim() || "";
    const eventId = params.get("event_id")?.trim() || "";

    if (!leadId) return;

    // Gehashte Kontaktdaten aus dem Formular-Submit übernehmen (und immer
    // entfernen, auch wenn ohne Einwilligung keine Conversion gefeuert wird).
    const userData = takeStashedLeadUserData(eventId);
    trackGoogleAdsConversion("generate_lead", leadId, userData || undefined);
  }, []);

  return null;
}

const SUBMIT_STASH_TIMEOUT_MS = 400;

// Ergänzt das Hochzeitsmappe-Formular (nativer POST + Redirect) um Enhanced
// Conversions: Beim Submit werden E-Mail/Telefon normalisiert, per SHA-256
// gehasht und nur als Hashes in sessionStorage zwischengelagert, damit die
// Danke-Seite sie an den Google Tag übergeben kann. Ohne Marketing-
// Einwilligung werden die Kontaktdaten nicht angefasst und das Formular
// verhält sich exakt wie zuvor.
export function GoogleAdsLeadUserData() {
  useEffect(() => {
    const form = document.getElementById("mappe-form");
    if (!(form instanceof HTMLFormElement)) return undefined;

    let stashing = false;

    const fieldValue = (name: string) => {
      const field = form.elements.namedItem(name);
      return field instanceof HTMLInputElement ? field.value : "";
    };

    const onSubmit = (event: SubmitEvent) => {
      if (stashing) return;
      if (readStoredConsent() !== "granted") return;

      const email = fieldValue("email");
      const phone = fieldValue("phone");
      if (!email && !phone) return;

      event.preventDefault();
      stashing = true;

      // Hashing ist asynchron; die Navigation wird kurz angehalten und danach
      // in jedem Fall fortgesetzt. metaEventId erst nach den synchronen
      // Submit-Listenern lesen — MetaTrackingFields erzeugt die ID beim Submit
      // neu, und dieselbe ID landet als event_id im /danke-Redirect.
      const submitAfterStash = async () => {
        try {
          const eventId = fieldValue("metaEventId").trim();
          if (eventId) {
            await Promise.race([
              stashLeadUserDataForThankYouPage(eventId, { email, phone }),
              new Promise((resolve) => window.setTimeout(resolve, SUBMIT_STASH_TIMEOUT_MS))
            ]);
          }
        } catch {
          // Enhanced Conversions sind best effort — der Lead-Versand hat Vorrang.
        } finally {
          form.submit();
        }
      };

      void submitAfterStash();
    };

    form.addEventListener("submit", onSubmit);
    return () => form.removeEventListener("submit", onSubmit);
  }, []);

  return null;
}
