# Grid / Columns block – implementation plan

## Naming

- **Recommended label:** **Columns** (clear for email builders: “2 columns”, “3 columns”).
- **Alternative:** **Grid** (broader; can still map to MJML column layouts).
- **Internal type:** e.g. `type: "columns"` (stable in `BlockType` and MJML).

This plan uses **“Columns block”** with **`columnCount: 1 | 2 | 3 | 4`**.

---

## Goal

Replace the current **“Rows”** template shortcut with a first-class **Columns** block that has **four fixed variations**:

| Variation   | Meaning                                      |
|------------|-----------------------------------------------|
| 1 column   | Full-width single column                       |
| 2 columns  | Two side-by-side columns                       |
| 3 columns  | Three columns                                  |
| 4 columns  | Four columns                                   |

**Within each column, users can add and edit child blocks of these types only:**

- **Text**
- **Image**
- **Button**

(No other block types inside a column in v1; spacer/divider/html/etc. stay top-level or come later.)

Each variation should:

- Render correctly in the **canvas preview** (editor), including nested selection and add/remove/reorder of children.
- Export to **MJML** as one `mj-section` with **N `mj-column`**, each column containing the **ordered MJML** for its children (`mj-text`, `mj-image`, `mj-button` in sequence).
- Be addable from the **template library** as four cards: “1 Column”, “2 Columns”, “3 Columns”, “4 Columns” (empty columns or one placeholder text per column—product choice).

---

## Data model

### Dedicated block type: `columns`

Add to `BlockType` and `MJMLBlock`:

```ts
type: "columns";
columnCount: 1 | 2 | 3 | 4;

/**
 * Per-column stacks of child blocks. Length must match columnCount.
 * Each child: type "text" | "image" | "button" only, with normal fields (content, src, link, etc.).
 */
columnChildren?: MJMLBlock[][];
```

**Alternative shape** (equivalent, sometimes easier to update):

```ts
columns?: {
  id: string;              // stable id for the column (for keys / future styling)
  blocks: MJMLBlock[];     // only text | image | button
}[];
```

**Rules:**

- On create, initialize `columns` (or `columnChildren`) with `columnCount` entries, each `blocks: []` or `[]`.
- Every nested `MJMLBlock` must have **`id: string`** (e.g. `nanoid()` on insert) for selection, updates, delete, and reorder.
- When validating or saving, reject or ignore nested blocks whose `type` is not `text` | `image` | `button`.

**Grid-level layout (required for “whole grid” editing):**

```ts
/**
 * Horizontal spacing between columns (gutter). Email-safe: map to mj-column
 * padding-left/right on inner columns, or section padding — not CSS gap in final HTML.
 */
columnGap?: string; // e.g. "16px", "24px"; default e.g. "16px" in UI

// columnCount already encodes 1–4; changing it is a grid-level edit (see below).
```

**Optional later:** `columnWidths?: string[]` for unequal `%` widths; per-column background.

**Changing `columnCount` (data rules):**

- Increasing count: append new `columns[]` entries with `blocks: []` (and new stable column `id`s).
- Decreasing count: **drop trailing columns** (rightmost first) and **discard** their `blocks`, **or** merge last column’s blocks into the previous column—**pick one and document in UI** (simplest: discard with confirm if any blocks would be lost).

---

## Template store & updates

Today `updateBlock(id, partial)` is flat. Nested children need one of:

1. **Dedicated actions** on the store, e.g.  
   `addColumnChild(columnsBlockId, columnIndex, block: Omit<MJMLBlock,"id">)`,  
   `updateColumnChild(columnsBlockId, columnIndex, childId, partial)`,  
   `removeColumnChild(...)`,  
   `reorderColumnChildren(columnsBlockId, columnIndex, fromIndex, toIndex)`.

2. **Path-based update** (single generic API):  
   `updateBlock(columnsBlockId, { columns: nextColumns })` where the UI merges immutably.

**Recommendation:** (1) keeps call sites clear and avoids accidental whole-array replaces.

---

## MJML export (`blocks-to-mjml.ts`)

For a `columns` block:

1. Open `<mj-section>` (reuse `data-id` / selection class on the section if you highlight the whole columns block).
2. For each column `i` in `0..columnCount-1`:
   - `<mj-column width="...%">` with equal widths (100%, 50%, 33.333%, 25%) unless custom widths exist later.
   - For each **child** in `columns[i].blocks` in order:
     - **`text`** → same inner MJML as today’s text block (or call a shared `textBlockToMjmlInner(block)` helper).
     - **`image`** → `mj-image` (same attrs as standalone image block).
     - **`button`** → `mj-button` (same attrs as standalone button block).

**Do not** nest `mj-section` inside `mj-column` for these children—emit the **leaf** MJML components only inside the column.

**Refactor opportunity:** extract `blockToMjmlFragment` logic for `text` / `image` / `button` into **reusable functions** that accept `(block, activeBlockId?)` and return **inner column content** (no outer section), so top-level blocks wrap with section+column once, and columns block wraps many columns each with many inners.

**1 column:** still `mj-section` + one `mj-column` width `100%` for consistency.

**Inter-column spacing (`columnGap`):** apply symmetric horizontal padding on each `mj-column` (e.g. first column: padding-right only half gap, middle: both sides half, last: padding-left only half) so visual gutter matches editor **or** use consistent `padding-left`/`padding-right` per column with half-gap each—**verify** in MJML preview. Do not rely on CSS `gap` in client HTML for the email output.

---

## Canvas preview (`BlockPreview`)

- **`ColumnsBlockPreview.tsx`**
  - Outer: flex row (or CSS grid) with `columnCount` columns; **`gap` / padding in preview should reflect `columnGap`** so WYSIWYG matches intent (email MJML still uses padding as above).
  - **Hit targets / selection (three modes):**
    1. **Whole grid** — click the **outer chrome** of the columns block (section border, padding area, or a dedicated “select grid” strip). Selects the **`columns` block** for grid-level actions.
    2. **Single column** — click the **column gutter** (between children and column edge), column header strip, or empty column area. Selects **`(columnsBlockId, columnIndex)`** so the user can **add blocks** to that column from the properties panel (and see which column is active).
    3. **Child block** — click a text/image/button inside a column. Selects **`(columnsBlockId, columnIndex, childId)`** for child property editors.
  - Each column: vertical stack (`flex-col`) of child blocks.
  - For each child, render existing **`BlockPreview`** with `onBlockUpdate` → `updateColumnChild(...)` and child-level selection.

**Empty column:** when **column** is selected, emphasize outline; show placeholder copy + **Add text / Add image / Add button** in the **sidebar** (and optional inline + in canvas).

**Keyboard / breadcrumb:** optional “Grid → Column 2 → Text” in properties header to jump selection level without mis-clicks.

---

## Selection UX (three levels)

Users need **distinct selection states** for a **3-column grid** (generalizes to 1–4):

| Level | User intent | Properties panel |
|-------|-------------|------------------|
| **A. Whole grid** | Delete entire grid; change **number of columns**; change **padding/gap between columns** | **Columns / grid** panel: delete block, `columnCount` control (1–4), `columnGap` (and optional section padding later) |
| **B. Column** | Choose **which** column receives new blocks; clear visual focus | **Column** panel: label “Column 1…N”, **Add text / image / button**; optional empty state; optional “Select whole grid” link |
| **C. Child** | Edit text / image / button content and style | Existing **Text / Image / Button** property panels |

**Store shape (recommended):** extend editor selection with a **discriminated union**, e.g.:

```ts
type ColumnsSelection =
  | { kind: "columns-block"; blockId: string }
  | { kind: "column"; blockId: string; columnIndex: number }
  | { kind: "column-child"; blockId: string; columnIndex: number; childId: string };
```

Keep **top-level** `activeBlockId` for non-columns blocks; when any columns subtree is focused, either:

- Set `activeBlockId` to the **parent** `columns` block id **and** `columnsSelection: ColumnsSelection`, **or**
- Use only `columnsSelection` when `kind !==` implicit top-level (document one canonical approach in `template-store`).

**PropertyEditor routing:**

- `columnsSelection.kind === "columns-block"` → **`ColumnsBlockProperties`**: Delete, `columnCount`, `columnGap`.
- `columnsSelection.kind === "column"` → **`ColumnSlotProperties`** (or section inside `ColumnsBlockProperties`): add-block actions only (and “Back to grid”).
- `columnsSelection.kind === "column-child"` → delegate to **TextBlockProperties** / **ImageBlockProperties** / **ButtonBlockProperties** with scoped update handlers; “Back to column” / “Back to grid”.

**Delete whole grid:** reuse existing **delete top-level block** when selection is **A**; do **not** delete the parent when deleting a **child** (child delete only removes that nested block).

**Alternatives (if you avoid a second field):** compound ids `blockId`, `blockId:col:2`, `blockId:col:2:child:xyz` with `parseColumnsSelection(id)` — works but is easier to get wrong; **prefer explicit `ColumnsSelection`** for three levels.

---

## Drag-and-drop

- **Within a column:** reorder children (`@dnd-kit` `SortableContext` scoped per column).
- **Between columns (optional v2):** move child from column A to B (same DnD kit with a shared parent or custom collision).
- **v1 minimum:** reorder within column + delete child; cross-column move can wait.

Ensure **SortableContext** for the main canvas does not treat inner sortables as top-level block ids—use distinct id prefix, e.g. `column-${parentId}-${colIndex}-${childId}`.

---

## Properties panel (by selection)

- **Whole grid (A):** required controls:
  - **Delete** columns block (same destructive pattern as other blocks—confirm if needed).
  - **Number of columns** — `1 | 2 | 3 | 4` (dropdown or segmented control); apply **columnCount** + data migration rules when count changes.
  - **Padding between columns** — binds to **`columnGap`** (preset chips + custom input); preview and MJML stay in sync per mapping above.
- **Column (B):** primary actions — **Add text**, **Add image**, **Add button** (image flow can open existing upload modal). Secondary: link/button **“Edit grid settings”** to set selection to **A**.
- **Child (C):** full existing editors; navigation up to **B** or **A**.

**Add block UI:** lives in **column (B)** mode primarily; optional duplicate inline “+” in canvas on the selected column for power users.

---

## Sidebar / template library

- Remove or replace **`rows`** prefab once Columns ships.
- **Four cards:** `columns1` … `columns4` → `addBlock` with `type: "columns"`, `columnCount`, and empty `columns[].blocks` (or one default text child per column—decide).

---

## Phased rollout (updated)

| Phase | Scope |
|-------|--------|
| **1** | Types + `columnGap` + store helpers; **three-level selection** (`columns-block` / `column` / `column-child`); `ColumnsBlockPreview` hit targets for grid vs column vs child; MJML + preview respect `columnGap`. |
| **2** | **ColumnsBlockProperties**: delete grid, **column count**, **column gap**; **ColumnSlotProperties**: add text/image/button; child PropertyEditor routing + image upload for nested image; DnD reorder **within** column. |
| **3** | Template library: four column cards; remove “Rows” shortcut. |
| **4** | Unequal column widths; per-column background; optional DnD **between** columns; responsive stack (advanced). |

---

## Files to touch (summary)

- `lib/editor/block-types.ts` – `columns` + nested structure
- `lib/editor/template-store.ts` – column child CRUD + reorder
- `lib/editor/blocks-to-mjml.ts` – `case "columns"` + extract text/image/button **inner** MJML builders
- `app/components/editor/BlockPreview/ColumnsBlockPreview.tsx` (new)
- `app/components/editor/BlockPreview/index.tsx`
- `app/components/editor/Canvas.tsx` / selection – **`ColumnsSelection`** + clear click targets (grid chrome vs column shell vs child)
- `app/components/editor/PropertyEditor/index.tsx` – branch **A / B / C**
- `app/components/editor/PropertyEditor/ColumnsBlockProperties.tsx` – grid: delete, `columnCount`, `columnGap`
- `app/components/editor/PropertyEditor/ColumnSlotProperties.tsx` (new) – column: add blocks, back to grid
- `app/components/editor/Sidebar.tsx` – prefab cards; remove `rows`

---

## Open decisions

1. **UI name:** **Columns** vs **Grid** (user-facing).
2. **New empty columns:** truly empty vs one placeholder text block per column.
3. **Reducing column count:** discard trailing column content vs merge vs confirm—**default:** confirm if any discarded column has blocks.
4. **Cross-column drag** in v1 or defer to Phase 4.
5. **Exact MJML mapping for `columnGap`:** half-padding per column vs section padding—validate in real clients.

This plan assumes **nested text, image, and button blocks per column**, plus **selectable grid vs column vs child** so users can **manage the whole layout** (delete, column count, gutters) **and** **target a column** to add blocks.
