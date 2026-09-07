import { stats } from "@/lib/content"
import { StatCounter } from "@/components/stat-counter"

/**
 * Retrospective numbers with a year label. An event with no date has a
 * credibility problem; last year's attendance is evidence, where a promise
 * about an unscheduled event is not.
 */
function Stats() {
  return (
    <section id="rakamlar" className="scroll-mt-20 py-[clamp(4rem,10vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em]">
          {stats.headline}
        </h2>

        <div className="relative mt-14">
          {/* One continuous line running behind the numerals, doing the job a
              row of borders would otherwise do. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-12 hidden h-10 w-full overflow-visible lg:block"
          >
            <path
              d="M0 20C150 4 300 36 450 20S750 4 900 20s200 12 300 0"
              fill="none"
              stroke="var(--line)"
              strokeWidth="3"
              strokeLinecap="round"
              className="swash-draw"
            />
          </svg>

          <dl className="relative grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {stats.items.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-heading text-[clamp(3rem,2rem+5vw,5.5rem)] leading-[0.9] font-bold tracking-[-0.04em]">
                  <StatCounter value={s.value} prefix={s.prefix} />
                </dd>
                <p
                  aria-hidden="true"
                  className="mt-3 text-sm font-medium text-muted-foreground"
                >
                  {s.label}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export { Stats }
