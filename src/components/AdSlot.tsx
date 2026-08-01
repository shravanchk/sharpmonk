"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { ADSENSE_ENABLED, ADSENSE_PUBLISHER_ID, consentStore } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdSlotProps = {
  /** AdSense ad unit slot id — swap for a real one once the ad unit exists. */
  slot: string;
  className?: string;
  format?: string;
};

/** Designated ad placement.
 *
 *  Renders nothing at all while AdSense is switched off: a dashed
 *  "advertisement space" box on a live page reads as an unfinished site, and
 *  reserving room for an ad that cannot arrive buys no CLS protection. Once
 *  ads are enabled the space *is* held open while the visitor has yet to
 *  answer the consent banner, because then an ad really can drop in.
 *
 *  The outer spacing lives here rather than at the call sites so that
 *  disabling ads leaves no orphaned margin behind. */
export default function AdSlot({ slot, className = "", format = "auto" }: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const consented = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.hasAccepted,
    () => false,
  );

  useEffect(() => {
    if (!ADSENSE_ENABLED || !consented) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not yet loaded — safe to ignore.
    }
  }, [consented]);

  if (!ADSENSE_ENABLED) return null;

  return (
    <div className={`mt-8 ${className}`}>
      {consented ? (
        <ins
          ref={ref}
          data-print="hide"
          className="adsbygoogle block min-h-20"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_PUBLISHER_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div aria-hidden data-print="hide" className="min-h-20 w-full" />
      )}
    </div>
  );
}
