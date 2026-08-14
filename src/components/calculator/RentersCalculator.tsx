"use client";

import { useMemo } from "react";
import { RangeField, SelectField } from "./Fields";
import MoneyResultPanel from "./MoneyResultPanel";
import AdSlot from "@/components/AdSlot";
import { useShareableInputs, type Schema } from "@/hooks/useShareableInputs";
import {
  estimateRentersInsurance,
  type ClaimsCount,
  type LiabilityLimit,
  type RentersDeductible,
  type RentersInputs,
  type RiskLevel,
} from "@/lib/insuranceExtras";

import { num } from "@/lib/format";

const currency = (v: number) => `$${num(v)}`;

const DEFAULTS: RentersInputs = {
  personalPropertyValue: 30000,
  liabilityLimit: 300000,
  deductible: 500,
  regionRisk: "average",
  claimsHistory: "0",
};

// Mirrors the controls below, so a shared link can only ever carry a value the
// UI itself could have produced.
const SCHEMA: Schema<RentersInputs> = {
  personalPropertyValue: { kind: "number", min: 5000, max: 200000, step: 5000 },
  liabilityLimit: { kind: "numEnum", values: [100000, 300000, 500000] },
  deductible: { kind: "numEnum", values: [250, 500, 1000, 2500] },
  regionRisk: { kind: "enum", values: ["low", "average", "high"] },
  claimsHistory: { kind: "enum", values: ["0", "1", "2+"] },
};

export default function RentersCalculator() {
  const [inputs, setInputs] = useShareableInputs(DEFAULTS, SCHEMA);
  const result = useMemo(() => estimateRentersInsurance(inputs), [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <RangeField
            label="Personal property value"
            value={inputs.personalPropertyValue}
            min={5000}
            max={200000}
            step={5000}
            format={currency}
            onChange={(personalPropertyValue) => setInputs({ ...inputs, personalPropertyValue })}
          />
          <SelectField<string>
            label="Liability coverage"
            value={String(inputs.liabilityLimit)}
            options={[
              { value: "100000", label: "$100,000" },
              { value: "300000", label: "$300,000" },
              { value: "500000", label: "$500,000" },
            ]}
            onChange={(v) => setInputs({ ...inputs, liabilityLimit: Number(v) as LiabilityLimit })}
          />
          <SelectField<string>
            label="Deductible"
            value={String(inputs.deductible)}
            options={[
              { value: "250", label: "$250" },
              { value: "500", label: "$500" },
              { value: "1000", label: "$1,000" },
              { value: "2500", label: "$2,500" },
            ]}
            onChange={(v) => setInputs({ ...inputs, deductible: Number(v) as RentersDeductible })}
          />
          <SelectField<RiskLevel>
            label="Regional risk"
            value={inputs.regionRisk}
            options={[
              { value: "low", label: "Low risk area" },
              { value: "average", label: "Average risk area" },
              { value: "high", label: "High risk area" },
            ]}
            onChange={(regionRisk) => setInputs({ ...inputs, regionRisk })}
          />
          <SelectField<ClaimsCount>
            label="Claims history (5 yrs)"
            value={inputs.claimsHistory}
            options={[
              { value: "0", label: "None" },
              { value: "1", label: "One" },
              { value: "2+", label: "Two or more" },
            ]}
            onChange={(claimsHistory) => setInputs({ ...inputs, claimsHistory })}
          />
        </div>

        <AdSlot slot="renters-inline" />
      </div>

      <MoneyResultPanel
        eyebrow="Renters insurance"
        headlineLabel="Estimated monthly premium"
        headlineValue={result.monthlyPremium}
        secondaryLabel="Annual premium"
        secondaryValue={result.annualPremium}
        rows={result.rows}
      />
    </div>
  );
}
