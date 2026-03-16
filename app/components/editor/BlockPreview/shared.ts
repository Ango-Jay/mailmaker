import type React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";

export function getAlign(block: MJMLBlock): "left" | "center" | "right" {
  return (block.align ?? block.textAlign ?? "center") as "left" | "center" | "right";
}

export function getColor(block: MJMLBlock): string {
  return block.textColor ?? block.color ?? "#333333";
}

export function getWrapperClass(
  align: "left" | "center" | "right",
  isSelected: boolean,
  className: string
): string {
  const alignClass =
    align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";
  return `block-preview ${alignClass} ${isSelected ? "ring-2 ring-[#D65A31] ring-offset-2 rounded" : ""} ${className}`.trim();
}

export function getTextBlockStyle(
  block: MJMLBlock,
  align: "left" | "center" | "right",
  color: string
): React.CSSProperties {
  const textStyle =
    block.textStyle ?? (block.size === "large" ? "h1" : block.size === "small" ? "h3" : "paragraph");
  const fontSize =
    textStyle === "h1"
      ? "1.75rem"
      : textStyle === "h2"
        ? "1.375rem"
        : textStyle === "h3"
          ? "1.125rem"
          : block.size === "large"
            ? "1.25rem"
            : block.size === "small"
              ? "0.875rem"
              : "1rem";
  const fontWeight = textStyle === "h1" || textStyle === "h2" || textStyle === "h3" ? 700 : undefined;
  const textDeco = [
    block.underline ? "underline" : "",
    block.strikethrough ? "line-through" : "",
  ].filter(Boolean).join(" ");
  return {
    color,
    fontSize,
    fontWeight: block.bold ? 700 : fontWeight,
    fontStyle: block.italic ? "italic" : undefined,
    textDecoration: textDeco || undefined,
    textTransform:
      block.textTransform && block.textTransform !== "none" ? block.textTransform : undefined,
    textAlign: align === "left" ? "left" : align === "right" ? "right" : "center",
  };
}
