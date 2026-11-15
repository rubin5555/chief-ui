# `@workspace/tiny-quill-editor` (pnpm Workspace Package)

Self-contained **pnpm workspace package** for **TinyQuill 2.x** (2D table & rich text editor with English LTR & Hebrew RTL i18n, cell merge/split, drag resize, and format painter).

---

## Integrating into Your `pnpm` Monorepo

### 1. Copy the Package into `packages/`
Copy this folder (`packages/tiny-quill-editor`) into your monorepo's `packages/tiny-quill-editor` directory, and ensure your root `pnpm-workspace.yaml` includes `packages/*`:

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 2. Add Dependency to Your Consuming App (`package.json`)
In your Next.js / Vite / React app's `package.json`:

```json
{
  "dependencies": {
    "@workspace/tiny-quill-editor": "workspace:*",
    "quill": "^2.0.3",
    "lucide-react": "^1.59.0"
  }
}
```

Then run:
```bash
pnpm install
```

### 3. Next.js `transpilePackages` Configuration (Optional for Live TS Source)
Because `@workspace/tiny-quill-editor` exports `./src/index.ts` directly for zero-rebuild HMR inside a `pnpm` workspace (and `./dist/index.js` via `publishConfig` when packed/published), add it to `transpilePackages` in your `next.config.ts`:

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@workspace/tiny-quill-editor'],
};

export default nextConfig;
```

### 4. Import Styles & Component
`styles.css` includes `@source ".";` at the top, so **Tailwind CSS v4** in your consuming app automatically scans the workspace package for utility classes without extra config:

```tsx
// In your app's globals.css:
@import "tailwindcss";
@import "quill/dist/quill.core.css";
@import "@workspace/tiny-quill-editor/styles.css";
```

```tsx
// In your React / Next.js component:
import { TinyQuillEditor } from '@workspace/tiny-quill-editor';

export default function EditorView() {
  return (
    <TinyQuillEditor
      locale="he" // or "en"
      initialValue="<p>שלום עולם</p>"
      onChange={(cleanHTML) => console.log(cleanHTML)}
    />
  );
}
```
