"use client";

import { RangeField, SelectField, ToggleField } from "./Fields";
import type { HealthInputs, PlanTier, RegionCost } from "@/lib/insuranceMath";

type Props = {
  value: HealthInputs;
  onChange: (value: HealthInputs) => void;
};

export default function HealthForm({ value, onChange }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <RangeField
        label="Age"
        value={value.age}
        min={18}
        max={64}
        onChange={(age) => onChange({ ...value, age })}
      />
      <SelectField<PlanTier>
        label="Plan tier"
        value={value.tier}
        options={[
          { value: "bronze", label: "Bronze — lowest premium, highest out-of-pocket" },
          { value: "silver", label: "Silver — balanced" },
          { value: "gold", label: "Gold — higher premium, lower out-of-pocket" },
          { value: "platinum", label: "Platinum — highest premium, lowest out-of-pocket" },
        ]}
        onChange={(tier) => onChange({ ...value, tier })}
      />
      <SelectField<RegionCost>
        label="Regional cost of care"
        value={value.regionCost}
        options={[
          { value: "low", label: "Low-cost area" },
          { value: "average", label: "Average-cost area" },
          { value: "high", label: "High-cost area" },
        ]}
        onChange={(regionCost) => onChange({ ...value, regionCost })}
      />
      <div className="flex items-end">
        <ToggleField
          label="I use tobacco products"
          description="Marketplace plans can surcharge up to 50% for tobacco use."
          checked={value.smoker}
          onChange={(smoker) => onChange({ ...value, smoker })}
        />
      </div>
    </div>
  );
}
