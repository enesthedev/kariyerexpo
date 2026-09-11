import { audiences } from "@/lib/content"
import { Swoosh } from "@/components/brand/swoosh"
import { SectionHeading } from "@/components/section-heading"
import { RevealGroup, RevealItem } from "@/components/reveal"
import { AudienceCard } from "@/components/sections/audience-card"

/**
 * Three audiences, one salon -- and one funnel. Every card links to the same
 * contact anchor and only preselects a segment on the shared form, so the
 * employer is served without a second flow.
 *
 * Follows the reference site's visa-type cards: a tall face that always
 * carries the sign-up path, plus a "+" that opens an overlay for the detail
 * that would otherwise crowd it. See audience-card.tsx for the overlay
 * mechanics and the non-highlighted treatment's rationale.
 */
function Audiences() {
  return (
    <section id="kimler" className="scroll-mt-20 py-[clamp(4rem,10vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow={audiences.eyebrow}
          title={
            <>
              {audiences.headline} <Swoosh>{audiences.headlineAccent}</Swoosh>
            </>
          }
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.items.map((item, index) => (
            <RevealItem key={item.id} className="h-full">
              <AudienceCard index={index} {...item} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

export { Audiences }
