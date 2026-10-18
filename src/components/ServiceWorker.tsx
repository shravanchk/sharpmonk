"use client";

import { useEffect } from "react";

/**
 * Registers public/sw.js, which keeps the tools working offline after one
 * visit. Production only: in development a cache-first worker would serve
 * stale chunks and make every edit look like it didn't take.
 */
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Unsupported or blocked (private mode, some in-app browsers): the site
      // simply works online-only.
    });
  }, []);
  return null;
}
