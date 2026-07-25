"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { ADSENSE_ENABLED, ADSENSE_PUBLISHER_ID, consentStore } from "@/lib/adsense";

/** Loads the AdSense script only after consent is granted, and only once
 *  ADSENSE_ENABLED + a real publisher ID are configured (see lib/adsense.ts). */
export default function AdSenseLoader() {
  const consented = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.hasAccepted,
    () => false,
  );

  if (!ADSENSE_ENABLED || !consented) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
