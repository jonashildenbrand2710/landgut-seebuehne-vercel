"use client";

import { readStoredConsent } from "@/lib/consent";
import {
  TIKTOK_EVENT_NAME,
  tiktokCompleteRegistrationData,
  type TikTokConversionFunnel
} from "@/lib/tiktok-events";

type TikTokQueue = {
  track?: (
    eventName: string,
    properties: Record<string, string>,
    options: { event_id: string }
  ) => void;
};

declare global {
  interface Window {
    ttq?: TikTokQueue;
  }
}

function trackedStorageKey(eventId: string) {
  return `tiktok_complete_registration_${eventId}`;
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

function trackTikTokCompleteRegistration(funnel: TikTokConversionFunnel, eventId: string) {
  if (
    !eventId ||
    readStoredConsent() !== "granted" ||
    typeof window.ttq?.track !== "function"
  ) {
    return false;
  }

  window.ttq.track(TIKTOK_EVENT_NAME, tiktokCompleteRegistrationData[funnel], {
    event_id: eventId
  });
  return true;
}

export function trackTikTokCompleteRegistrationWhenReady(
  funnel: TikTokConversionFunnel,
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

    if (trackTikTokCompleteRegistration(funnel, eventId)) {
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
