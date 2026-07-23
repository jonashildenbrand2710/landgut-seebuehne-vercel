"use client";

import { BookOpenCheck, KeyRound } from "lucide-react";
import { type FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { FormStatusMessage } from "@/components/FormStatusMessage";
import { MetaTrackingFields } from "@/components/MetaConversionTracking";

const statusMessages: Record<string, string> = {
  missing: "Bitte füllt alle Pflichtfelder aus.",
  "invalid-email": "Bitte prüft eure E-Mail-Adresse.",
  "invalid-phone": "Bitte prüft eure Telefonnummer."
};

export function HochzeitsmappeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const submitFrameRef = useRef<number | null>(null);
  const submitLocked = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const resetSubmission = () => {
      if (submitFrameRef.current !== null) {
        window.cancelAnimationFrame(submitFrameRef.current);
        submitFrameRef.current = null;
      }
      submitLocked.current = false;
      setIsSubmitting(false);
    };
    const anchorFrame = window.requestAnimationFrame(() => {
      if (window.location.hash === "#mappe-form") {
        formRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      }
    });

    window.addEventListener("pageshow", resetSubmission);
    return () => {
      window.cancelAnimationFrame(anchorFrame);
      if (submitFrameRef.current !== null) {
        window.cancelAnimationFrame(submitFrameRef.current);
      }
      window.removeEventListener("pageshow", resetSubmission);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLocked.current) {
      return;
    }

    const form = event.currentTarget;

    submitLocked.current = true;
    setIsSubmitting(true);

    // Give React and the browser one complete paint before starting the native
    // navigation. The animated state then stays visible while a slow request is
    // still in flight instead of appearing as a frozen button.
    submitFrameRef.current = window.requestAnimationFrame(() => {
      submitFrameRef.current = window.requestAnimationFrame(() => {
        submitFrameRef.current = null;
        form.submit();
      });
    });
  }

  return (
    <form
      ref={formRef}
      action="/api/hochzeitsmappe"
      aria-busy={isSubmitting}
      className={isSubmitting ? "mappe-form-card is-submitting" : "mappe-form-card"}
      id="mappe-form"
      method="post"
      onSubmit={handleSubmit}
    >
      <BookOpenCheck aria-hidden="true" size={24} />
      <h3>Preise &amp; Leistungsbausteine anfordern</h3>
      <Suspense fallback={null}>
        <FormStatusMessage messages={statusMessages} />
      </Suspense>
      <p>
        Bestätigt kurz eure Kontaktdaten. Direkt danach senden wir euch den Link zur
        Preisübersicht und zu den Leistungsbausteinen per E-Mail.
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
          <span aria-hidden="true" className="mappe-submit-spinner" />
        ) : (
          <KeyRound aria-hidden="true" size={18} />
        )}
        <span>{isSubmitting ? "Preise werden angefordert …" : "Jetzt Preise anfordern"}</span>
      </button>
      <div aria-hidden="true" className="mappe-submit-progress">
        <span />
      </div>
      <div aria-atomic="true" aria-live="polite" className="mappe-submit-live" role="status">
        {isSubmitting ? (
          <p className="mappe-submit-state">
            Einen Moment bitte – wir speichern eure Anfrage und bereiten die E-Mail vor.
          </p>
        ) : null}
      </div>
      <p className="mappe-form-note">
        Wir verwenden eure Angaben für den Versand der Preisübersicht und die weitere
        Begleitung eurer Anfrage per E-Mail. Ihr könnt euch jederzeit wieder abmelden.
      </p>
    </form>
  );
}
