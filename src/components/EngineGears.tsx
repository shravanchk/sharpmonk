/**
 * Decorative engine-gear clusters for the landing backdrop.
 *
 * Geometry: each gear's teeth are centered on its pitch radius, and two
 * meshing gears sit exactly (pitch1 + pitch2) apart, so the teeth
 * interleave. Spin period is proportional to tooth count (period = teeth
 * * SECONDS_PER_TOOTH) with adjacent gears counter-rotating, which keeps
 * the mesh visually in sync forever.
 */

const SECONDS_PER_TOOTH = 2;

const r2 = (n: number) => Math.round(n * 100) / 100;

type GearProps = {
  teeth: number;
  /** Pitch radius — teeth are centered on this circle. */
  pitch: number;
  x: number;
  y: number;
  /** Initial rotation, used to phase teeth into the mesh. */
  phase?: number;
  /** Counter-clockwise spin (adjacent gears must alternate). */
  ccw?: boolean;
};

function Gear({ teeth, pitch, x, y, phase = 0, ccw = false }: GearProps) {
  const toothH = Math.min(16, pitch * 0.34);
  const toothW = ((2 * Math.PI * pitch) / teeth) * 0.42;
  const body = pitch - toothH / 2 + 1;
  const hub = pitch * 0.3;
  const spokes = teeth > 10 ? 5 : 4;

  return (
    <g transform={`translate(${r2(x)} ${r2(y)})`}>
      <g
        className={`gear-spin${ccw ? " gear-spin-ccw" : ""}`}
        style={{ "--dur": `${teeth * SECONDS_PER_TOOTH}s` } as React.CSSProperties}
      >
        <circle r={r2(body)} className="gear-body" />
        {Array.from({ length: teeth }, (_, i) => (
          <rect
            key={i}
            x={r2(-toothW / 2)}
            y={r2(-(pitch + toothH / 2))}
            width={r2(toothW)}
            height={r2(toothH)}
            rx={2}
            transform={`rotate(${r2(phase + (i * 360) / teeth)})`}
            className="gear-tooth"
          />
        ))}
        {Array.from({ length: spokes }, (_, i) => (
          <rect
            key={i}
            x={-2.5}
            y={r2(hub)}
            width={5}
            height={r2(body - hub - 4)}
            rx={2.5}
            transform={`rotate(${r2((i * 360) / spokes)})`}
            className="gear-spoke"
          />
        ))}
        <circle r={r2(hub)} className="gear-hub" />
        <circle r={r2(hub * 0.4)} className="gear-axle" />
      </g>
    </g>
  );
}

/** Place a gear meshed against a neighbour: center distance = sum of pitches. */
const mesh = (
  from: { x: number; y: number; pitch: number },
  pitch: number,
  angleDeg: number,
) => {
  const a = (angleDeg * Math.PI) / 180;
  const d = from.pitch + pitch;
  return { x: from.x + d * Math.cos(a), y: from.y + d * Math.sin(a), pitch };
};

export default function EngineGears() {
  // Main cluster (right side): 14t drives 9t (upper right) and 20t (lower left).
  const a = { x: 250, y: 150, pitch: 70 };
  const b = mesh(a, 45, -30);
  const c = mesh(a, 100, 130);

  // Small cluster (bottom left): 10t drives 7t.
  const d = { x: 100, y: 90, pitch: 40 };
  const e = mesh(d, 26, 25);

  return (
    <>
      <svg
        viewBox="0 0 480 400"
        className="absolute top-[62%] -right-24 w-[44vmin] max-w-[460px] min-w-64 -translate-y-1/2 sm:-right-12"
        aria-hidden
      >
        <Gear teeth={14} pitch={a.pitch} x={a.x} y={a.y} />
        <Gear teeth={9} pitch={b.pitch} x={b.x} y={b.y} phase={20} ccw />
        <Gear teeth={20} pitch={c.pitch} x={c.x} y={c.y} phase={9} ccw />
      </svg>
      <svg
        viewBox="0 0 240 180"
        className="absolute -bottom-8 -left-8 hidden w-[26vmin] max-w-60 min-w-40 sm:block"
        aria-hidden
      >
        <Gear teeth={10} pitch={d.pitch} x={d.x} y={d.y} ccw />
        <Gear teeth={7} pitch={e.pitch} x={e.x} y={e.y} phase={26} />
      </svg>
    </>
  );
}
