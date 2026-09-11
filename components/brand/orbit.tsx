import { cn } from "cn"

/**
 * The logo's orbit, reduced to keylines: three concentric OPEN arcs in solid
 * silver, for hero and banner decoration and as the track partners sit on.
 *
 * Open, because the logo's arcs are: each breaks off at a different angle,
 * which is what makes it an orbit rather than a target. Solid, because this
 * site has no dashed strokes anywhere.
 *
 * The strokes are non-scaling, so the keyline stays 1.5px at any size.
 * `stroke` and `strokeWidth` sit on the <svg> as presentation attributes,
 * which any CSS beats, so a caller can restyle every arc from `className`
 * (e.g. `stroke-sidebar-border`, `stroke-2`). Decorative only; `className`
 * sizes and positions it, and the viewBox keeps it square.
 */
// Centre (100, 100); angles run clockwise from three o'clock.
const ARCS = [
  // r 96, 160deg -> 20deg through the top
  "M9.8 132.8A96 96 0 1 1 190.2 132.8",
  // r 78, 300deg -> 120deg through the right and the bottom
  "M139 32.5A78 78 0 0 1 61 167.5",
  // r 60, 110deg -> 250deg through the left
  "M79.5 156.4A60 60 0 0 1 79.5 43.6",
]

function Orbit({ className }: { className?: string }) {
  return (
    <svg
      data-slot="orbit"
      viewBox="0 0 200 200"
      fill="none"
      stroke="var(--silver)"
      strokeWidth={1.5}
      aria-hidden
      className={cn("pointer-events-none", className)}
    >
      {ARCS.map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}

export { Orbit }
