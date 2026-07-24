"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  ADSENSE_ENABLED,
  ADSENSE_PUBLISHER_ID,
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  type ConsentValue,
} from "@/lib/adsense";

/** Loads the AdSense script only after consent is granted, and only once
 *  ADSENSE_ENABLED + a real publisher ID are configured (see lib/adsense.ts). */
export default function AdSenseLoader() {
  const [consented, setConsented] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted";
  });

  useEffect(() => {
    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<ConsentValue>).detail;
      setConsented(detail === "accepted");
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

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
