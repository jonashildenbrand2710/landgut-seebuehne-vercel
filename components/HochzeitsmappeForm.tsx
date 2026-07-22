"use client";

import { BookOpenCheck, KeyRound, LoaderCircle } from "lucide-react";
import { type FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { FormStatusMessage } from "@/components/FormStatusMessage";
import { MetaTrackingFields } from "@/components/MetaConversionTracking";

const statusMessages: Record<string, string> = {
  missing: "Bitte füllt alle Pflichtfelder aus.",
  "invalid-email": "Bitte prüft eure E-Mail-Adresse.",
  "invalid-phone": "Bitte prüft eure Telefonnummer.",
  "access-required":
    "Diese Online-Hochzeitsmappe ist persönlich geschützt. Tragt euch bitte kurz ein, um sie zu öffnen.",
  "access-invalid":
    "Euer Zugangslink ist ungültig oder abgelaufen. Fordert hier einfach einen neuen persönlichen Zugang an."
};

export function HochzeitsmappeForm() {
  const submitLocked = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const resetSubmission = () => {
      submitLocked.current = false;
      setIsSubmitting(false);
    };

    window.addEventListener("pageshow", resetSubmission);
    return () => window.removeEventListener("pageshow", resetSubmission);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (submitLocked.current) {
      event.preventDefault();
      return;
    }

    submitLocked.current = true;
    setIsSubmitting(true);
  }

  return (
    <form
      action="/api/hochzeitsmappe"
      aria-busy={isSubmitting}
      className="mappe-form-card"
      id="mappe-form"
      method="post"
      onSubmit={handleSubmit}
    >
      <BookOpenCheck aria-hidden="true" size={24} />
      <h3>Online-Hochzeitsmappe öffnen</h3>
      <Suspense fallback={null}>
        <FormStatusMessage messages={statusMessages} />
      </Suspense>
      <p>
        Bestätigt kurz eure Kontaktdaten. Direkt danach öffnet sich euer persönlicher
        Online-Zugang – und ihr erhaltet den Link zusätzlich per E-Mail.
      </p>
      <input
        aria-hidden="true"
        autoComplete="off"
        className="mappe-honeypot"
        name="website"
        tabIndex={-1}
        type="text"
      />
      <MetaTrackingFields funnel="hochzeitsmappe" />
      <div className="mappe-field-grid">
        <label className="mappe-field">
          <span>Vorname</span>
          <input autoComplete="given-name" name="firstName" required type="text" />
        </label>
        <label className="mappe-field">
          <span>Nachname</span>
          <input autoComplete="family-name" name="lastName" required type="text" />
        </label>
        <label className="mappe-field">
          <span>E-Mail</span>
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label className="mappe-field">
          <span>Telefon</span>
          <input autoComplete="tel" name="phone" required type="tel" />
        </label>
      </div>
      <button className="button primary mappe-submit-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <LoaderCircle aria-hidden="true" className="mappe-submit-spinner" size={18} />
        ) : (
          <KeyRound aria-hidden="true" size={18} />
        )}
        <span>{isSubmitting ? "Zugang wird vorbereitet …" : "Online-Hochzeitsmappe öffnen"}</span>
      </button>
      <div aria-atomic="true" aria-live="polite" className="mappe-submit-live" role="status">
        {isSubmitting ? (
          <p className="mappe-submit-state">
            Einen Moment bitte – wir speichern eure Anfrage und öffnen euren Zugang.
          </p>
        ) : null}
      </div>
      <p className="mappe-form-note">
        Wir verwenden eure Angaben für den persönlichen Zugang zur Hochzeitsmappe,
        den E-Mail-Versand und die Begleitung eurer Anfrage.
      </p>
    </form>
  );
}
