import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = "https://sharpmonk.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/calculators", priority: 0.95, changeFrequency: "weekly" },
    { path: "/calculator", priority: 0.9, changeFrequency: "weekly" },
    { path: "/calculators/life-insurance-needs", priority: 0.85, changeFrequency: "weekly" },
    { path: "/calculators/disability-insurance", priority: 0.8, changeFrequency: "weekly" },
    { path: "/calculators/renters-insurance", priority: 0.8, changeFrequency: "weekly" },
    { path: "/calculators/umbrella-insurance", priority: 0.8, changeFrequency: "weekly" },
    { path: "/calculators/pet-insurance", priority: 0.8, changeFrequency: "weekly" },
    { path: "/calculators/term-vs-whole-life", priority: 0.8, changeFrequency: "weekly" },
    { path: "/in", priority: 0.9, changeFrequency: "weekly" },
    { path: "/in/term-life", priority: 0.85, changeFrequency: "weekly" },
    { path: "/in/health-insurance", priority: 0.85, changeFrequency: "weekly" },
    { path: "/in/car-bike-insurance", priority: 0.85, changeFrequency: "weekly" },
    { path: "/guides", priority: 0.7, changeFrequency: "weekly" },
    { path: "/guides/how-much-life-insurance-do-you-need", priority: 0.75, changeFrequency: "monthly" },
    { path: "/guides/term-vs-whole-life-insurance", priority: 0.75, changeFrequency: "monthly" },
    { path: "/guides/term-insurance-india-guide", priority: 0.75, changeFrequency: "monthly" },
    { path: "/guides/car-insurance-india-explained", priority: 0.75, changeFrequency: "monthly" },
    { path: "/glossary", priority: 0.6, changeFrequency: "monthly" },
    { path: "/methodology", priority: 0.5, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
