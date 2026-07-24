"use client";

import { useMemo, useState } from "react";
import { RangeField, SelectField } from "./Fields";
import MoneyResultPanel from "./MoneyResultPanel";
import AdSlot from "@/components/AdSlot";
import {
  estimatePetInsurance,
  type BreedSize,
  type PetCoverageLevel,
  type PetDeductible,
  type PetInputs,
  type PetSpecies,
  type ReimbursementPct,
} from "@/lib/insuranceExtras";

const DEFAULTS: PetInputs = {
  species: "dog",
  ageYears: 3,
  breedSize: "medium",
  coverageLevel: "accident-illness",
  deductible: 250,
  reimbursement: 80,
};

export default function PetCalculator() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const result = useMemo(() => estimatePetInsurance(inputs), [inputs]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField<PetSpecies>
            label="Species"
            value={inputs.species}
            options={[
              { value: "dog", label: "Dog" },
              { value: "cat", label: "Cat" },
            ]}
            onChange={(species) => setInputs({ ...inputs, species })}
          />
          <RangeField
            label="Age"
            value={inputs.ageYears}
            min={0}
            max={15}
            format={(v) => `${v} yrs`}
            onChange={(ageYears) => setInputs({ ...inputs, ageYears })}
          />
          <SelectField<BreedSize>
            label="Breed size (dogs)"
            value={inputs.breedSize}
            options={[
              { value: "small", label: "Small breed" },
              { value: "medium", label: "Medium breed" },
              { value: "large", label: "Large breed" },
            ]}
            onChange={(breedSize) => setInputs({ ...inputs, breedSize })}
          />
          <SelectField<PetCoverageLevel>
            label="Coverage level"
            value={inputs.coverageLevel}
            options={[
              { value: "accident-only", label: "Accident-only" },
              { value: "accident-illness", label: "Accident & illness" },
              { value: "comprehensive-wellness", label: "Comprehensive + wellness" },
            ]}
            onChange={(coverageLevel) => setInputs({ ...inputs, coverageLevel })}
          />
          <SelectField<string>
            label="Annual deductible"
            value={String(inputs.deductible)}
            options={[
              { value: "100", label: "$100" },
              { value: "250", label: "$250" },
              { value: "500", label: "$500" },
            ]}
            onChange={(v) => setInputs({ ...inputs, deductible: Number(v) as PetDeductible })}
          />
          <SelectField<string>
            label="Reimbursement rate"
            value={String(inputs.reimbursement)}
            options={[
              { value: "70", label: "70%" },
              { value: "80", label: "80%" },
              { value: "90", label: "90%" },
            ]}
            onChange={(v) => setInputs({ ...inputs, reimbursement: Number(v) as ReimbursementPct })}
          />
        </div>

        <div className="mt-8">
          <AdSlot slot="pet-inline" className="min-h-20" />
        </div>
      </div>

      <MoneyResultPanel
        eyebrow="Pet insurance"
        headlineLabel="Estimated monthly premium"
        headlineValue={result.monthlyPremium}
        secondaryLabel="Annual premium"
        secondaryValue={result.annualPremium}
        rows={result.rows}
      />
    </div>
  );
}
