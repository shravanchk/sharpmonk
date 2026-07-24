"use client";

import { useEffect, useRef, useState } from "react";

/** Animates a numeric display toward `target`, respecting reduced-motion
 *  preferences. Shared by every calculator's result panel. */
export function useCountUp(target: number, durationMs = 600) {
  const [display, setDisplay] = useState(target);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveDuration = reduceMotion ? 1 : durationMs;

    const start = performance.now();
    const from = display;
    const delta = target - from;
    if (frame.current) cancelAnimationFrame(frame.current);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / effectiveDuration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + delta * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return display;
}
