"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import MonkMark from "./MonkMark";
import Icon, { type IconName } from "./Icon";

type NavLink = { href: string; label: string; icon: IconName; hint: string };

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home", icon: "home", hint: "Start here" },
  { href: "/exams", label: "Exams", icon: "clipboard", hint: "UPSC, SSC, IBPS, SBI, NEET & more" },
  { href: "/resize-image-to-kb", label: "Resize to KB", icon: "ruler", hint: "Any size window, any pixels" },
  { href: "/signature-resize", label: "Signature", icon: "pen", hint: "Clean ink on white paper" },
  { href: "/how-it-works", label: "How it works", icon: "info", hint: "Privacy, KB maths, padding" },
];

// Match the section, not the prefix — a bare `startsWith` would light up a
// link for any unrelated route that merely shares its first letters.
const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 8,
  );

  // Close the mobile menu on route change — adjust state during render
  // instead of in an effect (see https://react.dev/learn/you-might-not-need-an-effect).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the drawer is up it owns the screen: freeze the page behind it and
  // let Escape dismiss it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.removeProperty("overflow");
    };
  }, [open]);

  return (
    <>
      {/* Tap-anywhere-to-close scrim. It has to live outside <header>: the
          header's backdrop-filter makes it the containing block for any
          fixed-position descendant, which would pin the scrim to the bar. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 top-16 z-40 bg-[rgba(4,8,18,0.5)] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Transparent over the hero, frosted once scrolled, fully opaque while
          the drawer is open so bar and panel read as one surface. */}
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          open
            ? "border-[var(--line)] bg-[var(--background)]"
            : scrolled
              ? "border-[var(--line)] bg-[var(--background)]/80 backdrop-blur-md"
              : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 lg:h-[72px]">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 font-mono text-base font-semibold tracking-tight text-[var(--foreground)] transition-opacity hover:opacity-80 sm:text-lg"
          >
            <MonkMark size={28} />
            Sharpmonk
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link rounded-full px-4 py-2 text-sm transition-colors ${
                    active
                      ? "bg-[var(--surface-2)] text-[var(--foreground)]"
                      : "text-muted hover:bg-[var(--surface-1)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 lg:gap-3">
            <ThemeToggle />

            {/* Only from xl: at lg the nav already fills the bar. */}
            <Link
              href="/exams"
              className="btn-glow hidden rounded-full px-5 py-2 text-sm font-medium xl:inline-flex"
            >
              Find your exam
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
              className="relative flex size-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-1)] text-[var(--foreground)] transition-colors hover:bg-[var(--surface-2)] lg:hidden"
            >
              <span className={`hamburger ${open ? "hamburger-open" : ""}`} />
            </button>
          </div>
        </div>

        {/* Reading-progress hairline. Purely decorative and scroll-timeline
            driven, so browsers without support simply never paint it. */}
        <span className="scroll-progress" aria-hidden />

        <div
          id="mobile-nav"
          inert={!open}
          className={`nav-drawer absolute inset-x-0 top-full border-b border-[var(--line)] bg-[var(--background)] transition-[opacity,transform] duration-300 lg:hidden ${
            open
              ? "is-open translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0"
          }`}
        >
          <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    style={{ "--i": i } as React.CSSProperties}
                    className={`nav-row flex min-h-13 items-center gap-3 rounded-2xl px-3 py-2 transition-colors ${
                      active
                        ? "bg-[var(--surface-1)] text-[var(--foreground)]"
                        : "text-[var(--foreground)] active:bg-[var(--surface-1)]"
                    }`}
                  >
                    <span
                      className={`icon-badge icon-badge-sm shrink-0 ${
                        active ? "icon-badge--blue" : "nav-row-badge"
                      }`}
                    >
                      <Icon name={link.icon} size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] leading-tight font-medium">
                        {link.label}
                      </span>
                      <span className="text-muted block truncate text-xs leading-tight">
                        {link.hint}
                      </span>
                    </span>
                    <Icon
                      name="chevron-right"
                      size={16}
                      className={active ? "text-[var(--accent)]" : "text-muted"}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 border-t border-[var(--line)] pt-3">
              <Link
                href="/exams"
                className="btn-glow flex min-h-12 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold"
              >
                Find your exam
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
