import { cn } from "cn"

import { stats, type Stat } from "@/lib/content"
import { StatCounter } from "@/components/stat-counter"

/**
 * The reference site's why-us block: the claim on the left, the evidence as
 * a 2×2 of tiles on the right. The numbers are retrospective on purpose -- an
 * event with no date has a credibility problem, and last year's attendance is
 * evidence where a promise is not.
 *
 * The first tile is the one place in the section where orange is a surface;
 * its type is navy, never white (white on orange is 3.17:1).
 *
 * Each tile is a size container and the numeral is sized in cqi, so "11.400"
 * at wdth 125 fits its tile at every width from a 360px phone up, instead of
 * a viewport clamp that is right for one column count and wrong for the next.
 * The label comes first in the DOM (dt before dd) and the tile flips it
 * visually, so the list reads "label, value" without a hidden duplicate.
 */
function Stats() {
  return (
    <section
      id="rakamlar"
      className="scroll-mt-20 bg-band py-[clamp(4rem,10vw,8rem)]"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-5 text-line">{stats.eyebrow}</p>
          <h2 className="text-[clamp(2rem,1.2rem+3vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.02em]">
            {stats.headline}
          </h2>
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7">
          {stats.items.map((s: Stat, i) => {
            const lead = i === 0
            return (
              <div
                key={s.label}
                className={cn(
                  "@container flex min-h-40 flex-col-reverse justify-between gap-4 rounded-[1.5rem] p-5 sm:min-h-48 sm:p-7",
                  lead
                    ? "bg-accent text-accent-foreground"
                    : "border border-border bg-card"
                )}
              >
                <dt
                  className={cn(
                    "text-sm leading-snug font-medium",
                    lead ? "text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </dt>
                <dd className="numeral text-[clamp(1.75rem,19cqi,4rem)] leading-[0.9] tracking-[-0.03em]">
                  <StatCounter
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                  />
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}

export { Stats }
