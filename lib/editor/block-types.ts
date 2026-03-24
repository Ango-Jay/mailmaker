/**
 * Block types for the email template editor.
 * Blocks are the building units of a template: basic blocks (text, button, etc.)
 * and prebuilt cards. The template is an array of these blocks.
 */

export type BlockType =
  | "text"
  | "button"
  | "image"
  | "columns"
  | "card"
  | "footer"
  | "spacer"
  | "divider"
  | "html"
  | "mjml";

/** Allowed nested block types inside a columns block. */
export type ColumnChildBlockType = "text" | "image" | "button";

export interface ColumnSlot {
  id: string;
  blocks: MJMLBlock[];
}

export type CardVariant =
  | "default"
  | "minimal"
  | "feature"
  | "pricing"
  | "product";

export type FooterVariant = "minimal" | "full" | "legal" | "social";

export type SocialStyle = "icon" | "text" | "icon-text";

export interface SocialLink {
  url: string;
  label?: string;
  icon?: string;
}

export interface MJMLBlock {
  id: string;
  type: BlockType;

  /* shared */
  content?: string;
  text?: string;
  color?: string;
  textColor?: string;
  link?: string;
  size?: "large" | "medium" | "small";
  src?: string;
  alt?: string;
  borderRadius?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundOverlay?: number;
  imageOverlay?: number;
  align?: "left" | "center" | "right";
  textAlign?: "left" | "center" | "right";
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  /** Font size (e.g. "14px", "16px") – used by button and others */
  fontSize?: string;

  /* text block: semantic style and list */
  textStyle?: "h1" | "h2" | "h3" | "paragraph";
  listType?: "none" | "bullet" | "numbered";
  listItems?: string[];

  /* card-only (locked layout) */
  variant?: CardVariant;
  title?: string;
  subtitle?: string;
  description?: string;
  price?: string;
  badge?: string;
  ctaText?: string;

  /* image block: optional caption below image */
  caption?: string;

  /* footer-only */
  footerVariant?: FooterVariant;
  brand?: string;
  year?: string;
  address?: string;
  legal?: {
    termsUrl?: string;
    privacyPolicyURL?: string;
    unsubscribeUrl?: string;
    preferencesUrl?: string;
  };
  socials?: SocialLink[];
  mutedText?: string;

  /* lock */
  locked?: boolean;
  socialStyle?: SocialStyle;
  renderAsHtml?: boolean;

  /* columns block: N side-by-side columns with nested text | image | button */
  columnCount?: 1 | 2 | 3 | 4;
  /** Per-column stacks; length must match columnCount. */
  columnSlots?: ColumnSlot[];
  /** Horizontal gutter between columns (preview + MJML via padding). */
  columnGap?: string;
}

/**
 * Editor PREVIEW: visual representation shown in the canvas (e.g. React BlockPreview component).
 */
export type BlockPreview = string;

/**
 * GENERATED OUTPUT: MJML string that compiles to email-friendly HTML for export/sending.
 */
export type BlockGenerated = string;
