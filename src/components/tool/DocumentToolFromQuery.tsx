"use client";

import { useSyncExternalStore } from "react";
import DocumentTool, { type DocPreset } from "./DocumentTool";
import type { Strings } from "@/lib/i18n";

const noSubscribe = () => () => {};

/**
 * Reads `?min=&max=` so an exam page can link straight to the right window.
 * The static HTML renders the defaults; after hydration the query string is
 * read and the tool remounts with it, without a Suspense boundary.
 */
export default function DocumentToolFromQuery(props: {
  initial: { minKB: number; maxKB: number };
  presets: DocPreset[];
  what: keyof Strings["what"];
  fileName: string;
}) {
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => "");
  const q = new URLSearchParams(search);
  const num = (k: string) => {
    const v = Number(q.get(k));
    return q.has(k) && Number.isFinite(v) && v >= 0 && v <= 5000 ? v : null;
  };
  const min = num("min");
  const max = num("max");
  const initial = max !== null && max > 0 && (min ?? 0) < max ? { minKB: min ?? 0, maxKB: max } : props.initial;
  return <DocumentTool key={`${initial.minKB}-${initial.maxKB}`} {...props} initial={initial} />;
}
