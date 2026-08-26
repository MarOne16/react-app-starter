# fusion-starter

Opinionated Vite + React starter for Fusion apps.

| Concern | Choice |
| --- | --- |
| Build / dev server | Vite 8 + `@vitejs/plugin-react` |
| Language | TypeScript 5.9 (strict, `@/*` → `src/*`) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Components | shadcn/ui — shared primitives from `@fusion-uis/ui`, app-only ones in `src/components/ui` |
| Routing | React Router v7 (declarative, lazy routes) |
| Data fetching | SWR |
| Client state | Zustand (+ `persist`) |
| Validation | Zod (env, API responses, forms) |
| Forms | React Hook Form + `@hookform/resolvers/zod` |
| Lint / format | Biome |
| Git hooks | Husky + lint-staged |
| Tests | Vitest + Testing Library + jsdom |

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm dev            # http://localhost:8080
```

## Scripts

```bash
pnpm dev            # dev server on :8080, exposed on the network
pnpm build          # tsc -b && vite build
pnpm preview        # serve the production build
pnpm lint           # biome check .
pnpm lint:fix       # biome check --write .
pnpm format         # biome format --write .
pnpm typecheck      # tsc -b
pnpm test           # vitest run
pnpm test:watch     # vitest
pnpm coverage       # vitest run --coverage
```

## Layout

```
src/
  components/ui/     app-only shadcn primitives (form.tsx lives here)
  config/env.ts      import.meta.env parsed through a Zod schema
  hooks/             SWR hooks (use-health.ts is the worked example)
  lib/api/           fetch wrapper, HttpError, SWR fetchers + <SwrProvider>
  lib/utils/         cn() and friends
  pages/             route components; private/ is auth-gated, public/ is not
  store/             Zustand stores (session, theme)
  test/              Vitest setup + renderWithProviders()
```

## Shared UI

Components come from [`@fusion-uis/ui`](https://github.com/Fusion-UIs/Shared-UI),
installed straight from GitHub — its `prepare` script builds `dist/` on install.

```bash
pnpm add github:Fusion-UIs/Shared-UI#v1.7.0   # pin a tag for reproducible installs
```

`src/global.css` imports the package's design tokens and points Tailwind at the
installed `dist/` so utilities used inside the library are emitted:

```css
@import "@fusion-uis/ui/global.css";
@source "../node_modules/@fusion-uis/ui/dist";
```

Import components from the package root:

```tsx
import { Button, Card, Dialog, Input } from "@fusion-uis/ui";
```

To develop the library and this app side by side:

```bash
cd ../Shared-UI && pnpm dev          # vite build --watch
cd ../fusion-starter && pnpm link ../Shared-UI
```

Anything the shared library does not ship is added locally with the shadcn CLI —
`components.json` is already configured:

```bash
pnpm dlx shadcn@latest add <component>   # lands in src/components/ui
```

## Environment

`src/config/env.ts` parses `import.meta.env` through a Zod schema, so a missing
or malformed variable fails at startup rather than at first use. Add new
variables to both the schema and `.env.example`.

## Forms

`src/components/ui/form.tsx` is shadcn's form binding, backed by the shared
`Label`. `src/pages/public/login` is the worked example: a Zod schema next to
the page, `zodResolver` in `useForm`, and per-field `<FormMessage />`.

## Testing

`renderWithProviders` from `src/test/utils.tsx` wraps a component in
`MemoryRouter` + an isolated SWR cache. Setup lives in `src/test/setup.ts`,
which registers jest-dom matchers and stubs `ResizeObserver` / `matchMedia`
for Radix-based components.

## Git hooks

- `pre-commit` → `lint-staged` runs `biome check --write` on staged files
- `pre-push` → `pnpm typecheck && pnpm test`

Hooks install automatically via the `prepare` script on `pnpm install`.
