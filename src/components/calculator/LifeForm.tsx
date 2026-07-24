"use client";

import { RangeField, SelectField, ToggleField } from "./Fields";
import type { HealthRating, LifeInputs, TermYears } from "@/lib/insuranceMath";

const currency = (v: number) => `$${v.toLocaleString()}`;

type Props = {
  value: LifeInputs;
  onChange: (value: LifeInputs) => void;
};

export default function LifeForm({ value, onChange }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <RangeField
        label="Age"
        value={value.age}
        min={18}
        max={80}
        onChange={(age) => onChange({ ...value, age })}
      />
      <RangeField
        label="Coverage amount"
        value={value.coverageAmount}
        min={50000}
        max={2000000}
        step={25000}
        format={currency}
        onChange={(coverageAmount) => onChange({ ...value, coverageAmount })}
      />
      <SelectField<"10" | "20" | "30">
        label="Term length"
        value={String(value.term) as "10" | "20" | "30"}
        options={[
          { value: "10", label: "10 years" },
          { value: "20", label: "20 years" },
          { value: "30", label: "30 years" },
        ]}
        onChange={(v) => onChange({ ...value, term: Number(v) as TermYears })}
      />
      <SelectField<HealthRating>
        label="Self-reported health"
        value={value.healthRating}
        options={[
          { value: "excellent", label: "Excellent" },
          { value: "good", label: "Good" },
          { value: "fair", label: "Fair" },
          { value: "poor", label: "Poor" },
        ]}
        onChange={(healthRating) => onChange({ ...value, healthRating })}
      />
      <div className="sm:col-span-2">
        <ToggleField
          label="I use tobacco products"
          description="Smoking is the single largest rating factor for life insurance."
          checked={value.smoker}
          onChange={(smoker) => onChange({ ...value, smoker })}
        />
      </div>
    </div>
  );
}
