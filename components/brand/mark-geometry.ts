/**
 * The Kariyer Expo 27 mark as measured geometry.
 *
 * Every number is a pixel of public/kariyer-expo.png (1097 x 1097), printed
 * by `bun scripts/measure-mark.ts` and pasted here. The mark is shown through
 * the crop `viewBox`, so layouts built on its 922 : 876 aspect never move.
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
 * cut closes along a straight line. An arc that passes behind the stripes or
 * the orange dot is one crescent with several spans.
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

export const MARK_VIEWBOX = { x: 88, y: 102, w: 922, h: 876 } as const
export const markViewBox = `${MARK_VIEWBOX.x} ${MARK_VIEWBOX.y} ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`

export const markGeometry = {
  /** In drawing order: the upper arcs clockwise, then the lower ones. */
  arcs: [
    {
      id: "navyUpper",
      ink: "navy",
      outer: { cx: 563, cy: 542.3, r: 439.2 },
      inner: { cx: 675, cy: 774, r: 645.3 },
      spans: [{ outer: [-160, -68.57], inner: [-143.71, -85.67] }],
    },
    {
      id: "orangeUpper",
      ink: "orange",
      outer: { cx: 609.5, cy: 485.5, r: 329.1 },
      inner: { cx: 550.8, cy: 548.5, r: 373.9 },
      spans: [{ outer: [-109.76, -34.32], inner: [-98, -41.65] }],
    },
    {
      id: "silver",
      ink: "silver",
      outer: { cx: 661, cy: 468.9, r: 325 },
      inner: { cx: 620.7, cy: 487.2, r: 344.2 },
      spans: [
        { outer: [-87.79, -76.81], inner: [-81.22, -69.83] },
        { outer: [-61.12, -12.35], inner: [-58.41, -16.18] },
      ],
    },
    {
      id: "navyLower",
      ink: "navy",
      outer: { cx: 562.7, cy: 528.6, r: 448.3 },
      inner: { cx: 569, cy: 487.5, r: 432.5 },
      spans: [
        { outer: [34.86, 121.07], inner: [38.47, 117.39] },
        { outer: [127.13, 129.45], inner: [123.41, 125.73] },
        { outer: [144.6, 166.52], inner: [140.99, 160.33] },
      ],
    },
    {
      id: "orangeLower",
      ink: "orange",
      outer: { cx: 579.6, cy: 548, r: 356.7 },
      inner: { cx: 548.2, cy: 498.8, r: 396.8 },
      spans: [{ outer: [13.69, 99.46], inner: [19.46, 93.92] }],
    },
  ],
  /** The three-dot cluster top to bottom, then the orange dot at the top. */
  dots: [
    { id: "navy", ink: "navy", cx: 981.4, cy: 633.7, r: 22.3 },
    { id: "orange", ink: "orange", cx: 964.2, cy: 688.8, r: 22.2 },
    { id: "silver", ink: "silver", cx: 943.2, cy: 742.1, r: 22.9 },
    { id: "orangeTop", ink: "orange", cx: 785.9, cy: 145.7, r: 35.2 },
  ],
  /**
   * Three bars rising up-right. Their long sides are fitted separately, so
   * they fan by a degree or two, as in the logo. The navy bar is cut square
   * at both ends; orange and silver end on level cuts. The silver bar's top
   * is under the logo's haze, so it has the navy bar's length.
   */
  stripes: {
    angle: 40.54,
    bars: [
      {
        ink: "navy",
        points: [
          [204.7, 799.5],
          [448.3, 597.6],
          [474.6, 626.5],
          [237.3, 836.5],
        ],
      },
      {
        ink: "orange",
        points: [
          [178.9, 906],
          [436, 690],
          [470.3, 690],
          [244.8, 906],
        ],
      },
      {
        ink: "silver",
        points: [
          [272.1, 906],
          [504.4, 683.9],
          [554, 683.9],
          [334.9, 906],
        ],
      },
    ],
  },
  /**
   * Ink boxes of each glyph, left to right. The İ's box includes its dot.
   * `expoStem` is the E's stem width, which picks the outline weight.
   */
  letters: {
    kariyer: [
      { x: 304, y: 319, w: 63, h: 64 },
      { x: 380, y: 319, w: 74, h: 64 },
      { x: 474, y: 319, w: 59, h: 64 },
      { x: 557, y: 296, w: 18, h: 87 },
      { x: 595, y: 319, w: 66, h: 64 },
      { x: 681, y: 319, w: 51, h: 64 },
      { x: 757, y: 319, w: 59, h: 64 },
    ],
    expo: [
      { x: 90, y: 422, w: 190, h: 180 },
      { x: 289, y: 422, w: 264, h: 180 },
      { x: 565, y: 422, w: 210, h: 180 },
      { x: 784, y: 420, w: 226, h: 185 },
    ],
    edition: [
      { x: 581, y: 645, w: 116, h: 104 },
      { x: 703, y: 646, w: 109, h: 103 },
    ],
    expoStem: 60,
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
