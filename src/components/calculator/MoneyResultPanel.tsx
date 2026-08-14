"use client";

import Link from "next/link";
import { useCountUp } from "@/hooks/useCountUp";
import { usd } from "@/lib/format";
import DonutChart from "./DonutChart";
import ResultActions from "./ResultActions";
import type { MoneyRow } from "@/lib/insuranceExtras";

type Props = {
  eyebrow: string;
  headlineLabel: string;
  headlineValue: number;
  headlineSuffix?: string;
  secondaryLabel?: string;
  secondaryValue?: number;
  rows: MoneyRow[];
  disclaimerHref?: string;
  /** Set false when the positive rows don't form a clean part-to-whole
   *  (e.g. disability, where target = employer + gap would double-count). */
  showComposition?: boolean;
  /** Currency formatter — defaults to USD; India tools pass an INR one. */
  formatCurrency?: (v: number) => string;
};

export default function MoneyResultPanel({
  eyebrow,
  headlineLabel,
  headlineValue,
  headlineSuffix,
  secondaryLabel,
  secondaryValue,
  rows,
  disclaimerHref = "/disclaimer",
  showComposition = true,
  formatCurrency = usd,
}: Props) {
  const currency = formatCurrency;
  const headline = useCountUp(headlineValue);
  const maxAbs = Math.max(1, ...rows.map((r) => Math.abs(r.amount)));

  const positiveRows = rows.filter((r) => r.amount > 0);
  const positiveTotal = positiveRows.reduce((sum, r) => sum + r.amount, 0);
  const showDonut = showComposition && positiveRows.length >= 2;

  return (
    <div className="glass-card sticky top-24 rounded-2xl p-6">
      <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{eyebrow}</span>

      <div key={headlineValue} className="result-pop mt-2">
        <span className="text-muted block text-xs">{headlineLabel}</span>
        <div className="flex items-end gap-2">
          <span className="count-tick text-4xl font-semibold tracking-tight">{currency(headline)}</span>
          {headlineSuffix && <span className="text-muted mb-1 text-sm">{headlineSuffix}</span>}
        </div>
        {secondaryLabel && secondaryValue !== undefined && (
          <p className="text-muted mt-1 text-sm">
            {secondaryLabel}: {currency(secondaryValue)}
          </p>
        )}
      </div>

      {showDonut && (
        <div className="mt-6 border-t border-[var(--line)] pt-5">
          <span className="text-muted font-mono text-[0.7rem] tracking-[0.14em] uppercase">
            Composition
          </span>
          <div className="mt-4">
            <DonutChart
              slices={positiveRows.map((r) => ({ label: r.label, value: r.amount }))}
              centerValue={currency(positiveTotal)}
              centerLabel="total before offsets"
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3.5 border-t border-[var(--line)] pt-5">
        {rows.map((row) => {
          const width = Math.min(100, Math.max(6, (Math.abs(row.amount) / maxAbs) * 100));
          const negative = row.amount < 0;
          return (
            <div key={row.label}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm text-[var(--foreground)]/90">{row.label}</span>
                <span className={`shrink-0 font-mono text-xs ${negative ? "text-[var(--positive)]" : "text-muted"}`}>
                  {negative ? "-" : ""}
                  {currency(Math.abs(row.amount))}
                </span>
              </div>
              <p className="text-muted mt-0.5 text-xs">{row.note}</p>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
                <div
                  className={`bar-fill h-full rounded-full ${negative ? "bg-[var(--positive)]" : "bg-[var(--mesh-2)]"}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <ResultActions />

      <p className="text-muted mt-6 border-t border-[var(--line)] pt-4 text-xs leading-relaxed">
        Illustrative estimate only &mdash; not a quote or professional
        recommendation.{" "}
        <Link href={disclaimerHref} className="text-[var(--accent)] underline underline-offset-2">
          Read the full disclaimer
        </Link>
        .
      </p>
    </div>
  );
}
