"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { INPUT_CLASS, LABEL_CLASS } from "./constants";

interface ButtonBlockPropertiesProps {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}

export function ButtonBlockProperties({ block, onUpdate }: ButtonBlockPropertiesProps) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);

  return (
    <>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Text</label>
        <input
          type="text"
          value={block.text ?? ""}
          onChange={(e) => handleChange({ text: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Link</label>
        <input
          type="url"
          value={block.link ?? ""}
          onChange={(e) => handleChange({ link: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Text Color</label>
          <input
            type="color"
            value={block.textColor ?? block.color ?? "#ffffff"}
            onChange={(e) =>
              handleChange({ textColor: e.target.value, color: e.target.value })
            }
            className="w-full h-8 bg-transparent border-none rounded cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Background</label>
          <input
            type="color"
            value={block.backgroundColor ?? "#D65A31"}
            onChange={(e) => handleChange({ backgroundColor: e.target.value })}
            className="w-full h-8 bg-transparent border-none rounded cursor-pointer"
          />
        </div>
      </div>
    </>
  );
}
