import { cn } from "cn"

/**
 * The logo's three dots -- navy, orange, silver -- as the page's ONE "not
 * announced yet" signal.
 *
 * EXACTLY THREE USES: the hero date pill (while `site.date` is null), the
 * Konuşmacılar heading accent, and the speaker placeholder cards (one
 * instance per card is still the same use). A fourth use kills the rule:
 * once the dots also mean "more", "decoration" or "brand", they stop meaning
 * "yakında" anywhere.
 *
 * STATIC, always, hover included. Three dots that pulse or bounce are a
 * typing or loading indicator, which says "wait, it is coming this second";
 * the dots here say "decided, not yet told", and only stillness says that.
 *
 * Sizes are in em, so the dots scale with whatever text they follow, and the
 * row sits on the middle of the x-height, so it can trail a heading word or
 * sit inside a pill. The colours come from the --mark-* vars, which
 * [data-surface="navy"] remaps. Pass `label` where the dots are the only
 * statement of the pending state; without it the whole row is aria-hidden.
 */
const SIZES = {
  sm: "[--dot:0.28em]",
  md: "[--dot:0.4em]",
  lg: "[--dot:0.55em]",
} as const

function PendingDots({
  size = "md",
  label,
  className,
}: {
  size?: keyof typeof SIZES
  label?: string
  className?: string
}) {
  return (
    <span
      data-slot="pending-dots"
      aria-hidden={label ? undefined : true}
      className={cn(
        "inline-flex items-center gap-[calc(var(--dot)*0.3)] align-middle",
        SIZES[size],
        className
      )}
    >
      <span
        aria-hidden
        className="size-(--dot) shrink-0 rounded-full bg-(--mark-navy)"
      />
      <span
        aria-hidden
        className="size-(--dot) shrink-0 rounded-full bg-(--mark-orange)"
      />
      <span
        aria-hidden
        className="size-(--dot) shrink-0 rounded-full bg-(--mark-silver)"
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  )
}

export { PendingDots }
