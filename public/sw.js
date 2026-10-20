/*
 * Sharpmonk service worker: makes the tools work offline after one visit.
 *
 * - Install: fetch the tool pages and every script/style they reference, and
 *   cache them, so a phone that later loses signal at an exam centre or a
 *   cyber café can still resize a photo.
 * - Pages: network first (so updates arrive), falling back to the cache.
 * - /_next/static and /vendor: cache first. Their names change whenever
 *   their contents do, so a cached copy is never stale.
 * - POST /share-target: files shared from another app (the manifest's
 *   share_target). They're parked in their own cache and the page at /open
 *   picks them up — the share never touches the network.
 *
 * Bump VERSION to drop every old cache on the next visit.
 */
const VERSION = "v1";
const CACHE = `sharpmonk-${VERSION}`;
// Read by src/lib/shared.ts; not versioned, so an update never drops a share.
const SHARE_CACHE = "sharpmonk-share";

const PAGES = [
  "/",
  "/exams",
  "/resize-image-to-kb",
  "/signature-resize",
  "/compress-pdf-to-kb",
  "/image-to-pdf",
  "/open",
  "/hi",
  "/hi/open",
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
      for (const key of await caches.keys()) if (key !== CACHE && key !== SHARE_CACHE) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.method === "POST" && url.pathname === "/share-target") {
    event.respondWith(receiveShare(req));
    return;
  }
  if (req.method !== "GET") return;

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

/** Keeps the shared files (replacing any earlier share) and opens /open. */
async function receiveShare(req) {
  try {
    const form = await req.formData();
    const files = form.getAll("files").filter((f) => typeof f === "object" && "size" in f);
    const cache = await caches.open(SHARE_CACHE);
    for (const key of await cache.keys()) await cache.delete(key);
    await Promise.all(
      files.map((f, i) =>
        cache.put(
          `/__shared/${i}`,
          new Response(f, {
            headers: {
              "content-type": f.type || "application/octet-stream",
              "x-name": encodeURIComponent(f.name || `shared-${i + 1}`),
            },
          }),
        ),
      ),
    );
  } catch {
    // /open says nothing arrived, and offers the tools anyway.
  }
  return Response.redirect(new URL("/open?shared=1", self.location.origin).href, 303);
}
