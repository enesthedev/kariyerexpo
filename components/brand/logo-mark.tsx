import { cn } from "cn"

import { BLOB, MARK_VIEWBOX } from "./blob-paths"

const SIZES = {
  sm: "h-8",
  md: "h-12",
  lg: "h-[clamp(9rem,26vw,29rem)]",
} as const

/**
 * The logo mark. Inline SVG rather than an <img>, which is what lets the navy
 * blob take a different fill in dark mode (it would otherwise vanish against a
 * navy page) and keeps the mark out of the LCP request path entirely.
 */
function LogoMark({
  size = "md",
  className,
  ...props
}: React.ComponentProps<"svg"> & { size?: keyof typeof SIZES }) {
  return (
    <svg
      data-slot="logo-mark"
      viewBox={MARK_VIEWBOX}
      role="img"
      aria-label="Kariyer Expo"
      className={cn("w-auto shrink-0", SIZES[size], className)}
      {...props}
    >
      <defs>
        <filter
          id="km-shadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <clipPath id="km-cream">
          <path d={BLOB.cream} />
        </clipPath>
      </defs>
      <path fill="var(--blob-cream)" d={BLOB.cream} />
      <g clipPath="url(#km-cream)">
        <path
          fill="var(--blob-shadow)"
          filter="url(#km-shadow)"
          d={BLOB.shadow}
        />
      </g>
      <path fill="var(--blob-slate)" d={BLOB.slate} />
      <path fill="var(--blob-navy)" d={BLOB.navy} />
      <path fill="var(--blob-orange)" d={BLOB.orange} />
    </svg>
  )
}

export { LogoMark }
