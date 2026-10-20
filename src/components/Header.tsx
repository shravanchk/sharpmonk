"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import InstallApp from "./InstallApp";
import MonkMark from "./MonkMark";
import Icon, { type IconName } from "./Icon";
import { LANG_KEY, STRINGS, basePath, hasHindi, langFromPath, localHref, type Lang } from "@/lib/i18n";

type NavLink = { href: string; label: string; icon: IconName; hint: string };

function navLinks(lang: Lang): NavLink[] {
  const n = STRINGS[lang].nav;
  const items: [string, IconName, string[]][] = [
    ["/", "home", n.home],
    ["/exams", "clipboard", n.exams],
    ["/resize-image-to-kb", "ruler", n.kb],
    ["/signature-resize", "pen", n.signature],
    ["/compress-pdf-to-kb", "file-text", n.pdf],
    ["/how-it-works", "info", n.how],
  ];
  return items.map(([href, icon, [label, hint]]) => ({ href: localHref(lang, href), icon, label, hint }));
}

/** The same page in the other language, or that language's home page. */
function switchHref(pathname: string, lang: Lang) {
  if (lang === "hi") return basePath(pathname);
  return hasHindi(pathname) ? localHref("hi", pathname) : "/hi";
}

// Match the section, not the prefix — a bare `startsWith` would light up a
// link for any unrelated route that merely shares its first letters.
const isActive = (pathname: string, href: string) =>
  href === "/" || href === "/hi" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

export default function Header() {
  const pathname = usePathname();
  const lang = langFromPath(pathname);
  const t = STRINGS[lang];
  const NAV_LINKS = navLinks(lang);
  const [open, setOpen] = useState(false);
  // Starts false on both server and client, so hydration matches even when
  // the browser restores a scrolled position; the effect below syncs it.
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu on route change — adjust state during render
  // instead of in an effect (see https://react.dev/learn/you-might-not-need-an-effect).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Remembered so a share from another app, which always lands on
  // /open?shared=1, carries on in this language (see OpenShared). That
  // arrival itself isn't a choice of language, so it doesn't count.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("shared")) return;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // Storage blocked: shares open in English.
    }
  }, [lang, pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
    };
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
            href={localHref(lang, "/")}
            className="flex shrink-0 items-center gap-2.5 font-mono text-base font-semibold tracking-tight text-[var(--foreground)] transition-opacity hover:opacity-80 sm:text-lg"
          >
            <MonkMark size={28} />
            {/* The tagline says what the name doesn't. Hidden on phones and at
                lg, where the bar has no room; back from xl. */}
            <span className="flex flex-col leading-none">
              Sharpmonk
              <span className="text-muted mt-1 hidden font-sans text-[11px] font-normal tracking-normal sm:block lg:hidden xl:block">
                {t.tagline}
              </span>
            </span>
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
            <Link
              href={switchHref(pathname, lang)}
              hrefLang={lang === "hi" ? "en" : "hi"}
              lang={lang === "hi" ? "en" : "hi"}
              className="text-muted rounded-full border border-[var(--line-strong)] bg-[var(--surface-1)] px-3 py-1.5 text-sm transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              {t.switchTo}
            </Link>
            <ThemeToggle />

            {/* Only from xl: at lg the nav already fills the bar. */}
            <Link
              href={localHref(lang, "/exams")}
              className="btn-glow hidden rounded-full px-5 py-2 text-sm font-medium xl:inline-flex"
            >
              {t.nav.cta}
            </Link>

            <button
              type="button"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
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

            <div className="mt-3 flex flex-col gap-2 border-t border-[var(--line)] pt-3">
              <InstallApp lang={lang} variant="row" />
              <Link
                href={localHref(lang, "/exams")}
                className="btn-glow flex min-h-12 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold"
              >
                {t.nav.cta}
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
