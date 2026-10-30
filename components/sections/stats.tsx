import { stats, type Stat } from "@/lib/content"
import { RevealGroup, RevealItem, RevealText } from "@/components/reveal"
import { StatCounter } from "@/components/stat-counter"

/**
 * Last year's numbers. They are retrospective on purpose: an event with no
 * date needs evidence, not a promise. The label comes first in the DOM and is
 * flipped visually (dt before dd).
 */
function Stats() {
  return (
    <section id="rakamlar" className="container-page pb-section">
      <RevealText
        text={stats.headline}
        accent={stats.headlineAccent}
        className="text-h2"
      />

      <RevealGroup
        as="dl"
        className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-14 lg:grid-cols-4"
      >
        {stats.items.map((s: Stat) => (
          <RevealItem
            key={s.label}
            className="flex flex-col-reverse justify-end gap-2 border-t border-border pt-5"
          >
            <dt className="text-lead">{s.label}</dt>
            <dd className="text-display">
              <StatCounter
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
              />
            </dd>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}

export { Stats }
