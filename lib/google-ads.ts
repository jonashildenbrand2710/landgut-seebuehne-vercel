export type GoogleAdsConfig = {
  tagId: string;
  bookingLabel: string;
  analyticsOptOutIds?: string[];
};

export function googleAdsAnalyticsOptOutIds(value?: string) {
  return [...new Set((value || "").split(/[\s,]+/).filter((id) => /^G-[A-Z0-9]+$/.test(id)))];
}

export function googleAdsConfigFromValues(values: {
  enabled?: string;
  tagId?: string;
  bookingLabel?: string;
  analyticsOptOutIds?: string;
}): GoogleAdsConfig | null {
  const tagId = values.tagId?.trim() || "";
  const bookingLabel = values.bookingLabel?.trim() || "";
  if (
    values.enabled !== "true" ||
    !/^AW-\d+$/.test(tagId) ||
    !/^[A-Za-z0-9_-]+$/.test(bookingLabel)
  ) {
    return null;
  }
  const analyticsOptOutIds = googleAdsAnalyticsOptOutIds(values.analyticsOptOutIds);
  return { tagId, bookingLabel, ...(analyticsOptOutIds.length ? { analyticsOptOutIds } : {}) };
}

// Explicit activation follows approval of the Google consent/privacy copy.
export const GOOGLE_ADS_CONFIG = googleAdsConfigFromValues({
  enabled: process.env.NEXT_PUBLIC_GOOGLE_ADS_ENABLED,
  tagId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  bookingLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL,
  analyticsOptOutIds: process.env.NEXT_PUBLIC_GOOGLE_ADS_ANALYTICS_OPT_OUT_IDS
});

export type GoogleAdsBooking = {
  booking?: { status?: string };
  google_calendar?: { synced?: boolean; eventId?: string };
};

export type GoogleAdsHost = {
  disableAnalytics: (measurementIds: readonly string[]) => void;
  command: (...args: unknown[]) => void;
  loadTag: (tagId: string) => void;
  pageLocation: () => string;
  storage?: Pick<Storage, "getItem" | "setItem">;
};

export function googleAdsPageLocation(href: string) {
  const url = new URL(href);
  const clean = new URL(url.pathname, url.origin);
  // Preserve attribution without leaking online-map access tokens or other queries.
  for (const name of ["gclid", "gbraid", "wbraid"]) {
    const value = url.searchParams.get(name);
    if (value) clean.searchParams.set(name, value);
  }
  return clean.toString();
}

const deniedConsent = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied"
};

const measurementConsent = {
  ...deniedConsent,
  ad_storage: "granted",
  ad_user_data: "granted"
};

export function createGoogleAdsTracker(config: GoogleAdsConfig, host: GoogleAdsHost) {
  let consent = false;
  let initialized = false;
  const tracked = new Set<string>();

  function setConsent(granted: boolean) {
    consent = granted;
    if (!granted) {
      if (initialized) host.command("consent", "update", deniedConsent);
      return;
    }

    if (initialized) {
      host.command("consent", "update", measurementConsent);
      return;
    }

    // The existing Google tag can have linked Analytics destinations. Keep them off.
    if (config.analyticsOptOutIds?.length) host.disableAnalytics(config.analyticsOptOutIds);
    host.command("consent", "default", deniedConsent);
    host.command("set", "ads_data_redaction", true);
    host.command("consent", "update", measurementConsent);
    host.command("js", new Date());
    host.command("config", config.tagId, {
      allow_ad_personalization_signals: false,
      allow_enhanced_conversions: false,
      send_page_view: false,
      page_location: googleAdsPageLocation(host.pageLocation()),
      page_referrer: ""
    });
    host.loadTag(config.tagId);
    initialized = true;
  }

  function trackBooking(
    booking: GoogleAdsBooking,
    transactionId: string,
    appointmentType: "phone" | "tour"
  ) {
    if (
      !consent ||
      !initialized ||
      !transactionId ||
      booking.booking?.status === "preview" ||
      booking.google_calendar?.synced !== true ||
      !booking.google_calendar.eventId
    ) {
      return false;
    }

    const key = `google_ads_booking_${config.tagId}_${config.bookingLabel}_${transactionId}`;
    if (tracked.has(key)) return false;
    try {
      if (host.storage?.getItem(key) === "1") return false;
    } catch {
      // The in-memory guard and Google transaction ID also cover blocked storage.
    }

    host.command("event", "conversion", {
      send_to: `${config.tagId}/${config.bookingLabel}`,
      transaction_id: transactionId,
      appointment_type: appointmentType,
      page_location: googleAdsPageLocation(host.pageLocation()),
      page_referrer: ""
    });
    tracked.add(key);
    try {
      host.storage?.setItem(key, "1");
    } catch {
      // A consented conversion can still be queued without persistent storage.
    }
    return true;
  }

  return { setConsent, trackBooking };
}

type GoogleAdsTracker = ReturnType<typeof createGoogleAdsTracker>;
let activeTracker: GoogleAdsTracker | null = null;

export function registerGoogleAdsTracker(tracker: GoogleAdsTracker) {
  activeTracker = tracker;
  return () => {
    if (activeTracker === tracker) activeTracker = null;
  };
}

export function trackGoogleAdsBooking(
  booking: GoogleAdsBooking,
  transactionId: string,
  appointmentType: "phone" | "tour"
) {
  try {
    return activeTracker?.trackBooking(booking, transactionId, appointmentType) ?? false;
  } catch {
    // Optional advertising measurement must never turn a successful booking into an error.
    return false;
  }
}
