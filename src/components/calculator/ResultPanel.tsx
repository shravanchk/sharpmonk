"use client";

import type { EstimateResult } from "@/lib/insuranceMath";
import { useCountUp } from "@/hooks/useCountUp";
import { usd } from "@/lib/format";
import FactorImpactBars from "./FactorImpactBars";
import ResultActions from "./ResultActions";

type Props = {
  typeLabel: string;
  result: EstimateResult;
  /** Currency formatter — defaults to USD; India tools pass an INR one. */
  formatCurrency?: (v: number) => string;
};

export default function ResultPanel({ typeLabel, result, formatCurrency = usd }: Props) {
  const monthly = useCountUp(result.monthlyPremium);
  const currency = formatCurrency;

  return (
    <div className="glass-card sticky top-24 rounded-2xl p-6">
      <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
        {typeLabel} estimate
      </span>

      <div key={result.monthlyPremium} className="result-pop mt-2">
        <div className="flex items-end gap-2">
          <span className="count-tick text-4xl font-semibold tracking-tight">
            {currency(monthly)}
          </span>
          <span className="text-muted mb-1 text-sm">/ month</span>
        </div>
        <p className="text-muted mt-1 text-sm">
          {currency(result.annualPremium)} / year
        </p>
      </div>

      <div className="mt-6 border-t border-[var(--line)] pt-5">
        <span className="text-muted font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          Factor impact
        </span>
        <div className="mt-4">
          <FactorImpactBars items={result.breakdown} />
        </div>
      </div>

      <ResultActions />

      <p className="text-muted mt-6 border-t border-[var(--line)] pt-4 text-xs leading-relaxed">
        Illustrative estimate only, based on generic industry rating
        factors &mdash; not a quote from any insurer.{" "}
        <a href="/disclaimer" className="text-[var(--accent)] underline underline-offset-2">
          Read the full disclaimer
        </a>
        .
      </p>
    </div>
  );
}
