"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";

interface FooterBlockPreviewProps {
  block: MJMLBlock;
  wrapperClass: string;
}

export function FooterBlockPreview({ block, wrapperClass }: FooterBlockPreviewProps) {
  return (
    <div className={`${wrapperClass} py-4 text-xs`} style={{ color: "#888" }}>
      {block.mutedText ??
        `© ${block.year ?? new Date().getFullYear()} ${block.brand ?? ""}`}
    </div>
  );
}
