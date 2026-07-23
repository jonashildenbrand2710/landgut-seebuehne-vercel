import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Inbox, MailCheck, Search } from "lucide-react";
import { siteConfig } from "@/data/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Preise angefordert",
  description:
    "Bestätigung für die angeforderte Übersicht mit Preisen und Leistungsbausteinen des Landgut Seebühne.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true
  }
};

export default function DankePreisePage() {
  return (
    <article className={styles.page}>
      <Image
        className={styles.background}
        src="/images/site/hero-brautpaar-steg-am-see.jpg"
        alt=""
        fill
        priority
        quality={75}
        sizes="100vw"
        aria-hidden="true"
      />
      <div className={styles.shade} aria-hidden="true" />
      <section className={styles.card}>
        <MailCheck aria-hidden="true" className={styles.icon} size={34} />
        <span className={styles.eyebrow}>Preise angefordert</span>
        <h1>Die Übersicht ist unterwegs.</h1>
        <p className={styles.intro}>
          Schaut jetzt in euer E-Mail-Postfach. Dort findet ihr den Link zu unseren
          Preisen und Leistungsbausteinen und könnt alles in Ruhe ansehen.
        </p>

        <div className={styles.steps} aria-label="So findet ihr die E-Mail">
          <article>
            <Inbox aria-hidden="true" size={22} />
            <div>
              <strong>Posteingang prüfen</strong>
              <p>Die Nachricht sollte in den nächsten Minuten bei euch ankommen.</p>
            </div>
          </article>
          <article>
            <Search aria-hidden="true" size={22} />
            <div>
              <strong>Auch Spam und Werbung ansehen</strong>
              <p>
                Falls ihr sie nicht sofort findet, prüft bitte auch den Spam- oder
                Werbeordner.
              </p>
            </div>
          </article>
        </div>

        <p className={styles.note}>
          Noch keine E-Mail da? Wartet bitte einen kurzen Moment und aktualisiert euer
          Postfach anschließend noch einmal.
        </p>

        <div className={styles.actions}>
          <Link className={styles.primary} href="/hochzeitsmappe">
            Zurück zur Hochzeitsmappe
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
          <a className={styles.secondary} href={siteConfig.bookingUrl}>
            Besichtigung planen
          </a>
        </div>
      </section>
    </article>
  );
}
