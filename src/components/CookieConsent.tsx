"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  type ConsentValue,
} from "@/lib/adsense";

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.localStorage.getItem(CONSENT_STORAGE_KEY);
  });

  const choose = (value: ConsentValue) => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="consent-slide fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="glass-card mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl p-5 shadow-2xl shadow-black/40 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-[var(--foreground)]/85">
          We use cookies for basic site functionality and, once ads are live,
          for personalized advertising via Google AdSense. Read our{" "}
          <Link href="/privacy" className="text-[var(--accent)] underline underline-offset-2">
            Privacy Policy
          </Link>{" "}
          to learn more.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="btn-ghost rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="btn-glow rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
