import EngineGears from "@/components/EngineGears";

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6">
      {/* Animated backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
        <div className="mesh-blob mesh-blob-4" />
        <div className="mesh-grain" />
        {/* Vignette keeps the type legible over the brightest blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--background)_35%,transparent)_0%,transparent_45%,var(--background)_100%)]" />
        {/* After the vignette so the ghosted gears aren't dimmed by it */}
        <EngineGears />
      </div>

      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        <span
          className="reveal text-muted inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 font-mono text-xs tracking-[0.18em] uppercase backdrop-blur-sm"
          style={{ "--delay": "0.1s" } as React.CSSProperties}
        >
          <span className="pulse-dot size-1.5 rounded-full bg-emerald-400" />
          In development
        </span>

        {/* .reveal and .shimmer both drive `animation`, so they must live on
            separate elements or the later rule wins and the other never runs. */}
        <h1
          className="reveal mt-8 text-6xl font-semibold tracking-tight sm:text-8xl"
          style={{ "--delay": "0.25s" } as React.CSSProperties}
        >
          <span className="shimmer">Sharpmonk</span>
        </h1>

        <p
          className="reveal text-muted mt-6 max-w-md text-lg leading-relaxed text-balance"
          style={{ "--delay": "0.4s" } as React.CSSProperties}
        >
          Something sharp is taking shape. Quietly, for now.
        </p>

        <div
          className="reveal mt-12 h-px w-24 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          style={{ "--delay": "0.55s" } as React.CSSProperties}
        />

        <p
          className="reveal text-muted/60 mt-8 font-mono text-xs tracking-[0.2em] uppercase"
          style={{ "--delay": "0.7s" } as React.CSSProperties}
        >
          sharpmonk.com
        </p>
      </div>
    </main>
  );
}
