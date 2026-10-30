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

A one-page Turkish landing site for the Kariyer Expo 27 career fair. `app/page.tsx` composes nine sections (Hero, About, Stats, Audiences, Program, Speakers, Partners, Faq, CtaBand) between the header and footer, behind anchor navigation; there are no sub-routes. Light only. `PRODUCT.md` (audience, voice, anti-references) and `DESIGN.md` (the design system) are the design brief; read them before visual work.

- `app/layout.tsx` — `lang="tr"`, metadata and viewport exports, one Google font: **Geist** (`--font-sans`), `subsets: ["latin","latin-ext"]` (İ ı Ğ ğ Ş ş must not fall back). Wraps children in `MotionProvider`.
- `components/brand/` — the logo:
  - `lockup.tsx` is the only way the logos are shown: the event mark dominant, Physiocoree beside it at 0.62x (`--lockup-box`, `--partner-ratio`), a hairline between, logos only (no caption, no "x"). It appears in the header and footer only; `size="sm" | "md" | "lg"`.
  - `mark.tsx` (inline SVG, painted from `--mark-*` so surfaces can remap it) and `mark-symbol.tsx` (compact icon mark, used by `scripts/generate-brand-assets.ts`), built from `mark-geometry.ts` (measured data + path builders) and `mark-glyphs.ts` (generated outlines; do not edit).
  - Each file documents why it exists; read those before changing brand visuals.
- `components/reveal.tsx` — the motion layer, all `m.*` under `MotionProvider`'s `LazyMotion strict`: `Reveal`, `RevealGroup`/`RevealItem` (stagger), `RevealText` (a two-tone heading that rises) and `PhotoReveal` (a photo unmasks in its rounded frame). `on="load"` for the hero, `on="view"` (default, once) elsewhere. They take children as props, so sections stay RSC. Headings use `RevealText` directly; there is no section-heading component.
- `components/pill-link.tsx` — the action link, `m.a` over `buttonVariants` (`accent` by default). The form's submit button uses the same variants.
- `components/sections/` — one file per section, RSC except the interactive parts: `audiences-selector.tsx` (pill tabs over a photo and detail), `program-list.tsx` (pill toggle over session rows) and `faq.tsx`. `hero.tsx` is the headline, the full-width photo and the info bar (date, place, form) over its edge. `components/layout/` holds the sticky white header and the footer.
- `components/marquee-pause.tsx` — wraps the page's one marquee (partner names) and adds the pause button (WCAG 2.2.2); hidden under reduced motion.
- `components/subscribe-form.tsx`, `stat-counter.tsx` and `structured-data.tsx` are the form, the stats counters and the JSON-LD.
- `lib/content.ts` — every string on the page, `images` (stock placeholders in `public/photos/stock/` until the fair's own photos arrive), plus `site.date` (`null` until announced) and `speakers` (empty until announced). Both drive real design states (the pending device), so prefer changing content over changing components.
- `lib/utils.ts` — re-exports `cn` from the `cn` npm package (not the usual local `clsx`+`tailwind-merge` helper). It does **not** merge conflicting Tailwind classes, so never rely on a later class overriding an earlier one.
- `scripts/` — run with `bun`, outputs committed:
  - `measure-mark.ts` prints the mark's geometry from the PNG (paste into `mark-geometry.ts`); `--verify [out.png]` scores the drawn mark per layer (IoU).
  - `outline-mark-glyphs.ts` regenerates `mark-glyphs.ts`.
  - `generate-brand-assets.ts` renders `app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png` and `public/logo.png` from the SVG mark.
  - `check-contrast.ts` gates the token contrast pairs against a hand-kept copy of the tokens.

### View transitions

`next.config.ts` sets `experimental.viewTransition`, so React's `<ViewTransition>` works. Used in `audiences-selector.tsx`, `program-list.tsx`, `faq.tsx`, `subscribe-form.tsx` and `site-header.tsx`. The recipes (`fade-in`/`fade-out`, `slide-*`, `morph`, `text-morph`, `indicator`, `glide`, `pinned`) are CSS classes in `app/globals.css`, passed as the `enter`/`exit`/`share`/`update` props.

- **A state update that should animate must run inside `startTransition`** (`import { startTransition } from "react"`); a plain `setState` never triggers a view transition.
- Reduced motion zeroes every view transition in `globals.css`.

### Styling

Tailwind v4, CSS-first: **there is no `tailwind.config`**. Everything lives in `app/globals.css`:

- imports `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css`
- design tokens as oklch CSS variables under `:root`, surfaced to Tailwind through `@theme inline` (`--color-*`, `--radius-*` scale derived from `--radius`). The palette is the logo's: navy (hue 261) for text and one orange (38.4) as the accent, on white. `components.json` still says `baseColor: "mauve"`; that is only what the scaffold was generated from and no mauve remains.
- brand tokens beyond shadcn's set: `--silver` (the lockup hairline, the mark), `--line` (orange that is safe to read on a light ground), `--mark-*`, `--surface-hover`, `--header-h` (the sticky header's height), `--radius-media` / `--radius-card`, `--spacing-section*` and the motion tokens (`--ease-out-expo`, `--duration-*`)
- `@layer components`: `.container-page` (1320px, gutters); `@layer utilities`: the type scale (`.text-hero`, `.text-display`, `.text-h2`, `.text-h3`, `.text-lead`, `.text-meta`); plus `.marquee` / `.marquee-track` (the one marquee) and the view-transition recipes

Style with the semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`…) rather than raw colors.

**The header comment in `app/globals.css` is the design's contract — read it first.** Rules it records that are easy to break by accident:

- **`--accent` is fill-only on light grounds** (2.99:1 on white). Never orange text there. Anything orange that must be read uses `--line` (5.63:1). Text on an orange fill is navy, never white.
- **Headings are two tones:** the second phrase is muted (`RevealText`'s `accent`), never orange.
- **`text-transform: uppercase` is banned sitewide.** Turkish casing is locale-dependent, so `i` becomes `I` instead of `İ` wherever `lang` is not inherited. Capitals are typed as literal characters in `lib/content.ts`.
- **Shape:** actions, tabs, badges and inputs are pills; photos and the CTA band 20px, the info bar, FAQ rows and form panel 16px. No shadows but the info bar's soft one.
- **One pending device:** a small muted label marks "yakında" (the hero's Gün/Mekân badges, speaker frames). **One marquee** per page, always with the pause button. No gradient text, side-stripe borders or glow shadows; animate transform, opacity and clip-path only (the header's height is the one exception).

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
