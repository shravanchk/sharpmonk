/**
 * Starting values and URL schemas for the premium estimator's four policy
 * types.
 *
 * These live outside the calculator component because more than one surface
 * needs them: the estimator itself, and the homepage hero card, which runs the
 * same life-insurance formula and links through to the full tool with its
 * inputs carried in the query string. Keeping one copy is what stops the hero
 * from handing over a link that lands on different numbers.
 *
 * Each schema mirrors the controls in the matching form, so a shared link can
 * only ever carry a value the UI itself could have produced.
 */

import type { Schema } from "@/lib/shareableUrl";
import type {
  AutoInputs,
  HealthInputs,
  HomeInputs,
  LifeInputs,
} from "@/lib/insuranceMath";

export const DEFAULT_LIFE: LifeInputs = {
  age: 35,
  smoker: false,
  healthRating: "good",
  coverageAmount: 500000,
  term: 20,
};

export const DEFAULT_HEALTH: HealthInputs = {
  age: 30,
  tier: "silver",
  smoker: false,
  regionCost: "average",
};

export const DEFAULT_AUTO: AutoInputs = {
  age: 30,
  yearsLicensed: 12,
  vehicleValue: 25000,
  coverage: "standard",
  violations: "0",
  mileage: "average",
  regionRisk: "average",
};

export const DEFAULT_HOME: HomeInputs = {
  homeValue: 350000,
  homeAgeYears: 20,
  construction: "frame",
  coverage: "standard",
  deductible: 1000,
  regionRisk: "average",
  claimsHistory: "0",
};

export const LIFE_SCHEMA: Schema<LifeInputs> = {
  age: { kind: "number", min: 18, max: 80, step: 1 },
  smoker: { kind: "bool" },
  healthRating: { kind: "enum", values: ["excellent", "good", "fair", "poor"] },
  coverageAmount: { kind: "number", min: 50000, max: 2000000, step: 25000 },
  term: { kind: "numEnum", values: [10, 20, 30] },
};

export const HEALTH_SCHEMA: Schema<HealthInputs> = {
  age: { kind: "number", min: 18, max: 64, step: 1 },
  tier: { kind: "enum", values: ["bronze", "silver", "gold", "platinum"] },
  smoker: { kind: "bool" },
  regionCost: { kind: "enum", values: ["low", "average", "high"] },
};

export const AUTO_SCHEMA: Schema<AutoInputs> = {
  age: { kind: "number", min: 16, max: 85, step: 1 },
  yearsLicensed: { kind: "number", min: 0, max: 60, step: 1 },
  vehicleValue: { kind: "number", min: 2000, max: 120000, step: 1000 },
  coverage: { kind: "enum", values: ["liability", "standard", "full"] },
  violations: { kind: "enum", values: ["0", "1", "2+"] },
  mileage: { kind: "enum", values: ["low", "average", "high"] },
  regionRisk: { kind: "enum", values: ["low", "average", "high"] },
};

export const HOME_SCHEMA: Schema<HomeInputs> = {
  homeValue: { kind: "number", min: 50000, max: 2000000, step: 10000 },
  homeAgeYears: { kind: "number", min: 0, max: 120, step: 1 },
  construction: { kind: "enum", values: ["frame", "masonry"] },
  coverage: { kind: "enum", values: ["basic", "standard", "comprehensive"] },
  deductible: { kind: "numEnum", values: [500, 1000, 2500, 5000] },
  regionRisk: { kind: "enum", values: ["low", "average", "high"] },
  claimsHistory: { kind: "enum", values: ["0", "1", "2+"] },
};
