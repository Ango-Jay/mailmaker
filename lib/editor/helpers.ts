import { MJElement } from "./types";

/**
 * Recursively finds an element in the MJML element tree by its ID.
 */
export const findElementById = (
  element: MJElement,
  id: string,
): MJElement | null => {
  if (element.id === id) return element;
  if (element.children) {
    for (const child of element.children) {
      const found = findElementById(child, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * High-level sanitizer for HTML blocks.
 * - strips <script> tags
 * - strips on* event handlers
 * - keeps only safe url schemes in href/src
 *
 * NOTE: This is intentionally conservative and can be
 * extended to do CSS inlining later.
 */
export function sanitizeHtmlBlock(input: string): string {
  if (!input) return "";

  // If the user pasted a full document, prefer using only the <body> content.
  // This prevents nested <head>/<body> tags inside our email markup context.
  let out = input;
  out = out.replace(/<!doctype[\s\S]*?>/gi, "");

  const bodyMatch = out.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch?.[1]) {
    out = bodyMatch[1];
  } else {
    // Strip common outer wrappers if no explicit body exists.
    out = out.replace(/<\/?(html|head|body)[^>]*>/gi, "");
  }

  // Remove script tags completely
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Remove on*="..." style event handlers
  out = out.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "");

  // Sanitize href/src javascript: urls
  out = out.replace(
    /(href|src)\s*=\s*"javascript:[^"]*"/gi,
    (m) => m.replace(/"javascript:[^"]*"/i, '"#"'),
  );
  out = out.replace(
    /(href|src)\s*=\s*'javascript:[^']*'/gi,
    (m) => m.replace(/'javascript:[^']*'/i, "'#'"),
  );

  // Basic size cap (defensive)
  const MAX_LEN = 30000;
  if (out.length > MAX_LEN) {
    return out.slice(0, MAX_LEN);
  }

  return out;
}

/**
 * Conservative sanitizer for user-pasted MJML.
 * We strip obvious script blocks and cap size to avoid editor/export blowups.
 */
export function sanitizeMjmlBlock(input: string): string {
  if (!input) return "";

  let out = input.replace(/<script[\s\S]*?<\/script>/gi, "");
  // Also remove <style> to keep user control limited (email compatibility)
  out = out.replace(/<style[\s\S]*?<\/style>/gi, "");

  const MAX_LEN = 30000;
  if (out.length > MAX_LEN) return out.slice(0, MAX_LEN);

  return out.trim();
}
