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

A one-page Turkish landing site for the Kariyer Expo 27 career fair. `app/page.tsx` composes nine sections between the header and footer, behind anchor navigation; there are no sub-routes. Light only.

- `app/layout.tsx` — `lang="tr"`, metadata and viewport exports, and **Archivo** variable (`axes: ["wdth"]`, `subsets: ["latin","latin-ext"]`) loaded twice: roman as `--font-sans`, italic as `--font-display` (a variable Google font takes one `style` per call). Wraps children in `MotionProvider`.
- `components/brand/` — the design language, all drawn from `public/kariyer-expo.png`:
  - `mark.tsx` (inline SVG), `mark-animated.tsx` (hero entrance), `mark-symbol.tsx` (icons) — painted from `mark-geometry.ts` (measured data + path builders) and `mark-glyphs.ts` (generated outlines; do not edit).
  - `x-mark.tsx` (the logo's traced X: eyebrow and list bullet), `stripes.tsx` (the measured bars: band corners), `pending-dots.tsx` (the "yakında" signal).
  - Each file documents why it exists; read those before changing brand visuals.
- `components/section-heading.tsx` — `SectionHeading` (eyebrow, leaning title, one orange `accent`) and `Eyebrow`.
- `components/sections/` — one file per section, RSC except `faq.tsx` and `audience-card.tsx`. `components/layout/` holds the header and footer.
- `lib/content.ts` — every string on the page, plus `site.date` (`null` until announced) and `speakers` (empty until announced). Both drive real design states, so prefer changing content over changing components.
- `lib/utils.ts` — re-exports `cn` from the `cn` npm package (not the usual local `clsx`+`tailwind-merge` helper). It does **not** merge conflicting Tailwind classes, so never rely on a later class overriding an earlier one.
- `scripts/` — run with `bun`, outputs committed:
  - `measure-mark.ts` prints the mark's geometry from the PNG (paste into `mark-geometry.ts`); `--verify [out.png]` scores the drawn mark per layer (IoU).
  - `outline-mark-glyphs.ts` regenerates `mark-glyphs.ts`.
  - `generate-brand-assets.ts` renders `app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png` and `public/logo.png` from the SVG mark.
  - `check-contrast.ts` gates the token contrast pairs against a hand-kept copy of the tokens.

### Styling

Tailwind v4, CSS-first: **there is no `tailwind.config`**. Everything lives in `app/globals.css`:

- imports `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css`
- design tokens as oklch CSS variables under `:root`, surfaced to Tailwind through `@theme inline` (`--color-*`, `--radius-*` scale derived from `--radius`). The palette is measured from the logo and sits on two hues: blue 259 and orange 37.8. `components.json` still says `baseColor: "mauve"`; that is only what the scaffold was generated from and no mauve remains.
- brand tokens beyond shadcn's set: `--band` (the alternating section ground), `--silver` (keyline only, never a surface), `--line` (orange that is safe to read on a light ground), `--mark-*`, `--cut` (the one diagonal slope) and `--corner`
- `[data-surface="navy"]` remaps rings, borders, `--line`, `--muted-foreground` and `--mark-*` for the navy grounds (drawer, stats, speakers, CTA, footer)
- `@layer base`: h1/h2 in the italic display face; `@layer components`: `.eyebrow`, `.numeral`, `.cut-top` / `.cut-bottom` / `.cut-y` (diagonal band edges that overlap their neighbour) and `.corner-cut`

Style with the semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`…) rather than raw colors.

**The header comment in `app/globals.css` is the design's contract — read it first.** Rules it records that are easy to break by accident:

- **`--accent` is fill-only on light grounds** (2.84:1 on the page ground). Never orange text, never an orange stroke there. Anything orange that must be read uses `--line` (4.83:1).
- **One orange phrase per heading** — the logo gives orange to exactly two glyphs, the X and the 7.
- **`text-transform: uppercase` is banned sitewide.** Turkish casing is locale-dependent, so `i` becomes `I` instead of `İ` wherever `lang` is not inherited. Capitals are typed as literal characters in `lib/content.ts`.
- **The pending dots appear in exactly three places** (the hero date pill, the Konuşmacılar heading, the speaker cards); a fourth use kills the rule. No dashed strokes anywhere.

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
