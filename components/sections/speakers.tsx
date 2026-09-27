import Image from "next/image"

import { speakers, speakersSection } from "@/lib/content"
import { PendingDots } from "@/components/brand/pending-dots"
import { SectionHeading } from "@/components/section-heading"

/**
 * The second navy band, cut on both edges. The heading says "yakında" in
 * words and the cards say it in form: the second and third of the three
 * pending-dot sites (the heading, then the placeholder cards -- one instance
 * per card is still one use).
 *
 * Every card is a lighter-navy shell, its top-right corner cut, around a
 * photo well in the section's own navy. The well is the ground, not a tint, because the navy surface
 * remaps the dots to light / orange / --sidebar-border and that trio is only
 * tuned against --sidebar itself; on any lighter well the third dot fades.
 *
 * Announced speakers render in the same grid at the same size, so a mixed
 * state is the normal case and costs no layout work. Nothing on a
 * placeholder moves: confirmed things may animate, pending things never do.
 */
function Speakers() {
  const placeholders = Math.max(0, speakersSection.slots - speakers.length)

  return (
    <section
      id="konusmacilar"
      data-surface="navy"
      className="cut-y scroll-mt-20 bg-sidebar py-[calc(var(--cut)+clamp(3.5rem,8vw,6.5rem))] text-sidebar-foreground"
    >
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title={
            <>
              {speakersSection.headline} {speakersSection.headlineAccent}
              <PendingDots size="lg" className="ml-[0.18em]" />
            </>
          }
          description={<p>{speakersSection.note}</p>}
        />
        {placeholders > 0 ? (
          <p className="sr-only">{speakersSection.srAnnouncement}</p>
        ) : null}

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((s) => (
            <article key={s.name} className="corner-cut bg-sidebar-accent p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sidebar">
                {s.photo ? (
                  <Image
                    src={s.photo}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 16rem, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="px-2 pt-4 pb-2">
                <h3 className="font-heading text-lg leading-snug font-bold">
                  {s.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {s.title}, {s.org}
                </p>
              </div>
            </article>
          ))}

          {Array.from({ length: placeholders }).map((_, i) => (
            <div
              key={`slot-${i}`}
              aria-hidden="true"
              className="corner-cut bg-sidebar-accent p-3"
            >
              <div className="grid aspect-[4/5] place-items-center rounded-sm bg-sidebar text-4xl">
                <PendingDots size="lg" />
              </div>
              <div className="px-2 pt-5 pb-3">
                <div className="h-3.5 w-3/5 rounded-sm bg-sidebar" />
                <div className="mt-2.5 h-2.5 w-2/5 rounded-sm bg-sidebar" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Speakers }
