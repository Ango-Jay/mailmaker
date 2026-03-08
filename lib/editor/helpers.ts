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
