"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { encodeAll } from "@/hooks/useShareableInputs";
import { useCountUp } from "@/hooks/useCountUp";
import { DEFAULT_LIFE, LIFE_SCHEMA } from "@/lib/calculatorInputs";
import { estimateLife, type LifeInputs } from "@/lib/insuranceMath";
import { RangeField, ToggleField } from "@/components/calculator/Fields";
import Icon from "@/components/Icon";
import IconBadge from "@/components/IconBadge";

/**
 * The homepage hero card: a working term-life estimate, not a picture of one.
 *
 * The whole promise of the site is "see the number without filling in a form",
 * so the first thing on the page runs the real `estimateLife` formula rather
 * than showing a mocked-up figure. It is deliberately cut down to the three
 * inputs that move the premium most — age, coverage, tobacco — with term and
 * health held at their defaults; the full set lives one click away in the
 * estimator, and the CTA carries whatever the visitor has already entered.
 *
 * State starts at `DEFAULT_LIFE` with nothing read from the URL, so the server
 * render and the first client render agree and this can stay the LCP element.
 */

const currency = (v: number) => `$${v.toLocaleString("en-US")}`;

/** "$500k" / "$1.25M" — the sub-line has no room for the full figure.
 *  Hand-rolled rather than `Intl` compact notation: this renders during the
 *  static export and again at hydration, so it has to be ICU-independent. */
function shortCurrency(v: number): string {
  if (v < 1_000_000) return `$${Math.round(v / 1000)}k`;
  return `$${(v / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
}

export default function HeroEstimator() {
  const [inputs, setInputs] = useState<LifeInputs>(DEFAULT_LIFE);
  const result = useMemo(() => estimateLife(inputs), [inputs]);
  const monthly = useCountUp(result.monthlyPremium);

  const href = useMemo(() => {
    const qs = encodeAll(inputs, DEFAULT_LIFE, LIFE_SCHEMA).toString();
    return qs ? `/calculator?${qs}` : "/calculator";
  }, [inputs]);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
          Life · monthly estimate
        </span>
        <IconBadge name="shield" size={18} badgeSize="sm" />
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-5xl font-semibold tracking-tight tabular-nums">
          {currency(Math.round(monthly))}
        </span>
        <span className="text-muted mb-1.5 text-sm">/ month</span>
      </div>
      <p className="text-muted mt-1 text-sm">
        {currency(Math.round(result.annualPremium))} / year ·{" "}
        {shortCurrency(inputs.coverageAmount)}, {inputs.term}-yr term
      </p>

      <div className="mt-6 flex flex-col gap-5 border-t border-[var(--line)] pt-5">
        <RangeField
          label="Age"
          value={inputs.age}
          min={18}
          max={80}
          onChange={(age) => setInputs((v) => ({ ...v, age }))}
        />
        <RangeField
          label="Coverage amount"
          value={inputs.coverageAmount}
          min={50000}
          max={2000000}
          step={25000}
          format={currency}
          onChange={(coverageAmount) => setInputs((v) => ({ ...v, coverageAmount }))}
        />
        <ToggleField
          label="I use tobacco products"
          checked={inputs.smoker}
          onChange={(smoker) => setInputs((v) => ({ ...v, smoker }))}
        />
      </div>

      <Link
        href={href}
        className="text-[var(--accent)] mt-5 inline-flex items-center gap-1.5 text-sm font-medium"
      >
        See the full breakdown
        <Icon name="arrow-right" size={15} />
      </Link>
    </div>
  );
}
