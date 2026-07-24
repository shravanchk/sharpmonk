"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  decodeAll,
  encodeAll,
  useUrlSearchOnce,
  useUrlSync,
  type Schema,
} from "@/hooks/useShareableInputs";
import {
  estimateAuto,
  estimateHealth,
  estimateHome,
  estimateLife,
  type AutoInputs,
  type HealthInputs,
  type HomeInputs,
  type LifeInputs,
} from "@/lib/insuranceMath";
import LifeForm from "./LifeForm";
import HealthForm from "./HealthForm";
import AutoForm from "./AutoForm";
import HomeForm from "./HomeForm";
import ResultPanel from "./ResultPanel";
import AdSlot from "@/components/AdSlot";
import Icon, { type IconName } from "@/components/Icon";

type PolicyType = "life" | "health" | "auto" | "home";

const TABS: { id: PolicyType; label: string; icon: IconName }[] = [
  { id: "life", label: "Life", icon: "shield" },
  { id: "health", label: "Health", icon: "heart-pulse" },
  { id: "auto", label: "Auto", icon: "car" },
  { id: "home", label: "Home", icon: "home" },
];

const DEFAULT_LIFE: LifeInputs = {
  age: 35,
  smoker: false,
  healthRating: "good",
  coverageAmount: 500000,
  term: 20,
};

const DEFAULT_HEALTH: HealthInputs = {
  age: 30,
  tier: "silver",
  smoker: false,
  regionCost: "average",
};

const DEFAULT_AUTO: AutoInputs = {
  age: 30,
  yearsLicensed: 12,
  vehicleValue: 25000,
  coverage: "standard",
  violations: "0",
  mileage: "average",
  regionRisk: "average",
};

const DEFAULT_HOME: HomeInputs = {
  homeValue: 350000,
  homeAgeYears: 20,
  construction: "frame",
  coverage: "standard",
  deductible: 1000,
  regionRisk: "average",
  claimsHistory: "0",
};

// Mirror the controls in each form, so a shared link can only ever carry a
// value the UI itself could have produced.
const LIFE_SCHEMA: Schema<LifeInputs> = {
  age: { kind: "number", min: 18, max: 80, step: 1 },
  smoker: { kind: "bool" },
  healthRating: { kind: "enum", values: ["excellent", "good", "fair", "poor"] },
  coverageAmount: { kind: "number", min: 50000, max: 2000000, step: 25000 },
  term: { kind: "numEnum", values: [10, 20, 30] },
};

const HEALTH_SCHEMA: Schema<HealthInputs> = {
  age: { kind: "number", min: 18, max: 64, step: 1 },
  tier: { kind: "enum", values: ["bronze", "silver", "gold", "platinum"] },
  smoker: { kind: "bool" },
  regionCost: { kind: "enum", values: ["low", "average", "high"] },
};

const AUTO_SCHEMA: Schema<AutoInputs> = {
  age: { kind: "number", min: 16, max: 85, step: 1 },
  yearsLicensed: { kind: "number", min: 0, max: 60, step: 1 },
  vehicleValue: { kind: "number", min: 2000, max: 120000, step: 1000 },
  coverage: { kind: "enum", values: ["liability", "standard", "full"] },
  violations: { kind: "enum", values: ["0", "1", "2+"] },
  mileage: { kind: "enum", values: ["low", "average", "high"] },
  regionRisk: { kind: "enum", values: ["low", "average", "high"] },
};

const HOME_SCHEMA: Schema<HomeInputs> = {
  homeValue: { kind: "number", min: 50000, max: 2000000, step: 10000 },
  homeAgeYears: { kind: "number", min: 0, max: 120, step: 1 },
  construction: { kind: "enum", values: ["frame", "masonry"] },
  coverage: { kind: "enum", values: ["basic", "standard", "comprehensive"] },
  deductible: { kind: "numEnum", values: [500, 1000, 2500, 5000] },
  regionRisk: { kind: "enum", values: ["low", "average", "high"] },
  claimsHistory: { kind: "enum", values: ["0", "1", "2+"] },
};

/** Only the tab you are looking at goes into the URL — that is the estimate
 *  being shared, and carrying all four would make the link unreadable. */
function readFromUrl(search: string) {
  const active = (TABS.find((t) => t.id === new URLSearchParams(search).get("type"))?.id ??
    "life") as PolicyType;
  return {
    active,
    life: active === "life" ? decodeAll(search, DEFAULT_LIFE, LIFE_SCHEMA) : DEFAULT_LIFE,
    health: active === "health" ? decodeAll(search, DEFAULT_HEALTH, HEALTH_SCHEMA) : DEFAULT_HEALTH,
    auto: active === "auto" ? decodeAll(search, DEFAULT_AUTO, AUTO_SCHEMA) : DEFAULT_AUTO,
    home: active === "home" ? decodeAll(search, DEFAULT_HOME, HOME_SCHEMA) : DEFAULT_HOME,
  };
}

export default function InsuranceCalculator() {
  const search = useUrlSearchOnce();
  const fromUrl = useMemo(() => readFromUrl(search), [search]);

  const [state, setState] = useState(fromUrl);

  // Adopt the URL-derived values the moment they arrive (one transition, just
  // after hydration) — see https://react.dev/learn/you-might-not-need-an-effect.
  const [prevFromUrl, setPrevFromUrl] = useState(fromUrl);
  if (fromUrl !== prevFromUrl) {
    setPrevFromUrl(fromUrl);
    setState(fromUrl);
  }

  const { active, life, health, auto, home } = state;
  const setActive = (next: PolicyType) => setState((s) => ({ ...s, active: next }));
  const setLife = (next: LifeInputs) => setState((s) => ({ ...s, life: next }));
  const setHealth = (next: HealthInputs) => setState((s) => ({ ...s, health: next }));
  const setAuto = (next: AutoInputs) => setState((s) => ({ ...s, auto: next }));
  const setHome = (next: HomeInputs) => setState((s) => ({ ...s, home: next }));

  useUrlSync(
    useMemo(() => {
      const params = new URLSearchParams();
      if (active !== "life") params.set("type", active);
      if (active === "life") encodeAll(life, DEFAULT_LIFE, LIFE_SCHEMA, params);
      if (active === "health") encodeAll(health, DEFAULT_HEALTH, HEALTH_SCHEMA, params);
      if (active === "auto") encodeAll(auto, DEFAULT_AUTO, AUTO_SCHEMA, params);
      if (active === "home") encodeAll(home, DEFAULT_HOME, HOME_SCHEMA, params);
      return params.toString();
    }, [active, life, health, auto, home]),
  );

  const tabRefs = useRef<Partial<Record<PolicyType, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[active];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  const result = useMemo(() => {
    switch (active) {
      case "life":
        return estimateLife(life);
      case "health":
        return estimateHealth(health);
      case "auto":
        return estimateAuto(auto);
      case "home":
        return estimateHome(home);
    }
  }, [active, life, health, auto, home]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div
          role="tablist"
          aria-label="Insurance type"
          className="relative flex flex-wrap gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-1)] p-1.5"
        >
          <span
            aria-hidden
            className="tab-indicator"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {TABS.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              data-active={active === tab.id}
              onClick={() => setActive(tab.id)}
              className="tab-btn text-muted relative z-[1] flex flex-1 items-center justify-center gap-1.5 rounded-full border border-transparent px-4 py-2 text-sm font-medium"
            >
              <Icon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div key={active} className="reveal mt-8" style={{ "--delay": "0s" } as React.CSSProperties}>
          {active === "life" && <LifeForm value={life} onChange={setLife} />}
          {active === "health" && <HealthForm value={health} onChange={setHealth} />}
          {active === "auto" && <AutoForm value={auto} onChange={setAuto} />}
          {active === "home" && <HomeForm value={home} onChange={setHome} />}
        </div>

        <div className="mt-8">
          <AdSlot slot="calculator-inline" className="min-h-20" />
        </div>
      </div>

      <ResultPanel
        typeLabel={TABS.find((t) => t.id === active)!.label}
        result={result}
      />
    </div>
  );
}
