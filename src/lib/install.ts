"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether, and how, this browser can install Sharpmonk as an app.
 *
 * - "prompt": Chrome/Edge/Samsung offered an install prompt; ours shows it.
 * - "ios":    iPhone or iPad, where installing is Share → Add to Home Screen
 *             and no browser offers a prompt.
 * - "none":   already installed (or running as the Play Store app), or the
 *             browser can't install web apps.
 *
 * The listener is registered when this module loads — the Header imports it,
 * so that's on the first page — because the browser fires
 * beforeinstallprompt once, early, and doesn't repeat it.
 */
export type InstallState = "prompt" | "ios" | "none";

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

let deferred: PromptEvent | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    // Hold it for our button instead of Chrome's own mini-infobar.
    e.preventDefault();
    deferred = e as PromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    emit();
  });
}

function state(): InstallState {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return "none";
  if (deferred) return "prompt";
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  return ios ? "ios" : "none";
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useInstallState = () => useSyncExternalStore(subscribe, state, () => "none" as InstallState);

/** Shows the browser's install prompt. */
export async function promptInstall() {
  const e = deferred;
  if (!e) return;
  deferred = null;
  await e.prompt().catch(() => {});
  emit();
}
