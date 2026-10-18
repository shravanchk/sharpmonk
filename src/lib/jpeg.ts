/**
 * Byte-level JPEG helpers: sniffing, the JFIF DPI field, and size padding.
 *
 * Kept free of DOM APIs so it runs (and is tested) under plain Node — the
 * canvas side of the engine lives in imageEngine.ts.
 *
 * A JPEG is a sequence of marker segments: FF D8 (start of image), then
 * `FF xx <length:2 bytes, big-endian, counts itself> <payload>` segments up to
 * the start-of-scan, then entropy-coded data. Everything here only ever reads
 * or inserts segments before the scan, which is the part every decoder agrees
 * on.
 */

export type SniffedType = "jpeg" | "png" | "webp" | "gif" | "heic" | "pdf" | "unknown";

/** What the bytes actually are, regardless of the file name. A PNG renamed to
 *  `.jpg` is one of the commonest reasons an exam portal rejects an upload. */
export function sniffType(b: Uint8Array): SniffedType {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b.length >= 12 && ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 4) === "WEBP") return "webp";
  if (b.length >= 6 && ascii(b, 0, 3) === "GIF") return "gif";
  if (b.length >= 5 && ascii(b, 0, 5) === "%PDF-") return "pdf";
  if (b.length >= 12 && ascii(b, 4, 4) === "ftyp") {
    const brand = ascii(b, 8, 4);
    if (/^(heic|heix|hevc|hevx|mif1|msf1|heim|heis)$/.test(brand)) return "heic";
  }
  return "unknown";
}

function ascii(b: Uint8Array, start: number, len: number) {
  let s = "";
  for (let i = start; i < start + len && i < b.length; i++) s += String.fromCharCode(b[i]);
  return s;
}

type Segment = { marker: number; start: number; length: number };

/** The segments between SOI and the start of scan. `length` is the whole
 *  segment including its two marker bytes. */
function segments(b: Uint8Array): Segment[] {
  const out: Segment[] = [];
  if (sniffType(b) !== "jpeg") return out;
  let i = 2;
  while (i + 4 <= b.length) {
    if (b[i] !== 0xff) break;
    // Fill bytes: any number of 0xFF may precede a marker.
    while (b[i + 1] === 0xff && i + 2 < b.length) i++;
    const marker = b[i + 1];
    if (marker === 0xd9 || marker === 0xda) break; // EOI / SOS
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2; // standalone markers carry no length
      continue;
    }
    const len = (b[i + 2] << 8) | b[i + 3];
    if (len < 2) break;
    out.push({ marker, start: i, length: len + 2 });
    i += len + 2;
  }
  return out;
}

function isJfifApp0(b: Uint8Array, s: Segment) {
  return s.marker === 0xe0 && s.length >= 18 && ascii(b, s.start + 4, 5) === "JFIF\0";
}

/** Pixel dimensions as stored in the frame header (SOF0–SOF15, minus the
 *  DHT/JPG/DAC markers that share the range). */
export function readJpegSize(b: Uint8Array): { width: number; height: number } | null {
  for (const s of segments(b)) {
    const m = s.marker;
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      const p = s.start + 4;
      return { height: (b[p + 1] << 8) | b[p + 2], width: (b[p + 3] << 8) | b[p + 4] };
    }
  }
  return null;
}

/** The DPI recorded in the JFIF header, or null when the file carries none
 *  (units = 0 means "aspect ratio only", which is what canvas encoders write). */
export function readJfifDpi(b: Uint8Array): number | null {
  const app0 = segments(b).find((s) => isJfifApp0(b, s));
  if (!app0) return null;
  const p = app0.start + 4 + 5 + 2; // past length, "JFIF\0" and version
  const units = b[p];
  const x = (b[p + 1] << 8) | b[p + 2];
  if (units === 1) return x;
  if (units === 2) return Math.round(x * 2.54);
  return null;
}

/**
 * Writes `dpi` into the JFIF density fields, inserting a JFIF header when the
 * encoder did not emit one. DPI changes nothing about the pixels — it is a
 * label that says how large the image is meant to print — but some portals
 * read it, and IBPS states 200 DPI for the thumb impression and declaration.
 */
export function setJfifDpi(b: Uint8Array, dpi: number): Uint8Array {
  const d = Math.max(1, Math.min(65535, Math.round(dpi)));
  const app0 = segments(b).find((s) => isJfifApp0(b, s));
  if (app0) {
    const out = b.slice();
    const p = app0.start + 4 + 5 + 2;
    out[p] = 1;
    out[p + 1] = d >> 8;
    out[p + 2] = d & 0xff;
    out[p + 3] = d >> 8;
    out[p + 4] = d & 0xff;
    return out;
  }
  // FF E0, length 16, "JFIF\0", v1.01, units=1 (dpi), Xdensity, Ydensity, no thumbnail.
  const header = new Uint8Array([
    0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01,
    d >> 8, d & 0xff, d >> 8, d & 0xff, 0x00, 0x00,
  ]);
  return concat(b.subarray(0, 2), header, b.subarray(2));
}

const COM_MAX_PAYLOAD = 65533; // 0xFFFF minus the two length bytes
const PAD_NOTE = "sharpmonk.com size padding. ";

/**
 * Grows the file to exactly `target` bytes by inserting comment (COM)
 * segments, which every decoder skips. This is how an image that is simply too
 * small — a 140×60 signature is a few KB even at maximum quality — meets a
 * portal's minimum file size without being upscaled or degraded.
 *
 * Inserted after the JFIF header when there is one, since JFIF requires its
 * APP0 to come first. Returns the input unchanged when it is already at or
 * above the target.
 */
export function padTo(b: Uint8Array, target: number): Uint8Array {
  let needed = target - b.length;
  if (needed <= 0) return b;
  // A COM segment can't be smaller than its 4-byte header; overshooting by a
  // couple of bytes is harmless, so round up rather than refuse.
  if (needed < 4) needed = 4;

  const first = segments(b)[0];
  const at = first && isJfifApp0(b, first) ? first.start + first.length : 2;

  const parts: Uint8Array[] = [];
  while (needed > 0) {
    // Never leave a remainder too small to form its own segment.
    let total = Math.min(needed, COM_MAX_PAYLOAD + 4);
    if (needed - total > 0 && needed - total < 4) total -= 4;
    const payload = total - 4;
    const seg = new Uint8Array(total);
    seg[0] = 0xff;
    seg[1] = 0xfe;
    seg[2] = (payload + 2) >> 8;
    seg[3] = (payload + 2) & 0xff;
    for (let i = 0; i < payload; i++) seg[4 + i] = PAD_NOTE.charCodeAt(i % PAD_NOTE.length);
    parts.push(seg);
    needed -= total;
  }
  return concat(b.subarray(0, at), ...parts, b.subarray(at));
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(arrays.reduce((n, a) => n + a.length, 0));
  let o = 0;
  for (const a of arrays) {
    out.set(a, o);
    o += a.length;
  }
  return out;
}

/* ----------------------------------------------------------------------
   Byte windows — what "between 20 KB and 50 KB" means
   ---------------------------------------------------------------------- */

export type ByteWindow = { minBytes: number; maxBytes: number };

/**
 * Portals disagree on whether a KB is 1000 or 1024 bytes, and none of the
 * notifications say. A file of at least min × 1024 and at most max × 1000
 * bytes passes under either reading, so that is the window the engine aims
 * for. When the range is too narrow for both readings to overlap, fall back to
 * the decimal one.
 */
export function safeWindow(minKB: number, maxKB: number): ByteWindow {
  const strictMin = Math.ceil(minKB * 1024);
  const strictMax = Math.floor(maxKB * 1000);
  if (strictMin <= strictMax) return { minBytes: strictMin, maxBytes: strictMax };
  return { minBytes: Math.ceil(minKB * 1000), maxBytes: strictMax };
}

/** Where to land when padding up to a minimum: a little above it, so a
 *  portal that rounds or counts slightly differently still sees it as inside. */
export function padTarget(w: ByteWindow): number {
  const span = w.maxBytes - w.minBytes;
  return w.minBytes + Math.min(span, Math.max(256, Math.round(span * 0.12)));
}

export const kb = (bytes: number, unit: 1000 | 1024 = 1000) => bytes / unit;
