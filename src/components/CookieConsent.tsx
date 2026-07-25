"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ADSENSE_ENABLED, consentStore, writeConsent, type ConsentValue } from "@/lib/adsense";

/**
 * Consent banner for advertising cookies.
 *
 * Shown only when AdSense is actually enabled. With ads off, the site sets no
 * cookies at all and loads no third-party scripts — the only things it stores
 * are your theme choice and this consent answer, both strictly-necessary
 * preferences kept in localStorage on your own device. Prompting in that state
 * asks permission for something that is not happening, trains people to
 * dismiss the banner, and costs a chunk of the first screen.
 *
 * Flipping ADSENSE_ENABLED brings it back automatically, so this cannot be
 * forgotten when ads go live — that is the moment consent genuinely is
 * required. Cloudflare Web Analytics stays outside this gate on purpose: it is
 * cookieless and assigns no identifier, so it needs no consent (see
 * lib/analytics.ts).
 */

export default function CookieConsent() {
  const answered = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.hasAnswered,
    // Assume answered on the server, so the banner never flashes in before
    // hydration for someone who already dealt with it.
    () => true,
  );

  const choose = (value: ConsentValue) => writeConsent(value);

  if (!ADSENSE_ENABLED || answered) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="consent-slide fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      {/* Opaque, not the translucent .glass-card: this sits on top of page
          content, and the text behind it used to show through and collide. */}
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-[var(--line-strong)] bg-[var(--background)] p-5 shadow-2xl shadow-black/50 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-[var(--foreground)]/85">
          We use cookies for personalised advertising via Google AdSense.
          Declining keeps the site fully usable &mdash; every calculator still
          runs entirely in your browser. See our{" "}
          <Link href="/privacy" className="text-[var(--accent)] underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="btn-ghost flex-1 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap sm:flex-none"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="btn-glow flex-1 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap sm:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
