/**
 * Generates every derived brand asset from public/kariyer-expo-2027.png.
 * Run once; the outputs are committed.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Uses sharp (already present via Next) rather than ImageMagick, which is not
 * installed here.
 *
 * TWO KINDS OF OUTPUT
 *
 * 1. public/mark-*.png -- the full mark, split into three greyscale alpha
 *    masks (body, keyline, accent). The page paints them with CSS colours via
 *    mask-image, so ONE asset set serves both themes and the navy-surface
 *    lockup comes free. Measured: 29.2 KB for all three at 720w, against
 *    96.7 KB for a single full-colour WebP that would still need a second
 *    file per theme. Palette mode does most of that -- a greyscale mask has
 *    few distinct levels, so quantising costs nothing visible and saves 72 KB.
 *    Bump MASK_WIDTH if the hero mark ever looks soft on a HiDPI screen; it
 *    is the only knob. The mark is flat three-colour with hard edges, so
 *    nearest-colour classification is exact; only ~0.7% of pixels are far
 *    enough from every brand colour to be judgement calls, and those are
 *    anti-aliased edges where the nearest colour is the right answer anyway.
 *
 * 2. app/opengraph-image.png, app/icon.png, app/apple-icon.png -- flattened
 *    social and favicon art. The old source had no alpha, so this script used
 *    to composite with `darken` to keep a white rectangle off the card. The
 *    new source has a real alpha channel, so a plain `over` is correct and
 *    the trick is gone.
 */
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const sharp = require("sharp")

const SRC = "public/kariyer-expo-2027.png"
// The light page ground, so a shared card sits on the same surface as the site.
const GROUND = "#F4F7FA"

// Measured ink box in the 2000x2000 original. EXPO overhangs the badge circle
// on both sides, so this is wider than the circle itself.
const INK = { left: 11, top: 93, width: 1981, height: 1801 }

// The three brand colours, measured off the source.
const LAYERS = {
  body: [3, 30, 78],
  accent: [253, 98, 54],
  keyline: [196, 201, 209],
}
const MASK_WIDTH = 720

async function masks() {
  const { data, info } = await sharp(SRC)
    .extract(INK)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const names = Object.keys(LAYERS)
  // Two channels, both carrying the same coverage value: alpha because
  // mask-mode defaults to match-source (which is alpha for an image), and
  // grey so the masks still work if anything ever asks for luminance.
  const out = Object.fromEntries(
    names.map((n) => [n, Buffer.alloc(width * height * 2)])
  )

  for (let p = 0; p < width * height; p++) {
    const i = p * 4
    const alpha = data[i + 3]
    if (alpha === 0) continue
    let best = null
    let bestDistance = Infinity
    for (const name of names) {
      const [r, g, b] = LAYERS[name]
      const distance =
        (data[i] - r) ** 2 + (data[i + 1] - g) ** 2 + (data[i + 2] - b) ** 2
      if (distance < bestDistance) {
        bestDistance = distance
        best = name
      }
    }
    // Alpha carries through, so anti-aliased edges stay soft in the mask.
    out[best][p * 2] = alpha
    out[best][p * 2 + 1] = alpha
  }

  for (const name of names) {
    await sharp(out[name], { raw: { width, height, channels: 2 } })
      .resize({ width: MASK_WIDTH })
      .png({ compressionLevel: 9, palette: true, colours: 32 })
      .toFile(`public/mark-${name}.png`)
  }
}

// `inner` is the box the mark is fitted inside, not its width: the ink box is
// wider than it is tall, so bounding only the width overflows a 1200x630 card.
async function flattened(size, inner, out) {
  const crop = await sharp(SRC)
    .extract(INK)
    .resize({ width: inner.width, height: inner.height, fit: "inside" })
    .toBuffer()
  await sharp({
    create: {
      width: size.width,
      height: size.height,
      channels: 4,
      background: GROUND,
    },
  })
    .composite([{ input: crop, gravity: "centre" }])
    .png({ compressionLevel: 9, palette: true, colours: 32 })
    .toFile(out)
}

await masks()
await flattened(
  { width: 1200, height: 630 },
  { width: 820, height: 470 },
  "app/opengraph-image.png"
)
await flattened(
  { width: 512, height: 512 },
  { width: 430, height: 430 },
  "app/icon.png"
)
await flattened(
  { width: 180, height: 180 },
  { width: 152, height: 152 },
  "app/apple-icon.png"
)
console.log("brand assets written")
