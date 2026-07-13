import Script from "next/script";
import { CONSENT_EVENT_NAME, CONSENT_STORAGE_KEY } from "@/lib/consent";
import { META_PIXEL_ID } from "@/lib/meta-events";

// Der Pixel wird erst nach Marketing-Einwilligung geladen (TTDSG/DSGVO).
// Die Consent-Pruefung passiert im Script selbst, damit Server- und Client-Markup
// identisch bleiben und kein React-State noetig ist.
export function MetaPixel() {
  if (!META_PIXEL_ID) {
    return null;
  }

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        (function () {
          function loadMetaPixel() {
            if (window.fbq) return;
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            window.fbq('init', '${META_PIXEL_ID}');
            window.fbq('track', 'PageView');
          }

          var stored = null;
          try { stored = window.localStorage.getItem('${CONSENT_STORAGE_KEY}'); } catch (e) {}

          if (stored === 'granted') {
            loadMetaPixel();
            return;
          }

          window.addEventListener('${CONSENT_EVENT_NAME}', function (event) {
            if (event && event.detail === 'granted') loadMetaPixel();
          });
        })();
      `}
    </Script>
  );
}
