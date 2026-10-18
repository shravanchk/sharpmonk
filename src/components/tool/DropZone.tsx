"use client";

import { useRef, useState } from "react";
import Icon from "@/components/Icon";
import { useStrings } from "@/components/LangProvider";

type Props = {
  onFile: (file: File) => void;
  /** Already localised, e.g. "your photo". */
  what: string;
};

/** File picker that also takes drag-and-drop and pasted images. On phones the
 *  picker offers the camera directly, which is how most signatures arrive. */
export default function DropZone({ onFile, what }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const s = useStrings();

  const take = (files: FileList | null | undefined) => {
    const f = files?.[0];
    if (f) onFile(f);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => input.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          input.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        take(e.dataTransfer.files);
      }}
      onPaste={(e) => take(e.clipboardData.files)}
      className={`flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
        over
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--line-strong)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)]"
      }`}
    >
      <span className="icon-badge icon-badge-lg icon-badge--blue">
        <Icon name="upload" size={22} />
      </span>
      <span className="font-medium">{s.drop.choose(what)}</span>
      <span className="text-muted max-w-xs text-sm leading-relaxed">
        {s.drop.help}
      </span>
      <span className="text-muted inline-flex items-center gap-1.5 text-xs">
        <Icon name="lock" size={13} />
        {s.drop.local}
      </span>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          take(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
