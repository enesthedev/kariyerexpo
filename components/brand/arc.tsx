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
 * Same discipline as before -- one per section, under a phrase and never a
 * single word, and the text colour never changes. Same machinery too: the
 * draw-on is `animation-timeline: view()`, pure CSS, and it degrades to a
 * fully drawn arc where that is unsupported or motion is reduced.
 */
function Arc({ children, className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="arc"
      className={cn("relative inline-block", className)}
      {...props}
    >
      {children}
      <svg
        viewBox="0 0 240 18"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-[0.2em] h-[0.34em] w-full overflow-visible"
      >
        <path
          d="M3 4 A620 620 0 0 0 237 4"
          fill="none"
          stroke="var(--line)"
          strokeWidth="5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="arc-draw"
        />
      </svg>
    </span>
  )
}

export { Arc }
