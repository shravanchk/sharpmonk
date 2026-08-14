"use client";

import { useMemo } from "react";
import { RangeField } from "./Fields";
import MoneyResultPanel from "./MoneyResultPanel";
import AdSlot from "@/components/AdSlot";
import { useShareableInputs, type Schema } from "@/hooks/useShareableInputs";
import { estimateLifeInsuranceNeeds, type LifeNeedsInputs } from "@/lib/insuranceExtras";

import { num } from "@/lib/format";

const currency = (v: number) => `$${num(v)}`;

const DEFAULTS: LifeNeedsInputs = {
  annualIncome: 80000,
  yearsToReplace: 10,
  nonMortgageDebt: 15000,
  mortgageBalance: 250000,
  children: 1,
  costPerChildEducation: 80000,
  existingLifeInsurance: 0,
  liquidSavings: 20000,
};

// Mirrors the controls below, so a shared link can only ever carry a value the
// UI itself could have produced.
const SCHEMA: Schema<LifeNeedsInputs> = {
  annualIncome: { kind: "number", min: 20000, max: 400000, step: 5000 },
  yearsToReplace: { kind: "number", min: 1, max: 30, step: 1 },
  nonMortgageDebt: { kind: "number", min: 0, max: 200000, step: 1000 },
  mortgageBalance: { kind: "number", min: 0, max: 1000000, step: 5000 },
  children: { kind: "number", min: 0, max: 6, step: 1 },
  costPerChildEducation: { kind: "number", min: 0, max: 250000, step: 5000 },
  existingLifeInsurance: { kind: "number", min: 0, max: 1000000, step: 10000 },
  liquidSavings: { kind: "number", min: 0, max: 500000, step: 5000 },
};

export default function LifeNeedsCalculator() {
  const [inputs, setInputs] = useShareableInputs(DEFAULTS, SCHEMA);
  const result = useMemo(() => estimateLifeInsuranceNeeds(inputs), [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <RangeField
            label="Annual income"
            value={inputs.annualIncome}
            min={20000}
            max={400000}
            step={5000}
            format={currency}
            onChange={(annualIncome) => setInputs({ ...inputs, annualIncome })}
          />
          <RangeField
            label="Years of income to replace"
            value={inputs.yearsToReplace}
            min={1}
            max={30}
            format={(v) => `${v} yrs`}
            onChange={(yearsToReplace) => setInputs({ ...inputs, yearsToReplace })}
          />
          <RangeField
            label="Non-mortgage debt"
            value={inputs.nonMortgageDebt}
            min={0}
            max={200000}
            step={1000}
            format={currency}
            onChange={(nonMortgageDebt) => setInputs({ ...inputs, nonMortgageDebt })}
          />
          <RangeField
            label="Remaining mortgage balance"
            value={inputs.mortgageBalance}
            min={0}
            max={1000000}
            step={5000}
            format={currency}
            onChange={(mortgageBalance) => setInputs({ ...inputs, mortgageBalance })}
          />
          <RangeField
            label="Children to fund education for"
            value={inputs.children}
            min={0}
            max={6}
            onChange={(children) => setInputs({ ...inputs, children })}
          />
          <RangeField
            label="Education cost per child"
            value={inputs.costPerChildEducation}
            min={0}
            max={250000}
            step={5000}
            format={currency}
            onChange={(costPerChildEducation) => setInputs({ ...inputs, costPerChildEducation })}
          />
          <RangeField
            label="Existing life insurance"
            value={inputs.existingLifeInsurance}
            min={0}
            max={1000000}
            step={10000}
            format={currency}
            onChange={(existingLifeInsurance) => setInputs({ ...inputs, existingLifeInsurance })}
          />
          <RangeField
            label="Liquid savings"
            value={inputs.liquidSavings}
            min={0}
            max={500000}
            step={5000}
            format={currency}
            onChange={(liquidSavings) => setInputs({ ...inputs, liquidSavings })}
          />
        </div>

        <AdSlot slot="life-needs-inline" />
      </div>

      <MoneyResultPanel
        eyebrow="Life insurance needs"
        headlineLabel="Recommended coverage (net need)"
        headlineValue={result.netNeed}
        secondaryLabel="Gross need before offsets"
        secondaryValue={result.grossNeed}
        rows={result.rows}
      />
    </div>
  );
}
