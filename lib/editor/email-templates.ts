import { nanoid } from "nanoid";
import type { MJMLBlock } from "./block-types";

/**
 * Block shape for authoring full-email templates (ids assigned on load).
 * Nested `columns` use `columnSlots` without slot `id`s; children omit `id`.
 */
export type EmailTemplateBlockSeed = Omit<MJMLBlock, "id" | "columnSlots"> & {
  columnSlots?: Array<{
    blocks: EmailTemplateBlockSeed[];
  }>;
};

export type EmailTemplateDefinition = {
  id: string;
  title: string;
  description: string;
  blocks: EmailTemplateBlockSeed[];
};

function seedToBlock(seed: EmailTemplateBlockSeed): MJMLBlock {
  if (seed.type === "columns" && seed.columnSlots?.length) {
    const { columnSlots: seedSlots, ...rest } = seed;
    const n = (rest.columnCount ?? seedSlots.length) as 1 | 2 | 3 | 4;
    return {
      ...rest,
      id: nanoid(),
      type: "columns",
      columnCount: n,
      columnSlots: seedSlots.slice(0, n).map((slot) => ({
        id: nanoid(),
        blocks: slot.blocks.map((c) => seedToBlock(c)),
      })),
    };
  }
  return { ...seed, id: nanoid() } as MJMLBlock;
}

/** Full canvas blocks ready for `setBlocks`. */
export function buildEmailTemplateBlocks(templateId: string): MJMLBlock[] {
  const def = EMAIL_TEMPLATE_LIBRARY.find((t) => t.id === templateId);
  if (!def) return [];
  return def.blocks.map((b) => seedToBlock(b));
}

export const EMAIL_TEMPLATE_LIBRARY: EmailTemplateDefinition[] = [
  {
    id: "simple-newsletter",
    title: "Simple newsletter",
    description: "Headline, short body, CTA, and footer — ideal for updates and digests.",
    blocks: [
      {
        type: "text",
        textStyle: "h1",
        content: "Thanks for subscribing",
        align: "center",
        size: "large",
        textAlign: "center",
      },
      { type: "spacer", height: "12px" },
      {
        type: "text",
        textStyle: "paragraph",
        content:
          "Here's what you missed this week — product updates, tips, and stories from our team.",
        align: "center",
        textAlign: "center",
      },
      { type: "spacer", height: "20px" },
      {
        type: "button",
        text: "View in browser",
        link: "#",
        align: "center",
        textAlign: "center",
        backgroundColor: "#D65A31",
        textColor: "#ffffff",
        borderRadius: "8px",
      },
      { type: "spacer", height: "28px" },
      {
        type: "footer",
        footerVariant: "minimal",
        mutedText: "You received this because you signed up for our emails.",
      },
    ],
  },
  {
    id: "two-column-promo",
    title: "Two-column promo",
    description: "Headline plus a split row: copy on the left, CTA on the right.",
    blocks: [
      {
        type: "text",
        textStyle: "h2",
        content: "Summer collection is here",
        align: "center",
        textAlign: "center",
      },
      { type: "spacer", height: "16px" },
      {
        type: "columns",
        columnCount: 2,
        columnGap: "24px",
        columnSlots: [
          {
            blocks: [
              {
                type: "text",
                textStyle: "paragraph",
                content:
                  "Fresh styles and limited drops. Free shipping over $50.\n\nShop early for the best selection.",
                align: "left",
                textAlign: "left",
              },
            ],
          },
          {
            blocks: [
              {
                type: "button",
                text: "Shop the sale",
                link: "#",
                align: "center",
                textAlign: "center",
                backgroundColor: "#D65A31",
                textColor: "#ffffff",
                borderRadius: "8px",
              },
              { type: "spacer", height: "12px" },
              {
                type: "text",
                textStyle: "paragraph",
                content: "Ends Sunday",
                align: "center",
                textAlign: "center",
                size: "small",
              },
            ],
          },
        ],
      },
      { type: "spacer", height: "24px" },
      {
        type: "divider",
        height: "1px",
        backgroundColor: "#e5e5e5",
      },
      { type: "spacer", height: "16px" },
      {
        type: "footer",
        footerVariant: "minimal",
        mutedText: "© 2025 Your brand. Unsubscribe anytime.",
      },
    ],
  },
];
