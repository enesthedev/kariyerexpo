import { cn } from "cn"

import { site } from "@/lib/content"

/**
 * The full mark, painted from three greyscale alpha masks rather than shipped
 * as a picture of itself.
 *
 * The mark is flat three-colour with hard edges, so scripts/generate-brand-
 * assets.mjs splits it by nearest colour into public/mark-{body,keyline,
 * accent}.png and CSS supplies the colour through mask-image. That buys two
 * things a raster could not:
 *
 *   - One asset set for both themes. The mark's letters are knockouts, not
 *     paint, so on a navy ground a coloured copy would need a second file;
 *     here [data-surface="navy"] just remaps --mark-body and it inverts.
 *   - Three independently animatable pieces, which is where the hero's
 *     assembly gesture comes from -- see full-mark-animated.tsx.
 *
 * Sized by aspect ratio off the measured ink box (1981 x 1801): EXPO overhangs
 * the badge circle on both sides, so the mark is wider than it is tall.
 */
function FullMark({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children">) {
  return (
    <div
      data-slot="full-mark"
      role="img"
      aria-label={`${site.name} ${site.edition}`}
      className={cn("mark", className)}
      {...props}
    >
      <span data-layer="body" className="mark-layer" />
      <span data-layer="keyline" className="mark-layer" />
      <span data-layer="accent" className="mark-layer" />
    </div>
  )
}

export { FullMark }
