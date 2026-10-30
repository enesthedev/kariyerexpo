import Image from "next/image"

import { about, images } from "@/lib/content"
import { PhotoReveal, Reveal, RevealText } from "@/components/reveal"

/**
 * Heading at the start, the story at the end, then a large photograph with
 * the three facts beside it.
 */
function About() {
  return (
    <section id="fuar" className="container-page py-section">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
        <RevealText
          text={about.headline}
          accent={about.headlineAccent}
          className="text-h2 lg:col-span-5"
        />
        <Reveal delay={0.1} className="flex flex-col gap-4 lg:col-span-7">
          {about.body.map((p) => (
            <p key={p.slice(0, 24)} className="text-lead max-w-[62ch]">
              {p}
            </p>
          ))}
        </Reveal>
      </div>

      <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
        <PhotoReveal className="aspect-[4/3] lg:col-span-8 lg:aspect-[16/10]">
          <Image
            src={images.about.src}
            alt={images.about.alt}
            fill
            sizes="(min-width: 1024px) 820px, 100vw"
            className="object-cover"
          />
        </PhotoReveal>
        <Reveal delay={0.1} className="lg:col-span-4 lg:self-end">
          <dl className="divide-y divide-border border-y border-border">
            {about.facts.map((fact) => (
              <div key={fact.term} className="py-5">
                <dt className="text-h3">{fact.term}</dt>
                <dd className="text-meta mt-1">{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

export { About }
