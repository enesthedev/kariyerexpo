import { about } from "@/lib/content"
import { Swash } from "@/components/brand/swash"

/**
 * The quietest section on the page and the only real reading passage: no
 * cards, no icons, nothing competing with the prose.
 */
function About() {
  return (
    <section
      id="fuar"
      className="scroll-mt-20 bg-sand py-[clamp(4rem,10vw,8rem)]"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-12 md:gap-12">
        <h2 className="text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em] md:col-span-5">
          {about.headline} <Swash>{about.headlineAccent}</Swash>
        </h2>
        <div className="md:col-span-7">
          {about.body.map((p) => (
            <p
              key={p.slice(0, 24)}
              className="mt-0 max-w-[62ch] leading-[1.65] not-first:mt-5"
            >
              {p}
            </p>
          ))}
          <dl className="mt-9 space-y-4 border-l-2 border-swash pl-5">
            {about.facts.map((f) => (
              <div key={f.term}>
                <dt className="font-heading font-semibold">{f.term}</dt>
                <dd className="text-sm text-muted-foreground">{f.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export { About }
