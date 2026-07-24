"use client";

/**
 * Dependency-free animated line chart for the term-vs-whole-life story.
 *
 * Plots three cumulative series over the comparison term:
 *   • Term premiums paid          (linear)
 *   • Whole-life premiums paid     (linear, much steeper)
 *   • "Invest the difference" value (compound growth of the monthly gap)
 *
 * Lines draw themselves in via a stroke-dashoffset keyframe. The chart is
 * re-keyed on its data signature so the draw-in replays whenever a slider
 * changes. Pure SVG + a viewBox, so it scales fluidly and needs no lib.
 */

type Props = {
  termAnnual: number;
  wholeAnnual: number;
  termYears: number;
  investmentReturnPct: number;
};

const W = 620;
const H = 300;
const PAD = { top: 20, right: 16, bottom: 34, left: 56 };

const SERIES = [
  { key: "whole", label: "Whole-life paid", color: "#1e3a8a" },
  { key: "term", label: "Term paid", color: "#60a5fa" },
  { key: "invested", label: "Difference invested", color: "#2f6fed" },
] as const;

const shortCurrency = (v: number) => {
  if (v >= 1000) return `$${Math.round(v / 100) / 10}k`;
  return `$${Math.round(v)}`;
};

export default function GrowthChart({
  termAnnual,
  wholeAnnual,
  termYears,
  investmentReturnPct,
}: Props) {
  const monthlyRate = investmentReturnPct / 100 / 12;
  const monthlyDiff = (wholeAnnual - termAnnual) / 12;

  const years = Array.from({ length: termYears + 1 }, (_, y) => y);

  const data = years.map((y) => {
    const months = y * 12;
    const invested =
      monthlyRate > 0
        ? monthlyDiff * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
        : monthlyDiff * months;
    return {
      year: y,
      term: termAnnual * y,
      whole: wholeAnnual * y,
      invested: Math.max(0, invested),
    };
  });

  const maxY = Math.max(
    1,
    ...data.map((d) => Math.max(d.term, d.whole, d.invested)),
  );

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const x = (year: number) => PAD.left + (year / termYears) * plotW;
  const y = (val: number) => PAD.top + plotH - (val / maxY) * plotH;

  const line = (key: "term" | "whole" | "invested") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(d.year).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * maxY);
  const xTicks = years.filter((yr) => yr % Math.max(1, Math.round(termYears / 5)) === 0 || yr === termYears);

  const sig = `${termAnnual}-${wholeAnnual}-${termYears}-${investmentReturnPct}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Cumulative cost comparison over the term">
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--line)"
              strokeWidth={1}
            />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fill="var(--muted)" fontSize={11} fontFamily="var(--font-geist-mono), monospace">
              {shortCurrency(t)}
            </text>
          </g>
        ))}

        {xTicks.map((yr) => (
          <text key={yr} x={x(yr)} y={H - 12} textAnchor="middle" fill="var(--muted)" fontSize={11} fontFamily="var(--font-geist-mono), monospace">
            {yr}y
          </text>
        ))}

        <g key={sig}>
          {SERIES.map((s, i) => (
            <path
              key={s.key}
              d={line(s.key)}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
              className="chart-draw"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
          {SERIES.map((s) => {
            const last = data[data.length - 1];
            return (
              <circle
                key={s.key}
                cx={x(last.year)}
                cy={y(last[s.key])}
                r={3.5}
                fill={s.color}
                className="chart-dot"
              />
            );
          })}
        </g>
      </svg>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-sm">
            <span className="h-1.5 w-4 rounded-full" style={{ background: s.color }} aria-hidden />
            <span className="text-[var(--foreground)]/85">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
