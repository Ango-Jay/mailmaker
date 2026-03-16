"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";

interface ButtonBlockPreviewProps {
  block: MJMLBlock;
  wrapperClass: string;
}

export function ButtonBlockPreview({ block, wrapperClass }: ButtonBlockPreviewProps) {
  return (
    <div className={`${wrapperClass} py-3`}>
      <span
        className="inline-block rounded-full px-6 py-2.5 text-sm font-semibold"
        style={{
          backgroundColor: block.backgroundColor ?? "#D65A31",
          color: block.textColor ?? block.color ?? "#ffffff",
        }}
      >
        {block.text ?? block.content ?? "Button"}
      </span>
    </div>
  );
}
