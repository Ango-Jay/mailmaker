"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";

interface SpacerBlockPreviewProps {
  block: MJMLBlock;
  wrapperClass: string;
}

export function SpacerBlockPreview({ block, wrapperClass }: SpacerBlockPreviewProps) {
  return (
    <div
      className={wrapperClass}
      style={{ height: block.height ?? "20px" }}
      aria-hidden
    />
  );
}
