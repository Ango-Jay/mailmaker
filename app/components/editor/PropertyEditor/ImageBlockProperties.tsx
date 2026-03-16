"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { INPUT_CLASS, LABEL_CLASS, parseValueWithUnit } from "./constants";
import { StepperInput } from "./StepperInput";

interface ImageBlockPropertiesProps {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
  onOpenUploadModal?: (forBlockId: string) => void;
}

export function ImageBlockProperties({ block, onUpdate, onOpenUploadModal }: ImageBlockPropertiesProps) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);
  const widthVal = block.width ?? "100%";
  const heightVal = block.height ?? "";
  const borderRadiusVal = block.borderRadius ?? "0px";
  const { unit: widthUnit } = parseValueWithUnit(widthVal);
  const { unit: heightUnit } = parseValueWithUnit(heightVal || "200px");
  const { unit: radiusUnit } = parseValueWithUnit(borderRadiusVal);

  return (
    <>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Image URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={block.src ?? ""}
            onChange={(e) => handleChange({ src: e.target.value })}
            className={INPUT_CLASS}
            placeholder="https://..."
          />
          {onOpenUploadModal && (
            <button
              type="button"
              onClick={() => onOpenUploadModal(block.id)}
              className="flex-shrink-0 px-3 py-2 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent text-xs font-medium whitespace-nowrap"
            >
              Upload new
            </button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Alt text (recommended)</label>
        <input
          type="text"
          value={block.alt ?? ""}
          onChange={(e) => handleChange({ alt: e.target.value })}
          className={INPUT_CLASS}
          placeholder="Describe the image"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Width</label>
          <StepperInput
            value={widthVal}
            onChange={(v) => handleChange({ width: v })}
            step={widthUnit === "%" ? 5 : 10}
            min={widthUnit === "%" ? 5 : 1}
            max={widthUnit === "%" ? 100 : undefined}
          />
        </div>
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Height</label>
          <StepperInput
            value={heightVal}
            onChange={(v) => handleChange({ height: v })}
            step={heightUnit === "%" ? 5 : 10}
            min={heightUnit === "%" ? 5 : 1}
            max={heightUnit === "%" ? 100 : undefined}
          />
        </div>
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
        <label className={LABEL_CLASS}>Link URL (optional)</label>
        <input
          type="url"
          value={block.link ?? ""}
          onChange={(e) => handleChange({ link: e.target.value })}
          className={INPUT_CLASS}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Caption (optional)</label>
        <input
          type="text"
          value={block.caption ?? ""}
          onChange={(e) => handleChange({ caption: e.target.value })}
          className={INPUT_CLASS}
          placeholder="Caption below image"
        />
      </div>
    </>
  );
}
