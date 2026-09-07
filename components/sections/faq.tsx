"use client"

import { faq } from "@/lib/content"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

/**
 * Absorbs the questions the missing date creates so they do not arrive as
 * email. The first item is open by default because it is the question
 * everyone has.
 */
function Faq() {
  return (
    <section
      id="sss"
      className="scroll-mt-20 bg-band py-[clamp(4rem,10vw,8rem)]"
    >
      <div className="mx-auto max-w-3xl px-5">
        <p className="eyebrow mb-5 text-line">{faq.eyebrow}</p>
        <h2 className="text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em]">
          {faq.headline}
        </h2>

        <Accordion defaultValue={["q0"]} className="mt-10">
          {faq.items.map((item, i) => (
            <AccordionItem key={item.q} value={`q${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                <p className="max-w-[62ch] pb-5 leading-[1.65] text-muted-foreground">
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
