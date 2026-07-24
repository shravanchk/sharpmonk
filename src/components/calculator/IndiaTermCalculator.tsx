"use client";

import { useMemo, useState } from "react";
import { RangeField, SelectField, ToggleField } from "./Fields";
import ResultPanel from "./ResultPanel";
import AdSlot from "@/components/AdSlot";
import { estimateIndiaTermLife, inr, inrShort, type IndiaTermInputs } from "@/lib/insuranceIndia";

const DEFAULTS: IndiaTermInputs = {
  age: 32,
  smoker: false,
  sumAssured: 10000000, // ₹1 Cr
  term: 30,
};

export default function IndiaTermCalculator() {
  const [inputs, setInputs] = useState(DEFAULTS);
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

        <div className="mt-8">
          <AdSlot slot="india-term-inline" className="min-h-20" />
        </div>
      </div>

      <ResultPanel typeLabel="Term life" result={result} formatCurrency={inr} />
    </div>
  );
}
