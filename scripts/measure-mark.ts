/**
 * Measures the mark in public/kariyer-expo.png, so components/brand/
 * mark-geometry.ts is read off the logo rather than drawn by eye.
 *
 *   bun scripts/measure-mark.ts            print the measured geometry
 *   bun scripts/measure-mark.ts --verify   score the drawn mark against the PNG
 *
 * CLASSIFICATION. Every opaque pixel goes to the nearest of four references:
 * the three inks (navy, orange, silver) and the white disc, which is dropped.
 * The X's bevel and the letters' thin dark drop edge land on their nearest
 * ink, so they are simply part of the letter. One correction is spatial, because colour
 * alone cannot make it: silver sits almost exactly on the line from navy to
 * white, so a navy edge pixel at ~75% white reads as silver. A "silver" pixel
 * within two pixels of navy is therefore re-read as a navy/white blend, and
 * goes to navy only if it is more than half navy.
 *
 * SEGMENTATION. 8-connected components per ink, then each component gets a
 * role from where it sits (see PARTS). The lower navy arc is cut into three
 * blobs by the stripes; it is fitted as one arc. The X is two orange blobs
 * (the bevel splits it), folded into one letter like the İ and its dot.
 *
 * CRESCENTS are the region between two circles with different centres. The
 * blob's edge pixels are split into inner and outer by which way the ground
 * lies, a least-squares circle is fitted to each set with outliers (tips,
 * cuts, occlusion edges) trimmed, and each end is read as the angular extent
 * of the inlying edge points on each circle. So a tapered tip closes where
 * the circles meet, and a cut end (horizontal, or slanted where a stripe
 * crosses) closes along the cut.
 *
 * --verify renders the real <Mark> (components/brand/mark.tsx) one layer at a
 * time at the PNG's own size, flattens it on white, classifies it the same
 * way, and prints IoU per layer against the PNG's role masks.
 */
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import sharp from "sharp"

const SRC = "public/kariyer-expo.png"

type Rgb = readonly [number, number, number]
type Ink = "navy" | "orange" | "silver"
type Layer = "arcs" | "dots" | "stripes" | "letters"

// Measured: the mean of the pixels within 20 of each seed, iterated to rest.
const REFS = {
  navy: [3, 33, 79],
  orange: [255, 104, 55],
  silver: [193, 201, 214],
  white: [255, 255, 255],
} as const satisfies Record<string, Rgb>

const NONE = 0
const CODE: Record<Ink, number> = { navy: 1, orange: 2, silver: 3 }
const INK_OF: Ink[] = ["navy", "navy", "orange", "silver"]

type Img = { w: number; h: number; cls: Uint8Array }

// --- classification ---------------------------------------------------------

function distance2(r: number, g: number, b: number, ref: Rgb) {
  return (r - ref[0]) ** 2 + (g - ref[1]) ** 2 + (b - ref[2]) ** 2
}

/** Position of a colour along the segment a -> b, clamped to [0, 1]. */
function along(r: number, g: number, b: number, a: Rgb, z: Rgb) {
  const d = [z[0] - a[0], z[1] - a[1], z[2] - a[2]]
  const t =
    ((r - a[0]) * d[0] + (g - a[1]) * d[1] + (b - a[2]) * d[2]) /
    (d[0] ** 2 + d[1] ** 2 + d[2] ** 2)
  return Math.min(1, Math.max(0, t))
}

function classify(rgba: Buffer, w: number, h: number): Img {
  const cls = new Uint8Array(w * h)
  const refs = Object.entries(REFS) as [keyof typeof REFS, Rgb][]
  for (let p = 0; p < w * h; p++) {
    const i = p * 4
    if (rgba[i + 3] < 128) continue
    let best: keyof typeof REFS = "white"
    let bestD = Infinity
    for (const [name, ref] of refs) {
      const d = distance2(rgba[i], rgba[i + 1], rgba[i + 2], ref)
      if (d < bestD) {
        bestD = d
        best = name
      }
    }
    if (best === "navy" || best === "orange" || best === "silver") {
      cls[p] = CODE[best]
    }
  }
  // Silver next to navy is a navy edge blended with white.
  const fixed = cls.slice()
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x
      if (cls[p] !== CODE.silver) continue
      let nearNavy = false
      for (let dy = -2; dy <= 2 && !nearNavy; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx
          const yy = y + dy
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue
          if (cls[yy * w + xx] === CODE.navy) {
            nearNavy = true
            break
          }
        }
      }
      if (!nearNavy) continue
      const i = p * 4
      const t = along(rgba[i], rgba[i + 1], rgba[i + 2], REFS.navy, REFS.white)
      fixed[p] = t < 0.5 ? CODE.navy : NONE
    }
  }
  return { w, h, cls: fixed }
}

async function loadPng(): Promise<Img> {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return classify(data, info.width, info.height)
}

// --- components -------------------------------------------------------------

type Blob = {
  id: number
  ink: Ink
  pixels: number[]
  area: number
  x0: number
  y0: number
  x1: number
  y1: number
  cx: number
  cy: number
}

function components(img: Img, minArea = 40): Blob[] {
  const { w, h, cls } = img
  const seen = new Uint8Array(w * h)
  const blobs: Blob[] = []
  const stack: number[] = []
  for (let start = 0; start < w * h; start++) {
    const c = cls[start]
    if (c === NONE || seen[start]) continue
    const pixels: number[] = []
    stack.push(start)
    seen[start] = 1
    while (stack.length) {
      const p = stack.pop()!
      pixels.push(p)
      const x = p % w
      const y = (p - x) / w
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx
          const yy = y + dy
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue
          const q = yy * w + xx
          if (!seen[q] && cls[q] === c) {
            seen[q] = 1
            stack.push(q)
          }
        }
      }
    }
    if (pixels.length < minArea) continue
    let x0 = w
    let y0 = h
    let x1 = 0
    let y1 = 0
    let sx = 0
    let sy = 0
    for (const p of pixels) {
      const x = p % w
      const y = (p - x) / w
      x0 = Math.min(x0, x)
      y0 = Math.min(y0, y)
      x1 = Math.max(x1, x)
      y1 = Math.max(y1, y)
      sx += x
      sy += y
    }
    blobs.push({
      id: blobs.length,
      ink: INK_OF[c],
      pixels,
      area: pixels.length,
      x0,
      y0,
      x1,
      y1,
      cx: sx / pixels.length + 0.5,
      cy: sy / pixels.length + 0.5,
    })
  }
  return blobs
}

// --- roles ------------------------------------------------------------------

type Pt = readonly [number, number]

/**
 * Where each part sits, as the centroid of each blob it is made of. A blob
 * is claimed by the nearest listed centroid of its ink within 20px. The
 * pale silver sheen behind the navy stripe (its extruded side) is
 * deliberately left unclaimed.
 */
const PARTS = {
  arcs: {
    navyUpper: { ink: "navy", at: [[448, 217]] },
    orangeUpper: { ink: "orange", at: [[814, 244]] },
    silver: { ink: "silver", at: [[965, 270]] },
    navyLower: {
      ink: "navy",
      at: [
        [202, 811],
        [348, 981],
        [735, 1035],
      ],
    },
    orangeLower: { ink: "orange", at: [[875, 935]] },
  },
  dots: {
    navy: { ink: "navy", at: [[1122, 724]] },
    orange: { ink: "orange", at: [[1102, 787]] },
    silver: { ink: "silver", at: [[1078, 848]] },
  },
  stripes: {
    navy: { ink: "navy", at: [[384, 818]] },
    orange: { ink: "orange", at: [[365, 921]] },
    silver: { ink: "silver", at: [[468, 912]] },
  },
} as const satisfies Record<
  Exclude<Layer, "letters">,
  Record<string, { ink: Ink; at: readonly Pt[] }>
>

/**
 * Ink-box bands for the three lines of type. EXPO's X and the 27's 7 are
 * orange; KARİYER is navy only.
 */
type Band = { y0: number; y1: number; x0?: number; x1?: number; inks: Ink[] }
const LINES = {
  kariyer: { y0: 330, y1: 440, inks: ["navy"] },
  expo: { y0: 470, y1: 725, inks: ["navy", "orange"] },
  edition: { y0: 735, y1: 865, x0: 600, x1: 1000, inks: ["navy", "orange"] },
} as const satisfies Record<string, Band>

function claim(blobs: Blob[], ink: Ink, at: readonly Pt[]): Blob[] {
  return at.map(([x, y]) => {
    const found = blobs
      .filter((b) => b.ink === ink)
      .map((b) => ({ b, d: Math.hypot(b.cx - x, b.cy - y) }))
      .sort((a, b) => a.d - b.d)[0]
    if (!found || found.d > 20) {
      throw new Error(`no ${ink} blob near (${x}, ${y})`)
    }
    return found.b
  })
}

type Box = { x: number; y: number; w: number; h: number }

function letterBlobs(blobs: Blob[]) {
  const inBand = (b: Blob, band: Band) =>
    band.inks.includes(b.ink) &&
    b.y0 >= band.y0 &&
    b.y1 <= band.y1 &&
    b.x0 >= (band.x0 ?? 0) &&
    b.x1 <= (band.x1 ?? Infinity)
  const line = (band: Band) => {
    const found = blobs.filter((b) => inBand(b, band))
    // A smaller blob of the same ink inside another's x range is part of it:
    // the İ's dot, the X's second stroke. Fold it into the larger one.
    const within = (b: Blob, o: Blob) =>
      o !== b &&
      o.ink === b.ink &&
      o.area > b.area &&
      b.x0 >= o.x0 &&
      b.x1 <= o.x1
    const letters = found.filter((b) => !found.some((o) => within(b, o)))
    return letters
      .map((l) => [l, ...found.filter((d) => within(d, l))])
      .sort((a, b) => a[0].x0 - b[0].x0)
  }
  return {
    kariyer: line(LINES.kariyer),
    expo: line(LINES.expo),
    edition: line(LINES.edition),
  }
}

function boxOf(parts: Blob[]): Box {
  const x0 = Math.min(...parts.map((b) => b.x0))
  const y0 = Math.min(...parts.map((b) => b.y0))
  const x1 = Math.max(...parts.map((b) => b.x1)) + 1
  const y1 = Math.max(...parts.map((b) => b.y1)) + 1
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}

// --- circles ----------------------------------------------------------------

type Circle = { cx: number; cy: number; r: number }

function solve3(m: number[][], v: number[]): number[] {
  // Gaussian elimination with partial pivoting on a 3x3 system.
  const a = m.map((row, i) => [...row, v[i]])
  for (let c = 0; c < 3; c++) {
    let pivot = c
    for (let r = c + 1; r < 3; r++) {
      if (Math.abs(a[r][c]) > Math.abs(a[pivot][c])) pivot = r
    }
    ;[a[c], a[pivot]] = [a[pivot], a[c]]
    for (let r = 0; r < 3; r++) {
      if (r === c) continue
      const f = a[r][c] / a[c][c]
      for (let k = c; k < 4; k++) a[r][k] -= f * a[c][k]
    }
  }
  return [a[0][3] / a[0][0], a[1][3] / a[1][1], a[2][3] / a[2][2]]
}

/** Algebraic (Kasa) fit, then Gauss-Newton on the geometric distance. */
function fitCircle(points: Pt[]): Circle {
  const n = points.length
  let sx = 0
  let sy = 0
  let sxx = 0
  let syy = 0
  let sxy = 0
  let sz = 0
  let sxz = 0
  let syz = 0
  for (const [x, y] of points) {
    const z = x * x + y * y
    sx += x
    sy += y
    sxx += x * x
    syy += y * y
    sxy += x * y
    sz += z
    sxz += x * z
    syz += y * z
  }
  const [d, e, f] = solve3(
    [
      [sxx, sxy, sx],
      [sxy, syy, sy],
      [sx, sy, n],
    ],
    [-sxz, -syz, -sz]
  )
  let cx = -d / 2
  let cy = -e / 2
  let r = Math.sqrt(cx * cx + cy * cy - f)
  for (let iter = 0; iter < 20; iter++) {
    const jtj = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
    const jtr = [0, 0, 0]
    for (const [x, y] of points) {
      const dist = Math.hypot(x - cx, y - cy)
      const res = dist - r
      const j = [-(x - cx) / dist, -(y - cy) / dist, -1]
      for (let a = 0; a < 3; a++) {
        jtr[a] += j[a] * res
        for (let b = 0; b < 3; b++) jtj[a][b] += j[a] * j[b]
      }
    }
    const [da, db, dr] = solve3(jtj, jtr)
    cx -= da
    cy -= db
    r -= dr
    if (Math.abs(da) + Math.abs(db) + Math.abs(dr) < 1e-6) break
  }
  return { cx, cy, r }
}

/** Fit, drop the points off the circle, refit, with a tightening tolerance. */
function fitTrimmed(points: Pt[]) {
  let inliers = points
  let circle = fitCircle(points)
  for (const tolerance of [8, 5, 3, 2, 1.5, 1.5]) {
    inliers = points.filter(
      ([x, y]) =>
        Math.abs(Math.hypot(x - circle.cx, y - circle.cy) - circle.r) <
        tolerance
    )
    circle = fitCircle(inliers)
  }
  const rms = Math.sqrt(
    inliers.reduce(
      (s, [x, y]) =>
        s + (Math.hypot(x - circle.cx, y - circle.cy) - circle.r) ** 2,
      0
    ) / inliers.length
  )
  return { circle, inliers, rms }
}

const deg = (rad: number) => (rad * 180) / Math.PI
const angleOf = (c: { cx: number; cy: number }, [x, y]: Pt) =>
  deg(Math.atan2(y - c.cy, x - c.cx))
/** An angle moved into the 360° window centred on `ref`. */
const unwrap = (a: number, ref: number) =>
  ref + ((((a - ref + 180) % 360) + 360) % 360) - 180
const dot = (a: Pt, b: Pt) => a[0] * b[0] + a[1] * b[1]

type Edge = { pt: Pt; normal: Pt; part: number }

/** Boundary pixels of a mask, each with the direction the ground lies in. */
function edgesOf(img: Img, parts: Blob[]): Edge[] {
  const { w } = img
  const mask = new Uint8Array(img.w * img.h)
  parts.forEach((b) => b.pixels.forEach((p) => (mask[p] = 1)))
  const edges: Edge[] = []
  parts.forEach((b, part) => {
    for (const p of b.pixels) {
      const x = p % w
      const y = (p - x) / w
      let nx = 0
      let ny = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if ((dx || dy) && !mask[(y + dy) * w + x + dx]) {
            nx += dx
            ny += dy
          }
        }
      }
      const len = Math.hypot(nx, ny)
      if (len) {
        edges.push({
          pt: [x + 0.5, y + 0.5],
          normal: [nx / len, ny / len],
          part,
        })
      }
    }
  })
  return edges
}

type Line = { m: Pt; d: Pt; n: Pt }

/** Total-least-squares line, trimmed; `n` points to the ground. */
function fitLine(edges: Edge[]): Line & { rms: number } {
  let pts = edges.map((e) => e.pt)
  let line: Line = { m: [0, 0], d: [1, 0], n: [0, 1] }
  for (const tolerance of [Infinity, 3, 2, 1.5]) {
    pts = pts.filter(
      (p) =>
        Math.abs(dot([p[0] - line.m[0], p[1] - line.m[1]], line.n)) < tolerance
    )
    const { centre, u } = axisOf(pts)
    let n: Pt = [-u[1], u[0]]
    const ground = edges.reduce((s, e) => s + dot(e.normal, n), 0)
    if (ground < 0) n = [-n[0], -n[1]]
    line = { m: centre, d: u, n }
  }
  const rms = Math.sqrt(
    pts.reduce(
      (s, p) => s + dot([p[0] - line.m[0], p[1] - line.m[1]], line.n) ** 2,
      0
    ) / pts.length
  )
  // Edge pixel centres sit half a pixel inside the ink's edge.
  return {
    ...line,
    m: [line.m[0] + line.n[0] / 2, line.m[1] + line.n[1] / 2],
    rms,
  }
}

function lineCircle(l: Line, c: Circle, near: Pt): Pt | null {
  const fx = l.m[0] - c.cx
  const fy = l.m[1] - c.cy
  const b = fx * l.d[0] + fy * l.d[1]
  const disc = b * b - (fx * fx + fy * fy - c.r * c.r)
  if (disc < 0) return null
  const hits = [-b - Math.sqrt(disc), -b + Math.sqrt(disc)].map(
    (t) => [l.m[0] + t * l.d[0], l.m[1] + t * l.d[1]] as Pt
  )
  const dist = (p: Pt) => Math.hypot(p[0] - near[0], p[1] - near[1])
  return dist(hits[0]) < dist(hits[1]) ? hits[0] : hits[1]
}

function lineLine(a: Line, b: Line): Pt {
  // a.m + t a.d on b: dot(a.m + t a.d - b.m, b.n) = 0
  const t = dot([b.m[0] - a.m[0], b.m[1] - a.m[1]], b.n) / dot(a.d, b.n)
  return [a.m[0] + t * a.d[0], a.m[1] + t * a.d[1]]
}

type Span = { outer: [number, number]; inner: [number, number] }

/**
 * A crescent: two circles fitted to the inner and outer edges, and one span
 * per blob. Each span end is a cut line fitted to the pixels that face
 * along the arc rather than across it; where there are too few of those the
 * end is a tip, and both circles end at the tip pixel's angle.
 */
function measureArc(img: Img, parts: Blob[]) {
  const edges = edgesOf(img, parts)
  const rough = fitCircle(edges.map((e) => e.pt))
  const radial = (e: Edge) =>
    dot([e.pt[0] - rough.cx, e.pt[1] - rough.cy], e.normal) /
    Math.hypot(e.pt[0] - rough.cx, e.pt[1] - rough.cy)

  const outerFit = fitTrimmed(
    edges.filter((e) => radial(e) > 0.6).map((e) => e.pt)
  )
  const innerFit = fitTrimmed(
    edges.filter((e) => radial(e) < -0.6).map((e) => e.pt)
  )
  // Edge pixel centres sit half a pixel inside the ink's edge.
  const outer = { ...outerFit.circle, r: outerFit.circle.r + 0.5 }
  const inner = { ...innerFit.circle, r: innerFit.circle.r - 0.5 }

  let sx = 0
  let sy = 0
  let area = 0
  for (const b of parts) {
    sx += b.cx * b.area
    sy += b.cy * b.area
    area += b.area
  }
  const centroid: Pt = [sx / area, sy / area]
  const refOuter = angleOf(outer, centroid)
  const refInner = angleOf(inner, centroid)
  const refRough = angleOf(rough, centroid)

  // A cut pixel faces neither circle: its ground lies more than 35° away
  // from both the outer circle's outward normal and the inner one's inward.
  const facing = (e: Edge, c: Circle, sign: 1 | -1) =>
    (sign * dot([e.pt[0] - c.cx, e.pt[1] - c.cy], e.normal)) /
    Math.hypot(e.pt[0] - c.cx, e.pt[1] - c.cy)
  const isCut = (e: Edge) =>
    facing(e, outer, 1) < 0.82 && facing(e, inner, -1) < 0.82

  const ends: string[] = []
  const spans: Span[] = parts.map((_, k) => {
    const own = edges.filter((e) => e.part === k)
    const along = (e: Edge) => unwrap(angleOf(rough, e.pt), refRough)
    const angles = own.map(along)
    const lo = Math.min(...angles)
    const hi = Math.max(...angles)
    const half = (lo + hi) / 2
    const cut = own.filter(isCut)
    const end = (side: "start" | "end") => {
      const extreme = own[angles.indexOf(side === "start" ? lo : hi)]
      const pts = cut.filter((e) =>
        side === "start"
          ? along(e) < Math.min(half, lo + 8)
          : along(e) > Math.max(half, hi - 8)
      )
      if (pts.length >= 8) {
        const line = fitLine(pts)
        const o = lineCircle(line, outer, extreme.pt)
        const i = lineCircle(line, inner, extreme.pt)
        if (o && i && line.rms < 1.5) {
          ends.push(`cut (${pts.length} px, rms ${line.rms.toFixed(2)})`)
          return {
            outer: unwrap(angleOf(outer, o), refOuter),
            inner: unwrap(angleOf(inner, i), refInner),
          }
        }
      }
      ends.push("tip")
      return {
        outer: unwrap(angleOf(outer, extreme.pt), refOuter),
        inner: unwrap(angleOf(inner, extreme.pt), refInner),
      }
    }
    const a = end("start")
    const b = end("end")
    return { outer: [a.outer, b.outer], inner: [a.inner, b.inner] }
  })
  spans.sort((a, b) => a.outer[0] - b.outer[0])

  return {
    outer,
    inner,
    spans,
    ends,
    rms: { outer: outerFit.rms, inner: innerFit.rms },
    used: { outer: outerFit.inliers.length, inner: innerFit.inliers.length },
  }
}

// --- stripes ----------------------------------------------------------------

/** Principal axis of a point set, pointing right (screen y runs down). */
function axisOf(points: Pt[]) {
  let mx = 0
  let my = 0
  for (const [x, y] of points) {
    mx += x
    my += y
  }
  mx /= points.length
  my /= points.length
  let sxx = 0
  let syy = 0
  let sxy = 0
  for (const [x, y] of points) {
    sxx += (x - mx) ** 2
    syy += (y - my) ** 2
    sxy += (x - mx) * (y - my)
  }
  const theta = 0.5 * Math.atan2(2 * sxy, sxx - syy)
  let u: Pt = [Math.cos(theta), Math.sin(theta)]
  if (u[0] < 0) u = [-u[0], -u[1]]
  return { centre: [mx, my] as Pt, u }
}

/** Degrees above the horizontal of a direction (screen y runs down). */
const rise = (d: Pt) =>
  -deg(Math.atan2(d[1], Math.abs(d[0]) * Math.sign(d[0] || 1)))

/**
 * Each stripe is four lines. The long sides are fitted to the edge pixels
 * that face across the stripe. The navy stripe's ends are fitted the same
 * way; the orange and silver stripes end on level cuts at their first and
 * last rows.
 */
function measureStripes(img: Img, blobs: Blob[]) {
  const take = (ink: Ink, at: readonly Pt[]) => claim(blobs, ink, at)[0]
  const navyBlob = take("navy", PARTS.stripes.navy.at)
  const { u } = axisOf(navyBlob.pixels.map((p) => pointOf(img, p)))
  const up: Pt = u[1] < 0 ? u : [-u[0], -u[1]]
  const across: Pt = [-up[1], up[0]] // points down-right
  const sides = (b: Blob) => {
    const edges = edgesOf(img, [b]).filter(
      (e) => e.pt[1] > b.y0 + 1 && e.pt[1] < b.y1
    )
    const facing = (v: Pt) => edges.filter((e) => dot(e.normal, v) > 0.85)
    return {
      upperLeft: fitLine(facing([-across[0], -across[1]])),
      lowerRight: fitLine(facing(across)),
      top: facing(up),
      foot: facing([-up[0], -up[1]]),
    }
  }
  const level = (y: number): Line => ({ m: [0, y], d: [1, 0], n: [0, 1] })
  const quad = (a: Line, b: Line, top: Line, foot: Line) => [
    lineLine(a, foot),
    lineLine(a, top),
    lineLine(b, top),
    lineLine(b, foot),
  ]

  const navy = sides(navyBlob)
  const navyTop = fitLine(navy.top)
  const navyFoot = fitLine(navy.foot)
  const navyQuad = quad(navy.upperLeft, navy.lowerRight, navyTop, navyFoot)

  const levelled = (ink: Ink) => {
    const blob = take(ink, PARTS.stripes[ink].at)
    const s = sides(blob)
    return {
      s,
      quad: quad(s.upperLeft, s.lowerRight, level(blob.y0), level(blob.y1 + 1)),
    }
  }
  const orange = levelled("orange")
  const silver = levelled("silver")
  const dir = (l: Line): Pt => (l.d[1] < 0 ? l.d : [-l.d[0], -l.d[1]])

  const sideAngles = (s: { upperLeft: Line; lowerRight: Line }) =>
    [rise(dir(s.upperLeft)), rise(dir(s.lowerRight))] as const
  return {
    angle: rise(up),
    sides: {
      navy: sideAngles(navy),
      orange: sideAngles(orange.s),
      silver: sideAngles(silver.s),
    },
    rms: [navy, orange.s, silver.s].map((s) => [
      s.upperLeft.rms,
      s.lowerRight.rms,
    ]),
    polygons: { navy: navyQuad, orange: orange.quad, silver: silver.quad },
  }
}

function pointOf(img: Img, p: number): Pt {
  const x = p % img.w
  return [x + 0.5, (p - x) / img.w + 0.5]
}

// --- letters ----------------------------------------------------------------

/** The E's stem: the single ink run on the rows between its arms. */
function measureStem(img: Img, e: Blob) {
  const runs: number[] = []
  const inBlob = new Set(e.pixels)
  for (let y = e.y0; y <= e.y1; y++) {
    const spans: number[] = []
    let run = 0
    for (let x = e.x0; x <= e.x1 + 1; x++) {
      if (inBlob.has(y * img.w + x)) run++
      else if (run) {
        spans.push(run)
        run = 0
      }
    }
    if (spans.length === 1 && spans[0] < (e.x1 - e.x0) / 2) runs.push(spans[0])
  }
  runs.sort((a, b) => a - b)
  return { stem: runs[runs.length >> 1], rows: runs.length }
}

/**
 * EXPO's slant, as the tangent of its lean: a line fitted to the E's left
 * edge (the leftmost ink on every row), clear of the rounded corners.
 */
function measureSlant(img: Img, e: Blob) {
  const left = new Map<number, number>()
  for (const p of e.pixels) {
    const x = p % img.w
    const y = (p - x) / img.w
    left.set(y, Math.min(left.get(y) ?? Infinity, x))
  }
  const trim = (e.y1 - e.y0) * 0.1
  const pts = [...left].filter(([y]) => y > e.y0 + trim && y < e.y1 - trim)
  const my = pts.reduce((s, [y]) => s + y, 0) / pts.length
  const mx = pts.reduce((s, [, x]) => s + x, 0) / pts.length
  const slope =
    pts.reduce((s, [y, x]) => s + (y - my) * (x - mx), 0) /
    pts.reduce((s, [y]) => s + (y - my) ** 2, 0)
  // x falls as y rises down the page, so the lean is the negated slope.
  return -slope
}

/**
 * The X is not a font glyph: it is two straight-edged strokes, one of them
 * bevelled. Each blob's outline is traced along pixel edges (so a corner of
 * the outline is a corner of a pixel) and simplified with Ramer-Douglas-
 * Peucker, which returns the handful of vertices a straight-edged shape has.
 */
function tracePolygon(img: Img, b: Blob, tolerance = 1.5): Pt[] {
  const inside = new Set(b.pixels)
  const has = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < img.w && y < img.h && inside.has(y * img.w + x)
  // Directed pixel edges, ink on the right (clockwise, y down).
  const next = new Map<string, Pt>()
  const key = ([x, y]: Pt) => `${x},${y}`
  for (const p of b.pixels) {
    const x = p % img.w
    const y = (p - x) / img.w
    if (!has(x, y - 1)) next.set(key([x, y]), [x + 1, y])
    if (!has(x + 1, y)) next.set(key([x + 1, y]), [x + 1, y + 1])
    if (!has(x, y + 1)) next.set(key([x + 1, y + 1]), [x, y + 1])
    if (!has(x - 1, y)) next.set(key([x, y + 1]), [x, y])
  }
  // The outer loop starts at the top-left pixel's top-left corner.
  const top = Math.min(...b.pixels)
  const start: Pt = [top % img.w, (top - (top % img.w)) / img.w]
  const loop: Pt[] = [start]
  for (let at = next.get(key(start))!; key(at) !== key(start);) {
    loop.push(at)
    at = next.get(key(at))!
  }
  const rdp = (pts: Pt[]): Pt[] => {
    const [a, z] = [pts[0], pts[pts.length - 1]]
    const len = Math.hypot(z[0] - a[0], z[1] - a[1]) || 1
    let far = 0
    let at = 0
    pts.forEach(([x, y], i) => {
      const d =
        Math.abs((z[0] - a[0]) * (a[1] - y) - (a[0] - x) * (z[1] - a[1])) / len
      if (d > far) [far, at] = [d, i]
    })
    if (far <= tolerance) return [a, z]
    return [...rdp(pts.slice(0, at + 1)).slice(0, -1), ...rdp(pts.slice(at))]
  }
  // Split the closed loop at its farthest point so both halves are open.
  const far = loop.reduce(
    (best, p, i) =>
      Math.hypot(p[0] - start[0], p[1] - start[1]) >
      Math.hypot(loop[best][0] - start[0], loop[best][1] - start[1])
        ? i
        : best,
    0
  )
  return [
    ...rdp(loop.slice(0, far + 1)).slice(0, -1),
    ...rdp([...loop.slice(far), start]).slice(0, -1),
  ]
}

// --- measure ----------------------------------------------------------------

const r1 = (v: number) => Math.round(v * 10) / 10
const r2 = (v: number) => Math.round(v * 100) / 100

function measure(img: Img) {
  const blobs = components(img)

  const arcs = Object.fromEntries(
    Object.entries(PARTS.arcs).map(([name, part]) => {
      const m = measureArc(img, claim(blobs, part.ink, part.at))
      return [name, { ink: part.ink, ...m }]
    })
  )

  const dots = Object.fromEntries(
    Object.entries(PARTS.dots).map(([name, part]) => {
      const [b] = claim(blobs, part.ink, part.at)
      return [
        name,
        { ink: part.ink, cx: b.cx, cy: b.cy, r: Math.sqrt(b.area / Math.PI) },
      ]
    })
  )

  const stripes = measureStripes(img, blobs)
  const lines = letterBlobs(blobs)
  const letters = {
    kariyer: lines.kariyer.map(boxOf),
    expo: lines.expo.map(boxOf),
    edition: lines.edition.map(boxOf),
  }
  const stem = measureStem(img, lines.expo[0][0])
  const slant = measureSlant(img, lines.expo[0][0])
  const x = lines.expo[1].map((b) => tracePolygon(img, b))
  return { blobs, arcs, dots, stripes, letters, stem, slant, x, lines }
}

function printMeasurement() {
  return loadPng().then((img) => {
    const { arcs, dots, stripes, letters, stem, slant, x } = measure(img)
    const circle = (c: Circle) => ({ cx: r1(c.cx), cy: r1(c.cy), r: r1(c.r) })

    console.log("ARCS (angles clockwise from 3 o'clock, degrees)")
    for (const [name, a] of Object.entries(arcs)) {
      console.log(
        `  ${name}: outer rms ${a.rms.outer.toFixed(2)}px (${a.used.outer} px),` +
          ` inner rms ${a.rms.inner.toFixed(2)}px (${a.used.inner} px);` +
          ` ends ${a.ends.join(", ")}`
      )
    }
    console.log("DOTS")
    for (const [name, d] of Object.entries(dots)) {
      console.log(`  ${name}: (${r1(d.cx)}, ${r1(d.cy)}) r ${r1(d.r)}`)
    }
    console.log("STRIPES (degrees above horizontal)")
    console.log(`  navy axis ${stripes.angle.toFixed(2)}°`)
    for (const [ink, [a, b]] of Object.entries(stripes.sides)) {
      console.log(
        `  ${ink} sides: upper-left ${a.toFixed(2)}°, lower-right ${b.toFixed(2)}°`
      )
    }
    console.log(
      `  side fit rms ${stripes.rms.map((p) => p.map((v) => v.toFixed(2)).join("/")).join(", ")}`
    )
    console.log("LETTERS")
    for (const [name, boxes] of Object.entries(letters)) {
      console.log(
        `  ${name}: ` +
          boxes.map((b) => `[${b.x},${b.y} ${b.w}x${b.h}]`).join(" ")
      )
    }
    console.log(`  E stem ${stem.stem}px (median of ${stem.rows} rows)`)
    console.log(
      `  EXPO slant ${slant.toFixed(3)} (${deg(Math.atan(slant)).toFixed(1)}°)`
    )
    console.log(
      `  X strokes: ${x.map((p) => `${p.length} vertices`).join(", ")}`
    )

    const ts = {
      arcs: Object.entries(arcs).map(([id, a]) => ({
        id,
        ink: a.ink,
        outer: circle(a.outer),
        inner: circle(a.inner),
        spans: a.spans.map((s) => ({
          outer: s.outer.map(r2),
          inner: s.inner.map(r2),
        })),
      })),
      dots: Object.entries(dots).map(([id, d]) => ({
        id,
        ink: d.ink,
        cx: r1(d.cx),
        cy: r1(d.cy),
        r: r1(d.r),
      })),
      stripes: {
        angle: r2(stripes.angle),
        bars: Object.entries(stripes.polygons).map(([ink, pts]) => ({
          ink,
          points: pts.map(([x, y]) => [r1(x), r1(y)]),
        })),
      },
      letters: {
        ...letters,
        expoStem: stem.stem,
        expoSlant: Math.round(slant * 1000) / 1000,
        expoX: x,
      },
    }
    console.log("\nGEOMETRY (paste into components/brand/mark-geometry.ts)")
    console.log(JSON.stringify(ts))
  })
}

// --- verify -----------------------------------------------------------------

const LAYERS: Layer[] = ["arcs", "dots", "stripes", "letters"]
const hex = (rgb: Rgb) =>
  `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`

/**
 * The real <Mark>, at the PNG's size and in its pixel space. `only` hides
 * every other part. Inks are painted with the PNG's own measured colours, so
 * edges blend with white exactly as the logo's do and classify alike.
 */
async function renderMark(
  only?: Layer,
  paint: Record<Ink, string> = {
    navy: hex(REFS.navy),
    orange: hex(REFS.orange),
    silver: hex(REFS.silver),
  }
) {
  const { Mark } = await import("@/components/brand/mark")
  const { width: size } = await sharp(SRC).metadata()
  let svg = renderToStaticMarkup(
    createElement(Mark, {
      decorative: true,
      viewBox: `0 0 ${size} ${size}`,
      width: size,
      height: size,
    })
  )
  svg = svg
    .replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')
    .replace(/var\(--mark-(navy|orange|silver)\)/g, (_, ink: Ink) => paint[ink])
  if (only) {
    svg = svg.replace(/<g data-part="(\w+)"/g, (tag, part: string) =>
      part === only ? tag : `<g display="none" data-part="${part}"`
    )
  }
  return sharp(Buffer.from(svg)).flatten({ background: "#ffffff" })
}

async function verify(sideBySide?: string) {
  const truth = await loadPng()
  const { blobs, lines } = measure(truth)
  const { w, h } = truth
  const layerOf = new Uint8Array(w * h).fill(255)
  const mark = (layer: Layer, parts: Blob[]) =>
    parts.forEach((b) =>
      b.pixels.forEach((p) => (layerOf[p] = LAYERS.indexOf(layer)))
    )
  for (const layer of ["arcs", "dots", "stripes"] as const) {
    for (const part of Object.values(PARTS[layer])) {
      mark(layer, claim(blobs, part.ink, part.at))
    }
  }
  for (const line of Object.values(lines)) mark("letters", line.flat())

  console.log("IoU vs public/kariyer-expo.png")
  for (const layer of LAYERS) {
    const { data, info } = await (
      await renderMark(layer)
    )
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const drawn = classify(data, info.width, info.height)
    const k = LAYERS.indexOf(layer)
    const tally = { all: [0, 0], navy: [0, 0], orange: [0, 0], silver: [0, 0] }
    for (let p = 0; p < w * h; p++) {
      const t = layerOf[p] === k ? truth.cls[p] : NONE
      const d = drawn.cls[p]
      if (t === NONE && d === NONE) continue
      for (const key of ["all", INK_OF[t || d]] as const) {
        tally[key][1]++
        if (t === d) tally[key][0]++
      }
    }
    const iou = ([i, u]: number[]) => (u ? (i / u).toFixed(3) : "  -  ")
    console.log(
      `  ${layer.padEnd(8)} ${iou(tally.all)}   (navy ${iou(tally.navy)},` +
        ` orange ${iou(tally.orange)}, silver ${iou(tally.silver)})`
    )
  }

  if (sideBySide) {
    const drawn = await (await renderMark()).png().toBuffer()
    const source = await sharp(SRC)
      .flatten({ background: "#ffffff" })
      .png()
      .toBuffer()
    // Composite first: sharp would otherwise resize before compositing.
    const pair = await sharp({
      create: {
        width: w * 2 + 24,
        height: h,
        channels: 3,
        background: "#ffffff",
      },
    })
      .composite([
        { input: source, left: 0, top: 0 },
        { input: drawn, left: w + 24, top: 0 },
      ])
      .png()
      .toBuffer()
    await sharp(pair).resize({ width: 1600 }).png().toFile(sideBySide)
    console.log(`side by side: ${sideBySide}`)
  }
}

// --- entry ------------------------------------------------------------------

if (process.argv.includes("--list")) {
  for (const b of components(await loadPng())) {
    console.log(
      b.id,
      b.ink,
      b.area,
      `[${b.x0}..${b.x1}] x [${b.y0}..${b.y1}]`,
      `c=(${b.cx.toFixed(1)}, ${b.cy.toFixed(1)})`
    )
  }
} else if (process.argv.includes("--verify")) {
  const out = process.argv[process.argv.indexOf("--verify") + 1]
  await verify(out && !out.startsWith("--") ? out : undefined)
} else {
  await printMeasurement()
}
