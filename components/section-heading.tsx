import { cn } from "cn"

import { XMark } from "@/components/brand/x-mark"

/**
 * The eyebrow + title + description block every section opens with.
 *
 * The eyebrow leads with the logo's X. The title leans (h2 is the italic
 * display voice) and gives its `accent` -- one phrase, never two -- to
 * orange: the logo's X-and-7 rule. `accent` renders in --line, which is the
 * readable orange on paper and the full orange on navy, so the same call
 * works on both grounds.
 *
 * A 12-col split only from `md` up: below that the eyebrow, title and
 * description simply stack full-width, which is what keeps the title
 * legible at 360px without a narrower clamp step.
 */
function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  className,
  titleId,
}: {
  eyebrow?: string
  title: React.ReactNode
  accent?: string
  description?: React.ReactNode
  className?: string
  titleId?: string
}) {
  return (
    <div
      className={cn("gap-8 md:grid md:grid-cols-12 md:items-end", className)}
    >
      <div className="md:col-span-7">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2
          id={titleId}
          className="text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-[1]"
        >
          {title}
          {accent ? (
            <>
              {" "}
              <span className="text-line">{accent}</span>
            </>
          ) : null}
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

/** The X-led label line, for headings that are not a SectionHeading. */
function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn("eyebrow mb-5 flex items-center gap-2.5", className)}>
      <XMark className="h-[1.1em]" />
      {children}
    </p>
  )
}

export { Eyebrow, SectionHeading }
