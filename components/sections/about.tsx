import { about } from "@/lib/content"
import { Swoosh } from "@/components/brand/swoosh"
import { SectionHeading } from "@/components/section-heading"

/**
 * The reference site's customer-service block: heading on the left, the
 * reading passage on the right, then a row of short facts. Still the quietest
 * section on the page -- no cards, no icons, nothing competing with the prose.
 *
 * Each fact is its own heading, so each term carries its own swoosh; the
 * one-phrase-per-heading rule holds because every term is a phrase.
 */
function About() {
  return (
    <section id="fuar" className="scroll-mt-20 py-[clamp(4rem,10vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow={about.eyebrow}
          title={
            <>
              {about.headline} <Swoosh>{about.headlineAccent}</Swoosh>
            </>
          }
          description={about.body.map((p) => (
            <p key={p.slice(0, 24)} className="max-w-[62ch] not-first:mt-5">
              {p}
            </p>
          ))}
          className="md:items-start"
        />

        <dl className="mt-14 grid gap-10 border-t border-border pt-10 sm:grid-cols-3 sm:gap-8">
          {about.facts.map((f) => (
            <div key={f.term}>
              <dt className="font-heading text-xl leading-snug font-bold">
                <Swoosh>{f.term}</Swoosh>
              </dt>
              <dd className="mt-3 text-muted-foreground">{f.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export { About }
