Technical Specification: MJML Email Template Generator (v1.2)1. Project OverviewA web-based email builder built with Next.js and MJML. The application allows users to construct custom emails by adding atomic components or selecting pre-defined layout blocks.2. Core Tech StackFramework: Next.js (App Router)Email Engine: mjml-browserState Management: Zustand (Serialized JSON State)UI/Styling: Tailwind CSS + Radix UI3. Component Hierarchy3.1 Atomic Components (The "Bricks")Text (mj-text)Link (mj-button)Image (mj-image)Spacer (mj-spacer)Divider (mj-divider)3.2 Custom Blocks (The "Pre-fabs")These are composite structures that the user can drop into the canvas and then customize.Block NameStructureDefault ContentHeadermj-section > mj-columnLogo (mj-image) + Navigation Links (mj-inline-links or mj-text)Email Signaturemj-section > mj-columnName (mj-text) + Title (mj-text) + Social Icons (mj-group)Footermj-section (dark/light)Unsubscribe link + Copyright + Address (mj-text)Cardmj-section (bordered/shadow)Image + Heading + Body Text + CTA ButtonGridmj-section (multi-column)2 or 3 mj-columns with equal width for product/feature showcases4. Data Schema & State Management4.1 Block Definition SchemaWhen a user adds a "Card" block, the following object is pushed to the body array:JSON{
  "id": "block-uuid",
  "type": "block-card",
  "layout": "mj-section",
  "attributes": { "border": "1px solid #dddddd", "padding": "20px" },
  "children": [
    {
      "id": "col-uuid",
      "type": "mj-column",
      "children": [
        { "type": "mj-image", "attributes": { "src": "placeholder.jpg" } },
        { "type": "mj-text", "content": "<h2>Card Title</h2>" },
        { "type": "mj-button", "content": "Read More", "attributes": { "href": "#" } }
      ]
    }
  ]
}
4.2 State Store (Zustand)The store handles three main concerns:template: The full JSON tree.activeElementId: Tracks which component/block is being edited in the right sidebar.history: (Optional) For Undo/Redo functionality.5. User Workflow logicSelection: User drags a Grid block from the sidebar to the canvas.Initialization: The system injects a pre-configured mj-section with two mj-columns into the JSON state.Refinement: The user clicks a Text component inside the Grid. The Property Editor (Right Sidebar) opens specifically for that text element's font, color, and content.Transformation: The state is passed through a jsonToMjml() parser which generates the MJML string.Rendering: mjml-browser converts the string to HTML for the <iframe> preview.