# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **bun** (`bun.lock` is the only lockfile).

```bash
bun install
bun run dev        # next dev
bun run build      # next build
bun run start      # next start (needs a prior build)
bun run lint       # eslint (flat config)
bun run typecheck  # tsc --noEmit
bun run format     # prettier --write "**/*.{ts,tsx}"
```

No test framework is configured yet.

## Next.js 16 — read the bundled docs first

`AGENTS.md` enforces this and it is the single most important rule here: this project runs **Next.js 16.2.6**, whose APIs, conventions, and file structure differ from older Next.js. Before writing or changing any Next.js code (routing, data fetching, caching, `next.config.ts`, metadata, server actions), read the relevant guide under `node_modules/next/dist/docs/`:

- `01-app/01-getting-started/` — core concepts
- `01-app/02-guides/` — task-specific guides
- `01-app/03-api-reference/` — exact API signatures

Those docs also carry inline `{/* AI agent hint: ... */}` notes; heed them and any deprecation notices rather than relying on prior Next.js knowledge.

## Architecture

Fresh App Router scaffold — `app/page.tsx` is still the placeholder. Current shape:

- `app/layout.tsx` — the only real wiring: loads three Google fonts and exposes them as CSS variables (`--font-sans` = Inter, `--font-mono` and `--font-heading` = Geist Mono), then wraps children in `ThemeProvider`. `suppressHydrationWarning` on `<html>` is required by next-themes.
- `components/theme-provider.tsx` — `"use client"`. Wraps `next-themes` with `attribute="class"` + `defaultTheme="system"`, and mounts `ThemeHotkey`, which toggles light/dark on the bare `d` key (ignored while typing in an input/textarea/select/contenteditable, or with a modifier held).
- `components/ui/` — shadcn/ui components. Only `button.tsx` exists so far.
- `lib/utils.ts` — re-exports `cn` from the `cn` npm package (not the usual local `clsx`+`tailwind-merge` helper).

### Styling

Tailwind v4, CSS-first: **there is no `tailwind.config`**. Everything lives in `app/globals.css`:

- imports `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css`
- `@custom-variant dark (&:is(.dark *))` — dark mode is class-driven, matching next-themes
- design tokens as oklch CSS variables under `:root` / `.dark` (mauve base), surfaced to Tailwind through `@theme inline` (`--color-*`, `--radius-*` scale derived from `--radius`)
- `@layer base` sets border/ring defaults, body colors, `font-sans` on `html`, and pointer cursors on enabled buttons

Style with the semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`…) rather than raw colors, so both themes stay correct.

### Adding components

```bash
npx shadcn@latest add <component>
```

`components.json` pins: style `base-sera`, base color `mauve`, `rsc: true`, icon library **tabler** (`@tabler/icons-react`, not lucide), aliases `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`.

Generated components in this style build on **`@base-ui/react` primitives, not Radix**, and use `cva` for variants — see `components/ui/button.tsx` as the reference for the expected shape (`data-slot` attribute, `variant`/`size` variants, props typed as `Primitive.Props & VariantProps<typeof variants>`).

## Conventions

- Prettier: **no semicolons**, double quotes, 2-space indent, ES5 trailing commas, 80 columns. `prettier-plugin-tailwindcss` sorts classes and also sorts inside `cn(...)` and `cva(...)`; it reads the theme from `app/globals.css`.
- Imports use the `@/*` path alias (maps to the repo root).
- Commits: **atomic** — one logical change per commit. Do **not** add a `Co-Authored-By` trailer.
