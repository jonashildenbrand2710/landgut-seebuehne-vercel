"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Headphones,
  LoaderCircle,
  Mail,
  MapPin,
  Megaphone,
  MessageSquareMore,
  Phone,
  Send,
  ThumbsUp,
  Trophy,
  Upload,
  UsersRound
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { applicationFunnel } from "@/data/application";

type FunnelStep = "intro" | "job" | "form" | "success";

type BewerbungFunnelProps = {
  status?: string;
  step?: string;
};

const statusMessages: Record<string, { tone: "error" | "success"; text: string }> = {
  missing: {
    tone: "error",
    text: "Bitte füllen Sie die Pflichtfelder aus, damit wir Ihre Bewerbung zuordnen können."
  },
  "invalid-email": {
    tone: "error",
    text: "Bitte stellen Sie sicher, dass Sie eine gültige E-Mail-Adresse eingeben."
  },
  "invalid-phone": {
    tone: "error",
    text: "Wir akzeptieren ausschließlich Telefonnummern aus Deutschland."
  },
  "file-too-large": {
    tone: "error",
    text: "Der Lebenslauf darf maximal 10 MB groß sein."
  },
  "invalid-file": {
    tone: "error",
    text: "Bitte laden Sie ausschließlich PDF-, DOCX- oder JPEG-Dateien hoch."
  },
  "integration-missing": {
    tone: "error",
    text:
      "Die direkte Übermittlung ist noch nicht angebunden. Schreiben Sie uns bitte vorübergehend per E-Mail."
  },
  "integration-error": {
    tone: "error",
    text:
      "Die Übermittlung hat gerade nicht geklappt. Schreiben Sie uns bitte direkt per E-Mail oder versuchen Sie es später erneut."
  },
  success: {
    tone: "success",
    text: "Danke für Ihre Bewerbung. Wir melden uns persönlich bei Ihnen."
  }
};

const iconMap = {
  Headphones,
  Megaphone,
  MessageSquareMore,
  Trophy,
  UsersRound
};

function Progress({ label, value }: { label: string; value: number }) {
  return (
    <div className="bewerbung-progress" aria-label={label}>
      <span>{value}%</span>
      <div aria-label="Formular-Fortschritt" aria-valuemax={100} aria-valuemin={0} aria-valuenow={value} role="progressbar">
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StepStatus({ label }: { label: string }) {
  return <p className="sr-only" role="status">{label}</p>;
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="bewerbung-step-nav">
      <Link className="bewerbung-back-link" href={href}>
        <ArrowLeft aria-hidden="true" size={18} />
        <span>{label}</span>
      </Link>
    </div>
  );
}

function resolveStep(status?: string, step?: string): FunnelStep {
  if (status === "success") return "success";
  if (status) return "form";
  if (step === "job" || step === "form") return step;
  return "intro";
}

export function BewerbungFunnel({ status, step: stepParam }: BewerbungFunnelProps) {
  const step = resolveStep(status, stepParam);
  const [selectedFile, setSelectedFile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bei Rueckkehr aus dem bfcache (Zurueck-Navigation) darf der Button nicht gesperrt bleiben.
  useEffect(() => {
    const resetSubmitState = () => setIsSubmitting(false);
    window.addEventListener("pageshow", resetSubmitState);
    return () => window.removeEventListener("pageshow", resetSubmitState);
  }, []);

  const message = status ? statusMessages[status] : undefined;

  const progress = useMemo(() => {
    if (step === "intro") return { label: "Schritt 1 von 5", value: 20 };
    if (step === "job") return { label: "Schritt 2 von 5", value: 40 };
    if (step === "form") return { label: "Schritt 6 von 8", value: 75 };
    return { label: "Schritt 8 von 8", value: 100 };
  }, [step]);

  return (
    <div className={`bewerbung-page bewerbung-page-${step}`}>
      <StepStatus label={progress.label} />
      <Progress label={progress.label} value={progress.value} />

      {step === "intro" ? (
        <section className="bewerbung-intro" aria-labelledby="bewerbung-intro-title">
          <div className="bewerbung-intro-image">
            <Image
              alt={applicationFunnel.intro.image.alt}
              fill
              priority
              quality={85}
              sizes="(max-width: 760px) 92vw, 640px"
              src={applicationFunnel.intro.image.src}
            />
          </div>
          <BrandLogo className="brand-logo brand-logo-lead" priority variant="light" />
          <div className="bewerbung-intro-copy">
            <h1 id="bewerbung-intro-title">{applicationFunnel.intro.title}</h1>
            <p>{applicationFunnel.intro.text}</p>
            <p>{applicationFunnel.intro.note}</p>
          </div>
          <Link className="bewerbung-pill-button bewerbung-dark-button" href="/bewerbung?step=job">
            <ThumbsUp aria-hidden="true" size={22} />
            <span>{applicationFunnel.intro.cta}</span>
          </Link>
        </section>
      ) : null}

      {step === "job" ? (
        <section className="bewerbung-job" aria-labelledby="bewerbung-job-title">
          <BackLink href="/bewerbung" label="Zurück zum Einstieg" />
          <div className="bewerbung-job-image">
            <Image
              alt={applicationFunnel.job.image.alt}
              fill
              priority
              quality={85}
              sizes="(max-width: 760px) 52vw, 220px"
              src={applicationFunnel.job.image.src}
            />
          </div>
          <div className="bewerbung-chip-list" aria-label="Stelleninformationen">
            <span>
              <MapPin aria-hidden="true" size={18} />
              {applicationFunnel.job.location}
            </span>
            <span>
              <Building2 aria-hidden="true" size={18} />
              {applicationFunnel.job.employer}
            </span>
          </div>
          <h1 id="bewerbung-job-title">{applicationFunnel.job.title}</h1>
          <div className="bewerbung-chip-list bewerbung-chip-list-compact" aria-label="Arbeitsumfang">
            <span>
              <Clock3 aria-hidden="true" size={18} />
              {applicationFunnel.job.scope}
            </span>
            <span>
              <CalendarDays aria-hidden="true" size={18} />
              {applicationFunnel.job.hours}
            </span>
          </div>
          <Link className="bewerbung-pill-button bewerbung-green-button" href="/bewerbung?step=form#bewerbungsformular">
            <CalendarPlus aria-hidden="true" size={22} />
            <span>{applicationFunnel.job.cta}</span>
          </Link>
          <p className="bewerbung-job-intro">{applicationFunnel.job.intro}</p>

          <div className="bewerbung-qualifications">
            <p>Qualifikation</p>
            <ul>
              {applicationFunnel.job.qualifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <h2>Was du tun wirst</h2>
          <div className="bewerbung-duty-list">
            {applicationFunnel.job.duties.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <article className="bewerbung-duty-card" key={item.title}>
                  <Icon aria-hidden="true" size={42} strokeWidth={1.8} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>

          <h2>{applicationFunnel.job.expectationsTitle}</h2>
          <div className="bewerbung-expectations">
            {applicationFunnel.job.expectations.map((item) => (
              <article key={item.title}>
                <CheckCircle2 aria-hidden="true" size={26} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <Link className="bewerbung-pill-button bewerbung-green-button" href="/bewerbung?step=form#bewerbungsformular">
            <CalendarPlus aria-hidden="true" size={22} />
            <span>{applicationFunnel.job.cta}</span>
          </Link>
        </section>
      ) : null}

      {step === "form" ? (
        <section className="bewerbung-form-section" id="bewerbungsformular" aria-labelledby="bewerbung-form-title">
          <BackLink href="/bewerbung?step=job" label="Zurück zur Stelle" />
          <div className="bewerbung-form-heading">
            <h1 id="bewerbung-form-title">{applicationFunnel.form.title}</h1>
            <p>{applicationFunnel.form.text}</p>
          </div>

          <form
            action="/api/bewerbung"
            aria-busy={isSubmitting}
            className={isSubmitting ? "bewerbung-form-card is-submitting" : "bewerbung-form-card"}
            encType="multipart/form-data"
            method="post"
            onSubmit={() => setIsSubmitting(true)}
          >
            {message ? (
              <p className={`bewerbung-form-message bewerbung-form-message-${message.tone}`}>{message.text}</p>
            ) : null}
            <input name="position" type="hidden" value={applicationFunnel.job.title} />
            <label className="bewerbung-honeypot">
              Website
              <input autoComplete="off" name="website" tabIndex={-1} type="text" />
            </label>

            <div className="bewerbung-form-grid">
              <label>
                <span>Vorname</span>
                <input autoComplete="given-name" name="firstName" placeholder="Jane" required type="text" />
              </label>
              <label>
                <span>Nachname</span>
                <input autoComplete="family-name" name="lastName" placeholder="Doe" required type="text" />
              </label>
            </div>

            <label>
              <span>Startdatum</span>
              <span className="bewerbung-input-shell">
                <CalendarDays aria-hidden="true" size={24} />
                <input aria-label="Startdatum" name="startDate" type="date" />
              </span>
            </label>

            <label>
              <span>E-Mail</span>
              <span className="bewerbung-input-shell">
                <Mail aria-hidden="true" size={24} />
                <input
                  autoComplete="email"
                  inputMode="email"
                  name="email"
                  placeholder="beispiel@gmail.com"
                  required
                  type="email"
                />
              </span>
              <small>Bitte stellen Sie sicher, dass Sie eine gültige E-Mail-Adresse eingeben</small>
            </label>

            <label>
              <span>Telefonnummer</span>
              <span className="bewerbung-input-shell">
                <Phone aria-hidden="true" size={23} />
                <input autoComplete="tel" inputMode="tel" name="phone" placeholder="Ihr Telefon" required type="tel" />
              </span>
              <small>Wir akzeptieren ausschließlich Telefonnummern aus Deutschland</small>
            </label>

            <div className="bewerbung-upload-group">
              <p>{applicationFunnel.form.uploadTitle}</p>
              <label className="bewerbung-upload-drop">
                <Upload aria-hidden="true" size={28} />
                <span>{selectedFile || applicationFunnel.form.uploadText}</span>
                <small>{applicationFunnel.form.uploadLimit}</small>
                <input
                  accept=".pdf,.docx,.jpg,.jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg"
                  name="cv"
                  onChange={(event) => setSelectedFile(event.currentTarget.files?.[0]?.name ?? "")}
                  type="file"
                />
              </label>
            </div>

            <button className="bewerbung-submit-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <LoaderCircle aria-hidden="true" className="bewerbung-submit-spinner" size={20} />
              ) : (
                <Send aria-hidden="true" size={20} />
              )}
              <span>{isSubmitting ? "Wird gesendet …" : applicationFunnel.form.submitLabel}</span>
            </button>
          </form>
        </section>
      ) : null}

      {step === "success" ? (
        <section className="bewerbung-success" id="bewerbungsformular" aria-labelledby="bewerbung-success-title">
          <CheckCircle2 aria-hidden="true" size={54} />
          <h1 id="bewerbung-success-title">Danke für Ihre Bewerbung.</h1>
          <p>Wir haben Ihre Angaben erhalten und melden uns persönlich bei Ihnen.</p>
        </section>
      ) : null}
    </div>
  );
}
