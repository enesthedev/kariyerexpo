/**
 * Generates app/opengraph-image.png, app/icon.png and app/apple-icon.png from
 * public/logo.png. Run once; the outputs are committed.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Uses sharp (already present via Next) rather than ImageMagick, which is not
 * installed here. The source PNG has no alpha and ~6% whitespace padding, so
 * everything crops to the real ink box first.
 *
 * The crop is composited with `darken`, not `over`. The source has an opaque
 * white ground, so `over` would paste a white rectangle onto the sand card.
 * `darken` takes the per-channel minimum: white collapses to the ground, the
 * logo cream (#E5D9D1) is already darker than the ground so it is untouched,
 * and navy and the grey subtitle are untouched. Only the orange shifts, by 16
 * levels of red, which is not visible. Anti-aliased edges blend cleanly, which
 * is what a white-key would have failed at.
 */
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const sharp = require("sharp")

const SRC = "public/logo.png"
// The page background, so a shared card sits on the same ground as the site.
const GROUND = "#FBF1EA"

// Measured ink boxes in the 1920x1080 original.
const LOCKUP = { left: 66, top: 68, width: 1639, height: 932 }
const MARK = { left: 66, top: 68, width: 795, height: 932 }

async function ogImage() {
  const inner = await sharp(SRC)
    .extract(LOCKUP)
    .resize({ width: 940, fit: "inside" })
    .toBuffer()
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: GROUND,
    },
  })
    .composite([{ input: inner, gravity: "centre", blend: "darken" }])
    .png()
    .toFile("app/opengraph-image.png")
}

async function icon(size, out) {
  const inner = await sharp(SRC)
    .extract(MARK)
    .resize({ width: Math.round(size * 0.72), fit: "inside" })
    .toBuffer()
  await sharp({
    create: { width: size, height: size, channels: 3, background: GROUND },
  })
    .composite([{ input: inner, gravity: "centre", blend: "darken" }])
    .png()
    .toFile(out)
}

await ogImage()
await icon(512, "app/icon.png")
await icon(180, "app/apple-icon.png")
console.log("brand assets written")
