import { partners } from "@/lib/content"
import { RevealGroup, RevealItem } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

/**
 * Last year's companies as a ruled grid: one cell per name, hairlines
 * between them, so the list reads as a register rather than a wall of
 * badges. Real logos replace names in place, cell for cell; the grid never
 * changes shape.
 *
 * The rules are drawn by the grid's gap over a --border ground, not by cell
 * borders, so every inner line is exactly one hairline wide at every column
 * count and the outer edge stays open.
 */
function Partners() {
  return (
    <section
      id="firmalar"
      className="scroll-mt-20 bg-band py-[clamp(4rem,10vw,8rem)]"
    >
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title={partners.headline}
          description={<p>{partners.note}</p>}
        />

        <RevealGroup
          as="ul"
          stagger={0.03}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden bg-border sm:grid-cols-3 lg:grid-cols-6"
        >
          {partners.names.map((name) => (
            // The cell stays put and only the name rises: a fading cell
            // would show the --border ground through the grid.
            <li
              key={name}
              className="flex min-h-24 items-center bg-band px-4 py-5 text-[0.9375rem] leading-snug font-semibold"
            >
              <RevealItem>{name}</RevealItem>
            </li>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

export { Partners }
