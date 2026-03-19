import { create } from "zustand";

export type ContentAlignment = "left" | "center" | "right";

export interface LayoutState {
  /** e.g. "700px" */
  contentAreaWidth: string;
  contentAreaAlignment: ContentAlignment;

  /** page background */
  backgroundColor: string;
  /** background behind the content blocks (inside the content area) */
  contentAreaBackgroundColor: string;
  backgroundImageEnabled: boolean;

  defaultFontFamily: string;
  linkColor: string;

  language: string;

  setContentAreaWidth: (v: string) => void;
  setContentAreaAlignment: (v: ContentAlignment) => void;
  setBackgroundColor: (v: string) => void;
  setContentAreaBackgroundColor: (v: string) => void;
  setBackgroundImageEnabled: (v: boolean) => void;
  setDefaultFontFamily: (v: string) => void;
  setLinkColor: (v: string) => void;
  setLanguage: (v: string) => void;
}

const DEFAULT_CONTENT_WIDTH = "700px";

export const useLayoutStore = create<LayoutState>((set) => ({
  contentAreaWidth: DEFAULT_CONTENT_WIDTH,
  contentAreaAlignment: "center",

  backgroundColor: "#ffffff",
  contentAreaBackgroundColor: "transparent",
  backgroundImageEnabled: false,

  defaultFontFamily: "Inter, Arial, sans-serif",
  linkColor: "#7747ff",
  language: "English",

  setContentAreaWidth: (contentAreaWidth) => set({ contentAreaWidth }),
  setContentAreaAlignment: (contentAreaAlignment) => set({ contentAreaAlignment }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setContentAreaBackgroundColor: (contentAreaBackgroundColor) =>
    set({ contentAreaBackgroundColor }),
  setBackgroundImageEnabled: (backgroundImageEnabled) =>
    set({ backgroundImageEnabled }),
  setDefaultFontFamily: (defaultFontFamily) => set({ defaultFontFamily }),
  setLinkColor: (linkColor) => set({ linkColor }),
  setLanguage: (language) => set({ language }),
}));

