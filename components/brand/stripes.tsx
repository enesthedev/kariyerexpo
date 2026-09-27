import { cn } from "cn"

import { markPaint, markPaths } from "@/components/brand/mark"

// The three bars' own ink box in the logo's pixel space.
const points = markPaths.bars.flatMap((b): (readonly [number, number])[] => [
  ...b.points,
])
const x0 = Math.min(...points.map(([x]) => x))
const y0 = Math.min(...points.map(([, y]) => y))
const x1 = Math.max(...points.map(([x]) => x))
const y1 = Math.max(...points.map(([, y]) => y))

/**
 * The logo's three stripes, lifted out of the mark at their true angle
 * (40.5° above horizontal, fanning a few degrees, navy cut square, orange and
 * silver on level cuts): the same measured bars <Mark> draws.
 *
 * The page's direction mark, for band and hero corners. The angle is never
 * redrawn by hand anywhere else; band edges take the shallow --cut instead.
 *
 * Decorative only. The colours come from the --mark-* vars, which
 * [data-surface="navy"] remaps, so it works on paper and on navy. No
 * intrinsic size: `className` sets a width or a height.
 */
function Stripes({ className }: { className?: string }) {
  return (
    <svg
      data-slot="stripes"
      viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`}
      aria-hidden
      className={cn("pointer-events-none", className)}
    >
      {markPaths.bars.map((b) => (
        <path key={b.ink} d={b.d} fill={markPaint[b.ink]} />
      ))}
    </svg>
  )
}

export { Stripes }
