"use client";

/**
 * Diverging factor-impact chart for the premium estimator.
 *
 * Each rating factor is a multiplier around a baseline of 1.0. This renders
 * a horizontal bar diverging from a center baseline: factors that raise the
 * premium grow right (accent), factors that lower it grow left (positive/
 * green). Bar length is normalized to the largest deviation in the set, so
 * the biggest driver always fills the track and the rest scale relative to
 * it. Bars animate in via .bar-fill.
 */

import type { EstimateResult } from "@/lib/insuranceMath";

type Item = EstimateResult["breakdown"][number];

const MAX_FRAC = 0.46; // leave a margin either side of the 50% center

function impactLabel(multiplier: number): string {
  if (Math.abs(multiplier - 1) < 0.005) return "baseline";
  const pct = Math.round((multiplier - 1) * 100);
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}

export default function FactorImpactBars({ items }: { items: Item[] }) {
  const maxDev = Math.max(0.01, ...items.map((i) => Math.abs(i.multiplier - 1)));

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const dev = item.multiplier - 1;
        const pct = (Math.min(MAX_FRAC, (Math.abs(dev) / maxDev) * MAX_FRAC) * 100).toFixed(1);
        const increase = dev > 0.0005;
        const decrease = dev < -0.0005;

        return (
          <div key={item.label}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm text-[var(--foreground)]/90">{item.label}</span>
              <span
                className={`shrink-0 font-mono text-xs ${
                  decrease ? "text-[var(--positive)]" : increase ? "text-[var(--accent)]" : "text-muted"
                }`}
              >
                {impactLabel(item.multiplier)}
              </span>
            </div>

            <div className="relative mt-1.5 h-2 w-full rounded-full bg-[var(--surface-2)]">
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-[var(--line-strong)]"
              />
              {increase && (
                <span
                  className="bar-fill absolute left-1/2 top-0 h-full rounded-r-full bg-[var(--accent)]"
                  style={{ width: `${pct}%` }}
                />
              )}
              {decrease && (
                <span
                  className="bar-fill bar-fill-left absolute right-1/2 top-0 h-full rounded-l-full bg-[var(--positive)]"
                  style={{ width: `${pct}%` }}
                />
              )}
            </div>

            {item.note && <p className="text-muted mt-1 text-xs">{item.note}</p>}
          </div>
        );
      })}

      <div className="text-muted flex items-center justify-between border-t border-[var(--line)] pt-2 font-mono text-[0.65rem] tracking-wide uppercase">
        <span>Lower cost</span>
        <span>Baseline</span>
        <span>Higher cost</span>
      </div>
    </div>
  );
}
