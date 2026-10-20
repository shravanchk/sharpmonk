"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import { STRINGS, type Lang } from "@/lib/i18n";
import { promptInstall, useInstallState } from "@/lib/install";

/**
 * "Install the app", wherever the browser can install it. In the mobile menu
 * it's a full row; in the footer, a link. On iPhone it explains Add to Home
 * Screen, since Safari has no install prompt. Renders nothing once installed.
 */
export default function InstallApp({ lang, variant }: { lang: Lang; variant: "row" | "link" }) {
  const t = STRINGS[lang].install;
  const state = useInstallState();
  const [help, setHelp] = useState(false);

  if (state === "none") return null;
  const onClick = () => (state === "prompt" ? promptInstall() : setHelp(true));

  return (
    <>
      {variant === "row" ? (
        <button
          type="button"
          onClick={onClick}
          className="flex min-h-13 w-full items-center gap-3 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface-1)] px-3 py-2 text-left transition-colors active:bg-[var(--surface-2)]"
        >
          <span className="icon-badge icon-badge-sm icon-badge--blue shrink-0">
            <Icon name="smartphone" size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] leading-tight font-medium">{t.cta}</span>
            <span className="text-muted block truncate text-xs leading-tight">{t.hint}</span>
          </span>
          <Icon name="download" size={16} className="text-muted" />
        </button>
      ) : (
        <button type="button" onClick={onClick} className="text-muted inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--foreground)]">
          <Icon name="smartphone" size={15} />
          {t.cta}
        </button>
      )}
      {help && createPortal(<IosHelp lang={lang} onClose={() => setHelp(false)} />, document.body)}
    </>
  );
}

function IosHelp({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = STRINGS[lang].install;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[rgba(4,8,18,0.6)] p-4 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-install-title"
        lang={lang}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-[var(--line-strong)] bg-[var(--background)] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        <h2 id="ios-install-title" className="text-lg font-semibold">{t.iosTitle}</h2>
        <ol className="mt-4 flex flex-col gap-3 text-sm">
          {t.iosSteps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] font-mono text-xs text-[var(--accent)]">{i + 1}</span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <button type="button" onClick={onClose} className="btn-ghost mt-6 w-full rounded-full px-4 py-2.5 text-sm font-medium">
          {t.close}
        </button>
      </div>
    </div>
  );
}
