export type MJType =
  | "mjml"
  | "mj-head"
  | "mj-body"
  | "mj-section"
  | "mj-column"
  | "mj-text"
  | "mj-image"
  | "mj-button"
  | "mj-spacer"
  | "mj-divider"
  | "mj-group"
  | "mj-hero"
  | "mj-navbar"
  | "mj-raw"
  | "mj-include"
  | "mj-wrapper";

export interface MJElement {
  id: string;
  type: MJType;
  attributes?: Record<string, string>;
  content?: string;
  children?: MJElement[];
}

export interface EditorState {
  template: MJElement;
  activeElementId: string | null;
  setTemplate: (template: MJElement) => void;
  setActiveElementId: (id: string | null) => void;
  updateElementAttributes: (
    id: string,
    attributes: Record<string, string>,
  ) => void;
  updateElementContent: (id: string, content: string) => void;
  addElement: (parentId: string, element: MJElement) => void;
  removeElement: (id: string) => void;
}
