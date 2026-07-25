"use client";

import { THEME_STORAGE_KEY } from "@/lib/theme";

export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — theme just won't persist.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-1)] transition-colors hover:bg-[var(--surface-2)]"
    >
      {/* Accessible name, not a static aria-label, so it says which way the
          button goes. Only the applicable one is `display: inline`, so screen
          readers announce exactly one. */}
      <span className="sr-only theme-label-to-light">Switch to light theme</span>
      <span className="sr-only theme-label-to-dark">Switch to dark theme</span>

      <span className="theme-icon theme-icon-sun" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </span>
      <span className="theme-icon theme-icon-moon" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </span>
    </button>
  );
}
