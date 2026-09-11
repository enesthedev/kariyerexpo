/**
 * Renders every raster brand asset from the SVG mark. Run it after changing
 * the mark; the outputs are committed.
 *
 *   bun scripts/generate-brand-assets.ts
 *
 *   app/icon.png                 512 x 512, <MarkSymbol>, transparent
 *   app/apple-icon.png           180 x 180, <MarkSymbol> on opaque white
 *                                (iOS paints transparency black)
 *   app/opengraph-image.png      1200 x 630, <Mark> and site.tagline on the
 *                                band ground
 *   app/opengraph-image.alt.txt  its alt text, from lib/content.ts
 *   public/logo.png              <Mark>, transparent, 720 wide: the
 *                                Organization logo in structured data
 *
 * The components themselves are rendered with react-dom/server, so the
 * assets cannot drift from what the page draws. librsvg (inside sharp)
 * cannot resolve var(), so each --mark-* var is swapped for its light-theme
 * token as hex. The tagline is outlined from the same pinned Archivo as the
 * mark's letters, because librsvg has no web fonts.
 */
import { statSync, writeFileSync } from "node:fs"

import { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import sharp from "sharp"

import { Mark } from "@/components/brand/mark"
import { MARK_VIEWBOX, type Ink } from "@/components/brand/mark-geometry"
import { MarkSymbol } from "@/components/brand/mark-symbol"
import { site } from "@/lib/content"

import { loadArchivo, svgPath } from "./outline-mark-glyphs"

// app/globals.css, light theme, oklch -> sRGB.
const TOKENS: Record<Ink, string> = {
  navy: "#00234E", // --foreground, which --mark-navy follows
  orange: "#FF5717", // --accent
  silver: "#A0ABBA", // --silver
}
const BAND = "#F4F6F9" // --band

type SvgProps = React.ComponentProps<"svg"> & { decorative?: boolean }

/** A brand component as standalone SVG markup, painted with hex tokens. */
function markup(component: ComponentType<SvgProps>, props: SvgProps) {
  return renderToStaticMarkup(
    createElement(component, { decorative: true, ...props })
  ).replace(
    /var\(--mark-(navy|orange|silver)\)/g,
    (_, ink: Ink) => TOKENS[ink]
  )
}

const svgDoc = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`

async function png(svg: string, out: string) {
  const { width, height } = await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(out)
  const kb = (statSync(out).size / 1024).toFixed(1)
  console.log(`${out} ${width}x${height} ${kb} KB`)
}

/** The tagline, set in Archivo and outlined, wrapped to `maxWidth`. */
async function tagline(opts: {
  x: number
  y: number
  size: number
  maxWidth: number
  lineHeight: number
}) {
  const font = (await loadArchivo()).getVariation({ wdth: 112, wght: 800 })
  const scale = opts.size / font.unitsPerEm
  const width = (text: string) => font.layout(text).advanceWidth * scale

  const lines: string[] = []
  for (const word of site.tagline.split(" ")) {
    const last = lines[lines.length - 1]
    if (last && width(`${last} ${word}`) <= opts.maxWidth) {
      lines[lines.length - 1] = `${last} ${word}`
    } else {
      lines.push(word)
    }
  }

  const paths = lines.map((line, i) => {
    const run = font.layout(line)
    const baseline = opts.y + i * opts.lineHeight
    let pen = opts.x
    return run.glyphs
      .map((glyph, g) => {
        const pos = run.positions[g]
        const left = pen + pos.xOffset * scale
        pen += pos.xAdvance * scale
        return svgPath(glyph.path.commands, (x, y) => [
          left + x * scale,
          baseline - (y + pos.yOffset) * scale,
        ])
      })
      .join("")
  })
  return { d: paths.join(""), lines: lines.length }
}

async function main() {
  // Favicon: the compact symbol, edge to edge.
  await png(
    svgDoc(512, 512, markup(MarkSymbol, { width: 512, height: 512 })),
    "app/icon.png"
  )

  // Apple touch icon: opaque, with room for iOS's rounded corners.
  await png(
    svgDoc(
      180,
      180,
      `<rect width="180" height="180" fill="#FFFFFF"/>` +
        markup(MarkSymbol, { x: 16, y: 16, width: 148, height: 148 })
    ),
    "app/apple-icon.png"
  )

  // Organization logo: the full mark on nothing.
  const logoW = 720
  const logoH = Math.round((logoW * MARK_VIEWBOX.h) / MARK_VIEWBOX.w)
  await png(
    svgDoc(logoW, logoH, markup(Mark, { width: logoW, height: logoH })),
    "public/logo.png"
  )

  // Social card: the mark on the left, the tagline beside it.
  const card = { w: 1200, h: 630 }
  const markH = 470
  const markW = (markH * MARK_VIEWBOX.w) / MARK_VIEWBOX.h
  const markX = 96
  const markY = (card.h - markH) / 2
  const size = 76
  const lineHeight = 84
  const textX = markX + markW + 64
  const set = await tagline({
    x: textX,
    y: 0,
    size,
    maxWidth: card.w - textX - 72,
    lineHeight,
  })
  // Centre the block of lines on the card: cap height is ~0.7em.
  const blockH = (set.lines - 1) * lineHeight + size * 0.7
  const firstBaseline = (card.h - blockH) / 2 + size * 0.7
  await png(
    svgDoc(
      card.w,
      card.h,
      `<rect width="${card.w}" height="${card.h}" fill="${BAND}"/>` +
        markup(Mark, { x: markX, y: markY, width: markW, height: markH }) +
        `<path transform="translate(0 ${firstBaseline})" fill="${TOKENS.navy}" d="${set.d}"/>`
    ),
    "app/opengraph-image.png"
  )

  // No trailing newline: Next reads this file verbatim into og:image:alt.
  writeFileSync(
    "app/opengraph-image.alt.txt",
    `${site.name} ${site.edition} — ${site.tagline}`
  )
  console.log("app/opengraph-image.alt.txt")
}

await main()
