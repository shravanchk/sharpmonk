/**
 * Illustrative insurance premium estimators.
 *
 * These formulas use publicly-known, generic rating factors (age curves,
 * tobacco surcharges, deductible credits, regional risk multipliers, etc.)
 * that are broadly representative of how US insurers price policies. They
 * are NOT pulled from any real insurer's rate filing and should never be
 * presented as an actual quote — see /disclaimer.
 *
 * Every function returns a monthly + annual premium plus a breakdown of
 * the multipliers that produced it, so the UI can show *why* a number
 * looks the way it does instead of a black-box figure.
 */

export type BreakdownItem = {
  label: string;
  /** Multiplier applied relative to the base rate (1 = no change). */
  multiplier: number;
  note: string;
};

export type EstimateResult = {
  monthlyPremium: number;
  annualPremium: number;
  breakdown: BreakdownItem[];
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const round2 = (value: number) => Math.round(value * 100) / 100;

function buildResult(annualBase: number, breakdown: BreakdownItem[]): EstimateResult {
  const totalMultiplier = breakdown.reduce((acc, b) => acc * b.multiplier, 1);
  const annualPremium = annualBase * totalMultiplier;
  return {
    annualPremium: round2(annualPremium),
    monthlyPremium: round2(annualPremium / 12),
    breakdown,
  };
}

/* ----------------------------------------------------------------------
   Life insurance — 20yr-style term life, priced per $1,000 of coverage.
   ---------------------------------------------------------------------- */

export type HealthRating = "excellent" | "good" | "fair" | "poor";
export type TermYears = 10 | 20 | 30;

export type LifeInputs = {
  age: number;
  smoker: boolean;
  healthRating: HealthRating;
  coverageAmount: number;
  term: TermYears;
};

const LIFE_AGE_BANDS: { max: number; ratePer1000: number }[] = [
  { max: 24, ratePer1000: 0.55 },
  { max: 29, ratePer1000: 0.5 },
  { max: 34, ratePer1000: 0.55 },
  { max: 39, ratePer1000: 0.65 },
  { max: 44, ratePer1000: 0.85 },
  { max: 49, ratePer1000: 1.25 },
  { max: 54, ratePer1000: 1.95 },
  { max: 59, ratePer1000: 3.05 },
  { max: 64, ratePer1000: 4.85 },
  { max: 69, ratePer1000: 7.75 },
  { max: 200, ratePer1000: 12.5 },
];

const HEALTH_MULTIPLIER: Record<HealthRating, number> = {
  excellent: 0.85,
  good: 1.0,
  fair: 1.35,
  poor: 1.9,
};

const TERM_MULTIPLIER: Record<TermYears, number> = { 10: 0.85, 20: 1.0, 30: 1.35 };

export function estimateLife(inputs: LifeInputs): EstimateResult {
  const band = LIFE_AGE_BANDS.find((b) => inputs.age <= b.max) ?? LIFE_AGE_BANDS.at(-1)!;
  const annualBase = (inputs.coverageAmount / 1000) * band.ratePer1000;

  const breakdown: BreakdownItem[] = [
    {
      label: `Age ${inputs.age} mortality rate`,
      multiplier: 1,
      note: `$${band.ratePer1000.toFixed(2)} / $1,000 of coverage per year`,
    },
    {
      label: "Tobacco use",
      multiplier: inputs.smoker ? 2.5 : 1,
      note: inputs.smoker ? "Smoker surcharge (+150%)" : "Non-smoker",
    },
    {
      label: "Health rating",
      multiplier: HEALTH_MULTIPLIER[inputs.healthRating],
      note: `Self-reported: ${inputs.healthRating}`,
    },
    {
      label: `${inputs.term}-year term`,
      multiplier: TERM_MULTIPLIER[inputs.term],
      note: inputs.term === 20 ? "Baseline term length" : "Longer/shorter term adjustment",
    },
  ];

  return buildResult(annualBase, breakdown);
}

/* ----------------------------------------------------------------------
   Health insurance — individual marketplace-style monthly premium.
   ---------------------------------------------------------------------- */

export type PlanTier = "bronze" | "silver" | "gold" | "platinum";
export type RegionCost = "low" | "average" | "high";

export type HealthInputs = {
  age: number;
  tier: PlanTier;
  smoker: boolean;
  regionCost: RegionCost;
};

const TIER_BASE_MONTHLY: Record<PlanTier, number> = {
  bronze: 280,
  silver: 380,
  gold: 460,
  platinum: 540,
};

const REGION_MULTIPLIER: Record<RegionCost, number> = { low: 0.85, average: 1.0, high: 1.25 };

export function estimateHealth(inputs: HealthInputs): EstimateResult {
  const annualBase = TIER_BASE_MONTHLY[inputs.tier] * 12;
  const ageFactor = clamp(1 + (inputs.age - 21) * 0.047, 1, 3.0);

  const breakdown: BreakdownItem[] = [
    {
      label: `${inputs.tier[0].toUpperCase()}${inputs.tier.slice(1)} plan base`,
      multiplier: 1,
      note: `$${TIER_BASE_MONTHLY[inputs.tier]}/mo baseline at age 21`,
    },
    {
      label: "Age adjustment",
      multiplier: ageFactor,
      note: `Age ${inputs.age} (ACA-style 3:1 age curve)`,
    },
    {
      label: "Tobacco surcharge",
      multiplier: inputs.smoker ? 1.5 : 1,
      note: inputs.smoker ? "Up to +50% permitted in most states" : "Non-smoker",
    },
    {
      label: "Regional cost index",
      multiplier: REGION_MULTIPLIER[inputs.regionCost],
      note: `${inputs.regionCost} cost-of-care area`,
    },
  ];

  return buildResult(annualBase, breakdown);
}

/* ----------------------------------------------------------------------
   Auto insurance — annual premium, liability / standard / full coverage.
   ---------------------------------------------------------------------- */

export type AutoCoverage = "liability" | "standard" | "full";
export type ViolationCount = "0" | "1" | "2+";
export type MileageTier = "low" | "average" | "high";

export type AutoInputs = {
  age: number;
  yearsLicensed: number;
  vehicleValue: number;
  coverage: AutoCoverage;
  violations: ViolationCount;
  mileage: MileageTier;
  regionRisk: RegionCost;
};

const AUTO_COVERAGE_BASE: Record<AutoCoverage, number> = {
  liability: 600,
  standard: 1100,
  full: 1650,
};

const VIOLATION_MULTIPLIER: Record<ViolationCount, number> = { "0": 1.0, "1": 1.25, "2+": 1.6 };
const MILEAGE_MULTIPLIER: Record<MileageTier, number> = { low: 0.9, average: 1.0, high: 1.15 };
const AUTO_REGION_MULTIPLIER: Record<RegionCost, number> = { low: 0.85, average: 1.0, high: 1.35 };

export function estimateAuto(inputs: AutoInputs): EstimateResult {
  const annualBase = AUTO_COVERAGE_BASE[inputs.coverage];

  const ageFactor = inputs.age < 25 ? 1.6 : inputs.age < 30 ? 1.25 : inputs.age < 65 ? 1.0 : 1.15;
  const experienceFactor = inputs.yearsLicensed < 3 ? 1.3 : 1.0;
  const vehicleValueFactor =
    inputs.coverage === "liability"
      ? 1.0
      : clamp(1 + (inputs.vehicleValue - 25000) / 100000, 0.7, 1.8);

  const breakdown: BreakdownItem[] = [
    {
      label: `${inputs.coverage[0].toUpperCase()}${inputs.coverage.slice(1)} coverage base`,
      multiplier: 1,
      note: `$${annualBase}/yr baseline`,
    },
    { label: "Driver age", multiplier: ageFactor, note: `Age ${inputs.age}` },
    {
      label: "Driving experience",
      multiplier: experienceFactor,
      note: `${inputs.yearsLicensed} yrs licensed`,
    },
    {
      label: "Violation history",
      multiplier: VIOLATION_MULTIPLIER[inputs.violations],
      note: `${inputs.violations} at-fault incidents (3 yrs)`,
    },
    {
      label: "Vehicle value",
      multiplier: vehicleValueFactor,
      note:
        inputs.coverage === "liability"
          ? "Not rated (liability doesn't cover your vehicle)"
          : `$${inputs.vehicleValue.toLocaleString()} vehicle`,
    },
    { label: "Annual mileage", multiplier: MILEAGE_MULTIPLIER[inputs.mileage], note: `${inputs.mileage} mileage` },
    {
      label: "Regional risk",
      multiplier: AUTO_REGION_MULTIPLIER[inputs.regionRisk],
      note: `${inputs.regionRisk} claims-density region`,
    },
  ];

  return buildResult(annualBase, breakdown);
}

/* ----------------------------------------------------------------------
   Home insurance — annual premium, value-based with risk adjustments.
   ---------------------------------------------------------------------- */

export type ConstructionType = "frame" | "masonry";
export type HomeCoverage = "basic" | "standard" | "comprehensive";
export type Deductible = 500 | 1000 | 2500 | 5000;
export type ClaimsHistory = "0" | "1" | "2+";

export type HomeInputs = {
  homeValue: number;
  homeAgeYears: number;
  construction: ConstructionType;
  coverage: HomeCoverage;
  deductible: Deductible;
  regionRisk: RegionCost;
  claimsHistory: ClaimsHistory;
};

const HOME_COVERAGE_MULTIPLIER: Record<HomeCoverage, number> = {
  basic: 0.8,
  standard: 1.0,
  comprehensive: 1.25,
};

const DEDUCTIBLE_MULTIPLIER: Record<Deductible, number> = {
  500: 1.15,
  1000: 1.0,
  2500: 0.85,
  5000: 0.7,
};

const CLAIMS_MULTIPLIER: Record<ClaimsHistory, number> = { "0": 1.0, "1": 1.2, "2+": 1.45 };
const HOME_REGION_MULTIPLIER: Record<RegionCost, number> = { low: 0.85, average: 1.0, high: 1.5 };

export function estimateHome(inputs: HomeInputs): EstimateResult {
  const annualBase = inputs.homeValue * 0.0042;

  const ageFactor =
    inputs.homeAgeYears < 10 ? 0.9 : inputs.homeAgeYears < 30 ? 1.0 : inputs.homeAgeYears < 50 ? 1.15 : 1.35;
  const constructionFactor = inputs.construction === "masonry" ? 0.9 : 1.0;

  const breakdown: BreakdownItem[] = [
    {
      label: "Home value base",
      multiplier: 1,
      note: `$${inputs.homeValue.toLocaleString()} × 0.42%/yr`,
    },
    { label: "Home age", multiplier: ageFactor, note: `${inputs.homeAgeYears} years old` },
    {
      label: "Construction type",
      multiplier: constructionFactor,
      note: inputs.construction === "masonry" ? "Masonry (more fire-resistant)" : "Wood frame",
    },
    {
      label: `${inputs.coverage[0].toUpperCase()}${inputs.coverage.slice(1)} coverage`,
      multiplier: HOME_COVERAGE_MULTIPLIER[inputs.coverage],
      note: "Peril & replacement-cost scope",
    },
    {
      label: `$${inputs.deductible.toLocaleString()} deductible`,
      multiplier: DEDUCTIBLE_MULTIPLIER[inputs.deductible],
      note: "Higher deductible lowers premium",
    },
    {
      label: "Regional risk",
      multiplier: HOME_REGION_MULTIPLIER[inputs.regionRisk],
      note: `${inputs.regionRisk} weather/catastrophe exposure`,
    },
    {
      label: "Claims history",
      multiplier: CLAIMS_MULTIPLIER[inputs.claimsHistory],
      note: `${inputs.claimsHistory} claims (5 yrs)`,
    },
  ];

  return buildResult(annualBase, breakdown);
}
