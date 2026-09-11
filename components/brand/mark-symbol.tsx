import { markPaint, markPaths } from "@/components/brand/mark"
import { markGeometry } from "@/components/brand/mark-geometry"
import { site } from "@/lib/content"

// The ring's own bounds (arcs, dots, stripes) with a small margin, squared.
const VIEWBOX = "115 90 900 900"

// "27" moved into the ring's empty middle, where KARİYER and EXPO sit on the
// full mark, and scaled 2.4x: between the upper orange arc's cut end
// (y 299) and the navy stripe's top (y 598), centred on the ring.
const SCALE = 2.4
const CENTRE = { x: 560, y: 447 }
const editionTransform = (() => {
  const boxes = markGeometry.letters.edition
  const x0 = Math.min(...boxes.map((b) => b.x))
  const x1 = Math.max(...boxes.map((b) => b.x + b.w))
  const y0 = Math.min(...boxes.map((b) => b.y))
  const y1 = Math.max(...boxes.map((b) => b.y + b.h))
  const tx = CENTRE.x - ((x0 + x1) / 2) * SCALE
  const ty = CENTRE.y - ((y0 + y1) / 2) * SCALE
  return `translate(${tx} ${ty}) scale(${SCALE})`
})()

/**
 * The compact mark for favicons and app icons: the orbits, stripes and dots
 * of <Mark>, with "27" enlarged in the middle and no KARİYER / EXPO, which
 * cannot be read at 32px. Square, so it fills an icon.
 *
 * Same props as <Mark>. Rendered to PNG by scripts/generate-brand-assets.ts;
 * nothing on the page uses it yet.
 */
function MarkSymbol({
  className,
  decorative = false,
  ...props
}: React.ComponentProps<"svg"> & { decorative?: boolean }) {
  const labelling = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": `${site.name} ${site.edition}` } as const)

  return (
    <svg
      data-slot="mark-symbol"
      viewBox={VIEWBOX}
      {...labelling}
      className={className}
      {...props}
    >
      <g data-part="arcs">
        {markPaths.arcs.map((a) => (
          <path key={a.id} d={a.d} fill={markPaint[a.ink]} />
        ))}
      </g>
      <g data-part="stripes">
        {markPaths.bars.map((b) => (
          <path key={b.ink} d={b.d} fill={markPaint[b.ink]} />
        ))}
      </g>
      <g data-part="dots">
        {markGeometry.dots.map((d) => (
          <circle
            key={d.id}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill={markPaint[d.ink]}
          />
        ))}
      </g>
      <g
        data-part="letters"
        fill={markPaint.navy}
        transform={editionTransform}
      >
        <path d={markPaths.lines.edition} />
      </g>
    </svg>
  )
}

export { MarkSymbol }
