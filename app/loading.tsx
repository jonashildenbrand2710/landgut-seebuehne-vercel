export default function Loading() {
  return (
    <section aria-live="polite" className="page-loading" role="status">
      <div className="page-loading-mark" aria-hidden="true">
        <span />
        <i />
      </div>
      <p>Der nächste Blick auf die Seebühne wird vorbereitet …</p>
      <div className="page-loading-line" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
