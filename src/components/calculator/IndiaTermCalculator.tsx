"use client";

import { useMemo } from "react";
import { RangeField, SelectField, ToggleField } from "./Fields";
import ResultPanel from "./ResultPanel";
import AdSlot from "@/components/AdSlot";
import { useShareableInputs, type Schema } from "@/hooks/useShareableInputs";
import { estimateIndiaTermLife, inr, inrShort, type IndiaTermInputs } from "@/lib/insuranceIndia";

const DEFAULTS: IndiaTermInputs = {
  age: 32,
  smoker: false,
  sumAssured: 10000000, // ₹1 Cr
  term: 30,
};

// Mirrors the controls below, so a shared link can only ever carry a value the
// UI itself could have produced.
const SCHEMA: Schema<IndiaTermInputs> = {
  age: { kind: "number", min: 18, max: 65, step: 1 },
  smoker: { kind: "bool" },
  sumAssured: { kind: "number", min: 2500000, max: 50000000, step: 2500000 },
  term: { kind: "numEnum", values: [10, 15, 20, 30, 40] },
};

export default function IndiaTermCalculator() {
  const [inputs, setInputs] = useShareableInputs(DEFAULTS, SCHEMA);
  const result = useMemo(() => estimateIndiaTermLife(inputs), [inputs]);

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
            label="Sum assured"
            value={inputs.sumAssured}
            min={2500000}
            max={50000000}
            step={2500000}
            format={inrShort}
            onChange={(sumAssured) => setInputs({ ...inputs, sumAssured })}
          />
          <SelectField<"10" | "15" | "20" | "30" | "40">
            label="Policy term"
            value={String(inputs.term) as "10" | "15" | "20" | "30" | "40"}
            options={[
              { value: "10", label: "10 years" },
              { value: "15", label: "15 years" },
              { value: "20", label: "20 years" },
              { value: "30", label: "30 years" },
              { value: "40", label: "40 years" },
            ]}
            onChange={(v) => setInputs({ ...inputs, term: Number(v) })}
          />
          <div className="flex items-end">
            <ToggleField
              label="I use tobacco products"
              checked={inputs.smoker}
              onChange={(smoker) => setInputs({ ...inputs, smoker })}
            />
          </div>
        </div>

        <AdSlot slot="india-term-inline" />
      </div>

      <ResultPanel typeLabel="Term life" result={result} formatCurrency={inr} />
    </div>
  );
}
