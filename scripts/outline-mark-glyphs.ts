/**
 * Outlines the mark's type (KARİYER, EXPO, 27) from Archivo and writes the
 * paths to components/brand/mark-glyphs.ts.
 *
 *   bun scripts/outline-mark-glyphs.ts
 *
 * Outlines, not live text, so the mark renders the same everywhere (the
 * favicon rasteriser has no web fonts) and each glyph can be fitted into the
 * ink box measured off the logo. Fitting glyph by glyph means kerning,
 * tracking and the İ's dot never have to be modelled: each box is the
 * logo's answer. A glyph that would be stretched more than 1.2x wider than
 * tall keeps its natural width and is centred in its box instead.
 *
 * The weight is picked so the fitted E's stem matches the logo's
 * (letters.expoStem in mark-geometry.ts). Width is the axis maximum, 125,
 * the extended cut the logo is set in.
 *
 * The font is the upstream variable TTF from google/fonts at a pinned commit,
 * checked against a pinned sha256 and cached in node_modules/.cache/archivo/.
 * Not @fontsource: its WOFF2 files are split into subsets, and fontkit's
 * getVariation does not work on WOFF2.
 */
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { create, type Font, type PathCommand } from "fontkit"

import { markGeometry, type Box } from "@/components/brand/mark-geometry"

// The latest google/fonts commit touching ofl/archivo/Archivo[wdth,wght].ttf
// ("Archivo: Version 2.001 added (#2979)", 2021-02-04).
const FONT_COMMIT = "6c70c829f09ea345d3590406693220ea35c6553f"
const FONT_SHA256 =
  "0e094a7d3c7c4c25cf1310c4b30014f1dae9332220b1c2c88f4fa996f0b05053"
const FONT_URL =
  `https://raw.githubusercontent.com/google/fonts/${FONT_COMMIT}` +
  "/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf"
const FONT_CACHE = `node_modules/.cache/archivo/Archivo-wdth-wght-${FONT_COMMIT.slice(0, 7)}.ttf`

const OUT = "components/brand/mark-glyphs.ts"
const WIDTH = 125
const MAX_STRETCH = 1.2
const LINES = { kariyer: "KARİYER", expo: "EXPO", edition: "27" } as const

const sha256 = (bytes: Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex")

/** Archivo's variable TTF, downloaded once and verified on every load. */
export async function loadArchivo(): Promise<Font> {
  if (!existsSync(FONT_CACHE)) {
    const response = await fetch(FONT_URL)
    if (!response.ok) {
      throw new Error(`font download failed: ${response.status} ${FONT_URL}`)
    }
    const bytes = new Uint8Array(await response.arrayBuffer())
    if (sha256(bytes) !== FONT_SHA256) {
      throw new Error(`downloaded font does not match the pinned sha256`)
    }
    mkdirSync(dirname(FONT_CACHE), { recursive: true })
    writeFileSync(FONT_CACHE, bytes)
  }
  const bytes = readFileSync(FONT_CACHE)
  if (sha256(bytes) !== FONT_SHA256) {
    throw new Error(`${FONT_CACHE} does not match the pinned sha256; delete it`)
  }
  const font = create(bytes)
  if (!("getVariation" in font)) throw new Error("expected one font, got a collection")
  return font
}

const r1 = (v: number) => Math.round(v * 10) / 10

/**
 * A fontkit path (font units, y up) as SVG path data, every point passed
 * through `map` and rounded to 0.1.
 */
export function svgPath(
  commands: PathCommand[],
  map: (x: number, y: number) => readonly [number, number]
): string {
  const letter = {
    moveTo: "M",
    lineTo: "L",
    quadraticCurveTo: "Q",
    bezierCurveTo: "C",
    closePath: "Z",
  } as const
  return commands
    .map(({ command, args }) => {
      const points: number[] = []
      for (let i = 0; i < args.length; i += 2) {
        points.push(...map(args[i], args[i + 1]).map(r1))
      }
      return letter[command] + points.join(" ")
    })
    .join("")
}

/** Ink runs (nonzero winding) where a horizontal line crosses a path. */
function inkRuns(commands: PathCommand[], y: number): [number, number][] {
  const crossings: { x: number; dir: number }[] = []
  let start: [number, number] = [0, 0]
  let pen: [number, number] = [0, 0]
  const segment = (a: [number, number], b: [number, number]) => {
    if (a[1] === b[1]) return
    const lo = Math.min(a[1], b[1])
    const hi = Math.max(a[1], b[1])
    if (y < lo || y >= hi) return
    const t = (y - a[1]) / (b[1] - a[1])
    crossings.push({ x: a[0] + t * (b[0] - a[0]), dir: b[1] > a[1] ? 1 : -1 })
  }
  const curve = (points: [number, number][]) => {
    // de Casteljau, flattened to 32 segments.
    let prev = points[0]
    for (let s = 1; s <= 32; s++) {
      const t = s / 32
      let level = points
      while (level.length > 1) {
        level = level
          .slice(1)
          .map((p, i) => [
            level[i][0] + (p[0] - level[i][0]) * t,
            level[i][1] + (p[1] - level[i][1]) * t,
          ])
      }
      segment(prev, level[0])
      prev = level[0]
    }
  }
  for (const { command, args } of commands) {
    const pts: [number, number][] = []
    for (let i = 0; i < args.length; i += 2) pts.push([args[i], args[i + 1]])
    if (command === "moveTo") start = pen = pts[0]
    else if (command === "lineTo") {
      segment(pen, pts[0])
      pen = pts[0]
    } else if (command === "closePath") {
      segment(pen, start)
      pen = start
    } else {
      curve([pen, ...pts])
      pen = pts[pts.length - 1]
    }
  }
  crossings.sort((a, b) => a.x - b.x)
  const runs: [number, number][] = []
  let winding = 0
  let from = 0
  for (const c of crossings) {
    const before = winding
    winding += c.dir
    if (before === 0 && winding !== 0) from = c.x
    if (before !== 0 && winding === 0) runs.push([from, c.x])
  }
  return runs
}

type Fitted = { d: string; stretch: number; natural: boolean }

/** One glyph scaled into its measured ink box. */
function fit(font: Font, char: string, box: Box): Fitted {
  const glyph = font.glyphForCodePoint(char.codePointAt(0)!)
  const { commands, bbox } = glyph.path
  const sy = box.h / bbox.height
  const stretch = box.w / bbox.width / sy
  const natural = stretch > MAX_STRETCH
  const sx = natural ? sy : box.w / bbox.width
  const x0 = natural ? box.x + (box.w - bbox.width * sx) / 2 : box.x
  const d = svgPath(commands, (x, y) => [
    x0 + (x - bbox.minX) * sx,
    box.y + (bbox.maxY - y) * sy,
  ])
  return { d, stretch, natural }
}

/** The E's stem once fitted into its box, in logo pixels. */
function fittedStem(font: Font) {
  const glyph = font.glyphForCodePoint("E".codePointAt(0)!)
  const { commands, bbox } = glyph.path
  const box = markGeometry.letters.expo[0]
  // Between the top and middle arms at every weight.
  const [first] = inkRuns(commands, bbox.minY + bbox.height * 0.68)
  return ((first[1] - first[0]) * box.w) / bbox.width
}

async function main() {
  const base = await loadArchivo()
  const target = markGeometry.letters.expoStem
  // The stem grows with weight, so bisect the axis.
  let lo = 100
  let hi = 900
  while (hi - lo > 1) {
    const mid = Math.round((lo + hi) / 2)
    const stem = fittedStem(base.getVariation({ wdth: WIDTH, wght: mid }))
    if (stem < target) lo = mid
    else hi = mid
  }
  const stemAt = (w: number) =>
    fittedStem(base.getVariation({ wdth: WIDTH, wght: w }))
  const wght =
    Math.abs(stemAt(lo) - target) <= Math.abs(stemAt(hi) - target) ? lo : hi
  const font = base.getVariation({ wdth: WIDTH, wght })
  console.log(
    `wght ${wght}: fitted E stem ${stemAt(wght).toFixed(1)}px, logo ${target}px`
  )

  const out: Record<keyof typeof LINES, string[]> = {
    kariyer: [],
    expo: [],
    edition: [],
  }
  for (const key of Object.keys(LINES) as (keyof typeof LINES)[]) {
    const chars = [...LINES[key]]
    const boxes = markGeometry.letters[key]
    if (chars.length !== boxes.length) {
      throw new Error(`${key}: ${chars.length} glyphs, ${boxes.length} boxes`)
    }
    const report: string[] = []
    chars.forEach((char, i) => {
      const f = fit(font, char, boxes[i])
      out[key].push(f.d)
      report.push(`${char} ${f.stretch.toFixed(3)}${f.natural ? " (natural)" : ""}`)
    })
    console.log(`${key}: ${report.join(", ")}`)
  }

  const list = (paths: string[]) =>
    `[\n${paths.map((d) => `    "${d}",`).join("\n")}\n  ]`
  writeFileSync(
    OUT,
    `// generated by scripts/outline-mark-glyphs.ts — do not edit\n` +
      `// Archivo wdth ${WIDTH}, wght ${wght} (google/fonts@${FONT_COMMIT.slice(0, 7)}),\n` +
      `// each glyph fitted into its ink box in mark-geometry.ts.\n\n` +
      `export const markGlyphs: {\n  kariyer: string[]\n  expo: string[]\n  edition: string[]\n} = {\n` +
      `  kariyer: ${list(out.kariyer)},\n` +
      `  expo: ${list(out.expo)},\n` +
      `  edition: ${list(out.edition)},\n}\n`
  )
  console.log(`wrote ${OUT}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main()
}
