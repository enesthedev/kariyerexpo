import { IconCalendarEvent } from "@tabler/icons-react"
import { cn } from "cn"

import { site } from "@/lib/content"
import { PendingDots } from "@/components/brand/pending-dots"

/**
 * The first of the three pending-dot slots, and the clearest statement of the
 * rule: the logo's three dots are the page's one "not announced yet" signal.
 *
 * Both states share one pill shape at one size, so filling in site.date swaps
 * ground and content without moving anything around it. Confirmed is navy
 * with the date as a <time>; pending is a quiet card pill that says so in
 * words and then in dots. The dots are static on purpose -- dots that move
 * read as a typing indicator, not as a fact still to come.
 */
function DatePill({ className }: { className?: string }) {
  const shape =
    "inline-flex w-fit items-center gap-2.5 rounded-md px-5 py-2.5 text-sm"

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {site.date ? (
        <span
          className={cn(
            shape,
            "bg-primary font-semibold text-primary-foreground"
          )}
        >
          <IconCalendarEvent
            aria-hidden="true"
            className="size-4 shrink-0 text-accent"
          />
          <time dateTime={site.date}>
            {new Intl.DateTimeFormat("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(site.date))}
          </time>
        </span>
      ) : (
        <span
          className={cn(
            shape,
            "border border-border bg-card font-medium shadow-sm"
          )}
        >
          <IconCalendarEvent
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          {site.dateFallback}
          <PendingDots size="lg" className="ml-0.5" />
        </span>
      )}
      <span className="pl-1 text-sm text-muted-foreground">
        {site.venue.name}, {site.venue.district}
      </span>
    </div>
  )
}

export { DatePill }
