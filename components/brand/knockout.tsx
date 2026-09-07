import { cn } from "cn"

/**
 * The pending state, and the reason this design has no dashed strokes.
 *
 * 58.9% of the mark's canvas is a hole: KARİYER and the counters of EXPO are
 * cut to full transparency rather than painted. The mark's own logic is that
 * the form is finished and the content shows through from behind, and that is
 * a far better way to say "not announced yet" than a dashed border, which is
 * only a weaker border and reads as something that failed to finish loading.
 * A knockout cannot happen by accident. It holds the same footprint, weight
 * and rhythm as the confirmed thing beside it: nothing is missing, something
 * is reserved.
 *
 * Implementation is inversion against the surface, which on a flat ground is
 * exactly what a cut-out looks like: the block takes the surface's ink, the
 * letters take the surface's ground. So it inverts correctly by itself --
 * navy block with pale letters on the light sections, pale block with navy
 * letters on the navy ones (see the [data-surface="navy"] remap in
 * globals.css). Both directions measure AAA.
 *
 * THE DISCIPLINE: this appears in exactly three places -- the hero date pill,
 * the Konuşmacılar heading accent, and the speaker cards. It is never
 * decoration, and never touches anything already confirmed. A fourth use
 * turns a system into a texture and kills the rule.
 */
function Knockout({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="knockout"
      className={cn("knockout", className)}
      {...props}
    />
  )
}

export { Knockout }
