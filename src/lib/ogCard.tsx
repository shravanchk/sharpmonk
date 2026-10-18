import { ImageResponse } from "next/og";
import { EXAM_ENTRIES, TOOLS } from "./content";

/**
 * Shared renderer for per-page social share cards.
 *
 * Every route that wants its own card exports `size`/`contentType`/`alt` from
 * here and calls `ogCard(...)`, so the layout lives in one place and a new
 * page only needs the few lines of copy that differ.
 *
 * Runs at build time (no request-time APIs), so it stays compatible with
 * `output: "export"` and ships as plain PNGs.
 *
 * Note for editing: this is rendered by satori, not a browser. It supports a
 * subset of CSS — every element with more than one child needs an explicit
 * `display: flex`, and there is no cascade, so styles are set per element.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#0e1a2f";
const CARD_BG = "#0e1a2f";
const WHITE = "#f8fafc";
const MUTED = "#94a3b8";
const ACCENT = "#5b8def";
const GOLD = "#f4bb2b";

/** The brand mark, inlined as a data URI — satori renders SVG through <img>. */
const MARK = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect x="2" y="2" width="96" height="96" rx="24" fill="#17325c"/>
    <path d="M50 21C39 21 30 30 29 42L28.5 53C19.5 58.5 14 68.5 13 79C12.5 83.3 15.9 86.5 20 86.5H80C84.1 86.5 87.5 83.3 87 79C86 68.5 80.5 58.5 71.5 53L71 42C70 30 61 21 50 21Z" fill="#ffffff"/>
    <path d="M50 32c-6.6 0-12 5.4-12 12v5c0 6.6 5.4 12 12 12s12-5.4 12-12v-5c0-6.6-5.4-12-12-12Z" fill="#17325c"/>
    <path d="M35.5 13.5a14.5 4.2 0 0 1 29 0" stroke="#f4bb2b" stroke-width="3.6" fill="none" stroke-linecap="round"/>
  </svg>`,
)}`;

/**
 * Looks a route's card copy up from the shared catalogue, so a card says the
 * same thing the page does, and a new tool or exam gets a correct card from
 * its catalogue entry alone.
 *
 * Throws on an unknown href rather than silently rendering a blank card — this
 * runs at build time, so a typo fails the build instead of shipping.
 */
export function cardFor(href: string): OgCardInput {
  const tool = TOOLS.find((t) => t.href === href);
  if (tool) return { eyebrow: "Precision tool", title: tool.title, subtitle: tool.body };

  const exam = EXAM_ENTRIES.find((e) => e.href === href);
  if (exam) return { eyebrow: "Exam upload sizes", title: exam.title, subtitle: exam.body };

  throw new Error(
    `ogCard: no content entry for "${href}". Add it to TOOLS in lib/content.ts or an exam to lib/specs.ts, or pass copy explicitly.`,
  );
}

export type OgCardInput = {
  /** Small label above the headline — the section, e.g. "Precision tool". */
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Shown bottom-right. */
  tag?: string;
};

export function ogCard({ eyebrow, title, subtitle, tag = "Free · Nothing uploaded" }: OgCardInput) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CARD_BG,
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* Soft brand glow, bled off the right edge. Two flat circles rather
            than a gradient — satori has no blur filter. */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "#132844",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            right: 60,
            width: 460,
            height: 460,
            borderRadius: 9999,
            background: "#11213a",
            display: "flex",
          }}
        />

        {/* Brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK} width={64} height={64} alt="" />
          <span style={{ fontSize: 34, color: WHITE, letterSpacing: -0.5 }}>Sharpmonk</span>
        </div>

        {/* Headline block */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <span
            style={{
              fontSize: 22,
              color: ACCENT,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: title.length > 42 ? 62 : 76,
              color: WHITE,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            {title}
          </span>
          <span style={{ fontSize: 28, color: MUTED, lineHeight: 1.4, marginTop: 22 }}>
            {subtitle}
          </span>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontSize: 24,
              color: NAVY,
              background: ACCENT,
              borderRadius: 9999,
              padding: "10px 26px",
              display: "flex",
            }}
          >
            sharpmonk.com
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{ width: 10, height: 10, borderRadius: 9999, background: GOLD, display: "flex" }}
            />
            <span style={{ fontSize: 24, color: MUTED }}>{tag}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
