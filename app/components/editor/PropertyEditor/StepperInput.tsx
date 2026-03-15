"use client";

import React from "react";
import { INPUT_CLASS, parseValueWithUnit } from "./constants";

export function StepperInput({
  value,
  onChange,
  step = 4,
  min = 0,
  max,
  unit = "px",
}: {
  value: string;
  onChange: (next: string) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
}) {
  const { num, unit: parsedUnit } = parseValueWithUnit(value);
  const u = parsedUnit || unit;

  const apply = (n: number) => {
    const clamped = max != null ? Math.min(max, n) : n;
    const next = Math.max(min, clamped);
    onChange(`${next}${u}`);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => apply(num - step)}
        className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent flex items-center justify-center text-sm font-bold transition-colors"
        aria-label="Decrease"
      >
        −
      </button>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_CLASS} flex-1 text-center font-mono`}
      />
      <button
        type="button"
        onClick={() => apply(num + step)}
        className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent flex items-center justify-center text-sm font-bold transition-colors"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
