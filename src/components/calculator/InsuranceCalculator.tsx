"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
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

export default function InsuranceCalculator() {
  const [active, setActive] = useState<PolicyType>("life");
  const [life, setLife] = useState(DEFAULT_LIFE);
  const [health, setHealth] = useState(DEFAULT_HEALTH);
  const [auto, setAuto] = useState(DEFAULT_AUTO);
  const [home, setHome] = useState(DEFAULT_HOME);

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
