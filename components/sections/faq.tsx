"use client"

import { startTransition, useId, useState, ViewTransition } from "react"
import Image from "next/image"
import { IconChevronDown } from "@tabler/icons-react"

import { faq, images } from "@/lib/content"
import {
  PhotoReveal,
  RevealGroup,
  RevealItem,
  RevealText,
} from "@/components/reveal"
import { cn } from "@/lib/utils"

/**
 * Heading and questions at the start, a photograph at the end (under them on
 * phones). One answer open at a time, the first by default. Toggling runs
 * in startTransition so React View Transitions can play: the answer
 * slides up in / fades out, and every item is a bare `glide` boundary so
 * the rows below the toggled one glide instead of jumping.
 */
function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const uid = useId()

  return (
    <section
      id="sss"
      className="container-page grid gap-12 pb-section lg:grid-cols-12 lg:items-start lg:gap-16"
    >
      <div className="lg:col-span-7">
        <RevealText text={faq.headline} className="text-h2" />

        <RevealGroup stagger={0.06} className="mt-10 flex flex-col gap-3">
          {faq.items.map((item, i) => {
            const isOpen = open === i
            const panelId = `${uid}-p${i}`
            const buttonId = `${uid}-b${i}`
            return (
              <ViewTransition key={item.q} update="glide">
                <RevealItem className="rounded-card bg-muted">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={isOpen ? panelId : undefined}
                      onClick={() =>
                        startTransition(() => setOpen(isOpen ? null : i))
                      }
                      className="flex min-h-14 w-full items-center justify-between gap-4 rounded-card px-5 py-3 text-left text-base font-medium outline-hidden focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                    >
                      {item.q}
                      <IconChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-6 shrink-0 transition-[rotate,color] duration-300 ease-(--ease-out-expo)",
                          isOpen
                            ? "rotate-180 text-line"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  </h3>
                  {isOpen ? (
                    <ViewTransition enter="slide-up" exit="fade-out">
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                      >
                        <p className="text-lead max-w-[60ch] px-5 pb-5">
                          {item.a}
                        </p>
                      </div>
                    </ViewTransition>
                  ) : null}
                </RevealItem>
              </ViewTransition>
            )
          })}
        </RevealGroup>
      </div>

      <PhotoReveal className="aspect-[4/3] lg:col-span-5 lg:aspect-[4/5]">
        <Image
          src={images.faq.src}
          alt={images.faq.alt}
          fill
          sizes="(min-width: 1024px) 480px, 100vw"
          className="object-cover"
        />
      </PhotoReveal>
    </section>
  )
}

export { Faq }
