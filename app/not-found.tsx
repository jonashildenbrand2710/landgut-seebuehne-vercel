import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="subpage-hero">
      <div className="section-inner">
        <p className="eyebrow dark">404</p>
        <h1>Diese Seite haben wir nicht gefunden.</h1>
        <p>
          Der Link ist vermutlich veraltet oder die Adresse wurde vertippt. Auf der
          Startseite findet ihr Location, Hochzeits-Journal und die direkte Buchung
          einer Besichtigung.
        </p>
        <Link className="button primary" href="/">
          <span>Zur Startseite</span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}
