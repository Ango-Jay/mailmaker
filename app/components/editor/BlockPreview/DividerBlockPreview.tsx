"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";

interface DividerBlockPreviewProps {
  block: MJMLBlock;
  wrapperClass: string;
}

export function DividerBlockPreview({ block, wrapperClass }: DividerBlockPreviewProps) {
  const height = block.height ?? "2px";
  const color = block.backgroundColor ?? block.color ?? "#e5e5e5";

  return (
    <div
      className={wrapperClass}
      style={{
        height,
        backgroundColor: color,
        width: "100%",
      }}
      aria-hidden
    />
  );
}
