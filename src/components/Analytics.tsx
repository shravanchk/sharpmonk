import Script from "next/script";
import { ANALYTICS_ENABLED, CF_BEACON_TOKEN } from "@/lib/analytics";

/**
 * Cloudflare Web Analytics beacon.
 *
 * Deliberately not gated behind the cookie banner: the beacon sets no cookie
 * and stores no per-visitor identifier, so it needs no consent. Gating it
 * would only skew the numbers toward people who happen to click "Accept".
 *
 * `lazyOnload` keeps it off the critical path — it is measurement, and nothing
 * on the page depends on it.
 *
 * Renders nothing until a token is configured (see lib/analytics.ts).
 */
export default function Analytics() {
  if (!ANALYTICS_ENABLED) return null;

  return (
    <Script
      id="cf-web-analytics"
      strategy="lazyOnload"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
    />
  );
}
