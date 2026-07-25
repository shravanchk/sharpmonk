/**
 * Cloudflare Web Analytics configuration.
 *
 * Chosen because it is cookieless and stores no per-visitor identifier, which
 * means it does not need consent under GDPR/ePrivacy and can load for everyone
 * — unlike AdSense, which stays gated behind the banner (see adsense.ts). It is
 * also free and already part of the Cloudflare Pages account this site
 * deploys to.
 *
 * To turn it on:
 *
 *   1. Cloudflare dashboard -> Analytics & Logs -> Web Analytics.
 *   2. Add a site for sharpmonk.com. Cloudflare shows a beacon snippet
 *      containing a token like "abc123...".
 *   3. Put that token in TOKEN below (or set NEXT_PUBLIC_CF_BEACON_TOKEN at
 *      build time, which takes precedence).
 *
 * With no token the beacon is never rendered, so this is inert until step 3.
 *
 * Note: Cloudflare Pages can also auto-inject this from the dashboard. Doing
 * it here instead keeps it visible in the codebase and version-controlled —
 * but if you enable auto-injection too, you will get two beacons and double
 * counting. Pick one.
 */

export const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN ?? "";

export const ANALYTICS_ENABLED = CF_BEACON_TOKEN.length > 0;
