"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  /**
   * "compact" is the pill that rides in the desktop header bar; "block"
   * stretches to fill its container for the mobile nav drawer, where the two
   * halves need to be thumb-sized rather than chrome-sized.
   */
  variant?: "compact" | "block";
  className?: string;
};

/**
 * Compact US/India region toggle. Reflects the current section (any /in
 * route is "India") and links to each region's hub — a lightweight cue that
 * the site serves both markets, in $ and ₹.
 */
export default function RegionSwitch({ variant = "compact", className = "" }: Props) {
  const pathname = usePathname();
  const india = pathname.startsWith("/in");
  const block = variant === "block";

  const cls = (active: boolean) =>
    `rounded-full transition-colors ${
      block ? "flex-1 py-2 text-center text-sm" : "px-2.5 py-1"
    } ${
      active
        ? "bg-[var(--surface-2)] text-[var(--foreground)]"
        : "text-muted hover:text-[var(--foreground)]"
    }`;

  return (
    <div
      className={`items-center rounded-full border border-[var(--line-strong)] p-0.5 font-mono text-xs ${
        block ? "flex w-full" : "inline-flex"
      } ${className}`}
    >
      <Link href="/calculators" aria-current={!india ? "page" : undefined} className={cls(!india)}>
        $ US
      </Link>
      <Link href="/in" aria-current={india ? "page" : undefined} className={cls(india)}>
        ₹ IN
      </Link>
    </div>
  );
}
