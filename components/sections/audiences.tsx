import { IconArrowRight } from "@tabler/icons-react"
import { cn } from "cn"

import { audiences } from "@/lib/content"
import { Blob } from "@/components/brand/blobs"
import { Swash } from "@/components/brand/swash"
import { RevealGroup, RevealItem } from "@/components/reveal"

/**
 * Three audiences, one salon -- and one funnel. Every card links to the same
 * contact anchor and only preselects a segment on the shared form, so the
 * employer is served without a second flow. The employer card is the only one
 * whose glyph is filled in accent, so it does not read as an afterthought.
 *
 * The reference site flips these tiles on hover. That is unreachable on touch
 * and by keyboard, so everything here is visible without interaction.
 */
function Audiences() {
  return (
    <section id="kimler" className="scroll-mt-20 py-[clamp(4rem,10vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-2xl text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em]">
          {audiences.headline} <Swash>{audiences.headlineAccent}</Swash>
        </h2>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.items.map((a) => (
            <RevealItem key={a.id} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-7">
                <Blob
                  name={a.highlighted ? "orange" : "slate"}
                  className={cn(
                    "size-12",
                    a.highlighted ? "text-accent" : "text-slate"
                  )}
                />
                <h3 className="mt-6 font-heading text-[clamp(1.25rem,1.05rem+0.9vw,1.625rem)] leading-[1.2] font-semibold tracking-[-0.015em]">
                  {a.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{a.summary}</p>

                <ul className="mt-6 space-y-2.5">
                  {a.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm">
                      <span
                        aria-hidden="true"
                        className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-swash"
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                <p className="mt-7 text-sm text-muted-foreground">{a.note}</p>

                <a
                  href="#iletisim"
                  data-role-target={a.id}
                  className="group mt-4 inline-flex items-center gap-2 self-start rounded-md text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {a.cta}
                  <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
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
