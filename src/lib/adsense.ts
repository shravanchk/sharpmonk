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

/**
 * The visitor's consent answer, as an external store.
 *
 * It lives in localStorage and changes via a window event, so it is external
 * state, not component state. Reading it in a `useState` initializer instead
 * renders one thing on the server and another on the client for anyone who has
 * already answered, and React does not patch up a mismatched tree.
 *
 * `subscribe`/`getSnapshot` are stable module-level values so every consumer
 * shares one subscription shape — pass straight to `useSyncExternalStore`.
 */
function readConsent(): ConsentValue | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return raw === "accepted" || raw === "declined" ? raw : null;
  } catch {
    // Storage blocked (private browsing) — treat as unanswered.
    return null;
  }
}

export const consentStore = {
  subscribe(onChange: () => void) {
    window.addEventListener(CONSENT_EVENT, onChange);
    // Keeps other tabs in step.
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  },
  /** True only on an explicit "accepted" — the gate for anything ad-related. */
  hasAccepted: () => readConsent() === "accepted",
  /** True once any answer has been given, i.e. the banner is done. */
  hasAnswered: () => readConsent() !== null,
};

export function writeConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Private browsing — the choice just won't persist past this session.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
