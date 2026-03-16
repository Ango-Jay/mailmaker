"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { LABEL_CLASS } from "./constants";
import { StepperInput } from "./StepperInput";
import { ColorPicker } from "@/app/components/ui/ColorPicker";

interface DividerBlockPropertiesProps {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}

export function DividerBlockProperties({ block, onUpdate }: DividerBlockPropertiesProps) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Height</label>
        <StepperInput
          value={block.height ?? "2px"}
          onChange={(v) => handleChange({ height: v })}
          step={1}
          min={1}
        />
      </div>
      <ColorPicker
        label="Color"
        value={block.backgroundColor ?? block.color ?? "#e5e5e5"}
        onChange={(v) => handleChange({ backgroundColor: v, color: v })}
        id="divider-block-color"
      />
    </div>
  );
}
