"use client";

import { RangeField, SelectField } from "./Fields";
import type {
  ClaimsHistory,
  ConstructionType,
  Deductible,
  HomeCoverage,
  HomeInputs,
  RegionCost,
} from "@/lib/insuranceMath";

import { num } from "@/lib/format";

const currency = (v: number) => `$${num(v)}`;

type Props = {
  value: HomeInputs;
  onChange: (value: HomeInputs) => void;
};

export default function HomeForm({ value, onChange }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <RangeField
        label="Home value"
        value={value.homeValue}
        min={50000}
        max={2000000}
        step={10000}
        format={currency}
        onChange={(homeValue) => onChange({ ...value, homeValue })}
      />
      <RangeField
        label="Home age"
        value={value.homeAgeYears}
        min={0}
        max={120}
        format={(v) => `${v} yrs`}
        onChange={(homeAgeYears) => onChange({ ...value, homeAgeYears })}
      />
      <SelectField<ConstructionType>
        label="Construction type"
        value={value.construction}
        options={[
          { value: "frame", label: "Wood frame" },
          { value: "masonry", label: "Masonry / brick" },
        ]}
        onChange={(construction) => onChange({ ...value, construction })}
      />
      <SelectField<HomeCoverage>
        label="Coverage level"
        value={value.coverage}
        options={[
          { value: "basic", label: "Basic (named perils)" },
          { value: "standard", label: "Standard (open perils, ACV)" },
          { value: "comprehensive", label: "Comprehensive (replacement cost)" },
        ]}
        onChange={(coverage) => onChange({ ...value, coverage })}
      />
      <SelectField<string>
        label="Deductible"
        value={String(value.deductible)}
        options={[
          { value: "500", label: "$500" },
          { value: "1000", label: "$1,000" },
          { value: "2500", label: "$2,500" },
          { value: "5000", label: "$5,000" },
        ]}
        onChange={(v) => onChange({ ...value, deductible: Number(v) as Deductible })}
      />
      <SelectField<RegionCost>
        label="Regional risk"
        value={value.regionRisk}
        options={[
          { value: "low", label: "Low weather/catastrophe exposure" },
          { value: "average", label: "Average exposure" },
          { value: "high", label: "High exposure (flood/wildfire/hurricane)" },
        ]}
        onChange={(regionRisk) => onChange({ ...value, regionRisk })}
      />
      <SelectField<ClaimsHistory>
        label="Claims history (5 yrs)"
        value={value.claimsHistory}
        options={[
          { value: "0", label: "None" },
          { value: "1", label: "One" },
          { value: "2+", label: "Two or more" },
        ]}
        onChange={(claimsHistory) => onChange({ ...value, claimsHistory })}
      />
    </div>
  );
}
