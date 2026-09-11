import { cn } from "cn"

import { partners } from "@/lib/content"

/**
 * The reference site's flags-on-arcs block, in the logo's orbit grammar: from
 * lg up the names ride three arched rows (7 / 6 / 5, outermost first) over the
 * heading, threaded on two solid silver arcs. Below lg there is no room for an
 * arch, so the names run as the two-row marquee instead.
 *
 * Geometry. Chips are a fixed 7.75rem wide on a 8.375rem pitch, so every
 * chip's x is known without measuring: row chip i sits at t × half-span,
 * t ∈ [-1, 1]. Each row dips by `dip × t²` (a parabola), and the rows are
 * 5.5rem apart, which is what keeps an end chip clear of the chip below it
 * (worked out for the half-pitch overlap between neighbouring rows). The two
 * arcs are the same parabolas as quadratic Béziers -- control point at the
 * tangents' intersection -- through the centre lines of the outer and inner
 * rows, drawn in a viewBox of 0.1rem units so SVG and chips share one scale.
 * Both run a little past the end chips so they read as orbits, not rails.
 *
 * The rows slice the list 7 / 6 / 5, i.e. the arch is drawn for the 18 name
 * slots content.ts keeps; real logos replace names in place, not add rows.
 *
 * Screen readers get the names exactly once, from the visually hidden list;
 * both visual layouts are aria-hidden, since one is duplicated for the loop
 * and the other is only a picture of the same list.
 */

const CHIP_W = 7.75
const GAP = 0.625
const PITCH = CHIP_W + GAP
const CHIP_H = 3.5
const ARCH_W = 58

const ROWS = [
  { names: partners.names.slice(0, 7), top: 0, dip: 5 },
  { names: partners.names.slice(7, 13), top: 5.5, dip: 3.75 },
  { names: partners.names.slice(13), top: 11, dip: 2.5 },
]

/** A parabolic row centre line as a quadratic Bézier in 0.1rem units. */
function arcPath(row: (typeof ROWS)[number], reach: number) {
  const half = ((row.names.length - 1) / 2) * PITCH
  const a = row.dip / (half * half)
  const c = row.top + CHIP_H / 2
  const cx = ARCH_W / 2
  const lift = a * reach * reach
  const u = (n: number) => Math.round(n * 100) / 10
  return `M${u(cx - reach)} ${u(c + lift)} Q${u(cx)} ${u(c - lift)} ${u(cx + reach)} ${u(c + lift)}`
}

const HALF = Math.ceil(partners.names.length / 2)
const MARQUEE_ROWS = [partners.names.slice(0, HALF), partners.names.slice(HALF)]

const chip =
  "flex shrink-0 items-center justify-center rounded-lg border border-border bg-card px-2.5 text-center text-[0.8125rem] leading-tight font-semibold text-foreground shadow-sm"

function Partners() {
  return (
    <section
      id="firmalar"
      className="scroll-mt-20 overflow-hidden py-[clamp(4rem,10vw,8rem)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col px-5 lg:flex-col-reverse">
        <div className="mx-auto max-w-2xl text-center lg:mt-6">
          <p className="eyebrow mb-5 text-line">{partners.eyebrow}</p>
          <h2 className="text-[clamp(2rem,1.2rem+3vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.02em]">
            {partners.headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {partners.note}
          </p>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto hidden h-[17.5rem] w-[58rem] lg:block"
        >
          <svg
            viewBox="0 0 580 175"
            fill="none"
            stroke="var(--silver)"
            strokeWidth="1.5"
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
          >
            <path d={arcPath(ROWS[0], 31)} vectorEffect="non-scaling-stroke" />
            <path d={arcPath(ROWS[2], 22)} vectorEffect="non-scaling-stroke" />
          </svg>

          {ROWS.map((row) => {
            const mid = (row.names.length - 1) / 2
            return (
              <div
                key={row.top}
                className="absolute inset-x-0 flex justify-center"
                style={{ top: `${row.top}rem`, gap: `${GAP}rem` }}
              >
                {row.names.map((name, i) => {
                  const t = mid === 0 ? 0 : (i - mid) / mid
                  return (
                    <div
                      key={name}
                      className={cn(chip, "h-14")}
                      style={{
                        width: `${CHIP_W}rem`,
                        translate: `0 ${(row.dip * t * t).toFixed(3)}rem`,
                      }}
                    >
                      {name}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <ul className="sr-only">
        {partners.names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="marquee mt-12 space-y-3 overflow-hidden lg:hidden"
      >
        {MARQUEE_ROWS.map((row, i) => (
          <div
            key={i}
            className="marquee-track"
            data-direction={i === 1 ? "reverse" : undefined}
          >
            {/* Duplicated so the -50% translate lands on an identical frame. */}
            {[...row, ...row].map((name, j) => (
              <div
                key={`${name}-${j}`}
                className={cn(chip, "mx-1.5 h-14 w-36")}
              >
                {name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export { Partners }
