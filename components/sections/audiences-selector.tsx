"use client"

import { startTransition, useRef, useState, ViewTransition } from "react"
import Image from "next/image"
import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react"

import { images } from "@/lib/content"
import { PillLink } from "@/components/pill-link"
import { cn } from "@/lib/utils"

type Item = {
  readonly id: keyof typeof images.audiences
  readonly title: string
  readonly summary: string
  readonly points: readonly string[]
  readonly note: string
  readonly cta: string
}

/**
 * Pill tabs (roving tabindex, arrows/Home/End) over a photo and its detail. A
 * switch runs in startTransition so React can animate it: the active orange
 * pill is a shared-element view transition that glides between tabs, the
 * panel cross-fades.
 */
function AudiencesSelector({ items }: { items: readonly Item[] }) {
  const [activeId, setActiveId] = useState(items[0].id)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const active = items.find((i) => i.id === activeId) ?? items[0]
  const image = images.audiences[active.id]

  function select(index: number) {
    startTransition(() => setActiveId(items[index].id))
    tabs.current[index]?.focus()
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const n = items.length
    const next = {
      ArrowRight: (index + 1) % n,
      ArrowDown: (index + 1) % n,
      ArrowLeft: (index - 1 + n) % n,
      ArrowUp: (index - 1 + n) % n,
      Home: 0,
      End: n - 1,
    }[e.key]
    if (next === undefined) return
    e.preventDefault()
    select(next)
  }

  return (
    <div className="mt-8 lg:mt-10">
      <div role="tablist" className="flex flex-wrap gap-2">
        {items.map((item, i) => {
          const selected = item.id === activeId
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`aud-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={selected ? `aud-panel-${item.id}` : undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "relative isolate h-11 rounded-pill px-5 text-sm font-medium transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                selected
                  ? "text-accent-foreground"
                  : "bg-muted text-foreground hover:bg-surface-hover"
              )}
            >
              {selected ? (
                <ViewTransition
                  name="audience-indicator"
                  share="indicator"
                  default="none"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-pill bg-accent"
                  />
                </ViewTransition>
              ) : null}
              {item.title}
            </button>
          )
        })}
      </div>

      <ViewTransition
        key={active.id}
        enter="fade-in"
        exit="fade-out"
        default="none"
      >
        <div
          role="tabpanel"
          id={`aud-panel-${active.id}`}
          aria-labelledby={`aud-tab-${active.id}`}
          tabIndex={0}
          className="mt-8 grid gap-8 rounded-media focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:grid-cols-12 lg:gap-12"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-media bg-muted lg:col-span-7 lg:aspect-[16/11]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col items-start lg:col-span-5">
            <p className="text-h2">{active.summary}</p>

            <ul className="mt-6 w-full divide-y divide-border border-y border-border">
              {active.points.map((point) => (
                <li key={point} className="flex items-center gap-3 py-3.5">
                  <IconArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-line"
                  />
                  {point}
                </li>
              ))}
            </ul>

            <p className="text-lead mt-6">{active.note}</p>
            <PillLink
              href="#iletisim"
              data-role-target={active.id}
              size="xl"
              className="mt-6 lg:mt-auto"
            >
              {active.cta}
              <IconArrowUpRight data-icon="inline-end" />
            </PillLink>
          </div>
        </div>
      </ViewTransition>
    </div>
  )
}

export { AudiencesSelector }
