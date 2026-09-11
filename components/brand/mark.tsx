import { site } from "@/lib/content"

/**
 * The Kariyer Expo 27 mark, as one inline SVG.
 *
 * PUBLIC API -- sections import this, and the props below are fixed:
 *   <Mark className? decorative? {...svgProps} />
 * `className` sizes it (a width or a height; the viewBox keeps the aspect).
 * `decorative` hides it from assistive tech where a text name sits beside
 * it; otherwise it is an image named "Kariyer Expo 27".
 *
 * The viewBox is the final crop of public/kariyer-expo.png, in the PNG's own
 * pixel space, so every coordinate below is a PNG pixel and layouts built on
 * this aspect do not move when the measured geometry lands.
 *
 * Every colour is a --mark-* var, so [data-surface="navy"] can turn the navy
 * parts light.
 *
 * PROVISIONAL GEOMETRY; replaced by measured geometry in the logo task. Arcs
 * are stroked circle segments at an average width where the logo has tapered
 * crescents, the dots and stripes are rough reads of the PNG, and the letters
 * are live Archivo stretched into their ink boxes rather than outlines. Each
 * part is its own <g data-part> so it can be swapped whole.
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
      viewBox="88 102 922 876"
      {...labelling}
      className={className}
      {...props}
    >
      {/* provisional; replaced by measured geometry in the logo task. Circles
          fitted to each crescent; angles run clockwise from three o'clock. */}
      <g data-part="arcs" fill="none">
        {/* navy, upper left: centre (559, 535) r 412, -161deg -> -68deg */}
        <path
          d="M169.4 400.9A412 412 0 0 1 713.3 153"
          stroke="var(--mark-navy)"
          strokeWidth={36}
        />
        {/* orange, upper: centre (630, 410) r 241, -119deg -> -24deg */}
        <path
          d="M513.2 199.2A241 241 0 0 1 850.2 312"
          stroke="var(--mark-orange)"
          strokeWidth={26}
        />
        {/* silver, upper right: centre (759, 389) r 194, -100deg -> 3deg */}
        <path
          d="M725.3 197.9A194 194 0 0 1 952.7 399.2"
          stroke="var(--mark-silver)"
          strokeWidth={22}
        />
        {/* navy, lower: centre (583, 589) r 364, 26deg -> 174deg, passing
            behind the stripes */}
        <path
          d="M910.2 748.6A364 364 0 0 1 221 627"
          stroke="var(--mark-navy)"
          strokeWidth={44}
        />
        {/* orange, lower: centre (572, 536) r 362, 15deg -> 98deg */}
        <path
          d="M921.7 629.7A362 362 0 0 1 521.6 894.5"
          stroke="var(--mark-orange)"
          strokeWidth={16}
        />
      </g>

      {/* provisional; replaced by measured geometry in the logo task */}
      <g data-part="dots">
        <circle cx={981} cy={633} r={22} fill="var(--mark-navy)" />
        <circle cx={964} cy={688} r={22} fill="var(--mark-orange)" />
        <circle cx={943} cy={742} r={23} fill="var(--mark-silver)" />
        <circle cx={786} cy={145} r={35} fill="var(--mark-orange)" />
      </g>

      {/* provisional; replaced by measured geometry in the logo task. Bars
          drawn level along the stripe axis, then turned 41.6deg as a group. */}
      <g data-part="stripes" transform="rotate(-41.6)">
        <rect
          x={-376}
          y={736}
          width={312}
          height={46}
          fill="var(--mark-navy)"
        />
        <rect
          x={-456}
          y={798}
          width={338}
          height={38}
          fill="var(--mark-orange)"
        />
        <rect
          x={-387}
          y={848}
          width={328}
          height={48}
          fill="var(--mark-silver)"
        />
      </g>

      {/* provisional; replaced by measured geometry in the logo task. Each
          line is baselined on its ink box's bottom edge, sized so Archivo's
          cap height (0.686em) matches the box, and stretched to the box's
          width with textLength. KARİYER is typed with a literal İ. */}
      <g
        data-part="letters"
        fill="var(--mark-navy)"
        style={{
          fontFamily: "var(--font-sans)",
          fontVariationSettings: '"wdth" 125',
        }}
      >
        <text
          x={304}
          y={382}
          fontSize={92}
          fontWeight={800}
          textLength={510}
          lengthAdjust="spacing"
        >
          KARİYER
        </text>
        <text
          x={90}
          y={601}
          fontSize={260}
          fontWeight={900}
          textLength={918}
          lengthAdjust="spacingAndGlyphs"
        >
          EXPO
        </text>
        <text
          x={581}
          y={748}
          fontSize={150}
          fontWeight={900}
          textLength={230}
          lengthAdjust="spacingAndGlyphs"
        >
          27
        </text>
      </g>
    </svg>
  )
}

export { Mark }
