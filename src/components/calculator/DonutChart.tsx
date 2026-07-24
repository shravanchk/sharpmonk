"use client";

/**
 * Dependency-free animated donut chart.
 *
 * Uses SVG `pathLength={100}` normalization so each segment's dasharray is
 * just its percentage — no circumference math. Segments transition their
 * dash values on every render, so the ring smoothly re-draws whenever the
 * underlying data changes (e.g. a slider moves). Colors come from the
 * shared blue-family palette so it stays on-brand rather than rainbow.
 */

type Slice = { label: string; value: number };

type Props = {
  slices: Slice[];
  centerValue: string;
  centerLabel: string;
  size?: number;
};

// Cohesive blue-family ramp + one neutral, reused across all charts.
const PALETTE = [
  "#2f6fed",
  "#3b82f6",
  "#60a5fa",
  "#1e3a8a",
  "#93c5fd",
  "#64748b",
];

export default function DonutChart({
  slices,
  centerValue,
  centerLabel,
  size = 168,
}: Props) {
  const positive = slices.filter((s) => s.value > 0);
  const total = positive.reduce((sum, s) => sum + s.value, 0) || 1;

  const pcts = positive.map((slice) => (slice.value / total) * 100);
  const segments = positive.map((slice, i) => ({
    ...slice,
    pct: pcts[i],
    color: PALETTE[i % PALETTE.length],
    // Start each segment where the previous ones ended (prefix sum). The
    // group is rotated -90deg so the first slice begins at 12 o'clock.
    offset: -pcts.slice(0, i).reduce((sum, p) => sum + p, 0),
  }));

  const stroke = 14;
  const radius = 50 - stroke / 2;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`${centerLabel}: ${centerValue}`}>
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--surface-2)"
            strokeWidth={stroke}
          />
          <g transform="rotate(-90 50 50)">
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeLinecap="butt"
                pathLength={100}
                strokeDasharray={`${Math.max(0, seg.pct - 0.8)} ${100 - Math.max(0, seg.pct - 0.8)}`}
                strokeDashoffset={seg.offset}
                style={{
                  transition:
                    "stroke-dasharray 0.7s cubic-bezier(0.16,1,0.3,1), stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            ))}
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="count-tick text-lg font-semibold tracking-tight">{centerValue}</span>
          <span className="text-muted mt-0.5 max-w-[7rem] text-[0.65rem] leading-tight">{centerLabel}</span>
        </div>
      </div>

      <ul className="flex w-full flex-col gap-2">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2.5 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: seg.color }}
              aria-hidden
            />
            <span className="flex-1 text-[var(--foreground)]/85">{seg.label}</span>
            <span className="text-muted font-mono text-xs tabular-nums">
              {Math.round(seg.pct)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
