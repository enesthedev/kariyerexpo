import { cn } from "cn"

import { stats, type Stat } from "@/lib/content"
import { Stripes } from "@/components/brand/stripes"
import { StatCounter } from "@/components/stat-counter"

/**
 * The first navy band: cut on both edges, the stripes in its upper corner,
 * and last year's numbers set large in the leaning numeral voice. The numbers
 * are retrospective on purpose -- an event with no date has a credibility
 * problem, and last year's attendance is evidence where a promise is not.
 *
 * The lead number takes the section's one orange (--line is the full orange
 * on navy, 5.46:1), like the 7 in the logo's 27.
 *
 * Each cell is a size container and the numeral is sized in cqi, so "11.400"
 * at wdth 125 fits its cell at every width from a 360px phone up. The label
 * comes first in the DOM (dt before dd) and the cell flips it visually, so
 * the list reads "label, value" without a hidden duplicate.
 */
function Stats() {
  return (
    <section
      id="rakamlar"
      data-surface="navy"
      className="cut-y relative isolate scroll-mt-20 overflow-hidden bg-sidebar py-[calc(var(--cut)+clamp(3.5rem,8vw,6.5rem))] text-sidebar-foreground"
    >
      <Stripes className="absolute top-[calc(var(--cut)*0.4)] right-[4%] -z-10 h-24 opacity-90 sm:h-32 lg:h-44" />

      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-[16ch] text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-[1]">
          {stats.headline}
        </h2>

        <dl className="mt-14 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.items.map((s: Stat, i) => (
            <div
              key={s.label}
              className={cn(
                "@container flex flex-col-reverse justify-end gap-3 border-sidebar-border pr-4",
                // A rule between neighbours only: every odd cell, plus the
                // third once the row holds all four.
                i % 2 === 1 && "border-l pl-5",
                i === 2 && "lg:border-l lg:pl-5"
              )}
            >
              <dt className="max-w-[18ch] text-sm leading-snug text-muted-foreground">
                {s.label}
              </dt>
              <dd
                className={cn(
                  "numeral text-[clamp(2rem,22cqi,4.5rem)] leading-[0.9] tracking-[-0.03em]",
                  i === 0 && "text-line"
                )}
              >
                <StatCounter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export { Stats }
