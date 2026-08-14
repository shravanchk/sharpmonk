/**
 * Currency and number formatting for the US tools.
 *
 * Every formatter here pins its locale explicitly. `toLocaleString()` with no
 * locale resolves against the *runtime's* locale, which differs between the
 * build (Node, en-US) and the visitor's browser: an en-GB or en-IN reader was
 * served `$27` in the pre-rendered HTML and rendered `US$27` on hydration, so
 * React discarded the server markup and re-rendered the page. Pinning en-US
 * keeps the two sides identical and keeps the symbol the one a US-facing tool
 * should show. The India tools pin en-IN for the same reason — see
 * `inr` / `inrShort` in insuranceIndia.ts.
 */

/** $1,234 — whole dollars, no cents. */
export const usd = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** 1,234 — grouped digits with no currency symbol, for interpolating after a
 *  literal "$" in labels and notes. */
export const num = (v: number) => v.toLocaleString("en-US");
