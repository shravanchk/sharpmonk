"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

/**
 * Share + print actions for an estimate.
 *
 * Sits inside the two shared result panels, so all of the calculators get
 * both actions without each one wiring them up.
 *
 * "Copy link" copies the current address, which `useShareableInputs` keeps in
 * step with the inputs, so the link reproduces this exact estimate. "Print"
 * hands off to the browser's own dialog, where "Save as PDF" is the standard
 * destination on every platform — no PDF library, nothing to ship to the
 * client. The `print:` rules in globals.css strip the page down to the
 * assumptions and the result.
 */
export default function ResultActions() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (next: "copied" | "failed") => {
    setState(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2200);
  };

  const copy = async () => {
    try {
      // Absent over plain http and in some in-app browsers.
      if (!navigator.clipboard) throw new Error("no clipboard api");
      await navigator.clipboard.writeText(window.location.href);
      flash("copied");
    } catch {
      flash("failed");
    }
  };

  return (
    <div className="result-actions mt-6 border-t border-[var(--line)] pt-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={copy}
          className="btn-ghost flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium"
        >
          <Icon name={state === "copied" ? "check" : "link"} size={16} />
          {state === "copied" ? "Copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-ghost flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium"
        >
          <Icon name="printer" size={16} />
          Print / PDF
        </button>
      </div>

      <p aria-live="polite" className="text-muted mt-2 text-center text-xs leading-relaxed">
        {state === "copied"
          ? "Anyone opening that link sees these same numbers."
          : state === "failed"
            ? "Couldn’t copy automatically — copy the address bar instead."
            : "Your figures travel in the link, never to a server."}
      </p>
    </div>
  );
}
