import { cn } from "cn"

import { Reveal, RevealText } from "@/components/reveal"

/**
 * The title + description block every section opens with.
 *
 * The title leans (h2 is the italic display voice) and gives its `accent` --
 * one phrase, never two -- to orange: the logo's X-and-7 rule. `accent`
 * renders in --line, which is the readable orange on paper and the full
 * orange on navy, so the same call works on both grounds.
 *
 * The title's words rise in on scroll (RevealText) and the description
 * follows a beat later. `trailing` sits after the title, unanimated.
 *
 * A 12-col split only from `md` up: below that the title and description
 * simply stack full-width, which is what keeps the title legible at 360px
 * without a narrower clamp step.
 */
function SectionHeading({
  title,
  accent,
  trailing,
  description,
  className,
}: {
  title: string
  accent?: string
  trailing?: React.ReactNode
  description?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn("gap-8 md:grid md:grid-cols-12 md:items-end", className)}
    >
      <div className="md:col-span-7">
        <RevealText
          text={title}
          accent={accent}
          className="text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-[1]"
        >
          {trailing}
        </RevealText>
      </div>
      {description ? (
        <Reveal
          delay={0.15}
          className="mt-6 text-lg leading-relaxed text-muted-foreground md:col-span-5 md:mt-0"
        >
          {description}
        </Reveal>
      ) : null}
    </div>
  )
}

export { SectionHeading }
