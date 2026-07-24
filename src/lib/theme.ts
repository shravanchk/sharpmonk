export const THEME_STORAGE_KEY = "sharpmonk-theme";

/**
 * Runs before hydration (see layout.tsx, strategy="beforeInteractive") so
 * the correct theme is on <html> before first paint — no flash of the
 * wrong theme. Kept as a plain string (not a .ts import) since it has to
 * execute standalone in the browser before any app JS runs.
 */
export const themeInitScript = `
(function () {
  // Arms the scroll-reveal styling before first paint, and only where it can
  // actually be undone — no JS, or no IntersectionObserver, means nothing
  // would ever add .is-visible, so the content must stay plainly visible for
  // crawlers and those readers.
  if (typeof IntersectionObserver !== 'undefined') {
    document.documentElement.classList.add('reveal-ready');
  }
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();
`;
