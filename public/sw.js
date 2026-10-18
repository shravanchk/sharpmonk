/*
 * Sharpmonk service worker: makes the tools work offline after one visit.
 *
 * - Install: fetch the tool pages and every script/style they reference, and
 *   cache them, so a phone that later loses signal at an exam centre or a
 *   cyber café can still resize a photo.
 * - Pages: network first (so updates arrive), falling back to the cache.
 * - /_next/static and /vendor: cache first. Their names change whenever
 *   their contents do, so a cached copy is never stale.
 *
 * Bump VERSION to drop every old cache on the next visit.
 */
const VERSION = "v1";
const CACHE = `sharpmonk-${VERSION}`;

const PAGES = [
  "/",
  "/exams",
  "/resize-image-to-kb",
  "/signature-resize",
  "/compress-pdf-to-kb",
  "/image-to-pdf",
  "/hi",
];

const ASSET_RE = /(?:src|href)="(\/(?:_next\/static|vendor)\/[^"]+)"/g;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const assets = new Set(["/vendor/pdf.worker.min.mjs", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"]);
      for (const path of PAGES) {
        try {
          const res = await fetch(path, { cache: "no-cache" });
          if (!res.ok) continue;
          const html = await res.clone().text();
          await cache.put(path, res);
          for (const m of html.matchAll(ASSET_RE)) assets.add(m[1]);
        } catch {
          // Offline during install: whatever was fetched is still cached.
        }
      }
      await Promise.all([...assets].map((a) => cache.add(a).catch(() => {})));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/vendor/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(url.pathname, copy));
          }
          return res;
        })
        .catch(async () => (await caches.match(url.pathname)) || (await caches.match("/")) || Response.error()),
    );
  }
});
