/**
 * Files shared into the installed app from another app's share sheet.
 *
 * The service worker (public/sw.js) receives the share, parks the files in
 * the "sharpmonk-share" cache and opens /open, which asks what they're for
 * and then sends the reader to that tool with `?shared=1`. The tool takes the
 * files from here. Nothing in this round trip touches the network.
 */

const CACHE = "sharpmonk-share";

/** The shared files, without removing them — for /open's preview. */
export async function peekShared(): Promise<File[]> {
  if (typeof caches === "undefined") return [];
  try {
    const cache = await caches.open(CACHE);
    const keys = [...(await cache.keys())].sort((a, b) => index(a.url) - index(b.url));
    const files: File[] = [];
    for (const k of keys) {
      const res = await cache.match(k);
      if (!res) continue;
      const blob = await res.blob();
      const name = decodeURIComponent(res.headers.get("x-name") ?? "") || `shared-${files.length + 1}`;
      files.push(new File([blob], name, { type: blob.type }));
    }
    return files;
  } catch {
    return [];
  }
}

const index = (url: string) => Number(url.split("/").pop()) || 0;

let pending: { href: string; files: Promise<File[]> } | null = null;

/**
 * The files shared for this page, or null when it wasn't opened with
 * `?shared=1`. Read once per address, so a tool that mounts twice (React in
 * development, or a remount after hydration) gets the same files.
 */
export function sharedFiles(): Promise<File[]> | null {
  if (typeof window === "undefined" || !new URLSearchParams(window.location.search).has("shared")) return null;
  if (!pending || pending.href !== window.location.href) pending = { href: window.location.href, files: peekShared() };
  return pending.files;
}

/** Call once a tool has opened the files: empties the cache and drops
 *  `shared=1` from the address, so a reload or Back doesn't bring them back
 *  (an exam page's `doc=` stays, keeping its tab). */
export function consumeShared() {
  pending = null;
  caches?.delete(CACHE).catch(() => {});
  const url = new URL(window.location.href);
  url.searchParams.delete("shared");
  window.history.replaceState(window.history.state, "", url);
}

export const isPdf = (f: File) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);
