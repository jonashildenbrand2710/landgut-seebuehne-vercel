import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="subpage-hero">
      <div className="section-inner">
        <p className="eyebrow dark">404</p>
        <h1>Diese Seite haben wir nicht gefunden.</h1>
        <p>
          Wenn du über eine alte Onepage-URL hier gelandet bist, sollte diese URL
          vor Livegang in der Redirect-Matrix geprüft werden.
        </p>
        <Link className="button primary" href="/">
          <span>Zur Startseite</span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}
