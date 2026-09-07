import { IconArrowRight } from "@tabler/icons-react"
import { cn } from "cn"

import { audiences } from "@/lib/content"
import { Arc } from "@/components/brand/arc"
import { RevealGroup, RevealItem } from "@/components/reveal"

/**
 * Three audiences, one salon -- and one funnel. Every card links to the same
 * contact anchor and only preselects a segment on the shared form, so the
 * employer is served without a second flow.
 *
 * The blob glyph is replaced by a numeral, which is the mark's own grammar:
 * it puts a number in a shape rather than an icon in a circle, and unlike the
 * blob it carries information -- three paths, counted. The employer's sits in
 * a filled chip the way the mark's "27" does, which is also what keeps it off
 * the ban list: --accent cannot be text on this ground at 2.80:1, but it
 * carries navy at 5.38:1, and --line clears 4.16:1 at this size.
 *
 * Hover fills the whole card orange with navy type rather than lifting it.
 * That is where the palette gets its warmth back now that the cream ground is
 * gone: orange has to be a surface, not just an accent.
 *
 * The reference site flips these tiles on hover. That is unreachable on touch
 * and by keyboard, so everything here is visible without interaction.
 */
function Audiences() {
  return (
    <section id="kimler" className="scroll-mt-20 py-[clamp(4rem,10vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow mb-5 text-line">{audiences.eyebrow}</p>
        <h2 className="max-w-2xl text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em]">
          {audiences.headline} <Arc>{audiences.headlineAccent}</Arc>
        </h2>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.items.map((a, i) => (
            <RevealItem key={a.id} className="h-full">
              <article className="group/card flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground">
                <span
                  aria-hidden="true"
                  className={cn(
                    "numeral text-[1.75rem] leading-none font-bold",
                    a.highlighted
                      ? "w-fit rounded-full bg-accent px-3 py-1 text-accent-foreground group-hover/card:bg-accent-foreground group-hover/card:text-accent"
                      : "text-line group-hover/card:text-accent-foreground"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-heading text-[clamp(1.25rem,1.05rem+0.9vw,1.625rem)] leading-[1.2] font-semibold tracking-[-0.015em]">
                  {a.title}
                </h3>
                <p className="mt-2 text-muted-foreground group-hover/card:text-accent-foreground">
                  {a.summary}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {a.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm">
                      <span
                        aria-hidden="true"
                        className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-line group-hover/card:bg-accent-foreground"
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                <p className="mt-7 text-sm text-muted-foreground group-hover/card:text-accent-foreground">
                  {a.note}
                </p>

                <a
                  href="#iletisim"
                  data-role-target={a.id}
                  className="group/link mt-4 inline-flex items-center gap-2 self-start rounded-md text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {a.cta}
                  <IconArrowRight className="size-4 transition-transform group-hover/link:translate-x-1" />
                </a>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

export { Audiences }
