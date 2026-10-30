import Image from "next/image"

import { speakers, speakersSection } from "@/lib/content"
import {
  Reveal,
  RevealGroup,
  RevealItem,
  RevealText,
} from "@/components/reveal"

/**
 * Data-driven: real speakers and empty slots share one grid, so a
 * half-announced list is the normal case. A slot is a muted photo frame with
 * a small "yakında" label.
 */
const frame = "relative aspect-[4/5] overflow-hidden rounded-media bg-muted"

function Speakers() {
  const placeholders = Math.max(0, speakersSection.slots - speakers.length)

  return (
    <section id="konusmacilar" className="container-page pb-section">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <RevealText
          text={speakersSection.headline}
          accent={speakersSection.headlineAccent}
          className="text-h2 lg:col-span-7"
        />
        <Reveal delay={0.1} className="lg:col-span-5">
          <p className="text-lead">{speakersSection.note}</p>
        </Reveal>
      </div>

      {placeholders > 0 ? (
        <p className="sr-only">{speakersSection.srAnnouncement}</p>
      ) : null}

      <RevealGroup className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:mt-14 lg:grid-cols-4">
        {speakers.map((s) => (
          <RevealItem key={s.name}>
            <article>
              <div className={frame}>
                {s.photo ? (
                  <Image
                    src={s.photo}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 300px, 45vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <h3 className="text-h3 mt-4">{s.name}</h3>
              <p className="text-meta mt-1">
                {s.title}, {s.org}
              </p>
            </article>
          </RevealItem>
        ))}

        {Array.from({ length: placeholders }).map((_, i) => (
          <RevealItem key={`slot-${i}`}>
            <div
              aria-hidden="true"
              className={`${frame} grid place-items-center`}
            >
              <span className="text-meta">
                {speakersSection.headlineAccent}
              </span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}

export { Speakers }
