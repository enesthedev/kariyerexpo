import { cn } from "cn"

import { stats } from "@/lib/content"
import { StatCounter } from "@/components/stat-counter"

/**
 * Retrospective numbers with a year label. An event with no date has a
 * credibility problem; last year's attendance is evidence, where a promise
 * about an unscheduled event is not.
 *
 * The strongest number sits on an orange tile with navy type -- the first
 * place on the page where the accent becomes a surface rather than a trim,
 * which is how the palette gets its warmth back now that the cream ground is
 * gone. Its numeral breaks the tile's left edge: overhang, quoted from EXPO
 * reaching past the badge circle, and this section's one use of it.
 */
function Stats() {
  return (
    <section id="rakamlar" className="scroll-mt-20 py-[clamp(4rem,10vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow mb-5 text-line">{stats.eyebrow}</p>
        <h2 className="text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em]">
          {stats.headline}
        </h2>

        <div className="relative mt-14">
          {/* One continuous line running behind the numerals, doing the job a
              row of borders would otherwise do -- the arc at its widest
              scale, the same curve as the heading rules. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-12 hidden h-10 w-full overflow-visible lg:block"
          >
            <path
              d="M0 14 A12864 12864 0 0 0 1200 14"
              pathLength={1}
              fill="none"
              stroke="var(--line)"
              strokeWidth="3"
              strokeLinecap="round"
              className="arc-draw"
            />
          </svg>

          <dl className="relative grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {stats.items.map((s, i) => {
              const lead = i === 0
              return (
                <div
                  key={s.label}
                  className={
                    lead
                      ? "rounded-2xl bg-accent px-6 py-7 text-accent-foreground"
                      : undefined
                  }
                >
                  <dt className="sr-only">{s.label}</dt>
                  <dd
                    className={cn(
                      "numeral font-heading text-[clamp(3rem,2rem+5vw,5.5rem)] leading-[0.9] font-bold tracking-[-0.04em]",
                      lead && "-ml-3"
                    )}
                  >
                    <StatCounter value={s.value} prefix={s.prefix} />
                  </dd>
                  <p
                    aria-hidden="true"
                    className={cn(
                      "mt-3 text-sm font-medium",
                      lead ? "text-accent-foreground" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </p>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}

export { Stats }
