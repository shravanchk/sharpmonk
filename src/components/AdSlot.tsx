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

/** Designated ad placement. Renders a labeled placeholder until AdSense is
 *  enabled and the visitor has accepted cookies, so layout space is
 *  reserved (avoids CLS) without ever faking an ad before approval. */
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

  if (!ADSENSE_ENABLED || !consented) {
    return (
      <div
        aria-hidden
        data-print="hide"
        className={`flex min-h-24 w-full items-center justify-center rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--surface-1)] text-xs tracking-wide text-muted uppercase ${className}`}
      >
        Advertisement space
      </div>
    );
  }

  return (
    <ins
      ref={ref}
      data-print="hide"
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_PUBLISHER_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
