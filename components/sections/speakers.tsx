import { speakers, speakersSection } from "@/lib/content"
import { Knockout } from "@/components/brand/knockout"

/**
 * Where the knockout rule does its heaviest lifting, which is why this is the
 * one section that sits on navy: the reserved slots become actual holes in the
 * darkest field on the page, and the heading says the same thing in words that
 * the cards say in form.
 *
 * The placeholder is designed to look intentional rather than broken. It is
 * not a skeleton shimmer, not a question-mark icon, and not a grey avatar
 * circle -- all three read as failure. The aperture is the section's own
 * ground colour exactly, so it reads as cut through the card rather than as a
 * grey disc sitting on it, and the name bars are cut the same way, which no
 * avatar placeholder does.
 *
 * Announced speakers render in the same grid at the same size, so a mixed
 * state is the normal case and costs no layout work.
 *
 * Nothing here animates. Confirmed things may move; reserved things never do,
 * so the state reads before you have read a word -- and the section drops a
 * reveal animation rather than gaining one.
 */
function Speakers() {
  const placeholders = Math.max(0, speakersSection.slots - speakers.length)

  return (
    <section
      id="konusmacilar"
      data-surface="navy"
      className="scroll-mt-20 bg-sidebar py-[clamp(4rem,10vw,8rem)] text-sidebar-foreground"
    >
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow mb-5 text-sidebar-primary">
          {speakersSection.eyebrow}
        </p>
        <h2 className="max-w-2xl text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em]">
          {speakersSection.headline}{" "}
          <Knockout className="rounded-xl box-decoration-clone px-[0.18em] pb-[0.06em]">
            {speakersSection.headlineAccent}
          </Knockout>
        </h2>
        <p className="mt-6 max-w-[62ch] opacity-80">{speakersSection.note}</p>
        {placeholders > 0 ? (
          <p className="sr-only">{speakersSection.srAnnouncement}</p>
        ) : null}

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((s) => (
            <article
              key={s.name}
              className="rounded-2xl bg-card p-5 text-card-foreground"
            >
              <div className="aspect-square overflow-hidden rounded-full bg-muted" />
              <h3 className="mt-4 font-heading text-lg font-semibold">
                {s.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {s.title}, {s.org}
              </p>
            </article>
          ))}

          {Array.from({ length: placeholders }).map((_, i) => (
            <div
              key={`slot-${i}`}
              aria-hidden="true"
              className="rounded-2xl bg-card p-5"
            >
              <div className="aspect-square rounded-full bg-sidebar" />
              <div className="mt-4 h-4 w-3/5 rounded-full bg-sidebar" />
              <div className="mt-2 h-3 w-2/5 rounded-full bg-sidebar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Speakers }
