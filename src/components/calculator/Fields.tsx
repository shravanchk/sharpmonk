"use client";

import type { ReactNode } from "react";

type FieldShellProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function FieldShell({ label, hint, children }: FieldShellProps) {
  return (
    <label className="field-shell flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-[var(--foreground)]/90">{label}</span>
        {hint && <span className="text-muted text-xs">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

type RangeFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
};

export function RangeField({ label, value, min, max, step = 1, onChange, format }: RangeFieldProps) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <FieldShell label={label} hint={format ? format(value) : String(value)}>
      <input
        type="range"
        className="field-range"
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </FieldShell>
  );
}

type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
};

export function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  return (
    <FieldShell label={label}>
      <select
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type ToggleFieldProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
};

export function ToggleField({ label, checked, onChange, description }: ToggleFieldProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-3.5 transition-colors hover:bg-[var(--surface-2)]">
      <input
        type="checkbox"
        className="field-check mt-0.5 size-4"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="block text-sm font-medium text-[var(--foreground)]/90">{label}</span>
        {description && <span className="text-muted block text-xs">{description}</span>}
      </span>
    </label>
  );
}
