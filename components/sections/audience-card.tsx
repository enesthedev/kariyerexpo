"use client"

import * as React from "react"
import { IconArrowUpRight, IconPlus, IconX } from "@tabler/icons-react"
import { cn } from "cn"

import { audiences } from "@/lib/content"
import { buttonVariants } from "@/components/ui/button"

/**
 * The reference site's visa-type card: a tall face that always carries the
 * sign-up path, plus a round "+" that opens an overlay for the detail that
 * would otherwise crowd it. The overlay is a sibling of the toggle, not a
 * child of the face, so the two can be shown and hidden independently.
 *
 * Closed and open are mutually exclusive interactive surfaces: whichever one
 * isn't showing gets `inert`, so a covered CTA (while open) or covered detail
 * text (while closed) never stays reachable by keyboard or a screen reader --
 * only visually hiding it would leave a trap.
 *
 * `bg-card` plus a hairline border is the non-highlighted treatment. The
 * design contract's navy grounds are an enumerated list (drawer, speakers,
 * CTA banner, footer); these cards aren't on it, so `bg-sidebar` here would
 * add a fifth navy surface the contract never sanctioned.
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
        "relative flex min-h-[26rem] flex-col overflow-hidden rounded-[2rem] p-7",
        highlighted
          ? "bg-accent text-accent-foreground"
          : "border border-border bg-card"
      )}
    >
      <div inert={open} className="flex flex-1 flex-col">
        <span
          aria-hidden="true"
          className={cn(
            "numeral text-[1.75rem] leading-none",
            highlighted ? "text-accent-foreground" : "text-line"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="mt-6 text-[clamp(1.25rem,1.05rem+0.9vw,1.625rem)] leading-[1.2] font-semibold tracking-[-0.015em]">
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
        className="absolute top-6 right-6 z-10 inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {open ? <IconX aria-hidden="true" /> : <IconPlus aria-hidden="true" />}
      </button>

      <div
        id={panelId}
        inert={!open}
        className={cn(
          "absolute inset-0 z-0 flex flex-col rounded-[2rem] p-7 pt-20 transition-[opacity,transform] duration-200 motion-reduce:transition-none",
          highlighted ? "bg-accent text-accent-foreground" : "bg-card",
          open
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0 motion-reduce:translate-y-0"
        )}
      >
        <ul className="space-y-2.5">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-[0.45rem] size-1.5 shrink-0 rounded-full",
                  highlighted ? "bg-accent-foreground" : "bg-line"
                )}
              />
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
