import { cn } from "cn"

import { barPath, markGeometry } from "@/components/brand/mark-geometry"

// The X's own ink box in the logo's pixel space, so the viewBox crops to it.
const points = markGeometry.letters.expoX.flat()
const x0 = Math.min(...points.map(([x]) => x))
const y0 = Math.min(...points.map(([, y]) => y))
const x1 = Math.max(...points.map(([x]) => x))
const y1 = Math.max(...points.map(([, y]) => y))
const d = markGeometry.letters.expoX
  .map((p) => barPath({ ink: "orange", points: p }))
  .join("")

/**
 * The logo's X, exactly: the two strokes traced off public/kariyer-expo.png
 * (letters.expoX in mark-geometry.ts), in the mark's orange.
 *
 * The eyebrow bullet and the list bullet, nothing else. It is the logo's
 * one orange letter, so on the page it marks "a new thing starts here"; used
 * as decoration it would stop meaning that.
 *
 * Decorative only. Orange as a fill, which the colour bans allow on every
 * ground. Sized in em by default so it follows the text it sits beside;
 * `className` overrides.
 */
function XMark({ className }: { className?: string }) {
  return (
    <svg
      data-slot="x-mark"
      viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`}
      aria-hidden
      className={cn("inline-block h-[1em] w-auto shrink-0", className)}
    >
      <path d={d} fill="var(--mark-orange)" />
    </svg>
  )
}

export { XMark }
