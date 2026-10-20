import type { MetadataRoute } from "next";

// Required for `output: "export"` — force this metadata route to be
// generated statically at build time.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sharpmonk — Exam Photo & Signature Resizer",
    short_name: "Sharpmonk",
    description:
      "Resize exam photos and signatures to the exact pixels, KB and DPI the official notification asks for. Nothing is uploaded.",
    id: "/",
    start_url: "/",
    scope: "/",
    categories: ["utilities", "education", "productivity"],
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
      {
        src: "/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    // Long-press the app icon.
    shortcuts: [
      { name: "Exams", short_name: "Exams", url: "/exams", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Resize image to KB", short_name: "Resize", url: "/resize-image-to-kb", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Signature resizer", short_name: "Signature", url: "/signature-resize", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Compress PDF to KB", short_name: "PDF", url: "/compress-pdf-to-kb", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
    // Once installed, Sharpmonk appears in the phone's share sheet: share a
    // photo or PDF from the gallery or WhatsApp straight into a tool. The
    // service worker receives the POST (public/sw.js) and /open asks which
    // tool it's for. Nothing is uploaded — the "POST" never leaves the phone.
    share_target: {
      action: "/share-target",
      method: "POST",
      enctype: "multipart/form-data",
      params: {
        // MIME types only: the Play Store app turns these into Android
        // intent filters, which reject bare extensions.
        files: [{ name: "files", accept: ["image/*", "application/pdf"] }],
      },
    },
  };
}
