import type { MetadataRoute } from "next";
import { EXAMS } from "@/lib/specs";

export const dynamic = "force-static";

const siteUrl = "https://sharpmonk.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; lastModified?: string }[] = [
    { path: "", priority: 1 },
    { path: "/exams", priority: 0.9 },
    // An exam page changes when its notification does, so its date is the
    // date its figures were last checked — a truthful lastmod.
    ...EXAMS.map((e) => ({ path: `/exams/${e.slug}`, priority: 0.9, lastModified: e.verifiedOn })),
    { path: "/resize-image-to-kb", priority: 0.85 },
    { path: "/signature-resize", priority: 0.85 },
    { path: "/how-it-works", priority: 0.6 },
    { path: "/about", priority: 0.5 },
    { path: "/contact", priority: 0.4 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/disclaimer", priority: 0.2 },
  ];

  return routes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: r.lastModified ?? "2026-10-18",
    priority: r.priority,
  }));
}
