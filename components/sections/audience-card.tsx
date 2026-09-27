"use client"

import * as React from "react"
import { IconArrowUpRight, IconPlus, IconX } from "@tabler/icons-react"
import { cn } from "cn"

import { audiences } from "@/lib/content"
import { XMark } from "@/components/brand/x-mark"
import { buttonVariants } from "@/components/ui/button"

/**
 * A tall face that always carries the sign-up path, plus a "+" that opens an
 * overlay for the detail that would otherwise crowd it. The overlay is a
 * sibling of the toggle, not a child of the face, so the two can be shown
 * and hidden independently.
 *
 * The card's top-right corner is cut on the diagonal (.corner-cut), the
 * stripes' square end at card scale; the toggle sits just inside the cut.
 *
 * Closed and open are mutually exclusive interactive surfaces: whichever one
 * isn't showing gets `inert`, so a covered CTA (while open) or covered detail
 * text (while closed) never stays reachable by keyboard or a screen reader --
 * only visually hiding it would leave a trap.
 *
 * `bg-band` is the non-highlighted treatment: the cut would clip a border,
 * so the card is told from the page by its ground alone. Navy is kept for
 * the bands the contract lists; a navy card would be one more.
 */
function AudienceCard({
  index,
  id,
  title,
  summary,
  points,
  note,
  cta,
  highlighted,
}: {
  index: number
  id: string
  title: string
  summary: string
  points: readonly string[]
  note: string
  cta: string
  highlighted: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const panelId = React.useId()
  const toggleRef = React.useRef<HTMLButtonElement>(null)

  function closeAndRefocus() {
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <article
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation()
          closeAndRefocus()
        }
      }}
      className={cn(
        "corner-cut relative flex min-h-[26rem] flex-col overflow-hidden p-7",
        highlighted ? "bg-accent text-accent-foreground" : "bg-band"
      )}
    >
      <div inert={open} className="flex flex-1 flex-col">
        <span
          aria-hidden="true"
          className={cn(
            "numeral text-[2.5rem] leading-none",
            highlighted ? "text-accent-foreground" : "text-line"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="mt-8 text-[clamp(1.375rem,1.1rem+1vw,1.75rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          {title}
        </h3>
        <p className={cn("mt-2", !highlighted && "text-muted-foreground")}>
          {summary}
        </p>

        <a
          href="#iletisim"
          data-role-target={id}
          className={cn(
            buttonVariants({
              variant: highlighted ? "default" : "secondary",
            }),
            "mt-auto w-fit self-start"
          )}
        >
          {cta}
          <IconArrowUpRight data-icon="inline-end" />
        </a>
      </div>

      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? audiences.detailsClose : audiences.detailsOpen}
        onClick={() => setOpen((value) => !value)}
        className="absolute top-9 right-9 z-10 inline-flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {open ? <IconX aria-hidden="true" /> : <IconPlus aria-hidden="true" />}
      </button>

      <div
        id={panelId}
        inert={!open}
        className={cn(
          "absolute inset-0 z-0 flex flex-col p-7 pt-24 transition-[opacity,transform] duration-200 motion-reduce:transition-none",
          highlighted ? "bg-accent text-accent-foreground" : "bg-band",
          open
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0 motion-reduce:translate-y-0"
        )}
      >
        <ul className="space-y-2.5">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm">
              {highlighted ? (
                <span
                  aria-hidden="true"
                  className="mt-[0.4rem] h-1 w-3 shrink-0 -skew-x-[40deg] bg-accent-foreground"
                />
              ) : (
                <XMark className="mt-[0.2rem] h-[0.9em]" />
              )}
              {point}
            </li>
          ))}
        </ul>
        <p
          className={cn(
            "mt-auto pt-6 text-sm",
            !highlighted && "text-muted-foreground"
          )}
        >
          {note}
        </p>
      </div>
    </article>
  )
}

export { AudienceCard }
