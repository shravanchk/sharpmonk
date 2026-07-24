import type { MetadataRoute } from "next";

// Required for `output: "export"` — force this metadata route to be
// generated statically at build time.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sharpmonk — Free Insurance Calculator & Estimator",
    short_name: "Sharpmonk",
    description:
      "Free, no-signup calculators for life, health, auto, home, renters, umbrella, and pet insurance.",
    start_url: "/",
    display: "standalone",
    background_color: "#05070d",
    theme_color: "#17325c",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
