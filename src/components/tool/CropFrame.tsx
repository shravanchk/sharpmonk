"use client";

import { useEffect, useRef, useState } from "react";
import { cropRect, paint, settleFraming, type Fit, type Framing, type Source } from "@/lib/imageEngine";

type Props = {
  source: Source;
  /** Output width ÷ height. */
  aspect: number;
  fit: Fit;
  framing: Framing;
  onFraming: (f: Framing) => void;
  guide?: "passport" | "face80";
};

const MAX_H = 380;

/**
 * The crop, shown at the output's proportions: drag to move, keyboard arrows
 * to nudge. What you see here is painted with the same function that renders
 * the file, so the framing can't drift between preview and download.
 */
export default function CropFrame({ source, aspect, fit, framing, onFraming, guide }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number; f: Framing } | null>(null);
  const [cssW, setCssW] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setCssW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const c = canvas.current;
    if (!c || cssW === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(cssW * dpr);
    const h = Math.round((cssW / aspect) * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    const id = requestAnimationFrame(() => {
      const ctx = c.getContext("2d");
      if (ctx) paint(ctx, source, w, h, fit, framing);
    });
    return () => cancelAnimationFrame(id);
  }, [source, aspect, fit, framing, cssW]);

  const move = (base: Framing, dxCss: number, dyCss: number) => {
    const r = cropRect(source.width, source.height, aspect, fit, base);
    const perCss = r.w / Math.max(cssW, 1); // source px per CSS px
    onFraming(
      settleFraming(source.width, source.height, aspect, fit, {
        zoom: base.zoom,
        cx: base.cx - (dxCss * perCss) / source.width,
        cy: base.cy - (dyCss * perCss) / source.height,
      }),
    );
  };

  return (
    <div
      ref={box}
      className="relative mx-auto cursor-grab touch-none overflow-hidden rounded-xl border border-[var(--line-strong)] bg-white select-none active:cursor-grabbing"
      style={{ aspectRatio: `${aspect}`, width: `min(100%, ${Math.round(MAX_H * aspect)}px)` }}
      tabIndex={0}
      role="group"
      aria-label="Crop. Drag, or use the arrow keys, to move the image within the frame."
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        drag.current = { x: e.clientX, y: e.clientY, f: framing };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        move(d.f, e.clientX - d.x, e.clientY - d.y);
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 24 : 6;
        const k: Record<string, [number, number]> = {
          ArrowLeft: [step, 0],
          ArrowRight: [-step, 0],
          ArrowUp: [0, step],
          ArrowDown: [0, -step],
        };
        const v = k[e.key];
        if (!v) return;
        e.preventDefault();
        move(framing, v[0], v[1]);
      }}
    >
      <canvas ref={canvas} className="block size-full" />
      {guide && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
          {guide === "passport" ? (
            <ellipse cx="50" cy="44" rx="29" ry="33" fill="none" stroke="#2f6fed" strokeWidth="0.8" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
          ) : (
            <ellipse cx="50" cy="47" rx="40" ry="42" fill="none" stroke="#2f6fed" strokeWidth="0.8" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
          )}
        </svg>
      )}
    </div>
  );
}
