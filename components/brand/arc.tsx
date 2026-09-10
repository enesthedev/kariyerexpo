import { cn } from "cn"

/**
 * The heading rule, and the swash's replacement.
 *
 * A ring cannot do this job. The swash sat under a two-to-four word clause
 * (`headlineAccent` in lib/content.ts) and stretched to whatever that clause
 * measured; a ring stretched to a phrase is an oval, and an oval round a
 * phrase is a proofreader's delete mark. What the swash actually carried was
 * wayfinding -- "this is the heading of this section", never "this word
 * matters more" -- and that needs a line.
 *
 * So: a line, but a circular one. Nothing in this mark is hand-drawn; every
 * edge is either a circle or a straight run. A shallow arc is what this mark
 * would draw, and it stretches the way the swash did.
 *
 * The rule itself is a background on this span rather than a child element,
 * because a phrase wraps: an absolutely positioned child would be laid out
 * against the union of the span's line boxes and trail off past the last word.
 * See the .arc block in app/globals.css for the whole reason and the cost.
 *
 * Same discipline as before -- one per section, under a phrase and never a
 * single word, and the text colour never changes. Same machinery too: the
 * draw-on is `animation-timeline: view()`, pure CSS, and it degrades to a
 * fully drawn arc where that is unsupported or motion is reduced.
 */
function Arc({ children, className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="arc" className={cn("arc", className)} {...props}>
      {children}
    </span>
  )
}

export { Arc }
