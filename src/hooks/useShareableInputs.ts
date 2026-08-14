"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { decodeAll, encodeAll, type Schema } from "@/lib/shareableUrl";

/**
 * Keeps a calculator's inputs mirrored in the query string so an estimate can
 * be copied, bookmarked and shared, and restores them when such a link is
 * opened.
 *
 * Reading the URL during render would break hydration — the server has no
 * `location`, so it would emit the defaults while the client emitted the
 * shared values, and React does not patch mismatched attributes. The URL is
 * therefore read through `useSyncExternalStore`, which is built for exactly
 * this: `getServerSnapshot` yields "" so server and hydration agree, and the
 * real query string arrives on the first client render afterwards.
 *
 * The encode/decode half lives in `@/lib/shareableUrl` so Server Components
 * can build deep links with the same schemas — see the note there. It is
 * re-exported below so call sites keep importing both halves from one place.
 */

export { decodeAll, encodeAll };
export type { FieldSpec, Schema } from "@/lib/shareableUrl";

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
