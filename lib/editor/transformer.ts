import { MJElement } from "./types";

/**
 * Recursively converts our JSON element tree into a valid MJML string.
 */
export const jsonToMjml = (
  element: MJElement,
  activeElementId?: string | null,
): string => {
  const { type, attributes, content, children, id } = element;

  // Build attributes string: key="value"
  const attrString = attributes
    ? Object.entries(attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")
    : "";

  // Inject data-id for selection mapping
  const idAttr = `data-id="${id}"`;
  const isActive = id === activeElementId;
  const classAttr = isActive ? 'css-class="selected-element"' : "";

  // Combine all attributes
  const allAttrs = [attrString, idAttr, classAttr].filter(Boolean).join(" ");
  const finalAttrString = allAttrs ? ` ${allAttrs}` : "";

  // List of common self-closing MJML tags (not exhaustive, but covers most common ones)
  const selfClosingTags = [
    "mj-image",
    "mj-spacer",
    "mj-divider",
    "mj-raw",
    "mj-breakpoint",
    "mj-style",
    "mj-font",
    "mj-preview",
    "mj-title",
    "mj-attributes",
    "mj-all",
    "mj-class",
    "mj-group", // mj-group can be self-closing if empty, but usually has children
  ];

  const isSelfClosing =
    selfClosingTags.includes(type) &&
    !content &&
    (!children || children.length === 0);

  if (isSelfClosing) {
    return `<${type}${finalAttrString} />`;
  }

  const openingTag = `<${type}${finalAttrString}>`;
  const closingTag = `</${type}>`;

  // Base case: element with content but no children
  if (content !== undefined && (!children || children.length === 0)) {
    return `${openingTag}${content}${closingTag}`;
  }

  // Recursive case: element with children
  const childrenMjml =
    children?.map((child) => jsonToMjml(child, activeElementId)).join("\n") ||
    "";

  // If there's content AND children, we place content before children (though MJML usually prefers one or the other)
  return `${openingTag}
${content || ""}
${childrenMjml}
${closingTag}`;
};

/**
 * Wraps the MJML content in a standard boilerplate if needed.
 * This is useful for the final compilation step.
 */
export const wrapInMjmlBoilerplate = (bodyContent: string): string => {
  return `<mjml>
  <mj-body>
    ${bodyContent}
  </mj-body>
</mjml>`;
};
