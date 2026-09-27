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

A one-page Turkish landing site for the Kariyer Expo 27 career fair. `app/page.tsx` composes eleven sections behind anchor navigation; there are no sub-routes.

- `app/layout.tsx` — `lang="tr"`, metadata and viewport exports, and one Google font: **Archivo** variable (`axes: ["wdth"]`, `subsets: ["latin","latin-ext"]`) exposed as `--font-sans`. `--font-heading` aliases it in `globals.css`; the display and label voices are width-axis settings, not separate families. Wraps children in `ThemeProvider` > `MotionProvider`. `suppressHydrationWarning` on `<html>` is required by next-themes.
- `components/theme-provider.tsx` — `"use client"`. Wraps `next-themes` with `attribute="class"` + `defaultTheme="system"`, and mounts `ThemeHotkey`, which toggles light/dark on the bare `d` key (ignored while typing in an input/textarea/select/contenteditable, or with a modifier held).
- `components/brand/` — the design language. `badge-mark.tsx` (rings redrawn from measurements), `full-mark.tsx` + `full-mark-animated.tsx` (the logo as three CSS-masked layers), `arc.tsx` (the heading rule), `knockout.tsx` (the pending state), `wordmark.tsx`. Each file documents why it exists; read those before changing brand visuals.
- `components/sections/` — one file per section, all RSC except `faq.tsx`. `components/layout/` holds the header, footer and theme toggle.
- `lib/content.ts` — every string on the page, plus `site.date` (`null` until announced) and `speakers` (empty until announced). Both drive real design states, so prefer changing content over changing components.
- `lib/utils.ts` — re-exports `cn` from the `cn` npm package (not the usual local `clsx`+`tailwind-merge` helper).

### Styling

Tailwind v4, CSS-first: **there is no `tailwind.config`**. Everything lives in `app/globals.css`:

- imports `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css`
- `@custom-variant dark (&:is(.dark *))` — dark mode is class-driven, matching next-themes
- design tokens as oklch CSS variables under `:root` / `.dark`, surfaced to Tailwind through `@theme inline` (`--color-*`, `--radius-*` scale derived from `--radius`). The palette is measured from the logo and sits on two hues: blue 260 and orange 36. `components.json` still says `baseColor: "mauve"`; that is only what the scaffold was generated from and no mauve remains.
- brand tokens beyond shadcn's set: `--band` (the alternating section ground), `--silver` (keyline only, never a surface), `--line` (orange that is safe to read on a light ground), `--mark-*` and `--knockout-*`
- `[data-surface="navy"]` remaps rings, borders, `--line`, `--mark-*` and `--knockout-*` for the sections that stay navy in both themes
- `@layer base` sets border/ring defaults, body colors, `font-sans` on `html`, and pointer cursors on enabled buttons

Style with the semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`…) rather than raw colors, so both themes stay correct.

**The header comment in `app/globals.css` is the design's contract — read it first.** Three rules it records are easy to break by accident:

- **`--accent` is fill-only in light mode** (2.80:1 on the page ground). Never orange text, never an orange stroke there. Anything orange that must be read uses `--line` (4.16:1, large text and UI strokes only).
- **`text-transform: uppercase` is banned sitewide.** Turkish casing is locale-dependent, so `i` becomes `I` instead of `İ` wherever `lang` is not inherited. Capitals are typed as literal characters in `lib/content.ts`.
- **Ink is confirmed, knockout is pending.** There are no dashed strokes anywhere. The knockout appears in exactly three places (the hero date pill, the Konuşmacılar heading, the speaker cards); a fourth use kills the rule.

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
