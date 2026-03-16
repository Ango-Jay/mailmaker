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

  switch (block.type) {
    case "text": {
      const rawContent = (block.content ?? block.text ?? "").trim();
      const listType = block.listType ?? "none";
      const items = (block.listItems ?? []).map((s) => s.trim()).filter(Boolean);
      const itemsFromContent = rawContent.split(/\n/).map((s) => s.trim()).filter(Boolean);

      const textStyle = block.textStyle ?? (block.size === "large" ? "h1" : block.size === "small" ? "h3" : "paragraph");
      const fontSize =
        textStyle === "h1"
          ? "28px"
          : textStyle === "h2"
            ? "22px"
            : textStyle === "h3"
              ? "18px"
              : block.size === "large"
                ? "24px"
                : block.size === "small"
                  ? "14px"
                  : "16px";
      const fontWeight = textStyle === "h1" || textStyle === "h2" || textStyle === "h3" ? "bold" : undefined;
      const textDeco = [
        block.underline ? "underline" : "",
        block.strikethrough ? "line-through" : "",
      ].filter(Boolean).join(" ");
      const style = [
        block.bold ? "font-weight: bold" : fontWeight ? `font-weight: ${fontWeight}` : "",
        block.italic ? "font-style: italic" : "",
        textDeco ? `text-decoration: ${textDeco}` : "",
        block.textTransform && block.textTransform !== "none" ? `text-transform: ${block.textTransform}` : "",
      ].filter(Boolean).join("; ");
      const mjTextAttrs = [
        attr("align", align),
        attr("color", color),
        attr("font-size", fontSize),
        style ? ` style="${style}"` : "",
      ].filter(Boolean).join(" ");

      const textTransformStyle =
        block.textTransform && block.textTransform !== "none"
          ? `text-transform: ${block.textTransform}`
          : "";
      const listItems = items.length > 0 ? items : itemsFromContent;
      let inner: string;
      if (listType === "bullet" && listItems.length > 0) {
        const ulStyle = ["margin:0", "padding-left: 20px", textTransformStyle].filter(Boolean).join("; ");
        inner = `<ul style="${ulStyle}">${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
      } else if (listType === "numbered" && listItems.length > 0) {
        const olStyle = ["margin:0", "padding-left: 20px", textTransformStyle].filter(Boolean).join("; ");
        inner = `<ol style="${olStyle}">${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
      } else {
        const paraContent =
          rawContent
            .split(/\n/)
            .map((line) => escapeHtml(line))
            .join("<br/>") || "&#160;";
        inner = textTransformStyle
          ? `<span style="${textTransformStyle}">${paraContent}</span>`
          : paraContent;
      }

      const sectionBg = block.backgroundColor ? ` background-color="${escapeAttr(block.backgroundColor)}"` : "";
      const sectionAttrs = [baseAttrs, sectionBg].filter(Boolean).join("");
      return `<${SECTION_TAG}${sectionAttrs ? " " : ""}${sectionAttrs}>
  <${COLUMN_TAG}>
    <mj-text${mjTextAttrs ? " " : ""}${mjTextAttrs}>${inner}</mj-text>
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "button": {
      const text = block.text ?? block.content ?? "Button";
      const href = block.link ?? "#";
      const bg = block.backgroundColor ?? "#D65A31";
      const btnColor = block.textColor ?? block.color ?? "#ffffff";
      const sectionAttrs = baseAttrs ? ` ${baseAttrs}` : "";
      return `<${SECTION_TAG}${sectionAttrs}>
  <${COLUMN_TAG}>
    <mj-button href="${escapeAttr(href)}" background-color="${escapeAttr(bg)}" color="${escapeAttr(btnColor)}" align="${align}">${escapeHtml(text)}</mj-button>
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "image": {
      const src = block.src ?? "";
      const alt = block.alt ?? "";
      const width = block.width ?? "100%";
      const height = block.height ?? "";
      const href = block.link ?? "";
      const imgAlign = block.align ?? block.textAlign ?? "center";
      const borderRad = block.borderRadius ?? "";
      const caption = block.caption ?? "";
      const sectionAttrs = baseAttrs ? ` ${baseAttrs}` : "";
      const mjImgAttrs = [
        `src="${escapeAttr(src)}"`,
        `alt="${escapeAttr(alt)}"`,
        `width="${escapeAttr(width)}"`,
        height ? `height="${escapeAttr(height)}"` : "",
        href ? `href="${escapeAttr(href)}"` : "",
        imgAlign ? `align="${escapeAttr(imgAlign)}"` : "",
        borderRad ? `border-radius="${escapeAttr(borderRad)}"` : "",
      ]
        .filter(Boolean)
        .join(" ");
      const captionMj =
        caption
          ? `\n    <mj-text align="${escapeAttr(imgAlign)}" font-size="12px" color="#888888" padding-top="8px">${escapeHtml(caption)}</mj-text>`
          : "";
      return `<${SECTION_TAG}${sectionAttrs}>
  <${COLUMN_TAG}>
    <mj-image ${mjImgAttrs} />${captionMj}
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "spacer": {
      const height = block.height ?? "20px";
      const sectionAttrs = baseAttrs ? ` ${baseAttrs}` : "";
      return `<${SECTION_TAG}${sectionAttrs}>
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
      const sectionAttrs = baseAttrs ? ` ${baseAttrs}` : "";
      return `<${SECTION_TAG}${sectionAttrs}>
  <${COLUMN_TAG}>
    <mj-text align="${align}" font-size="20px" font-weight="bold" color="${escapeAttr(color)}">${escapeHtml(title)}</mj-text>
    <mj-text align="${align}" color="${escapeAttr(color)}" font-size="14px">${escapeHtml(desc)}</mj-text>
    <mj-button href="${escapeAttr(ctaHref)}" align="${align}">${escapeHtml(cta)}</mj-button>
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "footer": {
      const brand = block.brand ?? "";
      const year = block.year ?? new Date().getFullYear();
      const muted = block.mutedText ?? `© ${year} ${brand}. All rights reserved.`;
      const sectionAttrs = baseAttrs ? ` ${baseAttrs}` : "";
      return `<${SECTION_TAG}${sectionAttrs}>
  <${COLUMN_TAG}>
    <mj-text align="center" font-size="12px" color="#888888">${escapeHtml(muted)}</mj-text>
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    default: {
      const sectionAttrs = baseAttrs ? ` ${baseAttrs}` : "";
      return `<${SECTION_TAG}${sectionAttrs}>
  <${COLUMN_TAG}>
    <mj-text align="${align}">${escapeHtml(String((block as MJMLBlock).content ?? ""))}</mj-text>
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }
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
 *
 * This MJML is used only for the GENERATED OUTPUT (email-friendly HTML):
 * compile with mjml2html() to get the final HTML for export / sending.
 * The editor PREVIEW is rendered separately (BlockPreview React components),
 * not from this compiled HTML.
 *
 * @param blocks - Array of blocks from the template store
 * @param activeBlockId - Optional; when provided, the active block gets the selected-element class (e.g. if preview were ever rendered from this MJML)
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
  <mj-body width="600px" padding="0">
    ${bodyContent || "<mj-section><mj-column><mj-text>Add blocks to get started.</mj-text></mj-column></mj-section>"}
  </mj-body>
</mjml>`;
}
