# HTML block implementation plan

## Goal

Add a new **HTML block** that allows advanced users to paste custom HTML for complex layouts that are not easily represented by existing blocks.

This block should be explicit about trade-offs: it is a power-user escape hatch, and email-client compatibility becomes user-managed.

---

## Scope decisions

### In scope (v1)

- New block type: `html`
- Property editor with multiline HTML textarea
- Canvas preview rendering of user HTML
- Export support: include HTML in generated MJML output
- Basic safety and guardrails (size limits + script stripping)
- Clear warning text in UI about compatibility risks

### Out of scope (v1)

- Full HTML sanitizer / policy engine
- Visual builder for the custom HTML
- Automatic email-client compatibility checks
- Rewriting arbitrary CSS to email-safe styles

---

## Data model changes

### `lib/editor/block-types.ts`

1. Extend `BlockType` with `"html"`.
2. Reuse existing `content?: string` field to store raw HTML for the block.
3. Optional: add a dedicated `rawHtml?: string` field in future, but for v1 use `content` to keep migration simple.

---

## Sidebar / add flow

### `app/components/editor/Sidebar.tsx`

Add a new item in `COMPONENT_LIBRARY`:

- `type: "html"`
- `label: "HTML"`
- icon suggestion: `Code2` from `lucide-react`
- default block:

```ts
{ type: "html", content: "<table role=\"presentation\" width=\"100%\"><tr><td>Custom HTML</td></tr></table>" }
```

This creates a discoverable “advanced block” alongside basic blocks.

---

## Property editor UX

### `app/components/editor/PropertyEditor`

1. Create `HtmlBlockProperties.tsx`.
2. Wire `case "html"` in `PropertyEditor/index.tsx`.

### `HtmlBlockProperties.tsx` fields

- **Section: Main**
  - `HTML` textarea (large, monospaced, min-height ~220px)
- **Section: Others**
  - Optional helper text / warning:
    - “Custom HTML is inserted as-is. Email client support may vary.”

Behavior:

- On every change: `onUpdate({ content: value })`
- Do not auto-format user HTML in v1.

---

## Canvas preview behavior

### `app/components/editor/BlockPreview`

1. Create `HtmlBlockPreview.tsx`.
2. Wire `case "html"` in `BlockPreview/index.tsx`.

Rendering strategy:

- Use `dangerouslySetInnerHTML` inside a container (`div`) that inherits editor width.
- Show empty-state placeholder if `content` is empty.
- Wrap with subtle border/background so users can visually identify “this is custom HTML”.

Example behavior:

- Empty: “Custom HTML block (no content)”
- Non-empty: render the HTML snippet in the canvas.

---

## Export (MJML generation)

### `lib/editor/blocks-to-mjml.ts`

Add `case "html"`.

Recommended MJML output pattern:

```mjml
<mj-section>
  <mj-column>
    <mj-raw>
      <!-- user HTML here -->
    </mj-raw>
  </mj-column>
</mj-section>
```

Notes:

- `mj-raw` is the safest way to pass raw HTML through MJML.
- Keep this wrapped in section/column so it follows block flow ordering.

---

## Guardrails and safety

Because this is “anything goes,” add minimal protections in v1:

1. **Strip script tags on save/export**
   - Remove `<script>` blocks before preview/export.
2. **Block obvious event-handler attributes**
   - Optionally remove `on*=` attributes (e.g. `onclick=`).
3. **Max length**
   - Cap HTML size (e.g. 30KB) to avoid performance issues.
4. **User warning**
   - In properties: “You are responsible for email compatibility and accessibility.”

Implementation approach:

- Add helper in `lib/editor/helpers.ts`:
  - `sanitizeHtmlBlock(input: string): string`
- Use this helper in:
  - `HtmlBlockPreview` (before rendering)
  - `blocks-to-mjml` (before embedding in `<mj-raw>`)

---

## Compatibility and expectations

Be explicit in UI/docs:

- This block is for advanced custom markup.
- CSS support in email clients is inconsistent.
- Complex layouts should use table-based HTML for best compatibility.
- Avoid JS entirely (will be removed/ignored).

---

## Validation and tests

### Manual checks

1. Add HTML block from sidebar.
2. Paste simple markup (`<div><strong>Hello</strong></div>`) → canvas renders.
3. Export MJML tab contains `mj-raw` content.
4. Export HTML tab contains rendered HTML from MJML compile.
5. Script input (`<script>alert(1)</script>`) is stripped.
6. Oversized payload is rejected or truncated with message.

### Regression checks

- Existing text/image/button/spacer/divider blocks still export correctly.
- Drag-and-drop ordering still works with HTML blocks in the list.

---

## Suggested file list

- `lib/editor/block-types.ts`
- `app/components/editor/Sidebar.tsx`
- `app/components/editor/PropertyEditor/index.tsx`
- `app/components/editor/PropertyEditor/HtmlBlockProperties.tsx` (new)
- `app/components/editor/BlockPreview/index.tsx`
- `app/components/editor/BlockPreview/HtmlBlockPreview.tsx` (new)
- `lib/editor/blocks-to-mjml.ts`
- `lib/editor/helpers.ts` (sanitization helper)

---

## Rollout order

1. Add block type + sidebar item
2. Add property editor for HTML content
3. Add canvas preview rendering
4. Add MJML export via `mj-raw`
5. Add sanitization + size guardrails
6. QA pass (manual scenarios above)

---

## Future enhancements (v2)

- “Validate HTML” button with lint-style feedback
- Optional strict mode sanitizer profile
- Snippet templates (hero table, two-column table, rating stars)
- Per-block preview toggle (rendered vs source)
