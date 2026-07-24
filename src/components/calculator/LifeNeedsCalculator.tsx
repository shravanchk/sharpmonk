"use client";

import { useMemo, useState } from "react";
import { RangeField } from "./Fields";
import MoneyResultPanel from "./MoneyResultPanel";
import AdSlot from "@/components/AdSlot";
import { estimateLifeInsuranceNeeds, type LifeNeedsInputs } from "@/lib/insuranceExtras";

const currency = (v: number) => `$${v.toLocaleString()}`;

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

export default function LifeNeedsCalculator() {
  const [inputs, setInputs] = useState(DEFAULTS);
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

        <div className="mt-8">
          <AdSlot slot="life-needs-inline" className="min-h-20" />
        </div>
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
