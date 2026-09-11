import {
  barPath,
  crescentPaths,
  markGeometry,
  markViewBox,
  type Ink,
} from "@/components/brand/mark-geometry"
import { markGlyphs } from "@/components/brand/mark-glyphs"
import { site } from "@/lib/content"

/** Each ink as a CSS var, so [data-surface="navy"] can turn navy parts light. */
const markPaint: Record<Ink, string> = {
  navy: "var(--mark-navy)",
  orange: "var(--mark-orange)",
  silver: "var(--mark-silver)",
}

/** Path data built once per module, not per render. */
const markPaths = {
  arcs: markGeometry.arcs.map((a) => ({ ...a, d: crescentPaths(a) })),
  bars: markGeometry.stripes.bars.map((b) => ({ ...b, d: barPath(b) })),
  lines: {
    kariyer: markGlyphs.kariyer.join(""),
    expo: markGlyphs.expo.join(""),
    edition: markGlyphs.edition.join(""),
  },
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
 * the haze over the stripes' tops, the dot's drop shadow and the sheen beside
 * the navy stripe. The mark sits on whatever ground it is placed on.
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
      <g data-part="letters" fill={markPaint.navy}>
        <path d={markPaths.lines.kariyer} />
        <path d={markPaths.lines.expo} />
        <path d={markPaths.lines.edition} />
      </g>
    </svg>
  )
}

export { Mark, markPaint, markPaths }
