import { audiences } from "@/lib/content"
import { RevealText } from "@/components/reveal"
import { AudiencesSelector } from "@/components/sections/audiences-selector"

/**
 * Three audiences, one salon, one funnel: every CTA goes to the same form
 * anchor. The selector is the only client leaf.
 */
function Audiences() {
  return (
    <section id="kimler" className="container-page pb-section">
      <RevealText
        text={audiences.headline}
        accent={audiences.headlineAccent}
        className="text-h2 max-w-[24ch]"
      />
      <AudiencesSelector items={audiences.items} />
    </section>
  )
}

export { Audiences }
