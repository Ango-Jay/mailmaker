# MailMaker AI

MailMaker AI is a modern, web-based email template builder designed to help users create responsive, high-quality emails without writing code. It leverages **MJML** (Mailjet Markup Language) under the hood to ensure that the generated HTML is compatible across all major email clients.

## 🚀 Features

- **Visual Editor**: Click-to-add components from a rich library of basic elements (Text, Image, Button, Divider) and structural layouts (Sections, Columns).
- **Pre-fab Cards**: Quickly assemble emails using professionally designed composite blocks like Email Signatures, Testimonials, and Hero Banners.
- **Real-time Preview**: See your email come to life instantly. The central canvas renders the MJML code to HTML in real-time within an isolated iframe.
- **Responsive Testing**: Toggle between Desktop and Mobile viewport modes to ensure your design looks great on any device.
- **Context-Aware Property Editor**: Select any element on the canvas to edit its specific attributes (colors, typography, padding) and content via the right sidebar.
- **Modern Tech Stack**: Built with performance and developer experience in mind.

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI & Styling**: React, [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Email Engine**: [MJML](https://mjml.io/) (via `mjml-browser`)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏗️ Architecture

The editor is built around a centralized Zustand store (`lib/editor/store.ts`) that manages the email template as a serialized JSON tree of `MJElement` nodes.

1. **State Updates**: User interactions in the Left Sidebar (adding components) or Right Sidebar (updating properties) mutate this JSON state.
2. **Transformation**: A recursive transformer (`lib/editor/transformer.ts`) parses the JSON tree and compiles it into a valid MJML string.
3. **Compilation**: The MJML string is passed to `mjml-browser`, which generates the final, email-client-safe HTML.
4. **Rendering**: The HTML is securely rendered on the Canvas inside an iframe, complete with injected scripts for element selection and hover states.

## 🏃‍♂️ Getting Started

First, install the dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application. The main editor is located at `/editor`.
