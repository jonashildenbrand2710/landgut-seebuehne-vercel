"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCcw
} from "lucide-react";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import type { BookingFlowField } from "@/data/booking-flow";
import type { BookingAppointmentType, BookingResponse, BookingSlot } from "@/lib/booking-api";
import { createMetaEventId, trackMetaCompleteRegistrationWhenReady } from "@/components/MetaConversionTracking";
import { buildEnhancedConversionUserData, trackGoogleAdsConversion } from "@/lib/google-ads-gtag";

type BookingFunnelProps = {
  appointmentType: BookingAppointmentType;
  description: string;
  durationMinutes: number;
  fields: BookingFlowField[];
  flowId: string;
  flowVersion: string;
  heading: string;
  rangeDays: number;
  sourceLabel: string;
};

type BookingContact = {
  email: string;
  name: string;
  phone: string;
};

type LoadingState = "idle" | "loading" | "success" | "error";
type StepId = "slot" | "contact" | "questions" | "review";

const siteName = "landgut-seebuehne-vercel";
const timeZone = "Europe/Berlin";
const steps: Array<{ id: StepId; label: string }> = [
  { id: "slot", label: "Termin" },
  { id: "contact", label: "Kontakt" },
  { id: "questions", label: "Eckpunkte" },
  { id: "review", label: "Prüfen" }
];

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function cookieValue(name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

function trackingPayload() {
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid") || "";
  const fbp = cookieValue("_fbp");
  const fbc = cookieValue("_fbc") || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : "");

  return {
    capturedAt: new Date().toISOString(),
    fbc,
    fbclid,
    fbp,
    meta_ad_id: params.get("meta_ad_id") || "",
    meta_adset_id: params.get("meta_adset_id") || "",
    meta_campaign_id: params.get("meta_campaign_id") || "",
    meta_placement: params.get("meta_placement") || "",
    landingPageUrl: window.location.href,
    pageUrl: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_source: params.get("utm_source") || "",
    utm_term: params.get("utm_term") || "",
    meta: {
      ad_id: params.get("meta_ad_id") || "",
      adset_id: params.get("meta_adset_id") || "",
      campaign_id: params.get("meta_campaign_id") || "",
      placement: params.get("meta_placement") || ""
    },
    utm: {
      campaign: params.get("utm_campaign") || "",
      content: params.get("utm_content") || "",
      medium: params.get("utm_medium") || "",
      source: params.get("utm_source") || "",
      term: params.get("utm_term") || ""
    }
  };
}

function eventIdFor(appointmentType: BookingAppointmentType) {
  if (appointmentType === "phone") {
    return createMetaEventId("erstgespraech");
  }

  if (window.crypto?.randomUUID) {
    return `website_booking_${appointmentType}_${window.crypto.randomUUID()}`;
  }

  return `website_booking_${appointmentType}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function localDateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric"
  }).formatToParts(date);
  const record = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${record.year}-${record.month}-${record.day}`;
}

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function weekdayIndex(date: Date) {
  const name = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(date);
  return Math.max(0, weekdayNames.indexOf(name));
}

function formatDayNumber(date: Date) {
  return new Intl.DateTimeFormat("de-DE", { day: "numeric", timeZone }).format(date);
}

function formatWeekRange(start: Date, end: Date) {
  const dayMonth = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", timeZone });
  const monthOf = new Intl.DateTimeFormat("de-DE", { month: "numeric", timeZone });

  if (monthOf.format(start) === monthOf.format(end)) {
    return `${formatDayNumber(start)}. – ${dayMonth.format(end)}`;
  }

  return `${dayMonth.format(start)} – ${dayMonth.format(end)}`;
}

function formatFullDay(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    timeZone,
    weekday: "long"
  }).format(date);
}

function formatSlotDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeZone
  }).format(new Date(value));
}

function formatSlotTime(slot: BookingSlot) {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: slot.timezone || timeZone
  }).format(new Date(slot.start));
}

function formatReviewSlot(slot: BookingSlot | null) {
  if (!slot) return "Noch offen";
  return `${formatSlotDate(slot.start)}, ${formatSlotTime(slot)} Uhr`;
}

async function postJson<T>(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = data && typeof data.error === "string" ? data.error : "Anfrage fehlgeschlagen.";
    throw new Error(error);
  }

  return data as T;
}

function answerLabel(field: BookingFlowField, value: string) {
  if (!value) return "Noch offen";
  return field.options?.find((option) => option === value) || value;
}

function validateEmail(value: string) {
  const trimmed = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function phoneValidationMessage(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return "Bitte gebt eine Telefonnummer an.";
  if (!/^[+\d\s()/.-]+$/.test(trimmed)) {
    return "Bitte nutzt nur Zahlen, +, Leerzeichen, /, - oder Klammern.";
  }

  const digitCount = trimmed.replace(/\D/g, "").length;
  if (digitCount < 7) return "Bitte gebt eine Telefonnummer mit mindestens 7 Ziffern ein.";
  if (digitCount > 16) return "Bitte prüft die Telefonnummer, sie wirkt zu lang.";

  return "";
}

export function BookingFunnel({
  appointmentType,
  description,
  durationMinutes,
  fields,
  flowId,
  flowVersion,
  heading,
  rangeDays,
  sourceLabel
}: BookingFunnelProps) {
  const [activeStep, setActiveStep] = useState<StepId>("slot");
  const [availabilityState, setAvailabilityState] = useState<LoadingState>("idle");
  const [bookingState, setBookingState] = useState<LoadingState>("idle");
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedDayKey, setSelectedDayKey] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [weekIndex, setWeekIndex] = useState(0);
  const [contact, setContact] = useState<BookingContact>({
    email: "",
    name: "",
    phone: ""
  });
  const [contactTouched, setContactTouched] = useState<Record<keyof BookingContact, boolean>>({
    email: false,
    name: false,
    phone: false
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId) || null,
    [selectedSlotId, slots]
  );
  const slotsByDay = useMemo(() => {
    const groups = new Map<string, BookingSlot[]>();
    for (const slot of slots) {
      const key = localDateKey(slot.start);
      groups.set(key, [...(groups.get(key) || []), slot]);
    }

    return groups;
  }, [slots]);
  const days = useMemo(
    () =>
      Array.from({ length: rangeDays }, (_, index) => {
        const date = addDays(new Date(), index + 1);
        const key = localDateKey(date);
        return {
          date,
          key,
          slots: slotsByDay.get(key) || []
        };
      }),
    [rangeDays, slotsByDay]
  );
  // Wochenuebersicht wie bei Calendly: der buchbare Zeitraum wird auf volle
  // Montag-Sonntag-Wochen aufgefuellt, Tage ausserhalb bleiben ausgegraut.
  const weeks = useMemo(() => {
    if (!days.length) return [];

    const inRange = new Map(days.map((day) => [day.key, day]));
    const monday = addDays(days[0].date, -weekdayIndex(days[0].date));
    const totalCells = Math.ceil((weekdayIndex(days[0].date) + days.length) / 7) * 7;
    const cells = Array.from({ length: totalCells }, (_, index) => {
      const date = addDays(monday, index);
      const key = localDateKey(date);
      const day = inRange.get(key);

      return {
        date,
        hasSlots: Boolean(day?.slots.length),
        inRange: Boolean(day),
        key
      };
    });

    return Array.from({ length: totalCells / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
  }, [days]);
  const currentWeek = weeks[Math.min(weekIndex, Math.max(0, weeks.length - 1))] || [];
  const selectedDay = selectedDayKey ? days.find((day) => day.key === selectedDayKey) || null : null;
  const visibleSlots = selectedDayKey ? slotsByDay.get(selectedDayKey) || [] : [];
  const activeStepIndex = steps.findIndex((step) => step.id === activeStep);
  const contactValidation = useMemo(() => {
    const nameValid = contact.name.trim().length >= 2;
    const emailValid = validateEmail(contact.email);
    const phoneMessage = phoneValidationMessage(contact.phone);

    return {
      complete: nameValid && emailValid && !phoneMessage,
      emailValid,
      nameValid,
      phoneMessage
    };
  }, [contact]);
  const contactComplete = contactValidation.complete;
  const questionsComplete = fields.every((field) => !field.required || answers[field.id]?.trim());

  const canVisitStep = (step: StepId) => {
    if (step === "slot") return true;
    if (step === "contact") return Boolean(selectedSlot);
    if (step === "questions") return Boolean(selectedSlot && contactComplete);
    return Boolean(selectedSlot && contactComplete && questionsComplete);
  };

  const loadAvailability = async () => {
    setAvailabilityState("loading");
    setAvailabilityError("");

    try {
      const from = addDays(new Date(), 1);
      const to = addDays(from, rangeDays);
      const availability = await postJson<{ slots?: BookingSlot[] }>("/api/booking/availability", {
        appointmentType,
        durationMinutes,
        flowId,
        flowVersion,
        range: {
          from: from.toISOString(),
          to: to.toISOString()
        }
      });
      const nextSlots = availability.slots ?? [];
      setSlots(nextSlots);
      setSelectedSlotId("");
      // Bewusst kein Tag vorausgewaehlt: erst Tag waehlen, dann erscheinen die Slots.
      setSelectedDayKey("");
      setWeekIndex(0);
      setAvailabilityState("success");
    } catch (loadError) {
      setAvailabilityState("error");
      setAvailabilityError(
        loadError instanceof Error ? loadError.message : "Freie Termine konnten nicht geladen werden."
      );
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadAvailability();
    }, 0);

    return () => window.clearTimeout(timeout);
    // loadAvailability intentionally reads the current props listed below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentType, durationMinutes, flowId, flowVersion, rangeDays]);

  const goToStep = (step: StepId) => {
    const nextIndex = steps.findIndex((item) => item.id === step);
    if (nextIndex <= activeStepIndex) {
      setActiveStep(step);
      return;
    }

    if (canVisitStep(step)) setActiveStep(step);
  };

  const updateContact = (field: keyof BookingContact, value: string) => {
    setContact((current) => ({ ...current, [field]: value }));
    setContactTouched((current) => ({ ...current, [field]: true }));
  };

  const markContactTouched = (field: keyof BookingContact) => {
    setContactTouched((current) => ({ ...current, [field]: true }));
  };

  const updateAnswer = (field: string, value: string) => {
    setAnswers((current) => ({ ...current, [field]: value }));
  };

  const handleChoiceKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    field: BookingFlowField,
    optionIndex: number
  ) => {
    const options = field.options || [];
    if (!options.length) return;

    let nextIndex = -1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (optionIndex + 1) % options.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (optionIndex - 1 + options.length) % options.length;
    }

    if (nextIndex < 0) return;

    event.preventDefault();
    updateAnswer(field.id, options[nextIndex]);

    const group = event.currentTarget.closest('[role="radiogroup"]');
    const radios = group?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    radios?.[nextIndex]?.focus();
  };

  const submitBooking = async () => {
    if (!selectedSlot) {
      setError("Bitte wählt zuerst einen freien Slot aus.");
      setActiveStep("slot");
      return;
    }

    if (!contactComplete) {
      setError("Bitte prüft die Kontaktdaten.");
      setActiveStep("contact");
      return;
    }

    setBookingState("loading");
    setError("");

    try {
      const eventId = eventIdFor(appointmentType);
      const booking = await postJson<BookingResponse>("/api/booking/book", {
        answers,
        booking: {
          desiredYear: answers.desiredYear,
          durationMinutes,
          guestRange: answers.guestRange,
          note: answers.note,
          slot: {
            end: selectedSlot.end,
            start: selectedSlot.start,
            timezone: selectedSlot.timezone || timeZone
          },
          type: appointmentType,
          weddingType: answers.weddingType
        },
        contact,
        eventId,
        flowId,
        flowVersion,
        source: {
          page: window.location.pathname,
          site: siteName
        },
        tracking: trackingPayload()
      });
      setBookingResult(booking);
      setBookingState("success");

      if (appointmentType === "phone") {
        trackMetaCompleteRegistrationWhenReady("erstgespraech", eventId, { guard: true });
      }

      // Google Ads "Termin erfolgreich gebucht": nur nach serverseitig
      // bestätigter, im Kalender gespeicherter Buchung. Die persistierte
      // Lead-ID dient als stabile transaction_id (dedupliziert Reloads und
      // Umbuchungen); Kalender-Fehler liefern von der Booking-API kein 2xx.
      const confirmedBookingId = booking.lead?.id?.trim() || booking.google_calendar?.eventId?.trim() || "";
      const calendarConfirmed =
        booking.google_calendar?.synced === true || Boolean(booking.google_calendar?.eventId);

      if (confirmedBookingId && calendarConfirmed) {
        void buildEnhancedConversionUserData(contact).then((userData) => {
          trackGoogleAdsConversion("book_appointment", confirmedBookingId, userData || undefined);
        });
      }
    } catch (submitError) {
      setBookingState("error");
      setError(submitError instanceof Error ? submitError.message : "Termin konnte nicht gebucht werden.");
    }
  };

  const stepper = (
    <ol className="booking-progress" aria-label="Buchungsschritte">
      {steps.map((step, index) => (
        <li className={index === activeStepIndex ? "is-active" : index < activeStepIndex ? "is-complete" : ""} key={step.id}>
          <button
            aria-current={index === activeStepIndex ? "step" : undefined}
            disabled={!canVisitStep(step.id)}
            type="button"
            onClick={() => goToStep(step.id)}
          >
            <span>{index < activeStepIndex ? <CheckCircle2 aria-hidden="true" size={14} /> : index + 1}</span>
            {step.label}
          </button>
        </li>
      ))}
    </ol>
  );

  if (bookingResult) {
    return (
      <section className={`booking-panel booking-panel-${appointmentType}`} aria-labelledby="booking-success-title">
        <div className="booking-panel-head">
          <CalendarCheck aria-hidden="true" size={24} />
          <div>
            <p className="eyebrow dark">{sourceLabel}</p>
            <h2 id="booking-success-title">Termin ist gebucht.</h2>
          </div>
        </div>
        <div className="booking-success-box">
          <p>
            Danke, wir haben den Termin gespeichert und im Kalender angelegt.
            Eine persönliche Rückmeldung erfolgt, falls noch etwas offen ist.
          </p>
          <dl className="booking-review-list">
            <div>
              <dt>Termin</dt>
              <dd>{formatReviewSlot(selectedSlot)}</dd>
            </div>
            {bookingResult.lead?.leadNumber ? (
              <div>
                <dt>CRM-Referenz</dt>
                <dd>L-{String(bookingResult.lead.leadNumber).padStart(4, "0")}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>
    );
  }

  return (
    <section className={`booking-panel booking-panel-${appointmentType}`} aria-labelledby="booking-title">
      <div className="booking-panel-head">
        <CalendarDays aria-hidden="true" size={24} />
        <div>
          <p className="eyebrow dark">{sourceLabel}</p>
          <h2 id="booking-title">{heading}</h2>
        </div>
      </div>
      <p>{description}</p>
      {stepper}

      {activeStep === "slot" ? (
        <div className="booking-step">
          <div className="booking-step-title">
            <div>
              <h3>Freie Terminzeit wählen</h3>
              <p>Die Verfügbarkeit wird live mit dem Kalender abgeglichen.</p>
            </div>
            <button className="booking-refresh" type="button" onClick={loadAvailability}>
              <RefreshCcw aria-hidden="true" size={16} />
              <span>Neu laden</span>
            </button>
          </div>

          {availabilityState === "loading" ? (
            <p className="booking-inline-state">
              <LoaderCircle aria-hidden="true" className="booking-spinner" size={18} />
              Termine werden mit dem Kalender abgeglichen.
            </p>
          ) : null}

          {availabilityState === "error" ? (
            <div role="alert">
              <p className="booking-error">
                Die freien Termine konnten nicht geladen werden. {availabilityError}
              </p>
              <div className="booking-actions">
                <button className="booking-refresh" type="button" onClick={loadAvailability}>
                  <RefreshCcw aria-hidden="true" size={16} />
                  <span>Erneut versuchen</span>
                </button>
              </div>
            </div>
          ) : null}

          {availabilityState === "success" && !slots.length ? (
            <p className="booking-note" aria-live="polite">
              Aktuell wurden keine freien Termine in den nächsten zehn Tagen gefunden.
            </p>
          ) : null}

          {currentWeek.length && availabilityState !== "error" ? (
            <div className="booking-calendar" aria-label="Tag wählen">
              <div className="booking-week-nav">
                <button
                  aria-label="Vorherige Woche"
                  className="booking-week-arrow"
                  disabled={weekIndex === 0}
                  onClick={() => setWeekIndex((index) => Math.max(0, index - 1))}
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" size={18} />
                </button>
                <p aria-live="polite">{formatWeekRange(currentWeek[0].date, currentWeek[6].date)}</p>
                <button
                  aria-label="Nächste Woche"
                  className="booking-week-arrow"
                  disabled={weekIndex >= weeks.length - 1}
                  onClick={() => setWeekIndex((index) => Math.min(weeks.length - 1, index + 1))}
                  type="button"
                >
                  <ChevronRight aria-hidden="true" size={18} />
                </button>
              </div>
              <div className="booking-week-head" aria-hidden="true">
                {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((weekday) => (
                  <span key={weekday}>{weekday}</span>
                ))}
              </div>
              <div className="booking-week-grid">
                {currentWeek.map((cell) => {
                  const selectable = cell.inRange && cell.hasSlots && availabilityState === "success";
                  const className = [
                    "booking-week-day",
                    cell.key === selectedDayKey ? "is-selected" : "",
                    selectable ? "is-available" : ""
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      aria-label={formatFullDay(cell.date)}
                      aria-pressed={cell.key === selectedDayKey}
                      className={className}
                      disabled={!selectable}
                      key={cell.key}
                      onClick={() => {
                        setSelectedDayKey(cell.key);
                        setSelectedSlotId("");
                      }}
                      type="button"
                    >
                      {formatDayNumber(cell.date)}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {selectedDay ? (
            visibleSlots.length ? (
              <div className="booking-slot-block">
                <p className="booking-slot-day">{formatFullDay(selectedDay.date)}</p>
                <div className="booking-slot-grid compact" role="radiogroup" aria-label="Freie Uhrzeiten">
                  {visibleSlots.map((slot) => (
                    <label className={slot.id === selectedSlotId ? "booking-slot is-selected" : "booking-slot"} key={slot.id}>
                      <input
                        checked={slot.id === selectedSlotId}
                        name="slot"
                        onChange={() => setSelectedSlotId(slot.id)}
                        type="radio"
                        value={slot.id}
                      />
                      <span>{formatSlotTime(slot)} Uhr</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : availabilityState === "success" ? (
              <p className="booking-note">An diesem Tag ist aktuell kein Termin frei. Wählt einen anderen Tag.</p>
            ) : null
          ) : availabilityState === "success" && slots.length ? (
            <p className="booking-hint">Wählt zuerst einen Tag – danach erscheinen die freien Uhrzeiten.</p>
          ) : null}

          {selectedSlot ? (
            <p className="booking-selection-note">Ausgewählt: {formatReviewSlot(selectedSlot)}</p>
          ) : null}

          <div className="booking-actions">
            <button className="button primary" disabled={!selectedSlot} onClick={() => goToStep("contact")} type="button">
              <span>Weiter</span>
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </div>
      ) : null}

      {activeStep === "contact" ? (
        <form
          className="booking-step booking-contact-form"
          onSubmit={(event) => {
            event.preventDefault();
            setContactTouched({ email: true, name: true, phone: true });
            if (contactComplete) {
              setError("");
              goToStep("questions");
            }
          }}
        >
          <h3>Kontaktdaten</h3>
          <p>Damit wir den Termin zuordnen und euch erreichen können.</p>
          <div className="booking-field-grid">
            <label className="booking-field">
              <span>Name</span>
              <input
                autoComplete="name"
                aria-invalid={contactTouched.name && !contactValidation.nameValid ? true : undefined}
                name="name"
                onBlur={() => markContactTouched("name")}
                onChange={(event) => updateContact("name", event.target.value)}
                placeholder="Vor- und Nachname"
                required
                type="text"
                value={contact.name}
              />
              {contactTouched.name && !contactValidation.nameValid ? (
                <small aria-live="polite" className="booking-field-message">
                  Bitte gebt euren Namen ein.
                </small>
              ) : null}
            </label>
            <label className="booking-field">
              <span>E-Mail</span>
              <input
                autoComplete="email"
                aria-invalid={contactTouched.email && !contactValidation.emailValid ? true : undefined}
                inputMode="email"
                name="email"
                onBlur={() => markContactTouched("email")}
                onChange={(event) => updateContact("email", event.target.value)}
                placeholder="name@beispiel.de"
                required
                type="email"
                value={contact.email}
              />
              {contactTouched.email && !contactValidation.emailValid ? (
                <small aria-live="polite" className="booking-field-message">
                  Bitte gebt eine gültige E-Mail-Adresse ein.
                </small>
              ) : null}
            </label>
            <label className="booking-field">
              <span>Telefon</span>
              <input
                autoComplete="tel"
                aria-describedby="booking-phone-hint"
                aria-invalid={contactTouched.phone && Boolean(contactValidation.phoneMessage) ? true : undefined}
                inputMode="tel"
                name="phone"
                onBlur={() => markContactTouched("phone")}
                onChange={(event) => updateContact("phone", event.target.value)}
                pattern="[+0-9\\s()/.-]{7,}"
                placeholder="+49 170 1234567"
                required
                type="tel"
                value={contact.phone}
              />
              <small
                aria-live="polite"
                className={contactTouched.phone && contactValidation.phoneMessage ? "booking-field-message" : ""}
                id="booking-phone-hint"
              >
                {contactTouched.phone && contactValidation.phoneMessage
                  ? contactValidation.phoneMessage
                  : "Für Rückfragen zum Termin."}
              </small>
            </label>
          </div>
          <div className="booking-actions">
            <button className="button secondary" onClick={() => setActiveStep("slot")} type="button">
              <ArrowLeft aria-hidden="true" size={18} />
              <span>Zurück</span>
            </button>
            <button className="button primary" disabled={!contactComplete} type="submit">
              <span>Weiter</span>
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </form>
      ) : null}

      {activeStep === "questions" ? (
        <form
          className="booking-step"
          onSubmit={(event) => {
            event.preventDefault();
            if (questionsComplete) goToStep("review");
          }}
        >
          <h3>Eckpunkte</h3>
          <p>Nur wenige Angaben, damit das Gespräch direkt sinnvoll startet.</p>
          <div className="booking-field-grid questions">
            {fields.map((field) => (
              <label className="booking-field" key={field.id}>
                <span>{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.id}
                    onChange={(event) => updateAnswer(field.id, event.target.value)}
                    required={field.required}
                    rows={4}
                    value={answers[field.id] || ""}
                  />
                ) : field.type === "select" ? (
                  <div className="booking-choice-group" role="radiogroup" aria-label={field.label}>
                    {field.options?.map((option, optionIndex) => {
                      const isSelected = answers[field.id] === option;
                      const selectedIndex = field.options?.indexOf(answers[field.id] || "") ?? -1;
                      const focusIndex = selectedIndex >= 0 ? selectedIndex : 0;

                      return (
                        <button
                          aria-checked={isSelected}
                          className={isSelected ? "booking-choice is-selected" : "booking-choice"}
                          key={option}
                          onClick={() => updateAnswer(field.id, option)}
                          onKeyDown={(event) => handleChoiceKeyDown(event, field, optionIndex)}
                          role="radio"
                          tabIndex={optionIndex === focusIndex ? 0 : -1}
                          type="button"
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    name={field.id}
                    onChange={(event) => updateAnswer(field.id, event.target.value)}
                    required={field.required}
                    type="text"
                    value={answers[field.id] || ""}
                  />
                )}
                {field.helper ? <small>{field.helper}</small> : null}
              </label>
            ))}
          </div>
          <div className="booking-actions">
            <button className="button secondary" onClick={() => setActiveStep("contact")} type="button">
              <ArrowLeft aria-hidden="true" size={18} />
              <span>Zurück</span>
            </button>
            <button className="button primary" disabled={!questionsComplete} type="submit">
              <span>Prüfen</span>
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </form>
      ) : null}

      {activeStep === "review" ? (
        <div className="booking-step">
          <h3>Prüfen und buchen</h3>
          <dl className="booking-review-list">
            <div>
              <dt>Termin</dt>
              <dd>{formatReviewSlot(selectedSlot)}</dd>
            </div>
            <div>
              <dt>Name</dt>
              <dd>{contact.name || "Noch offen"}</dd>
            </div>
            <div>
              <dt>E-Mail</dt>
              <dd>{contact.email || "Noch offen"}</dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd>{contact.phone || "Noch offen"}</dd>
            </div>
            {fields.map((field) => (
              <div key={field.id}>
                <dt>{field.label}</dt>
                <dd>{answerLabel(field, answers[field.id] || "")}</dd>
              </div>
            ))}
          </dl>

          {error ? (
            <p className="booking-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="booking-actions">
            <button className="button secondary" onClick={() => setActiveStep("questions")} type="button">
              <ArrowLeft aria-hidden="true" size={18} />
              <span>Zurück</span>
            </button>
            <button className="button primary" disabled={bookingState === "loading"} onClick={submitBooking} type="button">
              {bookingState === "loading" ? (
                <LoaderCircle aria-hidden="true" className="booking-spinner" size={18} />
              ) : (
                <CalendarCheck aria-hidden="true" size={18} />
              )}
              <span>{bookingState === "loading" ? "Termin wird gebucht" : "Termin buchen"}</span>
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
