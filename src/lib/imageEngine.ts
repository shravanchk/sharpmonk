/**
 * The precision image engine: decode → frame → (clean up) → encode into a
 * byte window. Browser-only; nothing here ever sends the image anywhere.
 *
 * The job is narrower than "compress an image". An exam portal wants a JPEG at
 * specific pixel dimensions whose file size sits inside a range, sometimes
 * with a DPI value. The engine renders the chosen crop at exactly those
 * dimensions, searches the JPEG quality for the best one that fits under the
 * maximum, and — when even top quality comes out under the minimum, as small
 * signatures do — pads the file up to it (see padTo in jpeg.ts).
 */

import {
  padTarget,
  padTo,
  readJfifDpi,
  readJpegSize,
  safeWindow,
  setJfifDpi,
  sniffType,
  type SniffedType,
} from "./jpeg";

/* ----------------------------------------------------------------------
   Decoding
   ---------------------------------------------------------------------- */

export type Source = {
  image: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
};

export class DecodeError extends Error {
  constructor(public kind: SniffedType) {
    super(
      kind === "heic"
        ? "This is an iPhone HEIC photo, which this browser can't open. On the iPhone, share the photo and choose “Save as JPEG”, or set Settings → Camera → Formats → Most Compatible."
        : kind === "pdf"
          ? "This is a PDF. These tools work on photos and scans saved as JPG or PNG."
          : "This file couldn't be opened as an image. Try a JPG or PNG.",
    );
  }
}

/** Decodes with EXIF orientation applied, so a phone photo comes in upright. */
export async function decodeFile(file: Blob): Promise<Source> {
  const head = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const kind = sniffType(head);
  if (kind === "pdf") throw new DecodeError(kind);

  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { image: bmp, width: bmp.width, height: bmp.height, release: () => bmp.close() };
    } catch {
      // Fall through to <img>, which decodes more formats on some browsers
      // (Safari opens HEIC this way).
    }
  }

  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  try {
    await img.decode();
  } catch {
    URL.revokeObjectURL(url);
    throw new DecodeError(kind);
  }
  return {
    image: img,
    width: img.naturalWidth,
    height: img.naturalHeight,
    release: () => URL.revokeObjectURL(url),
  };
}

/** A copy of `src` turned clockwise by `quarterTurns` × 90°. */
export function rotate(src: Source, quarterTurns: number): Source {
  const turns = ((quarterTurns % 4) + 4) % 4;
  if (turns === 0) return src;
  const swap = turns % 2 === 1;
  const c = document.createElement("canvas");
  c.width = swap ? src.height : src.width;
  c.height = swap ? src.width : src.height;
  const ctx = c.getContext("2d")!;
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate((turns * Math.PI) / 2);
  ctx.drawImage(src.image, -src.width / 2, -src.height / 2);
  return { image: c, width: c.width, height: c.height, release: () => {} };
}

/* ----------------------------------------------------------------------
   Framing — which part of the source becomes the output
   ---------------------------------------------------------------------- */

/** "cover" crops to fill the frame; "contain" keeps the whole image and pads
 *  the rest with white — right for signatures, which must not be clipped. */
export type Fit = "cover" | "contain";

/** Crop centre as a fraction of the source, plus zoom (1 = largest crop). */
export type Framing = { zoom: number; cx: number; cy: number };

export const CENTRED: Framing = { zoom: 1, cx: 0.5, cy: 0.5 };

export type Rect = { x: number; y: number; w: number; h: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** The source rectangle, in source pixels, that maps onto the output. It may
 *  extend past the image in "contain" mode; that area renders white. */
export function cropRect(srcW: number, srcH: number, aspect: number, fit: Fit, f: Framing): Rect {
  const wider = srcW / srcH > aspect;
  let w: number;
  let h: number;
  if (fit === "cover") {
    h = wider ? srcH : srcW / aspect;
    w = wider ? srcH * aspect : srcW;
  } else {
    w = wider ? srcW : srcH * aspect;
    h = wider ? srcW / aspect : srcH;
  }
  w /= f.zoom;
  h /= f.zoom;
  const x = w <= srcW ? clamp(f.cx * srcW - w / 2, 0, srcW - w) : (srcW - w) / 2;
  const y = h <= srcH ? clamp(f.cy * srcH - h / 2, 0, srcH - h) : (srcH - h) / 2;
  return { x, y, w, h };
}

/** The framing that `cropRect` actually used, so a drag past the edge does
 *  not leave the stored centre somewhere the crop can't follow. */
export function settleFraming(srcW: number, srcH: number, aspect: number, fit: Fit, f: Framing): Framing {
  const r = cropRect(srcW, srcH, aspect, fit, f);
  return { zoom: f.zoom, cx: (r.x + r.w / 2) / srcW, cy: (r.y + r.h / 2) / srcH };
}

/* ----------------------------------------------------------------------
   Rendering
   ---------------------------------------------------------------------- */

/**
 * Halved copies of a source, built on demand. A single canvas draw from a
 * 4000 px photo down to 200 px aliases badly outside Chrome; stepping down by
 * halves first and finishing with one smooth draw looks right everywhere.
 */
const pyramids = new WeakMap<Source, CanvasImageSource[]>();

function levelFor(src: Source, scale: number): { image: CanvasImageSource; width: number } {
  let levels = pyramids.get(src);
  if (!levels) {
    levels = [src.image];
    pyramids.set(src, levels);
  }
  const wanted = src.width * scale;
  let i = 0;
  let w = src.width;
  while (w / 2 >= wanted && w / 2 >= 1) {
    i++;
    w = Math.floor(w / 2);
    if (!levels[i]) {
      const prev = levels[i - 1];
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.floor(src.width / 2 ** i));
      c.height = Math.max(1, Math.floor(src.height / 2 ** i));
      const ctx = c.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(prev, 0, 0, c.width, c.height);
      levels[i] = c;
    }
  }
  return { image: levels[i], width: w };
}

export type RenderOptions = {
  fit: Fit;
  framing: Framing;
  /** Flatten paper to white and ink to near-black — for signatures, thumb
   *  impressions and declarations photographed on a phone. */
  cleanInk?: boolean;
  /** With cleanInk: crop to the ink itself. Used until the reader frames
   *  the image by hand, since most people photograph the whole sheet. */
  trimToInk?: boolean;
};

/** Paints the framed source over the whole of `ctx`'s w × h, on white. Also
 *  what the live crop preview draws with, so preview and file always agree. */
export function paint(ctx: CanvasRenderingContext2D, src: Source, w: number, h: number, fit: Fit, framing: Framing) {
  const r = cropRect(src.width, src.height, w / h, fit, framing);
  const k = w / r.w;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const level = levelFor(src, k);
  ctx.drawImage(level.image, -r.x * k, -r.y * k, src.width * k, src.height * k);
  return r;
}

/** Renders the framed source at exactly `width` × `height`. */
export function render(src: Source, width: number, height: number, opts: RenderOptions): HTMLCanvasElement {
  if (!opts.cleanInk) {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    paint(c.getContext("2d")!, src, width, height, opts.fit, opts.framing);
    return c;
  }

  // Clean only the photographed part of the frame. In "contain" mode the
  // frame also holds white padding, and next to pure white even good paper
  // reads as ink — measured against the padding, it blackens into bars.
  const r = cropRect(src.width, src.height, width / height, opts.fit, opts.framing);
  const k = width / r.w; // output px per source px
  const ix0 = Math.max(r.x, 0);
  const iy0 = Math.max(r.y, 0);
  const ix1 = Math.min(r.x + r.w, src.width);
  const iy1 = Math.min(r.y + r.h, src.height);

  // Work well above a tiny target's resolution (a 140×60 signature has too
  // few pixels to tell paper from ink), then step down.
  const m = clamp(1 / k, 1, 4);
  const km = k * m;
  const ww = Math.max(1, Math.round((ix1 - ix0) * km));
  const wh = Math.max(1, Math.round((iy1 - iy0) * km));
  const work = document.createElement("canvas");
  work.width = ww;
  work.height = wh;
  const wctx = work.getContext("2d", { willReadFrequently: true })!;
  wctx.imageSmoothingEnabled = true;
  wctx.imageSmoothingQuality = "high";
  wctx.drawImage(levelFor(src, km).image, -ix0 * km, -iy0 * km, src.width * km, src.height * km);
  cleanInk(wctx, ww, wh);

  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const box = opts.trimToInk ? inkBounds(wctx, ww, wh) : null;
  if (box) {
    // Fit the ink, plus a margin, inside the output — centred, never cropped.
    const s = Math.min(width / box.w, height / box.h);
    const dw = box.w * s;
    const dh = box.h * s;
    ctx.drawImage(work, box.x, box.y, box.w, box.h, (width - dw) / 2, (height - dh) / 2, dw, dh);
  } else {
    ctx.drawImage(work, (ix0 - r.x) * k, (iy0 - r.y) * k, (ix1 - ix0) * k, (iy1 - iy0) * k);
  }
  return out;
}

/**
 * The region holding the ink after cleanup, with a margin. Uses the 0.5th and
 * 99.5th percentiles of ink positions rather than the extremes, so a stray
 * speck in a corner doesn't stretch the box. Null when there's no ink to find.
 */
function inkBounds(ctx: CanvasRenderingContext2D, w: number, h: number): Rect | null {
  const d = ctx.getImageData(0, 0, w, h).data;
  const xs = new Uint32Array(w);
  const ys = new Uint32Array(h);
  let total = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (d[(y * w + x) * 4] < 128) {
        xs[x]++;
        ys[y]++;
        total++;
      }
    }
  }
  if (total < 20) return null;

  const span = (hist: Uint32Array) => {
    const cut = total * 0.005;
    let lo = 0;
    for (let acc = 0; lo < hist.length; lo++) if ((acc += hist[lo]) > cut) break;
    let hi = hist.length - 1;
    for (let acc = 0; hi > 0; hi--) if ((acc += hist[hi]) > cut) break;
    return [lo, hi + 1] as const;
  };
  const [x0, x1] = span(xs);
  const [y0, y1] = span(ys);
  const pad = Math.max(4, Math.round(Math.max(x1 - x0, y1 - y0) * 0.08));
  const bx = Math.max(0, x0 - pad);
  const by = Math.max(0, y0 - pad);
  return { x: bx, y: by, w: Math.min(w, x1 + pad) - bx, h: Math.min(h, y1 + pad) - by };
}

/**
 * Flat-field document cleanup. A phone photo of a signature has paper that
 * ranges from grey to off-white across the frame, so no single threshold
 * works. Instead estimate the paper brightness locally (bright percentile per
 * block, smoothed), divide it out, then map the ratio through a soft curve:
 * paper → white, ink → near-black, edges stay anti-aliased.
 */
function cleanInk(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const lum = new Float32Array(w * h);
  for (let p = 0, i = 0; p < lum.length; p++, i += 4) {
    lum[p] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  }

  const bs = Math.max(8, Math.round(Math.min(w, h) / 10));
  const gw = Math.ceil(w / bs);
  const gh = Math.ceil(h / bs);
  const grid = new Float32Array(gw * gh);
  const hist = new Uint32Array(256);
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      hist.fill(0);
      let n = 0;
      for (let y = gy * bs; y < Math.min(h, (gy + 1) * bs); y++) {
        for (let x = gx * bs; x < Math.min(w, (gx + 1) * bs); x++) {
          hist[lum[y * w + x] | 0]++;
          n++;
        }
      }
      // 90th percentile: paper even when a block is mostly ink.
      let acc = 0;
      let v = 255;
      for (let b = 0; b < 256; b++) {
        acc += hist[b];
        if (acc >= n * 0.9) {
          v = b;
          break;
        }
      }
      grid[gy * gw + gx] = v;
    }
  }

  // 3×3 box smoothing so block edges never show.
  const smooth = new Float32Array(grid.length);
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      let s = 0;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const yy = gy + dy;
          const xx = gx + dx;
          if (yy >= 0 && yy < gh && xx >= 0 && xx < gw) {
            s += grid[yy * gw + xx];
            n++;
          }
        }
      }
      smooth[gy * gw + gx] = s / n;
    }
  }

  const LO = 0.55; // at or below this fraction of local paper: full ink
  const HI = 0.86; // at or above: paper
  for (let y = 0; y < h; y++) {
    const fy = clamp((y + 0.5) / bs - 0.5, 0, gh - 1);
    const y0 = Math.floor(fy);
    const y1 = Math.min(gh - 1, y0 + 1);
    const ty = fy - y0;
    for (let x = 0; x < w; x++) {
      const fx = clamp((x + 0.5) / bs - 0.5, 0, gw - 1);
      const x0 = Math.floor(fx);
      const x1 = Math.min(gw - 1, x0 + 1);
      const tx = fx - x0;
      const bg =
        smooth[y0 * gw + x0] * (1 - tx) * (1 - ty) +
        smooth[y0 * gw + x1] * tx * (1 - ty) +
        smooth[y1 * gw + x0] * (1 - tx) * ty +
        smooth[y1 * gw + x1] * tx * ty;
      const p = y * w + x;
      const t = clamp((lum[p] / Math.max(bg, 24) - LO) / (HI - LO), 0, 1);
      const v = Math.round(255 * t * t * (3 - 2 * t));
      const i = p * 4;
      d[i] = d[i + 1] = d[i + 2] = v;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/* ----------------------------------------------------------------------
   Encoding into a byte window
   ---------------------------------------------------------------------- */

export type Target = {
  width: number;
  height: number;
  minKB: number;
  maxKB: number;
  /** Written into the JFIF header when set. */
  dpi?: number;
};

export type EncodeResult =
  | {
      ok: true;
      blob: Blob;
      bytes: number;
      quality: number;
      /** Bytes of padding added to reach the minimum. */
      padded: number;
      dpi: number | null;
      width: number;
      height: number;
    }
  | { ok: false; reason: string; smallestBytes: number };

function toBytes(canvas: HTMLCanvasElement, quality: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("The browser could not encode a JPEG."));
        blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)), reject);
      },
      "image/jpeg",
      quality,
    );
  });
}

/**
 * Finds the highest JPEG quality whose file fits under the maximum, then pads
 * up to the minimum if needed. JPEG size is close enough to monotonic in
 * quality that a bisection converges; every candidate is measured for real
 * rather than estimated, so the reported size is the size of the file you get.
 */
export async function encodeToWindow(canvas: HTMLCanvasElement, t: Target): Promise<EncodeResult> {
  const win = safeWindow(t.minKB, t.maxKB);
  const finish = (b: Uint8Array) => (t.dpi ? setJfifDpi(b, t.dpi) : b);
  const at = async (q: number) => finish(await toBytes(canvas, q));

  const TOP = 0.95;
  let best: { q: number; bytes: Uint8Array } | null = null;

  const top = await at(TOP);
  if (top.length <= win.maxBytes) {
    best = { q: TOP, bytes: top };
    // Under the minimum: spend the headroom on real image detail before
    // reaching for padding. Quality 1.0 is wasteful in general, but here the
    // bytes are required either way, and pixels beat filler.
    if (top.length < win.minBytes) {
      const max = await at(1);
      if (max.length <= win.maxBytes) best = { q: 1, bytes: max };
    }
  } else {
    const floor = await at(0.05);
    if (floor.length > win.maxBytes) {
      return {
        ok: false,
        smallestBytes: floor.length,
        reason: `Even at the lowest quality this comes to ${(floor.length / 1000).toFixed(1)} KB, over the ${t.maxKB} KB limit. Reduce the pixel dimensions.`,
      };
    }
    best = { q: 0.05, bytes: floor };
    let lo = 0.05;
    let hi = TOP;
    for (let i = 0; i < 8; i++) {
      const mid = (lo + hi) / 2;
      const b = await at(mid);
      if (b.length <= win.maxBytes) {
        best = { q: mid, bytes: b };
        lo = mid;
      } else {
        hi = mid;
      }
    }
  }

  let bytes = best.bytes;
  let padded = 0;
  if (bytes.length < win.minBytes) {
    const before = bytes.length;
    bytes = padTo(bytes, padTarget(win));
    padded = bytes.length - before;
  }

  const blob = new Blob([bytes as BlobPart], { type: "image/jpeg" });
  return {
    ok: true,
    blob,
    bytes: bytes.length,
    quality: best.q,
    padded,
    dpi: readJfifDpi(bytes),
    width: canvas.width,
    height: canvas.height,
  };
}

/* ----------------------------------------------------------------------
   One call from settings to file
   ---------------------------------------------------------------------- */

export type ProduceSettings = {
  sizeMode: "exact" | "auto";
  width: number;
  height: number;
  maxLongSide: number;
  minKB: number;
  maxKB: number;
  dpi?: number;
  fit: Fit;
  cleanInk: boolean;
};

/** Below this, auto mode would rather lose pixels than turn the JPEG to mush. */
const AUTO_QUALITY_FLOOR = 0.6;

export async function produce(src: Source, s: ProduceSettings, framing: Framing): Promise<EncodeResult> {
  const target = { minKB: s.minKB, maxKB: s.maxKB, dpi: s.dpi };

  if (s.sizeMode === "exact") {
    const untouched = framing.zoom === 1 && framing.cx === 0.5 && framing.cy === 0.5;
    const canvas = render(src, s.width, s.height, { fit: s.fit, framing, cleanInk: s.cleanInk, trimToInk: s.cleanInk && untouched });
    return encodeToWindow(canvas, { ...target, width: s.width, height: s.height });
  }

  // Keep the photo's proportions. Start at its own resolution (never
  // upscaling, capped at maxLongSide) and step down only when meeting the
  // limit would otherwise cost too much quality.
  const aspect = src.width / src.height;
  const r = cropRect(src.width, src.height, aspect, "cover", framing);
  const startLong = Math.min(s.maxLongSide, Math.max(r.w, r.h));
  let firstFit: EncodeResult | null = null;
  let last: EncodeResult | null = null;
  for (let step = 0; step < 14; step++) {
    const long = Math.round(startLong * 0.85 ** step);
    if (long < 48) break;
    const w = Math.max(1, Math.round(aspect >= 1 ? long : long * aspect));
    const h = Math.max(1, Math.round(aspect >= 1 ? long / aspect : long));
    const canvas = render(src, w, h, { fit: "cover", framing, cleanInk: s.cleanInk });
    const res = await encodeToWindow(canvas, { ...target, width: w, height: h });
    last = res;
    if (res.ok && res.quality >= AUTO_QUALITY_FLOOR) return res;
    if (res.ok && !firstFit) firstFit = res;
  }
  // Nothing reached the quality floor: prefer the most pixels that fit at all.
  return firstFit ?? last ?? { ok: false, reason: "The limit is too small for any useful image.", smallestBytes: 0 };
}

/* ----------------------------------------------------------------------
   Inspecting a file someone already has
   ---------------------------------------------------------------------- */

export type FileFacts = {
  name: string;
  bytes: number;
  type: SniffedType;
  /** The extension on the name, lower-cased, without the dot. */
  extension: string;
  width: number;
  height: number;
  dpi: number | null;
};

export async function inspect(file: File, decoded: Source): Promise<FileFacts> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffType(bytes);
  // Stored dimensions for a JPEG (what a portal's validator reads); the
  // decoded, orientation-corrected size otherwise.
  const stored = type === "jpeg" ? readJpegSize(bytes) : null;
  return {
    name: file.name,
    bytes: bytes.length,
    type,
    extension: (file.name.split(".").pop() ?? "").toLowerCase(),
    width: stored?.width ?? decoded.width,
    height: stored?.height ?? decoded.height,
    dpi: type === "jpeg" ? readJfifDpi(bytes) : null,
  };
}
