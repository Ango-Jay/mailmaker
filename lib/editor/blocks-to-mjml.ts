import type { MJMLBlock } from "./block-types";
import { sanitizeHtmlBlock, sanitizeMjmlBlock } from "./helpers";
import type { LayoutState } from "./layout-store";

const SECTION_TAG = "mj-section";
const COLUMN_TAG = "mj-column";

function attr(key: string, value: string | number | boolean | undefined): string {
  if (value === undefined || value === "") return "";
  return `${key}="${String(value).replace(/"/g, "&quot;")}"`;
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

/** Half of a px gap for inter-column padding (fallback 8px). */
function halfGapPx(gap: string): string {
  const m = gap.trim().match(/^(\d+(?:\.\d+)?)\s*px$/i);
  if (m) {
    const v = parseFloat(m[1]) / 2;
    const s = Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/, "");
    return `${s}px`;
  }
  return "8px";
}

/** MJML mj-column padding: top right bottom left — gutter between columns. */
function mjColumnGutterPadding(n: number, index: number, half: string): string {
  if (n <= 1) return "";
  if (index === 0) return ` padding="0 ${half} 0 0"`;
  if (index === n - 1) return ` padding="0 0 0 ${half}"`;
  return ` padding="0 ${half} 0 ${half}"`;
}

function columnWidthPercent(n: number): string {
  if (n === 1) return "100%";
  if (n === 2) return "50%";
  if (n === 3) return "33.333333%";
  return "25%";
}

/**
 * mj-text only (for use inside mj-column, including nested columns children).
 */
export function textBlockToMjmlInner(
  block: MJMLBlock,
  opts?: { dataId?: string },
): string {
  const align = block.align ?? block.textAlign ?? "center";
  const color = block.textColor ?? block.color ?? "#333333";
  const rawContent = (block.content ?? block.text ?? "").trim();
  const listType = block.listType ?? "none";
  const items = (block.listItems ?? []).map((s) => s.trim()).filter(Boolean);
  const itemsFromContent = rawContent.split(/\n/).map((s) => s.trim()).filter(Boolean);

  const textStyle =
    block.textStyle ??
    (block.size === "large" ? "h1" : block.size === "small" ? "h3" : "paragraph");
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
  const fontWeight =
    textStyle === "h1" || textStyle === "h2" || textStyle === "h3" ? "bold" : undefined;
  const textDeco = [
    block.underline ? "underline" : "",
    block.strikethrough ? "line-through" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const style = [
    block.bold ? "font-weight: bold" : fontWeight ? `font-weight: ${fontWeight}` : "",
    block.italic ? "font-style: italic" : "",
    textDeco ? `text-decoration: ${textDeco}` : "",
    block.textTransform && block.textTransform !== "none"
      ? `text-transform: ${block.textTransform}`
      : "",
  ]
    .filter(Boolean)
    .join("; ");
  const mjTextAttrs = [
    attr("align", align),
    attr("color", color),
    attr("font-size", fontSize),
    style ? ` style="${style}"` : "",
    opts?.dataId ? attr("data-id", opts.dataId) : "",
  ]
    .filter(Boolean)
    .join(" ");

  const textTransformStyle =
    block.textTransform && block.textTransform !== "none"
      ? `text-transform: ${block.textTransform}`
      : "";
  const listItems = items.length > 0 ? items : itemsFromContent;
  let inner: string;
  if (listType === "bullet" && listItems.length > 0) {
    const ulStyle = ["margin:0", "padding-left: 20px", textTransformStyle]
      .filter(Boolean)
      .join("; ");
    inner = `<ul style="${ulStyle}">${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  } else if (listType === "numbered" && listItems.length > 0) {
    const olStyle = ["margin:0", "padding-left: 20px", textTransformStyle]
      .filter(Boolean)
      .join("; ");
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

  return `<mj-text${mjTextAttrs ? " " : ""}${mjTextAttrs}>${inner}</mj-text>`;
}

export function buttonBlockToMjmlInner(
  block: MJMLBlock,
  opts?: { dataId?: string },
): string {
  const text = block.text ?? block.content ?? "Button";
  const href = block.link ?? "#";
  const bg = block.backgroundColor ?? "#D65A31";
  const btnColor = block.textColor ?? block.color ?? "#ffffff";
  const btnAlign = block.align ?? block.textAlign ?? "center";
  const fontSize = block.fontSize ?? "16px";
  const fontWeight = block.bold ? "bold" : "normal";
  const borderRadius = block.borderRadius ?? "8px";
  const width = block.width ?? "";
  const height = block.height ?? "";
  const btnAttrs = [
    opts?.dataId ? attr("data-id", opts.dataId) : "",
    `href="${escapeAttr(href)}"`,
    `background-color="${escapeAttr(bg)}"`,
    `color="${escapeAttr(btnColor)}"`,
    `align="${escapeAttr(btnAlign)}"`,
    `font-size="${escapeAttr(fontSize)}"`,
    `font-weight="${escapeAttr(fontWeight)}"`,
    borderRadius ? `border-radius="${escapeAttr(borderRadius)}"` : "",
    width ? `width="${escapeAttr(width)}"` : "",
    height ? `height="${escapeAttr(height)}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<mj-button ${btnAttrs}>${escapeHtml(text)}</mj-button>`;
}

export function imageBlockToMjmlInner(
  block: MJMLBlock,
  opts?: { dataId?: string },
): string {
  const src = block.src ?? "";
  const alt = block.alt ?? "";
  const width = block.width ?? "100%";
  const height = block.height ?? "";
  const href = block.link ?? "";
  const imgAlign = block.align ?? block.textAlign ?? "center";
  const borderRad = block.borderRadius ?? "";
  const caption = block.caption ?? "";
  const mjImgAttrs = [
    opts?.dataId ? attr("data-id", opts.dataId) : "",
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
  return `<mj-image ${mjImgAttrs} />${captionMj}`;
}

function columnChildToMjmlInner(child: MJMLBlock): string {
  switch (child.type) {
    case "text":
      return textBlockToMjmlInner(child, { dataId: child.id });
    case "button":
      return buttonBlockToMjmlInner(child, { dataId: child.id });
    case "image":
      return imageBlockToMjmlInner(child, { dataId: child.id });
    default:
      return "";
  }
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
      const sectionBg = block.backgroundColor
        ? ` background-color="${escapeAttr(block.backgroundColor)}"`
        : "";
      const sectionAttrs = [baseAttrs, sectionBg].filter(Boolean).join("");
      return `<${SECTION_TAG}${sectionAttrs ? " " : ""}${sectionAttrs}>
  <${COLUMN_TAG}>
    ${textBlockToMjmlInner(block)}
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "button": {
      const sectionAttrs = baseAttrs ? ` ${baseAttrs}` : "";
      return `<${SECTION_TAG}${sectionAttrs}>
  <${COLUMN_TAG}>
    ${buttonBlockToMjmlInner(block)}
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "html": {
      const html = sanitizeHtmlBlock(block.content ?? "");
      const sectionAttrsHtml = baseAttrs ? ` ${baseAttrs}` : "";
      return `<${SECTION_TAG}${sectionAttrsHtml}>
  <${COLUMN_TAG}>
    <mj-raw>${html}</mj-raw>
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "mjml": {
      const mjml = sanitizeMjmlBlock(block.content ?? "");
      const sectionAttrsMjml = baseAttrs ? ` ${baseAttrs}` : "";
      return `<${SECTION_TAG}${sectionAttrsMjml}>
  <${COLUMN_TAG}>
    ${mjml}
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "image": {
      const sectionAttrs = baseAttrs ? ` ${baseAttrs}` : "";
      return `<${SECTION_TAG}${sectionAttrs}>
  <${COLUMN_TAG}>
    ${imageBlockToMjmlInner(block)}
  </${COLUMN_TAG}>
</${SECTION_TAG}>`;
    }

    case "columns": {
      const n = (block.columnCount ?? 1) as 1 | 2 | 3 | 4;
      const gap = block.columnGap ?? "16px";
      const half = halfGapPx(gap);
      const slotsRaw = [...(block.columnSlots ?? [])];
      while (slotsRaw.length < n) {
        slotsRaw.push({ id: `column-${slotsRaw.length}`, blocks: [] });
      }
      const slots = slotsRaw.slice(0, n);
      const w = columnWidthPercent(n);
      const sectionAttrs = baseAttrs ? ` ${baseAttrs}` : "";
      const cols = slots
        .map((slot, i) => {
          const padAttr = mjColumnGutterPadding(n, i, half);
          const inner =
            slot.blocks.map(columnChildToMjmlInner).filter(Boolean).join("\n    ") ||
            "<mj-text>&#160;</mj-text>";
          return `  <${COLUMN_TAG} width="${w}"${padAttr}>
    ${inner}
  </${COLUMN_TAG}>`;
        })
        .join("\n");
      return `<${SECTION_TAG}${sectionAttrs}>
${cols}
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

    case "divider": {
      const divHeight = block.height ?? "2px";
      const divColor = block.backgroundColor ?? block.color ?? "#e5e5e5";
      const sectionAttrs = baseAttrs ? ` ${baseAttrs}` : "";
      return `<${SECTION_TAG}${sectionAttrs}>
  <${COLUMN_TAG}>
    <mj-divider border-color="${escapeAttr(divColor)}" border-width="${escapeAttr(divHeight)}" />
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

const SELECTED_STYLE = `
      .selected-element { outline: 2px solid #D65A31 !important; outline-offset: -2px; cursor: pointer; }
      * { cursor: default; }
      mj-text, mj-button, mj-image { cursor: pointer; }
`;

function mjmlHead(layout: LayoutState, includeSelectedStyle: boolean): string {
  const selectedCss = includeSelectedStyle ? SELECTED_STYLE : "";
  const fontFamily = escapeAttr(layout.defaultFontFamily);
  const linkColor = escapeAttr(layout.linkColor);

  return `<mj-head>
    <mj-style>
${selectedCss}a { color: ${linkColor} !important; }
    </mj-style>
    <mj-attributes>
      <mj-all font-family="${fontFamily}" />
    </mj-attributes>
  </mj-head>`;
}

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
  layout?: LayoutState,
): string {
  const resolvedLayout: LayoutState = layout ?? {
    contentAreaWidth: "600px",
    contentAreaAlignment: "center",
    backgroundColor: "#ffffff",
    contentAreaBackgroundColor: "transparent",
    backgroundImageEnabled: false,
    defaultFontFamily: "Inter, Arial, sans-serif",
    linkColor: "#7747ff",
    language: "English",
    setContentAreaWidth: (_v: string) => {},
    setContentAreaAlignment: (_v: LayoutState["contentAreaAlignment"]) => {},
    setBackgroundColor: (_v: string) => {},
    setContentAreaBackgroundColor: (_v: string) => {},
    setBackgroundImageEnabled: (_v: boolean) => {},
    setDefaultFontFamily: (_v: string) => {},
    setLinkColor: (_v: string) => {},
    setLanguage: (_v: string) => {},
  };

  const bodyContent = blocks
    .map((block) => blockToMjmlFragment(block, activeBlockId ?? null))
    .join("\n");

  const head = mjmlHead(resolvedLayout, activeBlockId !== undefined);
  const mjBodyBg = resolvedLayout.backgroundColor;
  const mjWrapperBg = resolvedLayout.contentAreaBackgroundColor;
  const textAlign = resolvedLayout.contentAreaAlignment;

  return `<mjml>
${head}
  <mj-body width="${escapeAttr(resolvedLayout.contentAreaWidth)}" padding="0" background-color="${escapeAttr(mjBodyBg)}">
    <mj-wrapper text-align="${escapeAttr(textAlign)}" background-color="${escapeAttr(mjWrapperBg)}">
      ${bodyContent || "<mj-section><mj-column><mj-text>Add blocks to get started.</mj-text></mj-column></mj-section>"}
    </mj-wrapper>
  </mj-body>
</mjml>`;
}
