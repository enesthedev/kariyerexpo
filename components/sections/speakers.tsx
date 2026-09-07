import { cn } from "cn"

import { speakers, speakersSection } from "@/lib/content"
import { Blob, type BlobName } from "@/components/brand/blobs"
import { Swash } from "@/components/brand/swash"
import { RevealGroup, RevealItem } from "@/components/reveal"

/**
 * Where the "yakında" device does its heaviest lifting.
 *
 * The placeholder is designed to look intentional rather than broken: a dashed
 * swash border and one blob from the mark, rotated differently per card, so
 * the cards read as siblings and the silhouette says "a person will be here"
 * rather than "an image failed to load". No skeleton shimmer, no question-mark
 * icon, no grey avatar circle -- all three read as failure.
 *
 * Announced speakers render solid in the same grid at the same size, so a
 * mixed state (some announced, some not) is the normal case and costs no
 * layout work.
 */

const PLACEHOLDER_BLOBS: { name: BlobName; rotate: string }[] = [
  { name: "navy", rotate: "rotate-[8deg]" },
  { name: "slate", rotate: "-rotate-[14deg]" },
  { name: "cream", rotate: "rotate-[24deg]" },
  { name: "orange", rotate: "-rotate-[6deg]" },
]

function Speakers() {
  const placeholders = Math.max(0, speakersSection.slots - speakers.length)

  return (
    <section
      id="konusmacilar"
      className="scroll-mt-20 py-[clamp(4rem,10vw,8rem)]"
    >
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-2xl text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em]">
          {speakersSection.headline}{" "}
          <Swash variant="dashed">{speakersSection.headlineAccent}</Swash>
        </h2>
        <p className="mt-6 max-w-[62ch] text-muted-foreground">
          {speakersSection.note}
        </p>
        {placeholders > 0 ? (
          <p className="sr-only">{speakersSection.srAnnouncement}</p>
        ) : null}

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((s) => (
            <RevealItem key={s.name}>
              <article className="rounded-2xl border border-border bg-card p-5">
                <div className="aspect-square overflow-hidden rounded-xl bg-muted" />
                <h3 className="mt-4 font-heading text-lg font-semibold">
                  {s.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {s.title}, {s.org}
                </p>
              </article>
            </RevealItem>
          ))}

          {Array.from({ length: placeholders }).map((_, i) => {
            const b = PLACEHOLDER_BLOBS[i % PLACEHOLDER_BLOBS.length]
            return (
              <RevealItem key={`slot-${i}`}>
                <div
                  aria-hidden="true"
                  className="rounded-2xl border-2 border-dashed border-line p-5"
                >
                  <div className="flex aspect-square items-center justify-center">
                    <Blob
                      name={b.name}
                      className={cn(
                        "size-3/5 text-silver opacity-35",
                        b.rotate
                      )}
                    />
                  </div>
                  <div className="mt-4 h-4 w-3/5 rounded-full bg-muted" />
                  <div className="mt-2 h-3 w-2/5 rounded-full bg-muted" />
                </div>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

export { Speakers }
