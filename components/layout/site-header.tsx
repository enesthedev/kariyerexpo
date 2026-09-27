"use client"

import * as React from "react"
import { IconArrowUpRight, IconMenu2 } from "@tabler/icons-react"
import { cn } from "cn"
import { useMotionValueEvent, useScroll } from "motion/react"
import * as m from "motion/react-m"

import { header, nav, ui } from "@/lib/content"
import { Mark } from "@/components/brand/mark"
import { ScrollProgress } from "@/components/reveal"
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * A white capsule floating over the page, inset from the viewport edges, its
 * top-right corner cut on the brand diagonal (.corner-cut) instead of
 * rounded. On the light ground the logo needs no disc, so it stands at full
 * size at the left; the links run in literal capitals at the far right, in
 * flow and whitespace-nowrap, so they never break onto a second line.
 * clip-path would clip a box-shadow, so the float shadow is a drop-shadow on
 * the wrapper.
 *
 * It slides fully away going down and returns on any move up; never while
 * the drawer is open, and focus inside it brings it back, so a keyboard user
 * never tabs through links they cannot see. The active link carries the
 * stripe tick, the bar's one orange thing. Below lg the links move into the
 * navy drawer.
 */
function SiteHeader() {
  const [active, setActive] = React.useState("")
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? y)
    // Past the header's own height, and with a few pixels of dead band so a
    // trackpad's jitter does not flicker it.
    if (delta > 4 && y > 120) setHidden(true)
    else if (delta < -4) setHidden(false)
  })

  React.useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <ScrollProgress />
      <m.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: hidden && !menuOpen ? "-110%" : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        onFocusCapture={() => setHidden(false)}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 drop-shadow-[0_12px_24px_oklch(0.2589_0.092_258.9/0.28)]"
      >
        <div className="corner-cut mx-auto flex h-18 max-w-6xl items-center gap-8 bg-card px-4 lg:h-20 lg:px-5">
          {/* The mark's own role="img" label ("Kariyer Expo 27") is the
              link's accessible name -- one name, not zero and not two. */}
          <a
            href="#anasayfa"
            className="shrink-0 rounded-full focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Mark className="size-14 lg:size-16" />
          </a>

          <nav className="ml-auto hidden shrink-0 lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const isActive = active === item.href.slice(1)
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative inline-flex items-center rounded-md px-3.5 py-2 text-[0.9375rem] font-semibold tracking-[0.06em] whitespace-nowrap transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.caps}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute bottom-0 left-1/2 h-1 w-5 -translate-x-1/2 -skew-x-[40deg] bg-(--mark-orange) transition-opacity",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Controlled so the drawer's links can stay real anchors that
              close it on click, instead of SheetClose (a Dialog.Close, which
              must not render a link). */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            {/* Not the outline Button, which is a white card: a
                parallelogram in navy, painted by ::before so the
                label stays upright. mr-1 keeps its leaning corner off the
                gutter. */}
            <SheetTrigger className="relative isolate mr-1 ml-auto inline-flex h-9 items-center gap-1.5 px-6 text-[0.8125rem] font-semibold whitespace-nowrap text-primary-foreground outline-none before:absolute before:inset-0 before:-z-10 before:-skew-x-[40deg] before:bg-primary hover:before:bg-primary/85 focus-visible:before:ring-2 focus-visible:before:ring-ring motion-safe:before:transition-colors lg:hidden [&_svg]:size-4">
              <IconMenu2 data-icon="inline-start" />
              {ui.menu}
            </SheetTrigger>
            <SheetContent
              side="right"
              data-surface="navy"
              closeLabel={ui.close}
              className="w-[86%] border-l-0 bg-sidebar text-sidebar-foreground sm:max-w-sm"
            >
              <SheetTitle className="px-6 pt-6 text-sidebar-foreground">
                <Mark className="h-10 w-auto" />
              </SheetTitle>
              <nav className="relative z-10 mt-10 flex flex-col gap-1 px-6">
                {nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg py-3 text-2xl transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="relative z-10 mt-auto p-6">
                {/* Base UI's Button must not render a link, so the anchor
                    carries buttonVariants directly. */}
                <a
                  href="#iletisim"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "accent", size: "lg" }),
                    "w-full"
                  )}
                >
                  {header.cta}
                  <IconArrowUpRight data-icon="inline-end" />
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </m.header>
    </>
  )
}

export { SiteHeader }
