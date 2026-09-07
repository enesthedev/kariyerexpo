"use client"

import * as React from "react"
import { IconMail, IconMenu2 } from "@tabler/icons-react"
import { cn } from "cn"

import { nav } from "@/lib/content"
import { BadgeMark } from "@/components/brand/badge-mark"
import { Wordmark } from "@/components/brand/wordmark"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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
          "sticky top-0 z-50 transition-colors duration-300",
          scrolled
            ? "border-b border-line/60 bg-background/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center gap-6 px-5">
          <a
            href="#anasayfa"
            className="flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <BadgeMark size="sm" decorative />
            <Wordmark className="text-lg max-sm:sr-only" />
          </a>

          <nav className="ml-auto hidden items-center gap-7 lg:flex">
            {nav.map((item) => {
              const isActive = active === item.href.slice(1)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className="relative py-2 text-sm transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {item.label}
                  {/* The arc at its smallest scale, not a colour change:
                      the line carries state, the type never does. */}
                  <svg
                    viewBox="0 0 240 18"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-1 left-1/2 h-1.5 w-4 -translate-x-1/2 overflow-visible transition-opacity",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <path
                      d="M3 4 A620 620 0 0 0 237 4"
                      fill="none"
                      stroke="var(--line)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </a>
              )
            })}
          </nav>

          <div className={cn("flex items-center gap-1", "ml-auto lg:ml-0")}>
            <ThemeToggle />
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
              <IconMail data-icon="inline-start" />
              Haberdar ol
            </a>

            {/* Controlled so the drawer's links can stay real anchors: they
                close the sheet on click instead of being wrapped in
                SheetClose, which is a Dialog.Close and has the same rule. */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="lg:hidden" />
                }
              >
                <IconMenu2 />
                <span className="sr-only">Menüyü aç</span>
              </SheetTrigger>
              <SheetContent
                side="right"
                data-surface="navy"
                className="w-[86%] border-l-0 bg-sidebar text-sidebar-foreground sm:max-w-sm"
              >
                <SheetTitle className="px-6 pt-6 text-sidebar-foreground">
                  <Wordmark className="text-xl" />
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
                    <IconMail data-icon="inline-start" />
                    Haberdar ol
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
