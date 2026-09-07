import { IconCalendarPlus } from "@tabler/icons-react"
import { cn } from "cn"

import { site } from "@/lib/content"
import { Knockout } from "@/components/brand/knockout"

/**
 * The first of the three knockout slots, and the clearest statement of the
 * rule: the year is settled and says so in the wordmark's chip, the day is
 * not, so the date is cut out rather than dashed.
 *
 * It occupies exactly the slot a real date would occupy, at the size a real
 * date would be. When site.date is filled in the pill fills with ink and
 * nothing about the layout moves -- which is what makes the missing date read
 * as anticipation rather than as a hole in the page.
 */
function DatePill({ className }: { className?: string }) {
  const announced = Boolean(site.date)
  const label = site.date
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(site.date))
    : site.dateFallback

  const shape =
    "inline-flex w-fit items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium"

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {announced ? (
        <span className={cn(shape, "border-2 border-line")}>
          <IconCalendarPlus className="size-4 shrink-0 text-line" />
          {label}
        </span>
      ) : (
        <Knockout className={shape}>
          <IconCalendarPlus className="size-4 shrink-0" />
          {label}
        </Knockout>
      )}
      <span className="pl-1 text-sm text-muted-foreground">
        {site.venue.name}, {site.venue.district}
      </span>
    </div>
  )
}

export { DatePill }
