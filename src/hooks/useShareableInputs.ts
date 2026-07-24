"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

/**
 * Keeps a calculator's inputs mirrored in the query string so an estimate can
 * be copied, bookmarked and shared, and restores them when such a link is
 * opened.
 *
 * Two things drive the shape of this hook:
 *
 * 1. Reading the URL during render would break hydration — the server has no
 *    `location`, so it would emit the defaults while the client emitted the
 *    shared values, and React does not patch mismatched attributes. The URL is
 *    therefore read through `useSyncExternalStore`, which is built for exactly
 *    this: `getServerSnapshot` yields "" so server and hydration agree, and the
 *    real query string arrives on the first client render afterwards.
 *
 * 2. The premium functions look up their multipliers in `Record`s, so an
 *    unknown enum value silently produces `undefined` and a NaN premium. Every
 *    field is validated against a schema and falls back to its default, so no
 *    hand-edited URL can put a calculator into a broken state.
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

/** Debounced `replaceState` of a query string. Dragging a slider fires
 *  continuously, and Safari rate-limits history calls hard enough to throw if
 *  you write on every event. */
export function useUrlSync(qs: string) {
  useEffect(() => {
    const id = window.setTimeout(() => {
      const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(null, "", url + window.location.hash);
    }, 250);
    return () => window.clearTimeout(id);
  }, [qs]);
}

/**
 * The query string as it was when this component first mounted.
 *
 * `useSyncExternalStore` rather than a render-time read: the server has no
 * `location`, so reading it during render would emit different markup on each
 * side and React does not patch mismatched attributes. `getServerSnapshot`
 * yields "" so server and hydration agree, and the real value arrives on the
 * first client render afterwards. The snapshot is latched so our own
 * `replaceState` calls never re-trigger it.
 */
export function useUrlSearchOnce(): string {
  const store = useMemo(() => {
    let latched: string | null = null;
    return {
      subscribe: () => () => {},
      getSnapshot: () => (latched ??= window.location.search),
      getServerSnapshot: () => "",
    };
  }, []);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

export function useShareableInputs<T extends object>(defaults: T, schema: Schema<T>) {
  const search = useUrlSearchOnce();

  const fromUrl = useMemo(
    () => decodeAll(search, defaults, schema),
    // `defaults` and `schema` are module-level constants at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  const [inputs, setInputs] = useState(fromUrl);

  // Adopt the URL-derived values the moment they arrive (one transition, just
  // after hydration). Adjusting state during render rather than in an effect —
  // see https://react.dev/learn/you-might-not-need-an-effect.
  const [prevFromUrl, setPrevFromUrl] = useState(fromUrl);
  if (fromUrl !== prevFromUrl) {
    setPrevFromUrl(fromUrl);
    setInputs(fromUrl);
  }

  useUrlSync(
    useMemo(
      () => encodeAll(inputs, defaults, schema).toString(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [inputs],
    ),
  );

  return [inputs, setInputs] as const;
}
