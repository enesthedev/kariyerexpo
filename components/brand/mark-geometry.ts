/**
 * The Kariyer Expo 27 mark as measured geometry.
 *
 * Every number is a pixel of public/kariyer-expo.png (1254 x 1254), printed
 * by `bun scripts/measure-mark.ts` and pasted here. The mark is shown through
 * the crop `viewBox`, which is the ink box of the ring with a few pixels to
 * spare: very nearly square.
 * `bun scripts/measure-mark.ts --verify` scores the drawn mark against the
 * PNG, layer by layer.
 *
 * Shared by components/brand/mark*.tsx and scripts/generate-brand-assets.ts,
 * so this file is plain data plus pure path builders: no React, no colours.
 * Inks are names; each renderer maps them to its own paint.
 *
 * Angles are degrees clockwise from three o'clock (SVG's y runs down).
 */

export type Ink = "navy" | "orange" | "silver"
export type Circle = { cx: number; cy: number; r: number }
/** Where one visible piece starts and ends, on each circle. */
export type Span = {
  outer: readonly [number, number]
  inner: readonly [number, number]
}
/**
 * A tapered orbit: the region inside `outer` and outside `inner`, two
 * circles with different centres. A tip closes where the two ends meet; a
 * cut closes along a straight line. An arc that passes behind the stripes is
 * one crescent with several spans.
 */
export type Crescent = {
  id: string
  ink: Ink
  outer: Circle
  inner: Circle
  spans: readonly Span[]
}
export type Dot = { id: string; ink: Ink; cx: number; cy: number; r: number }
export type Bar = { ink: Ink; points: readonly (readonly [number, number])[] }
export type Box = { x: number; y: number; w: number; h: number }

export const MARK_VIEWBOX = { x: 136, y: 106, w: 1024, h: 1022 } as const
export const markViewBox = `${MARK_VIEWBOX.x} ${MARK_VIEWBOX.y} ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`

export const markGeometry = {
  /** In drawing order: the upper arcs clockwise, then the lower ones. */
  arcs: [
    {
      id: "navyUpper",
      ink: "navy",
      outer: { cx: 643.5, cy: 619.8, r: 501.8 },
      inner: { cx: 773.6, cy: 888.8, r: 742.3 },
      spans: [{ outer: [-159.98, -68.61], inner: [-143.58, -89.33] }],
    },
    {
      id: "orangeUpper",
      ink: "orange",
      outer: { cx: 675.7, cy: 554.3, r: 376.2 },
      inner: { cx: 608.6, cy: 625.9, r: 427.4 },
      spans: [{ outer: [-109.63, -34.34], inner: [-97.91, -41.63] }],
    },
    {
      id: "silver",
      ink: "silver",
      outer: { cx: 746, cy: 563.6, r: 404.6 },
      inner: { cx: 659.8, cy: 621.8, r: 458.5 },
      spans: [{ outer: [-99.09, -22.1], inner: [-86.92, -29.2] }],
    },
    {
      id: "navyLower",
      ink: "navy",
      outer: { cx: 643.5, cy: 603.4, r: 513.2 },
      inner: { cx: 650.5, cy: 557.3, r: 494.4 },
      spans: [
        { outer: [34.95, 121.35], inner: [38.53, 117.7] },
        { outer: [127.45, 129.76], inner: [123.71, 126.11] },
        { outer: [144.84, 166.4], inner: [141.28, 160.29] },
      ],
    },
    {
      id: "orangeLower",
      ink: "orange",
      outer: { cx: 663.7, cy: 627.8, r: 406 },
      inner: { cx: 626.6, cy: 570.1, r: 453.6 },
      spans: [{ outer: [13.45, 99.73], inner: [19.39, 93.98] }],
    },
  ],
  /** The three-dot cluster, top to bottom. */
  dots: [
    { id: "navy", ink: "navy", cx: 1121.8, cy: 724.4, r: 25.5 },
    { id: "orange", ink: "orange", cx: 1102.2, cy: 787.4, r: 25.5 },
    { id: "silver", ink: "silver", cx: 1078.1, cy: 848.3, r: 26.4 },
  ],
  /**
   * Three bars rising up-right. Their long sides are fitted separately, so
   * they fan by a few degrees, as in the logo. The navy bar is cut square at
   * both ends; orange and silver end on level cuts.
   */
  stripes: {
    angle: 40.55,
    bars: [
      {
        ink: "navy",
        points: [
          [233.2, 910.2],
          [511.8, 679.4],
          [541.6, 712.6],
          [270.3, 952.7],
        ],
      },
      {
        ink: "orange",
        points: [
          [203.6, 1032],
          [497.5, 785],
          [537.1, 785],
          [279.2, 1032],
        ],
      },
      {
        ink: "silver",
        points: [
          [308.4, 1033],
          [568.9, 784],
          [626.8, 784],
          [382, 1033],
        ],
      },
    ],
  },
  /**
   * Ink boxes of each glyph, left to right. The İ's box includes its dot;
   * EXPO's boxes include their lean. `expoStem` is the E's stem width, which
   * picks the outline weight; `expoSlant` is EXPO's lean as a tangent (the
   * logo sets EXPO oblique, KARİYER and 27 upright). `expoX` is the X,
   * which is no font's: two straight-edged strokes traced off the logo.
   * `accents` are the orange glyphs: the X and the 7.
   */
  letters: {
    kariyer: [
      { x: 347, y: 364, w: 73, h: 73 },
      { x: 434, y: 364, w: 85, h: 73 },
      { x: 542, y: 364, w: 67, h: 73 },
      { x: 636, y: 337, w: 21, h: 100 },
      { x: 680, y: 364, w: 75, h: 73 },
      { x: 778, y: 364, w: 59, h: 73 },
      { x: 865, y: 364, w: 68, h: 73 },
    ],
    expo: [
      { x: 169, y: 478, w: 202, h: 214 },
      { x: 360, y: 480, w: 291, h: 242 },
      { x: 628, y: 478, w: 212, h: 214 },
      { x: 855, y: 474, w: 236, h: 221 },
    ],
    edition: [
      { x: 676, y: 741, w: 133, h: 119 },
      { x: 819, y: 743, w: 124, h: 117 },
    ],
    expoStem: 52,
    expoSlant: 0.198,
    expoX: [
      [
        [367, 480],
        [431, 481],
        [616, 680],
        [649, 717],
        [651, 722],
        [584, 722],
        [492, 622],
        [487, 624],
        [432, 678],
        [360, 677],
        [458, 586],
        [363, 483],
        [363, 481],
      ],
      [
        [633, 480],
        [642, 480],
        [642, 482],
        [545, 582],
        [542, 582],
        [508, 546],
        [508, 542],
        [568, 481],
      ],
    ],
    accents: { kariyer: [], expo: [1], edition: [1] },
  },
} as const satisfies {
  arcs: readonly Crescent[]
  dots: readonly Dot[]
  stripes: { angle: number; bars: readonly Bar[] }
  letters: {
    kariyer: readonly Box[]
    expo: readonly Box[]
    edition: readonly Box[]
    expoStem: number
    expoSlant: number
    expoX: readonly (readonly (readonly [number, number])[])[]
    accents: Record<"kariyer" | "expo" | "edition", readonly number[]>
  }
}

// --- path builders -----------------------------------------------------------

const round = (v: number) => Math.round(v * 10) / 10
const at = (c: { cx: number; cy: number }, r: number, degrees: number) => {
  const a = (degrees * Math.PI) / 180
  return `${round(c.cx + r * Math.cos(a))} ${round(c.cy + r * Math.sin(a))}`
}

/** One span of a crescent as a closed, filled path. */
export function crescentPath(c: Crescent, span: Span): string {
  const [o0, o1] = span.outer
  const [i0, i1] = span.inner
  const ro = round(c.outer.r)
  const ri = round(c.inner.r)
  return (
    `M${at(c.outer, c.outer.r, o0)}` +
    `A${ro} ${ro} 0 ${o1 - o0 > 180 ? 1 : 0} 1 ${at(c.outer, c.outer.r, o1)}` +
    `L${at(c.inner, c.inner.r, i1)}` +
    `A${ri} ${ri} 0 ${i1 - i0 > 180 ? 1 : 0} 0 ${at(c.inner, c.inner.r, i0)}Z`
  )
}

/** Every span of a crescent, as one path. */
export function crescentPaths(c: Crescent): string {
  return c.spans.map((s) => crescentPath(c, s)).join("")
}

/**
 * A stroke that sweeps the whole crescent, gaps included, along the circle
 * halfway between its two edges. Stroked `width` wide inside a mask and drawn
 * on with pathLength, it reveals the filled crescent from its first end to
 * its last.
 */
export function crescentSweep(c: Crescent): { d: string; width: number } {
  const mid = {
    cx: (c.outer.cx + c.inner.cx) / 2,
    cy: (c.outer.cy + c.inner.cy) / 2,
  }
  const rm = (c.outer.r + c.inner.r) / 2
  const angleFromMid = (circle: Circle, degrees: number) => {
    const a = (degrees * Math.PI) / 180
    const x = circle.cx + circle.r * Math.cos(a) - mid.cx
    const y = circle.cy + circle.r * Math.sin(a) - mid.cy
    return (Math.atan2(y, x) * 180) / Math.PI
  }
  const first = c.spans[0]
  const last = c.spans[c.spans.length - 1]
  const start = Math.min(
    angleFromMid(c.outer, first.outer[0]),
    angleFromMid(c.inner, first.inner[0])
  )
  let end = Math.max(
    angleFromMid(c.outer, last.outer[1]),
    angleFromMid(c.inner, last.inner[1])
  )
  while (end < start) end += 360

  // Half-width: the farthest either edge strays from the middle circle.
  const reach = (circle: Circle, a: number) => {
    const b =
      (mid.cx - circle.cx) * Math.cos(a) + (mid.cy - circle.cy) * Math.sin(a)
    const f = (mid.cx - circle.cx) ** 2 + (mid.cy - circle.cy) ** 2
    return -b + Math.sqrt(b * b - f + circle.r * circle.r)
  }
  let half = 0
  for (let d = start; d <= end; d += 1) {
    const a = (d * Math.PI) / 180
    half = Math.max(
      half,
      Math.abs(reach(c.outer, a) - rm),
      Math.abs(reach(c.inner, a) - rm)
    )
  }
  const from = start - 1
  const to = end + 1
  return {
    d:
      `M${at(mid, rm, from)}` +
      `A${round(rm)} ${round(rm)} 0 ${to - from > 180 ? 1 : 0} 1 ${at(mid, rm, to)}`,
    width: Math.ceil(half * 2 + 4),
  }
}

/** A stripe as a closed polygon. */
export function barPath(bar: Bar): string {
  return `M${bar.points.map(([x, y]) => `${x} ${y}`).join("L")}Z`
}
