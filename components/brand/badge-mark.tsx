import { cn } from "cn"

import { site } from "@/lib/content"

/**
 * The badge, redrawn from measurements rather than traced.
 *
 * Every number below was read off public/kariyer-expo-2027.png by radial
 * sampling at 720 angles around the fitted centre (996, 993.5) with an outer
 * radius of 908px, then normalised into this 100x100 box. The ring stack came
 * out as three concentric strokes:
 *
 *   outer keyline   r 874-908   -> r 49.06, width 1.87
 *   navy body       r 577-854   -> r 39.40, width 15.26
 *   inner keyline   r 517-553   -> r 29.46, width 1.98
 *
 * and the banner tab as a rounded-top shape whose BOTTOM edge is the badge's
 * own circle (r 46.37 here), which is what stops it reading as a sticker.
 *
 * This is the small lockup. It carries no lettering: KARİYER and EXPO are
 * custom-drawn in the source and no web font reproduces them, so the full mark
 * ships as mask layers instead -- see full-mark.tsx. Here the wordmark beside
 * the badge does the naming.
 *
 * The keylines measure 1.55:1 on the light ground, so below roughly 64px they
 * are invisible anyway; what survives at header size is the navy ring and the
 * orange notch, which is enough to be recognisable.
 */
const SIZES = {
  sm: "size-8",
  md: "size-12",
  lg: "size-[clamp(9rem,26vw,26rem)]",
} as const

const TAB =
  "M39.32 78.61 L60.68 78.61 A8.65 8.65 0 0 1 69.33 87.47 L69.33 92.14 " +
  "A46.37 46.37 0 0 1 30.67 92.14 L30.67 87.47 A8.65 8.65 0 0 1 39.32 78.61 Z"

/**
 * `decorative` is the right setting wherever the badge sits beside the
 * wordmark, which is everywhere it currently appears: two elements naming the
 * same brand inside one link reads the name twice.
 */
function BadgeMark({
  size = "md",
  decorative = false,
  className,
  ...props
}: React.ComponentProps<"svg"> & {
  size?: keyof typeof SIZES
  decorative?: boolean
}) {
  const labelling = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": `${site.name} ${site.edition}` } as const)

  return (
    <svg
      data-slot="badge-mark"
      viewBox="0 0 100 100"
      {...labelling}
      className={cn("shrink-0", SIZES[size], className)}
      {...props}
    >
      <circle
        cx="50"
        cy="50"
        r="49.06"
        fill="none"
        stroke="var(--mark-keyline)"
        strokeWidth="1.87"
      />
      <circle
        cx="50"
        cy="50"
        r="39.4"
        fill="none"
        stroke="var(--mark-body)"
        strokeWidth="15.26"
      />
      <circle
        cx="50"
        cy="50"
        r="29.46"
        fill="none"
        stroke="var(--mark-keyline)"
        strokeWidth="1.98"
      />
      <path d={TAB} fill="var(--mark-accent)" />
    </svg>
  )
}

export { BadgeMark }
