"use client";

import { RangeField, SelectField } from "./Fields";
import type {
  AutoCoverage,
  AutoInputs,
  MileageTier,
  RegionCost,
  ViolationCount,
} from "@/lib/insuranceMath";

import { num } from "@/lib/format";

const currency = (v: number) => `$${num(v)}`;

type Props = {
  value: AutoInputs;
  onChange: (value: AutoInputs) => void;
};

export default function AutoForm({ value, onChange }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <RangeField
        label="Driver age"
        value={value.age}
        min={16}
        max={85}
        onChange={(age) => onChange({ ...value, age })}
      />
      <RangeField
        label="Years licensed"
        value={value.yearsLicensed}
        min={0}
        max={60}
        format={(v) => `${v} yrs`}
        onChange={(yearsLicensed) => onChange({ ...value, yearsLicensed })}
      />
      <SelectField<AutoCoverage>
        label="Coverage level"
        value={value.coverage}
        options={[
          { value: "liability", label: "Liability only" },
          { value: "standard", label: "Standard (liability + collision)" },
          { value: "full", label: "Full coverage (+ comprehensive)" },
        ]}
        onChange={(coverage) => onChange({ ...value, coverage })}
      />
      <RangeField
        label="Vehicle value"
        value={value.vehicleValue}
        min={2000}
        max={120000}
        step={1000}
        format={currency}
        onChange={(vehicleValue) => onChange({ ...value, vehicleValue })}
      />
      <SelectField<ViolationCount>
        label="At-fault incidents (3 yrs)"
        value={value.violations}
        options={[
          { value: "0", label: "None" },
          { value: "1", label: "One" },
          { value: "2+", label: "Two or more" },
        ]}
        onChange={(violations) => onChange({ ...value, violations })}
      />
      <SelectField<MileageTier>
        label="Annual mileage"
        value={value.mileage}
        options={[
          { value: "low", label: "Low — under 7,500 mi/yr" },
          { value: "average", label: "Average — 7,500–15,000 mi/yr" },
          { value: "high", label: "High — over 15,000 mi/yr" },
        ]}
        onChange={(mileage) => onChange({ ...value, mileage })}
      />
      <SelectField<RegionCost>
        label="Regional risk"
        value={value.regionRisk}
        options={[
          { value: "low", label: "Low claims-density area" },
          { value: "average", label: "Average area" },
          { value: "high", label: "High claims-density area" },
        ]}
        onChange={(regionRisk) => onChange({ ...value, regionRisk })}
      />
    </div>
  );
}
