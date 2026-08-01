"use client";

import { useMemo } from "react";
import { RangeField, SelectField, ToggleField } from "./Fields";
import GrowthChart from "./GrowthChart";
import AdSlot from "@/components/AdSlot";
import { useShareableInputs, type Schema } from "@/hooks/useShareableInputs";
import { useCountUp } from "@/hooks/useCountUp";
import { compareTermVsWholeLife, type TermVsWholeInputs } from "@/lib/insuranceExtras";
import type { HealthRating, TermYears } from "@/lib/insuranceMath";

const currency = (v: number) =>
  v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const DEFAULTS: TermVsWholeInputs = {
  age: 35,
  smoker: false,
  healthRating: "good",
  coverageAmount: 500000,
  term: 20,
  investmentReturnPct: 7,
};

// Mirrors the controls below, so a shared link can only ever carry a value the
// UI itself could have produced.
const SCHEMA: Schema<TermVsWholeInputs> = {
  age: { kind: "number", min: 18, max: 65, step: 1 },
  smoker: { kind: "bool" },
  healthRating: { kind: "enum", values: ["excellent", "good", "fair", "poor"] },
  coverageAmount: { kind: "number", min: 50000, max: 2000000, step: 25000 },
  term: { kind: "numEnum", values: [10, 20, 30] },
  investmentReturnPct: { kind: "number", min: 2, max: 12, step: 0.5 },
};

export default function TermVsWholeCalculator() {
  const [inputs, setInputs] = useShareableInputs(DEFAULTS, SCHEMA);
  const result = useMemo(() => compareTermVsWholeLife(inputs), [inputs]);

  const termMonthly = useCountUp(result.termMonthlyPremium);
  const wholeMonthly = useCountUp(result.wholeLifeMonthlyPremium);
  const invested = useCountUp(result.investedDifferenceAtTermEnd);

  return (
    <div className="flex flex-col gap-8">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <RangeField
            label="Age"
            value={inputs.age}
            min={18}
            max={65}
            onChange={(age) => setInputs({ ...inputs, age })}
          />
          <RangeField
            label="Coverage amount"
            value={inputs.coverageAmount}
            min={50000}
            max={2000000}
            step={25000}
            format={currency}
            onChange={(coverageAmount) => setInputs({ ...inputs, coverageAmount })}
          />
          <SelectField<"10" | "20" | "30">
            label="Term length to compare"
            value={String(inputs.term) as "10" | "20" | "30"}
            options={[
              { value: "10", label: "10 years" },
              { value: "20", label: "20 years" },
              { value: "30", label: "30 years" },
            ]}
            onChange={(v) => setInputs({ ...inputs, term: Number(v) as TermYears })}
          />
          <SelectField<HealthRating>
            label="Self-reported health"
            value={inputs.healthRating}
            options={[
              { value: "excellent", label: "Excellent" },
              { value: "good", label: "Good" },
              { value: "fair", label: "Fair" },
              { value: "poor", label: "Poor" },
            ]}
            onChange={(healthRating) => setInputs({ ...inputs, healthRating })}
          />
          <RangeField
            label="Expected investment return"
            value={inputs.investmentReturnPct}
            min={2}
            max={12}
            step={0.5}
            format={(v) => `${v}%`}
            onChange={(investmentReturnPct) => setInputs({ ...inputs, investmentReturnPct })}
          />
          <div className="flex items-end">
            <ToggleField
              label="I use tobacco products"
              checked={inputs.smoker}
              onChange={(smoker) => setInputs({ ...inputs, smoker })}
            />
          </div>
        </div>

        <AdSlot slot="term-vs-whole-inline" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="glass-card result-pop rounded-2xl p-6">
          <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
            Term life ({inputs.term} yrs)
          </span>
          <div className="mt-2 flex items-end gap-2">
            <span className="count-tick text-3xl font-semibold tracking-tight">{currency(termMonthly)}</span>
            <span className="text-muted mb-1 text-sm">/ month</span>
          </div>
          <p className="text-muted mt-1 text-sm">{currency(result.termAnnualPremium)} / year</p>
          <p className="text-muted mt-4 text-xs leading-relaxed">
            No cash value. Coverage ends when the term expires.
          </p>
        </div>

        <div className="glass-card result-pop rounded-2xl p-6">
          <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">Whole life</span>
          <div className="mt-2 flex items-end gap-2">
            <span className="count-tick text-3xl font-semibold tracking-tight">{currency(wholeMonthly)}</span>
            <span className="text-muted mb-1 text-sm">/ month</span>
          </div>
          <p className="text-muted mt-1 text-sm">{currency(result.wholeLifeAnnualPremium)} / year</p>
          <p className="text-muted mt-4 text-xs leading-relaxed">
            Permanent coverage. Est. {currency(result.estimatedCashValueAtTermEnd)} cash value
            by year {inputs.term}.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
          &ldquo;Buy term, invest the difference&rdquo;
        </span>
        <p className="text-muted mt-2 max-w-2xl text-sm leading-relaxed">
          You&apos;d pay {currency(result.annualPremiumDifference)}/year less for term than
          whole life. If you invested that difference instead at{" "}
          {inputs.investmentReturnPct}% annually for {inputs.term} years:
        </p>
        <div className="mt-4 flex items-end gap-2">
          <span className="count-tick text-4xl font-semibold tracking-tight text-[var(--accent)]">
            {currency(invested)}
          </span>
          <span className="text-muted mb-1 text-sm">projected value</span>
        </div>

        <div className="mt-8">
          <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
            Cumulative cost over {inputs.term} years
          </span>
          <div className="mt-4">
            <GrowthChart
              termAnnual={result.termAnnualPremium}
              wholeAnnual={result.wholeLifeAnnualPremium}
              termYears={inputs.term}
              investmentReturnPct={inputs.investmentReturnPct}
            />
          </div>
        </div>

        <p className="text-muted mt-6 text-xs leading-relaxed">
          Illustrative only &mdash; assumes the full premium difference is
          invested every month and ignores taxes, fees, and market
          volatility. Whole life cash value grows more predictably and
          isn&apos;t exposed to market risk, which is the trade-off this
          comparison simplifies.{" "}
          <a href="/disclaimer" className="text-[var(--accent)] underline underline-offset-2">
            Read the full disclaimer
          </a>
          .
        </p>
      </div>
    </div>
  );
}
