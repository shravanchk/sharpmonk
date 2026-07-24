"use client";

import { useMemo } from "react";
import { RangeField, SelectField } from "./Fields";
import MoneyResultPanel from "./MoneyResultPanel";
import AdSlot from "@/components/AdSlot";
import { useShareableInputs, type Schema } from "@/hooks/useShareableInputs";
import { estimateUmbrellaInsurance, type ClaimsCount, type UmbrellaInputs, type UmbrellaLimit } from "@/lib/insuranceExtras";

const DEFAULTS: UmbrellaInputs = {
  coverageLimit: 1000000,
  autoPolicies: 2,
  homePolicies: 1,
  priorClaims: "0",
};

// Mirrors the controls below, so a shared link can only ever carry a value the
// UI itself could have produced.
const SCHEMA: Schema<UmbrellaInputs> = {
  coverageLimit: { kind: "numEnum", values: [1000000, 2000000, 3000000, 5000000] },
  autoPolicies: { kind: "number", min: 0, max: 5, step: 1 },
  homePolicies: { kind: "number", min: 0, max: 5, step: 1 },
  priorClaims: { kind: "enum", values: ["0", "1", "2+"] },
};

export default function UmbrellaCalculator() {
  const [inputs, setInputs] = useShareableInputs(DEFAULTS, SCHEMA);
  const result = useMemo(() => estimateUmbrellaInsurance(inputs), [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField<string>
            label="Umbrella coverage limit"
            value={String(inputs.coverageLimit)}
            options={[
              { value: "1000000", label: "$1,000,000" },
              { value: "2000000", label: "$2,000,000" },
              { value: "3000000", label: "$3,000,000" },
              { value: "5000000", label: "$5,000,000" },
            ]}
            onChange={(v) => setInputs({ ...inputs, coverageLimit: Number(v) as UmbrellaLimit })}
          />
          <RangeField
            label="Auto policies covered"
            value={inputs.autoPolicies}
            min={0}
            max={5}
            onChange={(autoPolicies) => setInputs({ ...inputs, autoPolicies })}
          />
          <RangeField
            label="Home/property policies covered"
            value={inputs.homePolicies}
            min={0}
            max={5}
            onChange={(homePolicies) => setInputs({ ...inputs, homePolicies })}
          />
          <SelectField<ClaimsCount>
            label="Prior liability claims"
            value={inputs.priorClaims}
            options={[
              { value: "0", label: "None" },
              { value: "1", label: "One" },
              { value: "2+", label: "Two or more" },
            ]}
            onChange={(priorClaims) => setInputs({ ...inputs, priorClaims })}
          />
        </div>

        <div className="mt-8">
          <AdSlot slot="umbrella-inline" className="min-h-20" />
        </div>
      </div>

      <MoneyResultPanel
        eyebrow="Umbrella insurance"
        headlineLabel="Estimated annual premium"
        headlineValue={result.annualPremium}
        secondaryLabel="Monthly equivalent"
        secondaryValue={result.monthlyPremium}
        rows={result.rows}
      />
    </div>
  );
}
