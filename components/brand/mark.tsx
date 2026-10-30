import {
  barPath,
  crescentPaths,
  markGeometry,
  markViewBox,
  type Ink,
} from "@/components/brand/mark-geometry"
import { markGlyphs } from "@/components/brand/mark-glyphs"
import { site } from "@/lib/content"

/** Each ink as a CSS var, so a surface can remap the mark's colours. */
const markPaint: Record<Ink, string> = {
  navy: "var(--mark-navy)",
  orange: "var(--mark-orange)",
  silver: "var(--mark-silver)",
}

type Line = keyof typeof markGlyphs

/** One line of type as two paths: its navy glyphs and its orange accents. */
const linePaths = (line: Line) => {
  const accents: readonly number[] = markGeometry.letters.accents[line]
  const pick = (orange: boolean) =>
    markGlyphs[line].filter((_, i) => accents.includes(i) === orange).join("")
  return { navy: pick(false), orange: pick(true) }
}

/** Path data built once per module, not per render. */
const markPaths = {
  arcs: markGeometry.arcs.map((a) => ({ ...a, d: crescentPaths(a) })),
  bars: markGeometry.stripes.bars.map((b) => ({ ...b, d: barPath(b) })),
  lines: {
    kariyer: linePaths("kariyer"),
    expo: linePaths("expo"),
    edition: linePaths("edition"),
  },
}

/** A line of type, each ink in its own paint. */
function LinePaths({ line }: { line: { navy: string; orange: string } }) {
  return (
    <>
      <path d={line.navy} fill={markPaint.navy} />
      {line.orange && <path d={line.orange} fill={markPaint.orange} />}
    </>
  )
}

/**
 * The Kariyer Expo 27 mark, as one inline SVG.
 *
 * PUBLIC API -- sections import this, and the props below are fixed:
 *   <Mark className? decorative? {...svgProps} />
 * `className` sizes it (a width or a height; the viewBox keeps the aspect).
 * `decorative` hides it from assistive tech where a text name sits beside
 * it; otherwise it is an image named "Kariyer Expo 27".
 *
 * Drawn from measured geometry (mark-geometry.ts) and outlined Archivo
 * (mark-glyphs.ts), in public/kariyer-expo.png's own pixel space, cropped by
 * the viewBox. What the PNG has and this does not: the white disc behind it,
 * the X's bevel, the letters' dark drop edge and the navy stripe's extruded
 * side. The mark is flat and sits on whatever ground it is placed on.
 *
 * Every colour is a --mark-* var. Each part is its own <g data-part>.
 */
function Mark({
  className,
  decorative = false,
  ...props
}: React.ComponentProps<"svg"> & { decorative?: boolean }) {
  const labelling = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": `${site.name} ${site.edition}` } as const)

  return (
    <svg
      data-slot="mark"
      viewBox={markViewBox}
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
      <g data-part="letters">
        <LinePaths line={markPaths.lines.kariyer} />
        <LinePaths line={markPaths.lines.expo} />
        <LinePaths line={markPaths.lines.edition} />
      </g>
    </svg>
  )
}

export { LinePaths, Mark, markPaint, markPaths }
