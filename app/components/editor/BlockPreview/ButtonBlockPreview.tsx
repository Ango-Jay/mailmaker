"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";

interface ButtonBlockPreviewProps {
  block: MJMLBlock;
  wrapperClass: string;
}

export function ButtonBlockPreview({ block, wrapperClass }: ButtonBlockPreviewProps) {
  const label = block.text ?? block.content ?? "Button";
  const href = block.link ?? "#";
  const bg = block.backgroundColor ?? "#D65A31";
  const color = block.textColor ?? block.color ?? "#ffffff";
  const fontSize = block.fontSize ?? "16px";
  const fontWeight = block.bold ? "bold" : "normal";
  const borderRadius = block.borderRadius ?? "8px";
  const width = block.width;
  const height = block.height;

  const style: React.CSSProperties = {
    backgroundColor: bg,
    color,
    fontSize,
    fontWeight,
    borderRadius,
    width: width ?? "fit-content",
    ...(height && { minHeight: height }),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.625rem 1.5rem",
  };

  const button = <span style={style}>{label}</span>;

  return (
    <div className={`${wrapperClass} py-3 w-full`}>
      {href ? (
        <a
          href={href}
          onClick={(e) => e.preventDefault()}
          className="block w-full no-underline"
          style={{ cursor: "default" }}
        >
          {button}
        </a>
      ) : (
        button
      )}
    </div>
  );
}
