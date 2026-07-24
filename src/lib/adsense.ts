/**
 * AdSense configuration.
 *
 * Sharpmonk doesn't have an approved AdSense account yet, so this ships
 * disabled with a placeholder publisher ID. To go live:
 *
 *   1. Get your publisher ID from AdSense ("ca-pub-XXXXXXXXXXXXXXXX").
 *   2. Replace PUBLISHER_ID below.
 *   3. Replace the placeholder line in /public/ads.txt with the real one
 *      AdSense gives you (Settings -> Sites -> "View site ads.txt guidance").
 *   4. Flip ENABLED to true.
 *   5. Swap the slot ids in <AdSlot slot="..."> across the site for the
 *      real ad unit ids created in your AdSense dashboard.
 *
 * Nothing below fires a network request or renders a live ad unit until
 * ENABLED is true AND the visitor has accepted the cookie/consent banner
 * (see CookieConsent.tsx) — required for Google's EU user consent policy.
 */

export const ADSENSE_PUBLISHER_ID = "ca-pub-0000000000000000";

export const ADSENSE_ENABLED = false;

export const CONSENT_STORAGE_KEY = "sharpmonk-consent";
export const CONSENT_EVENT = "sharpmonk:consent";

export type ConsentValue = "accepted" | "declined";
