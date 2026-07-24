"use client";

import { useMemo, useState } from "react";
import { RangeField, SelectField } from "./Fields";
import MoneyResultPanel from "./MoneyResultPanel";
import AdSlot from "@/components/AdSlot";
import {
  estimateIndiaMotor,
  inr,
  inrShort,
  type IndiaMotorInputs,
  type VehicleType,
  type MotorCover,
  type MotorZone,
} from "@/lib/insuranceIndia";

const DEFAULTS: IndiaMotorInputs = {
  vehicleType: "car",
  idv: 600000,
  vehicleAge: 3,
  cover: "comprehensive",
  ncbPct: 25,
  zone: "A",
};

const NCB_OPTIONS = ["0", "20", "25", "35", "45", "50"] as const;

export default function IndiaMotorCalculator() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const result = useMemo(() => estimateIndiaMotor(inputs), [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField<VehicleType>
            label="Vehicle type"
            value={inputs.vehicleType}
            options={[
              { value: "car", label: "Car" },
              { value: "bike", label: "Two-wheeler / bike" },
            ]}
            onChange={(vehicleType) => setInputs({ ...inputs, vehicleType })}
          />
          <RangeField
            label="IDV (insured declared value)"
            value={inputs.idv}
            min={50000}
            max={3000000}
            step={25000}
            format={inrShort}
            onChange={(idv) => setInputs({ ...inputs, idv })}
          />
          <RangeField
            label="Vehicle age"
            value={inputs.vehicleAge}
            min={0}
            max={15}
            format={(v) => (v === 0 ? "Brand new" : `${v} yr${v > 1 ? "s" : ""}`)}
            onChange={(vehicleAge) => setInputs({ ...inputs, vehicleAge })}
          />
          <SelectField<MotorCover>
            label="Cover type"
            value={inputs.cover}
            options={[
              { value: "comprehensive", label: "Comprehensive" },
              { value: "third-party", label: "Third-party only" },
            ]}
            onChange={(cover) => setInputs({ ...inputs, cover })}
          />
          <SelectField<(typeof NCB_OPTIONS)[number]>
            label="No-Claim Bonus"
            value={String(inputs.ncbPct) as (typeof NCB_OPTIONS)[number]}
            options={NCB_OPTIONS.map((v) => ({ value: v, label: `${v}%` }))}
            onChange={(v) => setInputs({ ...inputs, ncbPct: Number(v) })}
          />
          <SelectField<MotorZone>
            label="Registration zone"
            value={inputs.zone}
            options={[
              { value: "A", label: "Zone A (metro cities)" },
              { value: "B", label: "Zone B (rest of India)" },
            ]}
            onChange={(zone) => setInputs({ ...inputs, zone })}
          />
        </div>

        <div className="mt-8">
          <AdSlot slot="india-motor-inline" className="min-h-20" />
        </div>
      </div>

      <MoneyResultPanel
        eyebrow="Motor insurance"
        headlineLabel="Estimated annual premium"
        headlineValue={result.annualPremium}
        secondaryLabel="Monthly (annual ÷ 12)"
        secondaryValue={result.monthlyPremium}
        rows={result.rows}
        formatCurrency={inr}
      />
    </div>
  );
}
