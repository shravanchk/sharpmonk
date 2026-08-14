/**
 * The pure encode/decode half of the shareable-inputs system.
 *
 * This lives apart from `useShareableInputs` because the hook file is a
 * `"use client"` module: in RSC every export of such a module is a *client
 * reference*, so a Server Component that imported `encodeAll` from there would
 * get a stub it cannot call. The generated long-tail pages need to build
 * calculator deep links at build time, on the server, so the codec has to sit
 * in a module with no client boundary. The hook re-exports these, and both
 * halves share one schema, which is what stops a generated link from carrying
 * a value the calculator would reject.
 */

export type FieldSpec =
  | { kind: "number"; min: number; max: number; step?: number }
  | { kind: "bool" }
  | { kind: "enum"; values: readonly string[] }
  | { kind: "numEnum"; values: readonly number[] };

/**
 * The allowed values are typed against the field they describe, so listing an
 * option the field cannot actually hold is a compile error rather than a value
 * that silently never restores from a link.
 */
type FieldSpecFor<V> = [V] extends [boolean]
  ? { kind: "bool" }
  : [V] extends [number]
    ? { kind: "number"; min: number; max: number; step?: number } | { kind: "numEnum"; values: readonly V[] }
    : [V] extends [string]
      ? { kind: "enum"; values: readonly V[] }
      : never;

export type Schema<T> = { [K in keyof T]: FieldSpecFor<T[K]> };

const decodeField = (raw: string, spec: FieldSpec): unknown => {
  switch (spec.kind) {
    case "number": {
      const n = Number(raw);
      if (!Number.isFinite(n)) return undefined;
      const clamped = Math.min(spec.max, Math.max(spec.min, n));
      // Snap back onto the control's own increments so a shared link can never
      // land a slider between two stops.
      if (spec.step) {
        return spec.min + Math.round((clamped - spec.min) / spec.step) * spec.step;
      }
      return clamped;
    }
    case "bool":
      return raw === "1" ? true : raw === "0" ? false : undefined;
    case "enum":
      return spec.values.includes(raw) ? raw : undefined;
    case "numEnum": {
      const n = Number(raw);
      return spec.values.includes(n) ? n : undefined;
    }
  }
};

const encodeField = (value: unknown): string =>
  typeof value === "boolean" ? (value ? "1" : "0") : String(value);

export function decodeAll<T extends object>(search: string, defaults: T, schema: Schema<T>): T {
  if (!search) return defaults;
  const params = new URLSearchParams(search);
  let changed = false;
  const next = { ...defaults };
  for (const key of Object.keys(schema) as (keyof T)[]) {
    const raw = params.get(String(key));
    if (raw === null) continue;
    const parsed = decodeField(raw, schema[key]);
    if (parsed === undefined) continue;
    next[key] = parsed as T[keyof T];
    changed = true;
  }
  return changed ? next : defaults;
}

/** Only fields that differ from their default make it into the URL, so an
 *  untouched calculator has a clean address and shared links stay short. */
export function encodeAll<T extends object>(
  inputs: T,
  defaults: T,
  schema: Schema<T>,
  into = new URLSearchParams(),
): URLSearchParams {
  for (const key of Object.keys(schema) as (keyof T)[]) {
    if (inputs[key] !== defaults[key]) into.set(String(key), encodeField(inputs[key]));
  }
  return into;
}
