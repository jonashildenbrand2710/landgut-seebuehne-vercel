import type { Metadata } from "next";
import styles from "./smoke.module.css";

export const metadata: Metadata = {
  title: "Code Factory Smoke",
  description: "Isolierte E2E-Vorschauseite für den Code-Factory-Cloud-Build.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  }
};

const checks = [
  "Cloud Build",
  "Vercel Preview",
  "Automatischer Review"
] as const;

export default function CodeFactorySmokePage() {
  return (
    <div className={styles.main}>
      <section className={styles.panel} aria-labelledby="code-factory-smoke-heading">
        <p className={styles.eyebrow}>Code Factory · E2E</p>
        <h1 id="code-factory-smoke-heading" className={styles.title}>
          Code Factory E2E bereit
        </h1>
        <p className={styles.lead}>
          Isolierte Vorschauseite zur Prüfung von Cloud Build, Vercel Preview und automatischem
          Review. Nicht für Navigation, Sitemap oder Produktion vorgesehen.
        </p>
        <ul className={styles.checks}>
          {checks.map((label) => (
            <li key={label} className={styles.check}>
              <span className={styles.marker} aria-hidden="true" />
              <span>{label} wird geprüft</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
