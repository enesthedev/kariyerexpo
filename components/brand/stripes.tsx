import { cn } from "cn"

/**
 * The logo's three diagonal stripes: the direction mark, for hero and banner
 * corners. (In buttons, direction is IconArrowUpRight.)
 *
 * Quoted from public/kariyer-expo.png, where the stripes rise up-right at
 * 41.6deg. Each bar's length, thickness and offset along the diagonal were
 * read off the PNG by projecting its pixels onto the stripe axis and its
 * normal, then shifted to start at 0: navy on the upper left, orange staggered
 * down-left of it, silver on the lower right, as in the logo. The ends are
 * square, and the bars are drawn level and turned as one group, so the angle
 * lives in one place.
 *
 * Decorative only. The colours come from the --mark-* vars, which
 * [data-surface="navy"] remaps, so it works on paper and on navy. There is no
 * intrinsic size: `className` sets a width or a height and the viewBox keeps
 * the aspect.
 */
function Stripes({ className }: { className?: string }) {
  return (
    <svg
      data-slot="stripes"
      viewBox="0 0 362 335"
      aria-hidden
      className={cn("pointer-events-none", className)}
    >
      <g transform="translate(-41.2 260.3) rotate(-41.6)">
        <rect x="80" y="0" width="312" height="46" fill="var(--mark-navy)" />
        <rect x="0" y="62" width="338" height="38" fill="var(--mark-orange)" />
        <rect
          x="69"
          y="112"
          width="328"
          height="48"
          fill="var(--mark-silver)"
        />
      </g>
    </svg>
  )
}

export { Stripes }
