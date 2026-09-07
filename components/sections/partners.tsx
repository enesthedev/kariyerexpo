import { partners } from "@/lib/content"

/**
 * Name-only slots rather than grey boxes with a broken-image glyph. When real
 * logos arrive they drop into the same fixed slot size and the layout does not
 * move.
 *
 * Pure CSS: the track is duplicated and translated -50%, so the loop is
 * seamless without an observer or a requestAnimationFrame loop. It pauses on
 * hover and on focus-within, and reduced motion turns it into a static grid.
 */

const HALF = Math.ceil(partners.names.length / 2)
const ROWS = [partners.names.slice(0, HALF), partners.names.slice(HALF)]

function Slot({ name }: { name: string }) {
  return (
    <div className="mx-3 flex h-14 w-[9rem] shrink-0 items-center justify-center rounded-xl bg-muted px-3 text-center text-sm font-semibold text-muted-foreground">
      {name}
    </div>
  )
}

function Partners() {
  return (
    <section id="firmalar" className="scroll-mt-20 py-[clamp(4rem,10vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow mb-5 text-line">{partners.eyebrow}</p>
        <h2 className="text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em]">
          {partners.headline}
        </h2>
        <p className="mt-6 max-w-[62ch] text-muted-foreground">
          {partners.note}
        </p>
      </div>

      <div className="marquee mt-12 space-y-4 overflow-hidden">
        {ROWS.map((row, i) => (
          <div
            key={i}
            className="marquee-track"
            data-direction={i === 1 ? "reverse" : undefined}
          >
            {/* Duplicated so the -50% translate lands on an identical frame. */}
            {[...row, ...row].map((name, j) => (
              <Slot key={`${name}-${j}`} name={name} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export { Partners }
