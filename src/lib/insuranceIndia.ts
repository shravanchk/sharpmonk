/**
 * Illustrative insurance estimators for the Indian market.
 *
 * Same philosophy as insuranceMath.ts (US): generic, publicly-understood
 * rating logic — age curves, sum-assured scaling, NCB, GST — that is
 * broadly representative of how Indian insurers price policies. These are
 * NOT drawn from any insurer's rate filing and must never be shown as an
 * actual quote. Amounts are in INR. See /disclaimer.
 */

import type { BreakdownItem, EstimateResult } from "./insuranceMath";
import type { MoneyRow } from "./insuranceExtras";

const round0 = (v: number) => Math.round(v);
const round2 = (v: number) => Math.round(v * 100) / 100;

/** ₹1,23,456 — Indian grouping. */
export const inr = (v: number) =>
  v.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/** Compact lakh/crore label for large sliders, e.g. "₹1 Cr", "₹7.5 L". */
export function inrShort(v: number): string {
  if (v >= 10000000) {
    const c = v / 10000000;
    return `₹${Number.isInteger(c) ? c : c.toFixed(2).replace(/\.?0+$/, "")} Cr`;
  }
  if (v >= 100000) {
    const l = v / 100000;
    return `₹${Number.isInteger(l) ? l : l.toFixed(1).replace(/\.0$/, "")} L`;
  }
  return `₹${v.toLocaleString("en-IN")}`;
}

function buildResult(annualBase: number, breakdown: BreakdownItem[]): EstimateResult {
  const total = breakdown.reduce((acc, b) => acc * b.multiplier, 1);
  const annualPremium = round0(annualBase * total);
  return { annualPremium, monthlyPremium: round0(annualPremium / 12), breakdown };
}

function band(age: number, bands: { max: number; mult: number }[]): number {
  for (const b of bands) if (age <= b.max) return b.mult;
  return bands[bands.length - 1].mult;
}

/* ----------------------------------------------------------------------
   1. Term life (India) — level term, priced off sum assured.
   ---------------------------------------------------------------------- */

export type IndiaTermInputs = {
  age: number;
  smoker: boolean;
  sumAssured: number; // ₹
  term: number; // years
};

const TERM_AGE_BANDS = [
  { max: 25, mult: 0.75 },
  { max: 30, mult: 0.9 },
  { max: 35, mult: 1.0 },
  { max: 40, mult: 1.35 },
  { max: 45, mult: 1.9 },
  { max: 50, mult: 2.7 },
  { max: 55, mult: 3.8 },
  { max: 60, mult: 5.2 },
  { max: 120, mult: 7.0 },
];

const TERM_LENGTH_MULT: Record<number, number> = { 10: 0.85, 15: 0.93, 20: 1.0, 30: 1.25, 40: 1.5 };

export function estimateIndiaTermLife(inputs: IndiaTermInputs): EstimateResult {
  // Baseline: ~₹11,000/yr for ₹1 Cr at age 31–35, 20-yr term, non-smoker.
  const baseAnnual = inputs.sumAssured * 0.0011;
  const ageMult = band(inputs.age, TERM_AGE_BANDS);
  const termMult = TERM_LENGTH_MULT[inputs.term] ?? 1.0;
  const smokerMult = inputs.smoker ? 1.5 : 1.0;

  const breakdown: BreakdownItem[] = [
    { label: "Base rate", multiplier: 1, note: `${inrShort(inputs.sumAssured)} sum assured` },
    { label: "Age", multiplier: ageMult, note: `${inputs.age} years old` },
    { label: "Policy term", multiplier: termMult, note: `${inputs.term}-year term` },
    { label: "Tobacco use", multiplier: smokerMult, note: inputs.smoker ? "Smoker rates" : "Non-smoker" },
  ];
  return buildResult(baseAnnual, breakdown);
}

/* ----------------------------------------------------------------------
   2. Health / mediclaim (India) — sum-insured based.
   ---------------------------------------------------------------------- */

export type CityTier = "metro" | "tier2" | "tier3";
export type PlanType = "individual" | "couple" | "family";
export type PreExisting = "none" | "controlled" | "multiple";

export type IndiaHealthInputs = {
  age: number;
  sumInsured: number; // ₹
  cityTier: CityTier;
  plan: PlanType;
  smoker: boolean;
  preExisting: PreExisting;
};

const HEALTH_AGE_BANDS = [
  { max: 25, mult: 0.8 },
  { max: 30, mult: 0.9 },
  { max: 35, mult: 1.0 },
  { max: 40, mult: 1.2 },
  { max: 45, mult: 1.5 },
  { max: 50, mult: 2.0 },
  { max: 55, mult: 2.7 },
  { max: 60, mult: 3.5 },
  { max: 120, mult: 4.5 },
];

const CITY_MULT: Record<CityTier, number> = { metro: 1.0, tier2: 0.88, tier3: 0.78 };
const PLAN_MULT: Record<PlanType, number> = { individual: 1.0, couple: 1.6, family: 1.9 };
const PLAN_NOTE: Record<PlanType, string> = {
  individual: "Individual cover",
  couple: "2 adults",
  family: "Family floater (2 adults + 2 kids)",
};
const PED_MULT: Record<PreExisting, number> = { none: 1.0, controlled: 1.25, multiple: 1.6 };
const PED_NOTE: Record<PreExisting, string> = {
  none: "No pre-existing conditions",
  controlled: "Controlled (e.g. BP / thyroid)",
  multiple: "Multiple / complex conditions",
};

export function estimateIndiaHealth(inputs: IndiaHealthInputs): EstimateResult {
  // Baseline: ~₹8,000/yr for ₹5 L, age 31–35, metro, individual, non-smoker.
  const baseAnnual = 8000;
  const sumMult = Math.pow(inputs.sumInsured / 500000, 0.45); // diminishing scale
  const ageMult = band(inputs.age, HEALTH_AGE_BANDS);

  const breakdown: BreakdownItem[] = [
    { label: "Base rate", multiplier: 1, note: "Metro, individual baseline" },
    { label: "Sum insured", multiplier: round2(sumMult), note: inrShort(inputs.sumInsured) },
    { label: "Age", multiplier: ageMult, note: `${inputs.age} years old` },
    { label: "City tier", multiplier: CITY_MULT[inputs.cityTier], note: inputs.cityTier === "metro" ? "Metro" : inputs.cityTier === "tier2" ? "Tier-2 city" : "Tier-3 / town" },
    { label: "Who's covered", multiplier: PLAN_MULT[inputs.plan], note: PLAN_NOTE[inputs.plan] },
    { label: "Tobacco use", multiplier: inputs.smoker ? 1.2 : 1.0, note: inputs.smoker ? "Smoker loading" : "Non-smoker" },
    { label: "Pre-existing", multiplier: PED_MULT[inputs.preExisting], note: PED_NOTE[inputs.preExisting] },
  ];
  return buildResult(baseAnnual, breakdown);
}

/* ----------------------------------------------------------------------
   3. Motor (India) — car & bike, OD + statutory TP + GST, with NCB.
   ---------------------------------------------------------------------- */

export type VehicleType = "car" | "bike";
export type MotorCover = "comprehensive" | "third-party";
export type MotorZone = "A" | "B";

export type IndiaMotorInputs = {
  vehicleType: VehicleType;
  idv: number; // ₹, insured declared value
  vehicleAge: number; // years
  cover: MotorCover;
  ncbPct: number; // 0,20,25,35,45,50
  zone: MotorZone;
};

export type IndiaMotorResult = {
  annualPremium: number;
  monthlyPremium: number;
  rows: MoneyRow[];
  comprehensive: boolean;
};

// Statutory third-party base (illustrative, generic slab, not the current
// IRDAI notified figure — see /disclaimer).
const TP_BASE: Record<VehicleType, number> = { car: 2094, bike: 1366 };
const OD_BASE_RATE: Record<VehicleType, number> = { car: 0.02, bike: 0.012 };

export function estimateIndiaMotor(inputs: IndiaMotorInputs): IndiaMotorResult {
  const isComp = inputs.cover === "comprehensive";
  const zoneLoad = inputs.zone === "A" ? 1.05 : 1.0;
  const ageLoad = 1 + Math.max(0, inputs.vehicleAge) * 0.03;

  const odBase = isComp ? inputs.idv * OD_BASE_RATE[inputs.vehicleType] * zoneLoad * ageLoad : 0;
  const ncbDiscount = isComp ? odBase * (inputs.ncbPct / 100) : 0;
  const tp = TP_BASE[inputs.vehicleType];
  const subtotal = odBase - ncbDiscount + tp;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const rows: MoneyRow[] = [];
  if (isComp) {
    rows.push({ label: "Own-damage premium", amount: round0(odBase), note: `≈${Math.round(OD_BASE_RATE[inputs.vehicleType] * 100)}% of IDV, ${inputs.vehicleAge}-yr-old vehicle` });
    if (inputs.ncbPct > 0) {
      rows.push({ label: "No-Claim Bonus", amount: -round0(ncbDiscount), note: `${inputs.ncbPct}% NCB on own-damage` });
    }
  }
  rows.push({ label: "Third-party premium", amount: tp, note: "Statutory liability cover" });
  rows.push({ label: "GST (18%)", amount: round0(gst), note: "On total premium" });

  return {
    annualPremium: round0(total),
    monthlyPremium: round0(total / 12),
    rows,
    comprehensive: isComp,
  };
}
