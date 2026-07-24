"use client";

import { useMemo } from "react";
import { RangeField, SelectField, ToggleField } from "./Fields";
import ResultPanel from "./ResultPanel";
import AdSlot from "@/components/AdSlot";
import { useShareableInputs, type Schema } from "@/hooks/useShareableInputs";
import {
  estimateIndiaHealth,
  inr,
  inrShort,
  type IndiaHealthInputs,
  type CityTier,
  type PlanType,
  type PreExisting,
} from "@/lib/insuranceIndia";

const DEFAULTS: IndiaHealthInputs = {
  age: 32,
  sumInsured: 1000000, // ₹10 L
  cityTier: "metro",
  plan: "individual",
  smoker: false,
  preExisting: "none",
};

// Mirrors the controls below, so a shared link can only ever carry a value the
// UI itself could have produced.
const SCHEMA: Schema<IndiaHealthInputs> = {
  age: { kind: "number", min: 18, max: 75, step: 1 },
  sumInsured: { kind: "number", min: 300000, max: 10000000, step: 100000 },
  cityTier: { kind: "enum", values: ["metro", "tier2", "tier3"] },
  plan: { kind: "enum", values: ["individual", "couple", "family"] },
  smoker: { kind: "bool" },
  preExisting: { kind: "enum", values: ["none", "controlled", "multiple"] },
};

export default function IndiaHealthCalculator() {
  const [inputs, setInputs] = useShareableInputs(DEFAULTS, SCHEMA);
  const result = useMemo(() => estimateIndiaHealth(inputs), [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <RangeField
            label="Age (eldest member)"
            value={inputs.age}
            min={18}
            max={75}
            onChange={(age) => setInputs({ ...inputs, age })}
          />
          <RangeField
            label="Sum insured"
            value={inputs.sumInsured}
            min={300000}
            max={10000000}
            step={100000}
            format={inrShort}
            onChange={(sumInsured) => setInputs({ ...inputs, sumInsured })}
          />
          <SelectField<CityTier>
            label="City tier"
            value={inputs.cityTier}
            options={[
              { value: "metro", label: "Metro (Mumbai, Delhi, etc.)" },
              { value: "tier2", label: "Tier-2 city" },
              { value: "tier3", label: "Tier-3 / town" },
            ]}
            onChange={(cityTier) => setInputs({ ...inputs, cityTier })}
          />
          <SelectField<PlanType>
            label="Who's covered"
            value={inputs.plan}
            options={[
              { value: "individual", label: "Individual" },
              { value: "couple", label: "Couple (2 adults)" },
              { value: "family", label: "Family floater (2A + 2K)" },
            ]}
            onChange={(plan) => setInputs({ ...inputs, plan })}
          />
          <SelectField<PreExisting>
            label="Pre-existing conditions"
            value={inputs.preExisting}
            options={[
              { value: "none", label: "None" },
              { value: "controlled", label: "Controlled (BP / thyroid)" },
              { value: "multiple", label: "Multiple / complex" },
            ]}
            onChange={(preExisting) => setInputs({ ...inputs, preExisting })}
          />
          <div className="flex items-end">
            <ToggleField
              label="Any member uses tobacco"
              checked={inputs.smoker}
              onChange={(smoker) => setInputs({ ...inputs, smoker })}
            />
          </div>
        </div>

        <div className="mt-8">
          <AdSlot slot="india-health-inline" className="min-h-20" />
        </div>
      </div>

      <ResultPanel typeLabel="Health cover" result={result} formatCurrency={inr} />
    </div>
  );
}
