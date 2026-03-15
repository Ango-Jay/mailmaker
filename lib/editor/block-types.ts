/**
 * Block types for the email template editor.
 * Blocks are the building units of a template: basic blocks (text, button, etc.)
 * and prebuilt cards. The template is an array of these blocks.
 */

export type BlockType =
  | "text"
  | "button"
  | "image"
  | "card"
  | "footer"
  | "spacer";

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
}

/**
 * Editor PREVIEW: visual representation shown in the canvas (e.g. React BlockPreview component).
 */
export type BlockPreview = string;

/**
 * GENERATED OUTPUT: MJML string that compiles to email-friendly HTML for export/sending.
 */
export type BlockGenerated = string;
