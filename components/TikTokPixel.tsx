import Script from "next/script";
import { CONSENT_EVENT_NAME, CONSENT_STORAGE_KEY } from "@/lib/consent";
import { TIKTOK_PIXEL_ID } from "@/lib/tiktok-events";

// TikTok wird wie Meta erst nach ausdruecklicher Marketing-Einwilligung geladen.
export function TikTokPixel() {
  if (!TIKTOK_PIXEL_ID) {
    return null;
  }

  const pixelId = JSON.stringify(TIKTOK_PIXEL_ID);

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`
        (function () {
          function loadTikTokPixel() {
            if (window.ttq && window.ttq._i && window.ttq._i[${pixelId}]) return;

            !function (w, d, t) {
              w.TiktokAnalyticsObject = t;
              var ttq = w[t] = w[t] || [];
              ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
              ttq.setAndDefer = function (target, method) {
                target[method] = function () {
                  target.push([method].concat(Array.prototype.slice.call(arguments, 0)));
                };
              };
              for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
              ttq.instance = function (pixelId) {
                var instance = ttq._i[pixelId] || [];
                for (var j = 0; j < ttq.methods.length; j++) ttq.setAndDefer(instance, ttq.methods[j]);
                return instance;
              };
              ttq.load = function (pixelId, options) {
                var scriptUrl = "https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i = ttq._i || {};
                ttq._i[pixelId] = [];
                ttq._i[pixelId]._u = scriptUrl;
                ttq._t = ttq._t || {};
                ttq._t[pixelId] = +new Date();
                ttq._o = ttq._o || {};
                ttq._o[pixelId] = options || {};
                var script = d.createElement("script");
                script.type = "text/javascript";
                script.async = true;
                script.src = scriptUrl + "?sdkid=" + pixelId + "&lib=" + t;
                var firstScript = d.getElementsByTagName("script")[0];
                firstScript.parentNode.insertBefore(script, firstScript);
              };
              ttq.load(${pixelId});
              ttq.page();
            }(window, document, "ttq");
          }

          var stored = null;
          try { stored = window.localStorage.getItem('${CONSENT_STORAGE_KEY}'); } catch (e) {}

          if (stored === 'granted') {
            loadTikTokPixel();
            return;
          }

          window.addEventListener('${CONSENT_EVENT_NAME}', function (event) {
            if (event && event.detail === 'granted') loadTikTokPixel();
          });
        })();
      `}
    </Script>
  );
}
