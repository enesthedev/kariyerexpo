import { program, ui } from "@/lib/content"
import { SectionHeading } from "@/components/section-heading"
import { Carousel } from "@/components/carousel"
import { Reveal } from "@/components/reveal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

/**
 * One tab per theme group, each panel a carousel of cut-corner session
 * cards, numbered in the leaning numeral voice. Every panel is `keepMounted` so the
 * Atölyeler items are in the server HTML even while the Paneller tab shows.
 *
 * base-ui hides the inactive panel with the `hidden` attribute rather than a
 * class, so no panel here (and no element `TabsContent` renders as) carries
 * its own `flex`/`grid` display utility -- a utility of equal specificity
 * declared after Tailwind's `[hidden]` reset would out-cascade it and leave
 * the panel visible. The Carousel's own display styling lives on its inner
 * elements, safely below the panel root.
 */
function Program() {
  return (
    <section
      id="program"
      className="scroll-mt-20 bg-band py-[clamp(4rem,10vw,8rem)]"
    >
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title={program.headline}
          accent={program.headlineAccent}
        />

        <Reveal delay={0.1} className="mt-14">
          <Tabs defaultValue={program.groups[0].title}>
            <TabsList>
              {program.groups.map((group) => (
                <TabsTrigger key={group.title} value={group.title}>
                  {group.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {program.groups.map((group) => (
              <TabsContent key={group.title} value={group.title} keepMounted>
                <Carousel
                  label={program.carouselLabel}
                  prevLabel={ui.prev}
                  nextLabel={ui.next}
                >
                  {group.items.map((item, index) => (
                    <div
                      key={item}
                      className="corner-cut flex h-full min-h-[14rem] w-[78vw] max-w-[22rem] flex-col justify-between bg-card p-6 sm:w-[20rem]"
                    >
                      <span
                        aria-hidden="true"
                        className="numeral text-[2.5rem] leading-none text-line"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-6 text-[clamp(1.125rem,1rem+0.6vw,1.375rem)] leading-snug font-semibold tracking-[-0.015em]">
                        {item}
                      </p>
                    </div>
                  ))}
                </Carousel>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>

        <p className="mt-10 max-w-[62ch] text-muted-foreground">
          {program.note}
        </p>
      </div>
    </section>
  )
}

export { Program }
