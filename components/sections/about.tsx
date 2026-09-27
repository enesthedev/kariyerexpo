import { about } from "@/lib/content"
import { RevealGroup, RevealItem } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

/**
 * Heading on the left, the reading passage on the right, then a row of
 * short facts. The quietest section on the page -- no cards, no icons,
 * nothing competing with the prose.
 *
 * Each fact stands on a heavy navy rule that leans off at its right end,
 * the stripes' square cut at text scale; the orange stays with the heading's
 * one phrase.
 */
function About() {
  return (
    <section id="fuar" className="scroll-mt-20 py-[clamp(4rem,10vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title={about.headline}
          accent={about.headlineAccent}
          description={about.body.map((p) => (
            <p key={p.slice(0, 24)} className="max-w-[62ch] not-first:mt-5">
              {p}
            </p>
          ))}
          className="md:items-start"
        />

        <RevealGroup
          as="dl"
          stagger={0.12}
          className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8"
        >
          {about.facts.map((f) => (
            <RevealItem key={f.term}>
              <RevealItem variant="rule">
                <div
                  aria-hidden="true"
                  className="h-1.5 w-full bg-foreground [clip-path:polygon(0_0,100%_0,calc(100%_-_0.4375rem)_100%,0_100%)]"
                />
              </RevealItem>
              <dt className="mt-6 font-heading text-xl leading-snug font-bold">
                {f.term}
              </dt>
              <dd className="mt-2 text-muted-foreground">{f.detail}</dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

export { About }
