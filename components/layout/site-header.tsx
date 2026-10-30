"use client"

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  ViewTransition,
} from "react"
import { IconArrowUpRight, IconMenu2, IconX } from "@tabler/icons-react"
import { cn } from "cn"
import { LazyMotion, useMotionValueEvent, useScroll } from "motion/react"
import * as m from "motion/react-m"

import { header, nav, ui } from "@/lib/content"
import { Lockup } from "@/components/brand/lockup"
import { PillLink } from "@/components/pill-link"

const MENU_ID = "mobile-nav"

// The layout features (the sliding nav pill) load after first paint.
const loadFeatures = () => import("motion/react").then((r) => r.domMax)

/**
 * A white sticky bar: 72px at the top, 60px with a hairline once the page
 * moves. The logos, the links and the orange pill. The active link gets a
 * muted pill that slides between links (Motion `layoutId`, which needs the
 * layout feature set, so the bar wraps itself in a LazyMotion that loads
 * `domMax` async; the rest of the page keeps the lighter `domAnimation`). The
 * active section comes from an IntersectionObserver, never a scroll listener.
 *
 * Below lg the links move into a full-screen sheet under the bar, entering
 * and leaving with <ViewTransition>, toggled in startTransition. The bar keeps
 * its full height while the sheet is open so the two stay flush.
 */
function SiteHeader() {
  const [active, setActive] = useState("")
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const { scrollY } = useScroll()
  const compact = scrolled && !open

  const setMenu = (next: boolean) => startTransition(() => setOpen(next))

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24))

  useEffect(() => {
    // Every section is observed, so one that is not in the nav (stats,
    // partners, the CTA) clears the active pill instead of leaving the last
    // one lit.
    const sections =
      document.querySelectorAll<HTMLElement>("main > section[id]")
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting)
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Sheet open: focus moves in, Escape closes and hands focus back, and the
  // sheet closes by itself if the viewport grows to the desktop bar.
  useEffect(() => {
    if (!open) return
    firstLinkRef.current?.focus()
    // Page behind the sheet is not reachable while it is open.
    const behind = document.querySelectorAll<HTMLElement>("main, footer")
    behind.forEach((el) => {
      el.inert = true
    })
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setMenu(false)
      toggleRef.current?.focus()
    }
    const mq = window.matchMedia("(min-width: 1024px)")
    const onChange = () => mq.matches && setMenu(false)
    document.addEventListener("keydown", onKey)
    mq.addEventListener("change", onChange)
    return () => {
      document.removeEventListener("keydown", onKey)
      mq.removeEventListener("change", onChange)
      behind.forEach((el) => {
        el.inert = false
      })
    }
  }, [open])

  return (
    <LazyMotion features={loadFeatures} strict>
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-background transition-colors duration-500",
          compact ? "border-border" : "border-transparent"
        )}
      >
        <div
          className={cn(
            "container-page flex items-center gap-6 transition-[height] duration-500 ease-(--ease-out-expo)",
            compact ? "h-15" : "h-(--header-h)"
          )}
        >
          <a
            href="#anasayfa"
            aria-label={header.homeLabel}
            className="rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Lockup priority className="[--lockup-box:3rem]" />
          </a>

          <nav aria-label="Ana menü" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const isActive = active === item.href.slice(1)
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "relative isolate flex h-10 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isActive ? (
                        <m.span
                          layoutId="nav-pill"
                          aria-hidden
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 30,
                          }}
                          className="absolute inset-0 -z-10 rounded-full bg-muted"
                        />
                      ) : null}
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <PillLink href="#iletisim" className="hidden lg:inline-flex">
            {header.cta}
            <IconArrowUpRight data-icon="inline-end" />
          </PillLink>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={open ? MENU_ID : undefined}
            aria-label={open ? ui.close : ui.menu}
            onClick={() => setMenu(!open)}
            className="ml-auto grid size-11 place-items-center rounded-full border border-border transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:hidden [&_svg]:size-5"
          >
            {open ? (
              <IconX aria-hidden="true" />
            ) : (
              <IconMenu2 aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {open ? (
        <ViewTransition enter="slide-up" exit="slide-down" default="none">
          <div
            id={MENU_ID}
            className="fixed inset-x-0 top-(--header-h) bottom-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-background px-4 pt-6 pb-8 sm:px-6 lg:hidden"
          >
            <nav aria-label="Ana menü" className="flex flex-col">
              {nav.map((item, i) => (
                <a
                  key={item.href}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={() => setMenu(false)}
                  className="text-display rounded-card py-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <PillLink
              href="#iletisim"
              size="xl"
              onClick={() => setMenu(false)}
              className="mt-auto w-full"
            >
              {header.cta}
              <IconArrowUpRight data-icon="inline-end" />
            </PillLink>
          </div>
        </ViewTransition>
      ) : null}
    </LazyMotion>
  )
}

export { SiteHeader }
