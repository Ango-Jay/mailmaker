import type { MJMLBlock } from "./block-types";

const SECTION_TAG = "mj-section";
const COLUMN_TAG = "mj-column";

function attr(key: string, value: string | number | boolean | undefined): string {
  if (value === undefined || value === "") return "";
  return `${key}="${String(value).replace(/"/g, "&quot;")}"`;
}

/**
 * Renders one block as an MJML fragment (mj-section > mj-column > content).
 * Includes data-id and optional selected-element class for preview.
 */
function blockToMjmlFragment(
  block: MJMLBlock,
  activeBlockId: string | null,
): string {
  const id = block.id;
  const isActive = id === activeBlockId;
  const dataId = attr("data-id", id);
  const classAttr = isActive ? ' css-class="selected-element"' : "";
  const baseAttrs = dataId + classAttr;

  const align = block.align ?? block.textAlign ?? "center";
  const color = block.textColor ?? block.color ?? "#333333";
  const fontSize =
    block.size === "large"
      ? "24px"
      : block.size === "small"
        ? "14px"
        : "18px";

  switch (block.type) {
    case "text": {
      const text = block.content ?? block.text ?? "";
      const style = [
        block.bold ? "font-weight: bold" : "",
        block.italic ? "font-style: italic" : "",
        block.underline ? "text-decoration: underline" : "",
        block.textTransform && block.textTransform !== "none" ? `text-transform: ${block.textTransform}` : "",
      ].filter(Boolean).join("; ");
      const mjTextAttrs = [
        attr("align", align),
        attr("color", color),
        attr("font-size", fontSize),
        style ? ` style="${style}"` : "",
      ].filter(Boolean).join(" ");
      return `<${SECTION_TAG}${baseAttrs}>
  <${COLUMN_TAG}>
    <mj-text${mjTextAttrs}>${escapeHtml(text)}</mj-text>
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "button": {
      const text = block.text ?? block.content ?? "Button";
      const href = block.link ?? "#";
      const bg = block.backgroundColor ?? "#D65A31";
      const btnColor = block.textColor ?? block.color ?? "#ffffff";
      return `<${SECTION_TAG}${baseAttrs}>
  <${COLUMN_TAG}>
    <mj-button href="${escapeAttr(href)}" background-color="${bg}" color="${btnColor}" align="${align}">${escapeHtml(text)}</mj-button>
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "image": {
      const src = block.src ?? "";
      const alt = block.alt ?? "";
      const width = block.width ?? "100%";
      return `<${SECTION_TAG}${baseAttrs}>
  <${COLUMN_TAG}>
    <mj-image src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" width="${escapeAttr(width)}" />
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "spacer": {
      const height = block.height ?? "20px";
      return `<${SECTION_TAG}${baseAttrs}>
  <${COLUMN_TAG}>
    <mj-spacer height="${escapeAttr(height)}" />
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "card": {
      const title = block.title ?? "";
      const desc = block.description ?? block.content ?? "";
      const cta = block.ctaText ?? "Learn more";
      const ctaHref = block.link ?? "#";
      return `<${SECTION_TAG}${baseAttrs}>
  <${COLUMN_TAG}>
    <mj-text align="${align}" font-size="20px" font-weight="bold" color="${color}">${escapeHtml(title)}</mj-text>
    <mj-text align="${align}" color="${color}" font-size="14px">${escapeHtml(desc)}</mj-text>
    <mj-button href="${escapeAttr(ctaHref)}" align="${align}">${escapeHtml(cta)}</mj-button>
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "footer": {
      const brand = block.brand ?? "";
      const year = block.year ?? new Date().getFullYear();
      const muted = block.mutedText ?? `© ${year} ${brand}. All rights reserved.`;
      return `<${SECTION_TAG}${baseAttrs}>
  <${COLUMN_TAG}>
    <mj-text align="center" font-size="12px" color="#888888">${escapeHtml(muted)}</mj-text>
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    default:
      return `<${SECTION_TAG}${baseAttrs}>
  <${COLUMN_TAG}>
    <mj-text align="${align}">${escapeHtml(String((block as MJMLBlock).content ?? ""))}</mj-text>
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

const MJML_HEAD = `
  <mj-head>
    <mj-style>
      .selected-element { outline: 2px solid #D65A31 !important; outline-offset: -2px; cursor: pointer; }
      * { cursor: default; }
      mj-text, mj-button, mj-image { cursor: pointer; }
    </mj-style>
  </mj-head>`;

/**
 * Converts the template blocks array into a full MJML document.
 * This is the single source for both representations of the template:
 *
 * - Preview: pass activeBlockId and compile result with mjml2html() for canvas HTML.
 * - Generated: call without activeBlockId (or with) for final MJML export.
 *
 * @param blocks - Array of blocks from the template store
 * @param activeBlockId - Optional; when provided, the active block gets the selected-element class for preview
 */
export function blocksToGeneratedMjml(
  blocks: MJMLBlock[],
  activeBlockId?: string | null,
): string {
  const bodyContent = blocks
    .map((block) => blockToMjmlFragment(block, activeBlockId ?? null))
    .join("\n");

  return `<mjml>
${activeBlockId !== undefined ? MJML_HEAD : ""}
  <mj-body>
    ${bodyContent || "<mj-section><mj-column><mj-text>Add blocks to get started.</mj-text></mj-column></mj-section>"}
  </mj-body>
</mjml>`;
}
