"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { INPUT_CLASS, LABEL_CLASS } from "./constants";

interface FooterBlockPropertiesProps {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}

export function FooterBlockProperties({ block, onUpdate }: FooterBlockPropertiesProps) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);

  return (
    <>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Brand</label>
        <input
          type="text"
          value={block.brand ?? ""}
          onChange={(e) => handleChange({ brand: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Year</label>
        <input
          type="text"
          value={block.year ?? ""}
          onChange={(e) => handleChange({ year: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Muted text</label>
        <textarea
          value={block.mutedText ?? ""}
          onChange={(e) => handleChange({ mutedText: e.target.value })}
          className={`${INPUT_CLASS} min-h-[60px]`}
        />
      </div>
    </>
  );
}
