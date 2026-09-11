import { cn } from "cn"

/**
 * The eyebrow + title + description block every section opens with.
 *
 * A 12-col split only from `md` up: below that the eyebrow, title and
 * description simply stack full-width, which is what keeps the title
 * legible at 360px without a narrower clamp step.
 */
function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  titleId,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  titleId?: string
}) {
  return (
    <div
      className={cn("gap-8 md:grid md:grid-cols-12 md:items-end", className)}
    >
      <div className="md:col-span-7">
        {eyebrow ? <p className="eyebrow mb-5 text-line">{eyebrow}</p> : null}
        <h2
          id={titleId}
          className="text-[clamp(2rem,1.2rem+3vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.02em]"
        >
          {title}
        </h2>
      </div>
      {description ? (
        <div className="mt-6 text-lg leading-relaxed text-muted-foreground md:col-span-5 md:mt-0">
          {description}
        </div>
      ) : null}
    </div>
  )
}

export { SectionHeading }
