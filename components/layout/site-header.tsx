"use client"

import * as React from "react"
import { IconArrowUpRight, IconMenu2 } from "@tabler/icons-react"
import { cn } from "cn"

import { header, nav, ui } from "@/lib/content"
import { Mark } from "@/components/brand/mark"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

/**
 * Logo left, plain links dead-centre, CTA right. `left-1/2 -translate-x-1/2`
 * on the nav (rather than a 1fr grid track) is what actually centres it on
 * the header -- the logo and the CTA/menu cluster are different widths, so a
 * three-track grid would centre the nav inside its track, not on the bar.
 *
 * The active link is marked by a stripe tick: a short orange parallelogram
 * leaning at the stripes' angle. The skew is on a shape, never on text, and
 * orange is a fill, which the colour bans allow on light grounds.
 *
 * Transparent over the hero; once scrolled, the page ground with a hairline
 * under it rather than a shadow, so the header reads as ruled, not floating.
 */
function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false)
  const [active, setActive] = React.useState<string>("")
  const [menuOpen, setMenuOpen] = React.useState(false)
  const sentinel = React.useRef<HTMLDivElement>(null)

  // A sentinel at the top of the document rather than a scroll listener: the
  // browser does the work off the main thread and we never read layout.
  React.useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  React.useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1))
    const sections = ids
      .map((id) => document.getElementById(id))
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
      <div
        ref={sentinel}
        aria-hidden="true"
        className="absolute top-0 left-0 h-20 w-px"
      />
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,border-color] duration-300",
          "border-b",
          scrolled
            ? "border-border bg-background/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="relative mx-auto flex h-20 max-w-6xl items-center px-5">
          {/* The mark's own role="img" label ("Kariyer Expo 27") is the
              link's accessible name -- no aria-label here, so there is
              exactly one name, not zero and not two. */}
          <a
            href="#anasayfa"
            className="flex items-center rounded-md focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Mark className="h-14 w-auto" />
          </a>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const isActive = active === item.href.slice(1)
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute bottom-0.5 left-1/2 h-1 w-5 -translate-x-1/2 -skew-x-[40deg] bg-(--mark-orange) transition-opacity",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Base UI's Button enforces button semantics (role="button",
                Enter/Space handling) and its docs say not to render links
                through it -- nativeButton={false} would silence the warning by
                making a link announce itself as a button. Every CTA here
                navigates, so the anchor carries buttonVariants directly. */}
            <a
              href="#iletisim"
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden sm:inline-flex"
              )}
            >
              {header.cta}
              <IconArrowUpRight data-icon="inline-end" />
            </a>

            {/* Controlled so the drawer's links can stay real anchors: they
                close the sheet on click instead of being wrapped in
                SheetClose, which is a Dialog.Close and has the same rule. */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                render={
                  <Button variant="outline" size="sm" className="lg:hidden" />
                }
              >
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
        </div>
      </header>
    </>
  )
}

export { SiteHeader }
