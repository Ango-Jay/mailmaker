"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { LABEL_CLASS } from "./constants";
import { StepperInput } from "./StepperInput";

interface SpacerBlockPropertiesProps {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}

export function SpacerBlockProperties({ block, onUpdate }: SpacerBlockPropertiesProps) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);

  return (
    <div className="space-y-2">
      <label className={LABEL_CLASS}>Height</label>
      <StepperInput
        value={block.height ?? "20px"}
        onChange={(v) => handleChange({ height: v })}
        step={4}
        min={2}
      />
    </div>
  );
}
