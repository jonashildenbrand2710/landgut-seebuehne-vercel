# Google Ads: consented server delivery

Status 2026-10-18: implemented and locally tested, disabled pending account authorization and approval of the privacy notice addition. No new conversions, uploads or changes to campaign goals have been made.

## Behavior

- The website sends successful mappe enquiries and calendar-confirmed phone/tour bookings to Google's Data Manager API, in addition to the existing Google tag.
- Both sources use the **same existing conversion action and transaction ID**. Mappe IDs come from the signed server receipt; booking IDs are the UUID event IDs already used by the browser. No second conversion action or goal is created.
- Only an explicit `granted` choice permits uploads. Missing consent, rejection and withdrawal block Google uploads. Google receives `adUserData: CONSENT_GRANTED`, `adPersonalization: CONSENT_DENIED` only for consented events.
- Only GCLID/GBRAID/WBRAID, event timestamp, opaque transaction ID and the action/destination are sent. No email/phone hashes, names, form answers, access links, visitor IP or browser fingerprint are sent by the new server delivery.
- Click IDs are saved **after opt-in only**, in the current browser tab's first-party session storage (maximum 30 days; normally cleared when the tab closes). Rejection/withdrawal removes this record. No extra advertising cookie is introduced. If storage is blocked, an identifier in the current page URL can still be used.
- Without a click ID, attribution is skipped. This does not recover all Google-related leads, cross-device attribution, a click lost before consent, or visits without a Google click identifier.
- Tracking failures cannot fail the completed enquiry or booking. Transient HTTP 429/5xx errors get one immediate retry with the identical timestamp and ID. There is no durable retry queue or historical backfill in this version; failed events require investigation.
- Acceptance of an ingestion request is not proof of ad attribution. Only processing diagnostics and a real conversion can confirm that. Log messages contain request ID/kind/status only, never event or customer payloads.
- Google currently describes multi-source conversions as beta. Initial additional-source data has a 14-day trial before bidding use; account eligibility and processing diagnostics must be confirmed.

## Existing Meta consent correction

The existing Meta CAPI helper had no consent check although the published privacy notice says tracking stays disabled without consent. The helper now requires `tracking.marketingConsent === "granted"`. The mappe route passes the shared banner choice; booking already supplies it. This enforces the existing notice and does not authorize consent-independent tracking.

## Activation

1. `datamanager.googleapis.com` has been enabled on the existing Ads OAuth client's Google Cloud project `sbw-api-20260702` (2026-10-18).
2. Obtain a separate offline OAuth grant with `https://www.googleapis.com/auth/datamanager` from the existing account owner. Existing Ads OAuth credentials only have `auth/adwords`; a validate-only request returned HTTP 403 `ACCESS_TOKEN_SCOPE_INSUFFICIENT` on 2026-10-18. Do not replace the working Ads audit token. The new consent flow is open in the in-app browser; Google currently shows the unverified-app warning for the existing own app “SB Werbung Google Ads API”. The account owner must complete the warning and expanded account permission themselves. The pending callback listens at `http://127.0.0.1:8080/oauth2callback`; the separate grant is stored only under the original checkout's untracked `.secrets/google-data-manager-token.json`.
3. Store the new OAuth client/secret/refresh token as server-only Vercel Secrets. Populate the documented `GOOGLE_DATA_MANAGER_*` values. Never commit or print tokens.
4. Use existing customer `6477188860`, manager `7283589984`, lead action `7095345761`, booking action `7670616206`.
5. Validate both destinations with `validateOnly: true`, using a synthetic test identifier and no customer data. Do not upload a synthetic live conversion. Verify beta eligibility and warnings.
6. Obtain approval for the following privacy notice addition, then insert it after the paragraph explaining the Google event data. The repository AGENTS.md requires concrete approval for legal text edits.
7. Set both `NEXT_PUBLIC_GOOGLE_ADS_SERVER_ENABLED=true` and `GOOGLE_ADS_SERVER_ENABLED=true`, build and deploy. All other environments remain disabled.
8. Check the public tracking contract's `serverDelivery.enabled`, then check the next real consented enquiry's Data Manager request status. Confirm the shared transaction ID prevents duplicate counting.

### Proposed privacy notice addition (requires approval)

> Nach einer erfolgreichen Anfrage oder Buchung können wir die Anzeigen-Klickkennung, den Zeitpunkt und dieselbe Ereignis-ID zusätzlich direkt von unserem Server an Google übermitteln. Damit können wir Ausfälle der Messung im Browser verringern. Die gemeinsame Ereignis-ID dient dazu, eine doppelte Zählung zu verhindern. Auch diese Übermittlung erfolgt nur mit eurer Einwilligung. Dabei übermitteln wir keine Kontaktdaten oder Formularantworten an Google. Zur Zuordnung innerhalb eures aktuellen Browser-Tabs können wir nach eurer Einwilligung Anzeigen-Klickkennungen im Sitzungsspeicher eures Browsers speichern. Bei Ablehnung oder Widerruf wird dieser Eintrag entfernt.

## Validation

Local production-build browser verification also passed: opt in on a landing URL, navigate to the mappe form, submit through an isolated local proxy → consent and click ID present; revoke via the footer, submit again → neither advertising consent nor click ID present. The proxy intercepted every POST before the application/backend; no real lead or email was sent. Screenshots are saved in `SB_Werbung/output/google-ads/server-browser-{consented,revoked}-2026-10-18.png` outside this repository.

`npm run test:google-ads` covers consent, session expiry/revocation, allowed data, server delivery/retry behavior, real mappe and booking route boundaries, identical server/browser IDs and Meta CAPI's consent check. All external effects are mocked; no real enquiry, calendar entry, email or Google conversion is created.

Sources (checked 2026-10-18):
- https://developers.google.com/data-manager/api/devguides/events/google-ads/online
- https://developers.google.com/data-manager/api/devguides/events/google-ads/online/send-events
- https://developers.google.com/data-manager/api/devguides/quickstart/set-up-access
- https://support.google.com/google-ads/answer/16542291
- https://developers.google.com/tag-platform/tag-manager/server-side/consent-mode
