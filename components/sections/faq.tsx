"use client"

import { IconPlus } from "@tabler/icons-react"

import { faq } from "@/lib/content"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Eyebrow } from "@/components/section-heading"

/**
 * The heading holds the left column, the questions run as ruled rows on the
 * right, under a heavy navy top rule. Absorbs the questions the
 * missing date creates so they do not arrive as email; the first item is open
 * by default because it is the question everyone has.
 *
 * The primitive's own +/− icons are hidden and replaced by one + that turns
 * 45° into ×, in a square well that fills navy when open.
 */
function Faq() {
  return (
    <section id="sss" className="scroll-mt-20 py-[clamp(4rem,10vw,8rem)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5 lg:col-span-4">
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <h2 className="text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-[1]">
            {faq.headline}
          </h2>
        </div>

        <Accordion
          defaultValue={["q0"]}
          className="border-t-4 border-foreground md:col-span-7 lg:col-span-8"
        >
          {faq.items.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`q${i}`}
              className="border-b border-border"
            >
              <AccordionTrigger className="items-center py-6 text-lg font-bold hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden!">
                {item.q}
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-md border border-input text-foreground transition-colors group-aria-expanded/accordion-trigger:border-primary group-aria-expanded/accordion-trigger:bg-primary group-aria-expanded/accordion-trigger:text-primary-foreground"
                >
                  <IconPlus className="size-4 group-aria-expanded/accordion-trigger:rotate-45 motion-safe:transition-transform motion-safe:duration-200" />
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-[62ch] pb-2 text-base leading-[1.65] text-muted-foreground">
                  {item.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export { Faq }
