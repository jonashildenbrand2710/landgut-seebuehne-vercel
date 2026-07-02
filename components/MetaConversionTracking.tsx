"use client";

import { useEffect, useRef } from "react";
import {
  isMetaConversionFunnel,
  META_EVENT_NAME,
  metaConversionCustomData,
  type MetaConversionFunnel
} from "@/lib/meta-events";

type MetaTrackingFieldName =
  | "fbclid"
  | "fbc"
  | "fbp"
  | "meta_ad_id"
  | "meta_adset_id"
  | "meta_campaign_id"
  | "meta_placement"
  | "metaEventId"
  | "pageUrl"
  | "referrer"
  | "submittedAt"
  | "userAgent"
  | "utm_campaign"
  | "utm_content"
  | "utm_medium"
  | "utm_source"
  | "utm_term";

type MetaTrackingFields = Record<MetaTrackingFieldName, string>;

type Fbq = (
  command: "track",
  eventName: string,
  customData: Record<string, string>,
  options: { eventID: string }
) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

const fieldNames: MetaTrackingFieldName[] = [
  "fbclid",
  "fbc",
  "fbp",
  "meta_ad_id",
  "meta_adset_id",
  "meta_campaign_id",
  "meta_placement",
  "metaEventId",
  "pageUrl",
  "referrer",
  "submittedAt",
  "userAgent",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term"
];

function cookieValue(name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

export function createMetaEventId(funnel: MetaConversionFunnel) {
  if (window.crypto?.randomUUID) {
    return `${funnel}_${window.crypto.randomUUID()}`;
  }

  return `${funnel}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function fbcFromFbclid(fbclid: string) {
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : "";
}

function trackedStorageKey(eventId: string) {
  return `meta_complete_registration_${eventId}`;
}

function wasTracked(eventId: string) {
  try {
    return window.localStorage.getItem(trackedStorageKey(eventId)) === "1";
  } catch {
    return false;
  }
}

function markTracked(eventId: string) {
  try {
    window.localStorage.setItem(trackedStorageKey(eventId), "1");
  } catch {
    // Storage can be unavailable in private modes. Tracking should still proceed.
  }
}

export function trackMetaCompleteRegistration(funnel: MetaConversionFunnel, eventId: string) {
  if (!eventId || typeof window.fbq !== "function") {
    return false;
  }

  window.fbq("track", META_EVENT_NAME, metaConversionCustomData[funnel], { eventID: eventId });
  return true;
}

export function trackMetaCompleteRegistrationWhenReady(
  funnel: MetaConversionFunnel,
  eventId: string,
  options: { guard?: boolean; maxAttempts?: number } = {}
) {
  let cancelled = false;
  let attempts = 0;
  const guard = options.guard ?? true;
  const maxAttempts = options.maxAttempts ?? 20;

  const tick = () => {
    if (cancelled || !eventId) return;
    if (guard && wasTracked(eventId)) return;

    if (trackMetaCompleteRegistration(funnel, eventId)) {
      if (guard) markTracked(eventId);
      return;
    }

    attempts += 1;
    if (attempts < maxAttempts) {
      window.setTimeout(tick, 250);
    }
  };

  tick();

  return () => {
    cancelled = true;
  };
}

function collectTrackingFields(funnel: MetaConversionFunnel): MetaTrackingFields {
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid") || "";
  const fbc = cookieValue("_fbc") || fbcFromFbclid(fbclid);

  return {
    fbclid,
    fbc,
    fbp: cookieValue("_fbp"),
    meta_ad_id: params.get("meta_ad_id") || "",
    meta_adset_id: params.get("meta_adset_id") || "",
    meta_campaign_id: params.get("meta_campaign_id") || "",
    meta_placement: params.get("meta_placement") || "",
    metaEventId: createMetaEventId(funnel),
    pageUrl: window.location.href,
    referrer: document.referrer,
    submittedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_source: params.get("utm_source") || "",
    utm_term: params.get("utm_term") || ""
  };
}

export function MetaTrackingFields({ funnel }: { funnel: MetaConversionFunnel }) {
  const inputsRef = useRef<Partial<Record<MetaTrackingFieldName, HTMLInputElement>>>({});

  useEffect(() => {
    const fillFields = () => {
      const fields = collectTrackingFields(funnel);

      for (const [name, value] of Object.entries(fields)) {
        const input = inputsRef.current[name as MetaTrackingFieldName];
        if (input) input.value = value;
      }
    };

    fillFields();

    const firstInput = inputsRef.current.metaEventId;
    const form = firstInput?.closest("form");
    form?.addEventListener("submit", fillFields);

    return () => {
      form?.removeEventListener("submit", fillFields);
    };
  }, [funnel]);

  return (
    <>
      {fieldNames.map((name) => (
        <input
          defaultValue=""
          key={name}
          name={name}
          readOnly
          ref={(input) => {
            if (input) {
              inputsRef.current[name] = input;
            } else {
              delete inputsRef.current[name];
            }
          }}
          type="hidden"
        />
      ))}
    </>
  );
}

export function MetaConversionFromQuery() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("meta_event") !== META_EVENT_NAME) {
      return undefined;
    }

    const eventId = params.get("event_id")?.trim() || "";
    const funnel = params.get("funnel") || params.get("source");

    if (!eventId || !isMetaConversionFunnel(funnel)) {
      return undefined;
    }

    return trackMetaCompleteRegistrationWhenReady(funnel, eventId, { guard: true });
  }, []);

  return null;
}
