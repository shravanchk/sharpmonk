"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /**
   * For content in the first screenful: renders it plainly visible, with no
   * entrance animation and no observer. Anything above the fold should use
   * this — it is already on screen, so there is nothing to scroll into view,
   * and both fading it in and gating it on JS only push out the largest
   * contentful paint. `delay` is ignored here.
   */
  immediate?: boolean;
};

/** Fades + slides children in once they scroll into view (IntersectionObserver-based,
 *  fires once). See `immediate` for above-the-fold content.
 *
 *  The hidden starting state is applied by CSS under `html.reveal-ready` rather
 *  than from here, so this always renders the same markup on the server and the
 *  client. Deriving the initial state from `typeof IntersectionObserver`
 *  instead made the server emit `is-visible` and the client not, and React
 *  refuses to patch up a mismatched attribute — which left every reveal stuck
 *  on whatever the server happened to send.
 *
 *  That same class is also what handles the no-observer fallback: it is never
 *  set without IntersectionObserver, so the content simply stays visible and
 *  this component has nothing to do. */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  immediate = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  if (immediate) return <div className={className}>{children}</div>;

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--delay": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
