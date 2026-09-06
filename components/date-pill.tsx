import { IconCalendarPlus } from "@tabler/icons-react"
import { cn } from "cn"

import { site } from "@/lib/content"

/**
 * Occupies exactly the slot a real date would occupy, at the size a real date
 * would be. When site.date is filled in, the outline goes solid and nothing
 * about the layout moves -- which is what makes the missing date read as
 * anticipation rather than a hole in the page.
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

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex w-fit items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium",
          announced
            ? "border-2 border-solid border-swash"
            : "border-2 border-dashed border-swash"
        )}
      >
        <IconCalendarPlus className="size-4 shrink-0 text-swash" />
        {label}
      </span>
      <span className="pl-1 text-sm text-muted-foreground">
        {site.venue.name}, {site.venue.district}
      </span>
    </div>
  )
}

export { DatePill }
