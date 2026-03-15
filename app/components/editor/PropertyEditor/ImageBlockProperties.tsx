"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { INPUT_CLASS, LABEL_CLASS, parseValueWithUnit } from "./constants";
import { StepperInput } from "./StepperInput";

interface ImageBlockPropertiesProps {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}

export function ImageBlockProperties({ block, onUpdate }: ImageBlockPropertiesProps) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);
  const widthVal = block.width ?? "100%";
  const { unit } = parseValueWithUnit(widthVal);

  return (
    <>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Image URL</label>
        <input
          type="url"
          value={block.src ?? ""}
          onChange={(e) => handleChange({ src: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Alt text</label>
        <input
          type="text"
          value={block.alt ?? ""}
          onChange={(e) => handleChange({ alt: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Width</label>
        <StepperInput
          value={widthVal}
          onChange={(v) => handleChange({ width: v })}
          step={unit === "%" ? 5 : 10}
          min={unit === "%" ? 5 : 1}
          max={unit === "%" ? 100 : undefined}
        />
      </div>
    </>
  );
}
