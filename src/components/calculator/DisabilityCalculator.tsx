"use client";

import { useMemo } from "react";
import { RangeField, SelectField } from "./Fields";
import MoneyResultPanel from "./MoneyResultPanel";
import AdSlot from "@/components/AdSlot";
import { useShareableInputs, type Schema } from "@/hooks/useShareableInputs";
import { estimateDisabilityInsurance, type DisabilityInputs, type OccupationClass } from "@/lib/insuranceExtras";

const currency = (v: number) => `$${v.toLocaleString()}`;

const DEFAULTS: DisabilityInputs = {
  age: 35,
  monthlyIncome: 6000,
  targetReplacementPct: 65,
  employerCoveragePct: 0,
  occupationClass: "office",
};

// Mirrors the controls below, so a shared link can only ever carry a value the
// UI itself could have produced.
const SCHEMA: Schema<DisabilityInputs> = {
  age: { kind: "number", min: 18, max: 65, step: 1 },
  monthlyIncome: { kind: "number", min: 1000, max: 30000, step: 250 },
  targetReplacementPct: { kind: "number", min: 40, max: 80, step: 1 },
  employerCoveragePct: { kind: "number", min: 0, max: 70, step: 1 },
  occupationClass: { kind: "enum", values: ["office", "field", "manual"] },
};

export default function DisabilityCalculator() {
  const [inputs, setInputs] = useShareableInputs(DEFAULTS, SCHEMA);
  const result = useMemo(() => estimateDisabilityInsurance(inputs), [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
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
            label="Monthly income"
            value={inputs.monthlyIncome}
            min={1000}
            max={30000}
            step={250}
            format={currency}
            onChange={(monthlyIncome) => setInputs({ ...inputs, monthlyIncome })}
          />
          <RangeField
            label="Target income replacement"
            value={inputs.targetReplacementPct}
            min={40}
            max={80}
            format={(v) => `${v}%`}
            onChange={(targetReplacementPct) => setInputs({ ...inputs, targetReplacementPct })}
          />
          <RangeField
            label="Employer-provided LTD coverage"
            value={inputs.employerCoveragePct}
            min={0}
            max={70}
            format={(v) => `${v}%`}
            onChange={(employerCoveragePct) => setInputs({ ...inputs, employerCoveragePct })}
          />
          <SelectField<OccupationClass>
            label="Occupation risk class"
            value={inputs.occupationClass}
            options={[
              { value: "office", label: "Office / desk work" },
              { value: "field", label: "Field / some physical work" },
              { value: "manual", label: "Manual / physically demanding" },
            ]}
            onChange={(occupationClass) => setInputs({ ...inputs, occupationClass })}
          />
        </div>

        <AdSlot slot="disability-inline" />
      </div>

      <MoneyResultPanel
        eyebrow="Disability insurance"
        headlineLabel="Estimated annual premium"
        headlineValue={result.estimatedAnnualPremium}
        secondaryLabel="Monthly premium"
        secondaryValue={result.estimatedMonthlyPremium}
        rows={result.rows}
        showComposition={false}
      />
    </div>
  );
}
