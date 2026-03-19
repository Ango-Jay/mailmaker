"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { INPUT_CLASS, LABEL_CLASS, SECTION_HEADER_CLASS } from "./constants";

interface HtmlBlockPropertiesProps {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}

export function HtmlBlockProperties({ block, onUpdate }: HtmlBlockPropertiesProps) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);

  return (
    <>
      <h4 className={SECTION_HEADER_CLASS}>Main</h4>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>HTML</label>
        <textarea
          value={block.content ?? ""}
          onChange={(e) => handleChange({ content: e.target.value })}
          className={`${INPUT_CLASS} min-h-[220px] font-mono text-[11px]`}
          placeholder="Paste your HTML here"
          spellCheck={false}
        />
      </div>

      <h4 className={SECTION_HEADER_CLASS}>Others</h4>
      <p className="text-[10px] text-text-light/50 leading-relaxed">
        Custom HTML is sanitized and converted for email. Scripts and unsafe features are
        removed. Email client support may vary.
      </p>
    </>
  );
}

