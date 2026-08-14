/**
 * Illustrative insurance decision & cost calculators — the "second tier"
 * of tools beyond the core life/health/auto/home premium estimator in
 * insuranceMath.ts. Same rules apply: generic, publicly-known rating
 * logic, not a real insurer's rate table. See /disclaimer.
 */

import { estimateLife, type HealthRating, type TermYears } from "./insuranceMath";
import { num } from "./format";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round2 = (value: number) => Math.round(value * 100) / 100;

export type MoneyRow = { label: string; amount: number; note: string };

/* ----------------------------------------------------------------------
   1. Life insurance needs — DIME method
   (Debt + Income replacement + Mortgage + Education)
   ---------------------------------------------------------------------- */

export type LifeNeedsInputs = {
  annualIncome: number;
  yearsToReplace: number;
  nonMortgageDebt: number;
  mortgageBalance: number;
  children: number;
  costPerChildEducation: number;
  existingLifeInsurance: number;
  liquidSavings: number;
};

export type LifeNeedsResult = {
  grossNeed: number;
  netNeed: number;
  rows: MoneyRow[];
};

export function estimateLifeInsuranceNeeds(inputs: LifeNeedsInputs): LifeNeedsResult {
  const debt = inputs.nonMortgageDebt;
  const income = inputs.annualIncome * inputs.yearsToReplace;
  const mortgage = inputs.mortgageBalance;
  const education = inputs.children * inputs.costPerChildEducation;
  const grossNeed = debt + income + mortgage + education;
  const netNeed = Math.max(0, grossNeed - inputs.existingLifeInsurance - inputs.liquidSavings);

  const rows: MoneyRow[] = [
    { label: "Debt to pay off", amount: debt, note: "Non-mortgage debt (credit cards, loans)" },
    {
      label: "Income replacement",
      amount: income,
      note: `${inputs.yearsToReplace} yrs × $${num(inputs.annualIncome)}/yr`,
    },
    { label: "Mortgage payoff", amount: mortgage, note: "Remaining mortgage balance" },
    {
      label: "Education fund",
      amount: education,
      note: `${inputs.children} child(ren) × $${num(inputs.costPerChildEducation)}`,
    },
    {
      label: "Existing coverage & savings",
      amount: -(inputs.existingLifeInsurance + inputs.liquidSavings),
      note: "Subtracted from the gross need",
    },
  ];

  return { grossNeed: round2(grossNeed), netNeed: round2(netNeed), rows };
}

/* ----------------------------------------------------------------------
   2. Disability insurance — income-replacement gap + illustrative premium
   ---------------------------------------------------------------------- */

export type OccupationClass = "office" | "field" | "manual";

export type DisabilityInputs = {
  age: number;
  monthlyIncome: number;
  targetReplacementPct: number;
  employerCoveragePct: number;
  occupationClass: OccupationClass;
};

export type DisabilityResult = {
  targetMonthlyBenefit: number;
  coverageGapMonthly: number;
  estimatedAnnualPremium: number;
  estimatedMonthlyPremium: number;
  rows: MoneyRow[];
};

const OCCUPATION_MULTIPLIER: Record<OccupationClass, number> = { office: 0.8, field: 1.0, manual: 1.6 };

export function estimateDisabilityInsurance(inputs: DisabilityInputs): DisabilityResult {
  const targetMonthlyBenefit = inputs.monthlyIncome * (inputs.targetReplacementPct / 100);
  const employerProvided = inputs.monthlyIncome * (inputs.employerCoveragePct / 100);
  const coverageGapMonthly = Math.max(0, targetMonthlyBenefit - employerProvided);

  const ageFactor = inputs.age < 30 ? 0.75 : inputs.age < 40 ? 1.0 : inputs.age < 50 ? 1.35 : 1.85;
  const occFactor = OCCUPATION_MULTIPLIER[inputs.occupationClass];

  // Individual long-term disability riders commonly price around 1.5-2.5%
  // of the covered annual benefit; 2% is used here as an illustrative base.
  const annualGapBenefit = coverageGapMonthly * 12;
  const estimatedAnnualPremium = round2(annualGapBenefit * 0.02 * ageFactor * occFactor);

  const rows: MoneyRow[] = [
    { label: "Target monthly benefit", amount: targetMonthlyBenefit, note: `${inputs.targetReplacementPct}% of income` },
    { label: "Employer-provided LTD", amount: -employerProvided, note: `${inputs.employerCoveragePct}% covered by employer` },
    { label: "Coverage gap to insure", amount: coverageGapMonthly, note: "Monthly benefit you'd need to buy" },
  ];

  return {
    targetMonthlyBenefit: round2(targetMonthlyBenefit),
    coverageGapMonthly: round2(coverageGapMonthly),
    estimatedAnnualPremium,
    estimatedMonthlyPremium: round2(estimatedAnnualPremium / 12),
    rows,
  };
}

/* ----------------------------------------------------------------------
   3. Renters insurance
   ---------------------------------------------------------------------- */

export type LiabilityLimit = 100000 | 300000 | 500000;
export type RentersDeductible = 250 | 500 | 1000 | 2500;
export type RiskLevel = "low" | "average" | "high";
export type ClaimsCount = "0" | "1" | "2+";

export type RentersInputs = {
  personalPropertyValue: number;
  liabilityLimit: LiabilityLimit;
  deductible: RentersDeductible;
  regionRisk: RiskLevel;
  claimsHistory: ClaimsCount;
};

export type RentersResult = {
  annualPremium: number;
  monthlyPremium: number;
  rows: MoneyRow[];
};

const LIABILITY_BASE: Record<LiabilityLimit, number> = { 100000: 30, 300000: 55, 500000: 80 };
const RENTERS_DEDUCTIBLE_MULT: Record<RentersDeductible, number> = { 250: 1.25, 500: 1.1, 1000: 0.9, 2500: 0.75 };
const RISK_MULT: Record<RiskLevel, number> = { low: 0.85, average: 1.0, high: 1.3 };
const CLAIMS_MULT: Record<ClaimsCount, number> = { "0": 1.0, "1": 1.2, "2+": 1.4 };

export function estimateRentersInsurance(inputs: RentersInputs): RentersResult {
  const propertyBase = inputs.personalPropertyValue * 0.004;
  const liabilityBase = LIABILITY_BASE[inputs.liabilityLimit];
  const subtotal = propertyBase + liabilityBase;
  const multiplier =
    RENTERS_DEDUCTIBLE_MULT[inputs.deductible] * RISK_MULT[inputs.regionRisk] * CLAIMS_MULT[inputs.claimsHistory];
  const annualPremium = round2(subtotal * multiplier);

  const rows: MoneyRow[] = [
    { label: "Personal property coverage", amount: propertyBase, note: `$${num(inputs.personalPropertyValue)} of belongings` },
    { label: "Liability coverage", amount: liabilityBase, note: `$${num(inputs.liabilityLimit)} limit` },
    { label: "Deductible adjustment", amount: subtotal * (RENTERS_DEDUCTIBLE_MULT[inputs.deductible] - 1), note: `$${inputs.deductible} deductible` },
    { label: "Regional risk", amount: subtotal * RENTERS_DEDUCTIBLE_MULT[inputs.deductible] * (RISK_MULT[inputs.regionRisk] - 1), note: `${inputs.regionRisk} area` },
    { label: "Claims history", amount: annualPremium - subtotal * RENTERS_DEDUCTIBLE_MULT[inputs.deductible] * RISK_MULT[inputs.regionRisk], note: `${inputs.claimsHistory} claims` },
  ];

  return { annualPremium, monthlyPremium: round2(annualPremium / 12), rows };
}

/* ----------------------------------------------------------------------
   4. Umbrella / excess liability insurance
   ---------------------------------------------------------------------- */

export type UmbrellaLimit = 1000000 | 2000000 | 3000000 | 5000000;

export type UmbrellaInputs = {
  coverageLimit: UmbrellaLimit;
  autoPolicies: number;
  homePolicies: number;
  priorClaims: ClaimsCount;
};

export type UmbrellaResult = {
  annualPremium: number;
  monthlyPremium: number;
  rows: MoneyRow[];
};

const UMBRELLA_CLAIMS_MULT: Record<ClaimsCount, number> = { "0": 1.0, "1": 1.25, "2+": 1.6 };

export function estimateUmbrellaInsurance(inputs: UmbrellaInputs): UmbrellaResult {
  const millions = inputs.coverageLimit / 1000000;
  const base = millions * 175;
  const extraPolicySurcharge = Math.max(0, inputs.autoPolicies - 1) * 25 + Math.max(0, inputs.homePolicies - 1) * 15;
  const claimsMult = UMBRELLA_CLAIMS_MULT[inputs.priorClaims];
  const annualPremium = round2((base + extraPolicySurcharge) * claimsMult);

  const rows: MoneyRow[] = [
    { label: `$${millions}M umbrella base`, amount: base, note: "≈$175 per $1M of coverage / yr" },
    { label: "Additional underlying policies", amount: extraPolicySurcharge, note: `${inputs.autoPolicies} auto, ${inputs.homePolicies} home policies` },
    { label: "Prior claims adjustment", amount: annualPremium - (base + extraPolicySurcharge), note: `${inputs.priorClaims} claims` },
  ];

  return { annualPremium, monthlyPremium: round2(annualPremium / 12), rows };
}

/* ----------------------------------------------------------------------
   5. Pet insurance
   ---------------------------------------------------------------------- */

export type PetSpecies = "dog" | "cat";
export type BreedSize = "small" | "medium" | "large";
export type PetCoverageLevel = "accident-only" | "accident-illness" | "comprehensive-wellness";
export type PetDeductible = 100 | 250 | 500;
export type ReimbursementPct = 70 | 80 | 90;

export type PetInputs = {
  species: PetSpecies;
  ageYears: number;
  breedSize: BreedSize;
  coverageLevel: PetCoverageLevel;
  deductible: PetDeductible;
  reimbursement: ReimbursementPct;
};

export type PetResult = {
  monthlyPremium: number;
  annualPremium: number;
  rows: MoneyRow[];
};

const PET_BASE_MONTHLY: Record<PetSpecies, number> = { dog: 35, cat: 20 };
const BREED_SIZE_MULT: Record<BreedSize, number> = { small: 0.85, medium: 1.0, large: 1.3 };
const PET_COVERAGE_MULT: Record<PetCoverageLevel, number> = {
  "accident-only": 0.45,
  "accident-illness": 1.0,
  "comprehensive-wellness": 1.35,
};
const PET_DEDUCTIBLE_MULT: Record<PetDeductible, number> = { 100: 1.25, 250: 1.0, 500: 0.8 };
const REIMBURSEMENT_MULT: Record<ReimbursementPct, number> = { 70: 0.85, 80: 1.0, 90: 1.2 };

export function estimatePetInsurance(inputs: PetInputs): PetResult {
  const ageFactor =
    inputs.ageYears < 1 ? 0.8 : inputs.ageYears <= 3 ? 0.9 : inputs.ageYears <= 6 ? 1.0 : inputs.ageYears <= 9 ? 1.4 : 2.0;
  const breedFactor = inputs.species === "dog" ? BREED_SIZE_MULT[inputs.breedSize] : 1.0;
  const base = PET_BASE_MONTHLY[inputs.species];

  const monthlyPremium = round2(
    base *
      ageFactor *
      breedFactor *
      PET_COVERAGE_MULT[inputs.coverageLevel] *
      PET_DEDUCTIBLE_MULT[inputs.deductible] *
      REIMBURSEMENT_MULT[inputs.reimbursement],
  );

  const rows: MoneyRow[] = [
    { label: `${inputs.species === "dog" ? "Dog" : "Cat"} base rate`, amount: base, note: "Monthly baseline" },
    { label: "Age adjustment", amount: base * (ageFactor - 1), note: `${inputs.ageYears} yrs old` },
    { label: "Breed / size", amount: base * ageFactor * (breedFactor - 1), note: inputs.species === "dog" ? `${inputs.breedSize} breed` : "N/A for cats" },
    { label: "Coverage level", amount: base * ageFactor * breedFactor * (PET_COVERAGE_MULT[inputs.coverageLevel] - 1), note: inputs.coverageLevel },
    {
      label: "Deductible & reimbursement",
      amount:
        monthlyPremium -
        base * ageFactor * breedFactor * PET_COVERAGE_MULT[inputs.coverageLevel],
      note: `$${inputs.deductible} deductible, ${inputs.reimbursement}% reimbursement`,
    },
  ];

  return { monthlyPremium, annualPremium: round2(monthlyPremium * 12), rows };
}

/* ----------------------------------------------------------------------
   6. Term vs. whole life — cost & "invest the difference" comparison
   ---------------------------------------------------------------------- */

export type TermVsWholeInputs = {
  age: number;
  smoker: boolean;
  healthRating: HealthRating;
  coverageAmount: number;
  term: TermYears;
  investmentReturnPct: number;
};

export type TermVsWholeResult = {
  termAnnualPremium: number;
  termMonthlyPremium: number;
  wholeLifeAnnualPremium: number;
  wholeLifeMonthlyPremium: number;
  estimatedCashValueAtTermEnd: number;
  annualPremiumDifference: number;
  investedDifferenceAtTermEnd: number;
};

export function compareTermVsWholeLife(inputs: TermVsWholeInputs): TermVsWholeResult {
  const term = estimateLife({
    age: inputs.age,
    smoker: inputs.smoker,
    healthRating: inputs.healthRating,
    coverageAmount: inputs.coverageAmount,
    term: inputs.term,
  });

  // Rule-of-thumb multiplier widely cited for whole life vs. equivalent
  // term premiums at the same age/health/coverage — not a real carrier
  // quote. Whole life premiums flatten less steeply with age than term.
  const wholeLifeAnnualPremium = round2(term.annualPremium * 11);
  const wholeLifeMonthlyPremium = round2(wholeLifeAnnualPremium / 12);

  // Conservative illustrative assumption: roughly half of whole-life
  // premiums paid become accessible cash value by the end of the
  // comparison term (actual policies vary widely by carrier and design).
  const estimatedCashValueAtTermEnd = round2(wholeLifeAnnualPremium * inputs.term * 0.5);

  const annualPremiumDifference = round2(wholeLifeAnnualPremium - term.annualPremium);
  const monthlyRate = inputs.investmentReturnPct / 100 / 12;
  const months = inputs.term * 12;
  const monthlyDifference = annualPremiumDifference / 12;
  const investedDifferenceAtTermEnd = round2(
    monthlyRate > 0
      ? monthlyDifference * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
      : monthlyDifference * months,
  );

  return {
    termAnnualPremium: term.annualPremium,
    termMonthlyPremium: term.monthlyPremium,
    wholeLifeAnnualPremium,
    wholeLifeMonthlyPremium,
    estimatedCashValueAtTermEnd,
    annualPremiumDifference,
    investedDifferenceAtTermEnd: clamp(investedDifferenceAtTermEnd, 0, Number.MAX_SAFE_INTEGER),
  };
}
