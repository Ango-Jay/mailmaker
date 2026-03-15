"use client";

import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Plus } from "lucide-react";

const HEX_REGEX = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

function isValidHexColor(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const v = value.startsWith("#") ? value : `#${value}`;
  return HEX_REGEX.test(v);
}

function getSafeColor(value: string): string {
  if (!value) return "#000000";
  const v = String(value).trim();
  const withHash = v.startsWith("#") ? v : `#${v}`;
  if (HEX_REGEX.test(withHash)) {
    const hex = withHash.slice(1);
    if (hex.length === 3) {
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    return withHash.length === 7 ? withHash : "#000000";
  }
  return "#000000";
}

export interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  id?: string;
}

export function ColorPicker({ label, value, onChange, id }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const displayColor = getSafeColor(value);
  const pickerColor = isValidHexColor(value) ? getSafeColor(value) : "#000000";
  const needsBorder =
    displayColor === "#ffffff" ||
    displayColor === "#fff" ||
    !value ||
    displayColor.toLowerCase() === "#ffffff";

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const inputId = id ?? `color-picker-${label.replace(/\s/g, "-")}`;

  return (
    <div className="w-full flex items-center gap-4 justify-between">
      <label
        htmlFor={inputId}
        className="text-[10px] font-bold text-text-light/40 uppercase"
      >
        {label}
      </label>
      <div className="relative" ref={popoverRef}>
        <button
          id={inputId}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={`${label} color picker`}
          aria-expanded={open}
          className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
            needsBorder ? "border-white/20" : "border-transparent"
          }`}
          style={{ backgroundColor: displayColor }}
        >
          <div className="w-4 h-4 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
            <Plus className="w-3 h-3 text-[#323232]" />
          </div>
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-2 z-50 p-3 rounded-xl bg-[#222831] border border-white/10 shadow-xl"
            role="dialog"
            aria-label={`Pick ${label}`}
          >
            <HexColorPicker
              color={pickerColor}
              onChange={onChange}
              style={{ width: 180, height: 140 }}
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-text-light/40 uppercase">Hex</span>
              <HexColorInput
                color={pickerColor}
                onChange={onChange}
                prefixed
                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
