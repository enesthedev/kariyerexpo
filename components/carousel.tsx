"use client"

import * as React from "react"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { useReducedMotion } from "motion/react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

/**
 * A horizontally-snapping row with prev/next controls.
 *
 * The scroller itself carries the region semantics (role, label, tabIndex)
 * so keyboard users can focus and scroll it directly, per the WAI-ARIA
 * scrollable-region pattern. "One item" is measured, not assumed: the first
 * `li`'s rendered width plus the row's own gap, so callers can pass cards of
 * any size without this component needing to know it.
 */
function Carousel({
  label,
  prevLabel,
  nextLabel,
  children,
  className,
}: {
  label: string
  prevLabel: string
  nextLabel: string
  children: React.ReactNode
  className?: string
}) {
  const scrollerRef = React.useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = React.useState(true)
  const [atEnd, setAtEnd] = React.useState(false)
  const reducedMotion = useReducedMotion()

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    function update() {
      if (!el) return
      const maxScrollLeft = el.scrollWidth - el.clientWidth
      setAtStart(el.scrollLeft <= 1)
      setAtEnd(el.scrollLeft >= maxScrollLeft - 1)
    }

    update()
    el.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)

    return () => {
      el.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [])

  function itemStep() {
    const el = scrollerRef.current
    if (!el) return 0
    const firstItem = el.querySelector("li")
    if (!firstItem) return 0
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || "0")
    return firstItem.offsetWidth + gap
  }

  function scrollByItem(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({
      left: direction * itemStep(),
      behavior: reducedMotion ? "auto" : "smooth",
    })
  }

  return (
    <div className={cn("relative", className)}>
      <ul
        ref={scrollerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory scroll-px-5 [scrollbar-width:none] gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        {React.Children.map(children, (child, index) => (
          <li key={index} className="shrink-0 snap-start">
            {child}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="size-12 rounded-md"
          onClick={() => scrollByItem(-1)}
          disabled={atStart}
          aria-label={prevLabel}
        >
          <IconArrowLeft />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="size-12 rounded-md"
          onClick={() => scrollByItem(1)}
          disabled={atEnd}
          aria-label={nextLabel}
        >
          <IconArrowRight />
        </Button>
      </div>
    </div>
  )
}

export { Carousel }
