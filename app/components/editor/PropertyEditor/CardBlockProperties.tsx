"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { INPUT_CLASS, LABEL_CLASS } from "./constants";
import { ColorPicker } from "@/app/components/ui/ColorPicker";

interface CardBlockPropertiesProps {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}

export function CardBlockProperties({ block, onUpdate }: CardBlockPropertiesProps) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);

  return (
    <>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Variant</label>
        <select
          value={block.variant ?? "default"}
          onChange={(e) =>
            handleChange({
              variant: e.target.value as MJMLBlock["variant"],
            })
          }
          className={INPUT_CLASS}
        >
          {(["default", "minimal", "feature", "pricing", "product"] as const).map(
            (v) => (
              <option key={v} value={v}>
                {v}
              </option>
            )
          )}
        </select>
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Title</label>
        <input
          type="text"
          value={block.title ?? ""}
          onChange={(e) => handleChange({ title: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Subtitle</label>
        <input
          type="text"
          value={block.subtitle ?? ""}
          onChange={(e) => handleChange({ subtitle: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Description</label>
        <textarea
          value={block.description ?? ""}
          onChange={(e) => handleChange({ description: e.target.value })}
          className={`${INPUT_CLASS} min-h-[60px]`}
        />
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Button text</label>
        <input
          type="text"
          value={block.ctaText ?? ""}
          onChange={(e) => handleChange({ ctaText: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Button link</label>
        <input
          type="url"
          value={block.link ?? ""}
          onChange={(e) => handleChange({ link: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>
      <div className="space-y-3">
        <ColorPicker
          label="Background"
          value={block.backgroundColor ?? "#ffffff"}
          onChange={(v) => handleChange({ backgroundColor: v })}
          id="card-block-bg-color"
        />
        <ColorPicker
          label="Text color"
          value={block.textColor ?? block.color ?? "#333333"}
          onChange={(v) => handleChange({ textColor: v, color: v })}
          id="card-block-text-color"
        />
      </div>
    </>
  );
}
