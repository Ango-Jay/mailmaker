"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import {
  INPUT_CLASS,
  LABEL_CLASS,
  SECTION_HEADER_CLASS,
  parseValueWithUnit,
} from "./constants";
import { StepperInput } from "./StepperInput";
import { ColorPicker } from "@/app/components/ui/ColorPicker";

const FONT_SIZE_OPTIONS = ["12px", "14px", "16px", "18px", "20px", "24px"];

interface ButtonBlockPropertiesProps {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}

export function ButtonBlockProperties({ block, onUpdate }: ButtonBlockPropertiesProps) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);

  const widthVal = block.width ?? "200px";
  const heightVal = block.height ?? "44px";
  const borderRadiusVal = block.borderRadius ?? "8px";
  const { unit: widthUnit } = parseValueWithUnit(widthVal);
  const { unit: heightUnit } = parseValueWithUnit(heightVal);
  const { unit: radiusUnit } = parseValueWithUnit(borderRadiusVal);

  return (
    <>
      {/* Main */}
      <h4 className={SECTION_HEADER_CLASS}>Main</h4>
      <div className="space-y-3">
        <ColorPicker
          label="Background color"
          value={block.backgroundColor ?? "#D65A31"}
          onChange={(v) => handleChange({ backgroundColor: v })}
          id="button-block-bg-color"
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className={LABEL_CLASS}>Alignment</label>
            <select
              value={block.align ?? block.textAlign ?? "center"}
              onChange={(e) =>
                handleChange({
                  align: e.target.value as "left" | "center" | "right",
                  textAlign: e.target.value as "left" | "center" | "right",
                })
              }
              className={INPUT_CLASS}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className={LABEL_CLASS}>Border radius</label>
            <StepperInput
              value={borderRadiusVal}
              onChange={(v) => handleChange({ borderRadius: v })}
              step={radiusUnit === "%" ? 5 : 4}
              min={0}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className={LABEL_CLASS}>Width</label>
            <StepperInput
              value={widthVal}
              onChange={(v) => handleChange({ width: v })}
              step={widthUnit === "%" ? 5 : 10}
              min={widthUnit === "%" ? 10 : 40}
              max={widthUnit === "%" ? 100 : undefined}
            />
          </div>
          <div className="space-y-2">
            <label className={LABEL_CLASS}>Height</label>
            <StepperInput
              value={heightVal}
              onChange={(v) => handleChange({ height: v })}
              step={heightUnit === "%" ? 5 : 4}
              min={heightUnit === "%" ? 10 : 24}
              max={heightUnit === "%" ? 100 : undefined}
            />
          </div>
        </div>
      </div>

      {/* Text */}
      <h4 className={SECTION_HEADER_CLASS}>Text</h4>
      <div className="space-y-3">
        <ColorPicker
          label="Color"
          value={block.textColor ?? block.color ?? "#ffffff"}
          onChange={(v) => handleChange({ textColor: v, color: v })}
          id="button-block-text-color"
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className={LABEL_CLASS}>Font size</label>
            <select
              value={block.fontSize ?? "16px"}
              onChange={(e) => handleChange({ fontSize: e.target.value })}
              className={INPUT_CLASS}
            >
              {FONT_SIZE_OPTIONS.map((px) => (
                <option key={px} value={px}>
                  {px}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className={LABEL_CLASS}>Font weight</label>
            <select
              value={block.bold ? "bold" : "normal"}
              onChange={(e) => handleChange({ bold: e.target.value === "bold" })}
              className={INPUT_CLASS}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Others */}
      <h4 className={SECTION_HEADER_CLASS}>Others</h4>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Link URL</label>
        <input
          type="url"
          value={block.link ?? ""}
          onChange={(e) => handleChange({ link: e.target.value })}
          className={INPUT_CLASS}
          placeholder="https://..."
        />
      </div>
    </>
  );
}
