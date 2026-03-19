"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { INPUT_CLASS, LABEL_CLASS, SECTION_HEADER_CLASS } from "./constants";

interface MjmlBlockPropertiesProps {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}

export function MjmlBlockProperties({
  block,
  onUpdate,
}: MjmlBlockPropertiesProps) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);

  return (
    <>
      <h4 className={SECTION_HEADER_CLASS}>Main</h4>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>MJML</label>
        <textarea
          value={block.content ?? ""}
          onChange={(e) => handleChange({ content: e.target.value })}
          className={`${INPUT_CLASS} min-h-[220px] font-mono text-[11px]`}
          placeholder="Paste MJML here"
          spellCheck={false}
        />
      </div>

      <h4 className={SECTION_HEADER_CLASS}>Others</h4>
      <p className="text-[10px] text-text-light/50 leading-relaxed">
        Custom MJML is sanitized lightly (scripts/styles removed). You are
        responsible for producing valid MJML.
      </p>
    </>
  );
}
