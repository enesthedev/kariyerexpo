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

/**
 * Logo left, plain links dead-centre, CTA right. `left-1/2 -translate-x-1/2`
 * on the nav (rather than a 1fr grid track) is what actually centres it on
 * the header -- the logo and the CTA/menu cluster are different widths, so a
 * three-track grid would centre the nav inside its track, not on the bar.
 *
 * A navy band from the first paint, its bottom edge cut on the page's
 * diagonal at half depth (.cut-header). data-surface="navy" turns the mark,
 * the muted links and the focus rings light, so nothing here picks colours
 * per element. The CTA is the orange fill (navy on orange, 5.46:1); the
 * default navy button would vanish on this ground.
 *
 * The active link is marked by a stripe tick: a short orange parallelogram
 * leaning at the stripes' angle. The skew is on a shape, never on text.
 *
 * It gets out of the way going down and comes back on any move up. It never
 * hides while the drawer is open, and focus landing inside it (a Tab from
 * the skip link, say) brings it back, so a keyboard user never tabs through
 * links they cannot see.
 */
function SiteHeader() {
  const [active, setActive] = React.useState<string>("")
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? y)
    // Past the header's own height, so the hero never loses it; a few
    // pixels of dead band so a trackpad's jitter does not flicker it.
    if (delta > 4 && y > 120) setHidden(true)
    else if (delta < -4) setHidden(false)
  })

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
      <ScrollProgress />
      <m.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: hidden && !menuOpen ? "-100%" : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onFocusCapture={() => setHidden(false)}
        data-surface="navy"
        className="cut-header sticky top-0 z-50 h-(--header-h) bg-sidebar text-sidebar-foreground"
      >
        <div className="relative mx-auto flex h-(--header-bar) max-w-6xl items-center px-5">
          {/* The mark's own role="img" label ("Kariyer Expo 27") is the
              link's accessible name -- no aria-label here, so there is
              exactly one name, not zero and not two.
              On the logo's own white disc, hung from the top so on desktop
              it breaks a few pixels into the cut while the menu stays up in
              the bar. The mark keeps its real navy and silver: the --mark-*
              vars are set back from the navy remap. */}
          <a
            href="#anasayfa"
            className="mt-1 grid size-16 shrink-0 place-items-center self-start rounded-full bg-card [--mark-navy:var(--foreground)] [--mark-silver:var(--silver)] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none lg:mt-1.5 lg:size-21"
          >
            <Mark className="size-[82%]" />
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
                        "relative inline-flex items-center rounded-md px-3.5 py-2 text-[0.8125rem] font-semibold tracking-[0.08em] transition-colors hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                        isActive
                          ? "text-sidebar-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.caps}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute bottom-1 left-1/2 h-[3px] w-4 -translate-x-1/2 -skew-x-[40deg] bg-(--mark-orange) transition-opacity",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-8">
            {/* Base UI's Button enforces button semantics (role="button",
                Enter/Space handling) and its docs say not to render links
                through it -- nativeButton={false} would silence the warning by
                making a link announce itself as a button. Every CTA here
                navigates, so the anchor carries its own classes.
                The orange ground is a parallelogram leaning at the stripe
                tick's angle, painted by ::before so the label stays upright
                (skew on shapes, never on text). */}
            <a
              href="#iletisim"
              className="group/cta relative isolate hidden h-9 items-center gap-1 px-7 text-[0.8125rem] font-semibold tracking-[0.02em] whitespace-nowrap text-accent-foreground outline-none before:absolute before:inset-0 before:-z-10 before:-skew-x-[40deg] before:bg-accent before:transition-colors hover:before:bg-accent/90 focus-visible:before:ring-2 focus-visible:before:ring-ring sm:inline-flex lg:h-10 [&_svg]:size-3.5 motion-safe:[&_svg]:transition-transform motion-safe:hover:[&_svg]:translate-x-0.5 motion-safe:hover:[&_svg]:-translate-y-0.5"
            >
              {header.cta}
              <IconArrowUpRight data-icon="inline-end" />
            </a>

            {/* Controlled so the drawer's links can stay real anchors: they
                close the sheet on click instead of being wrapped in
                SheetClose, which is a Dialog.Close and has the same rule. */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              {/* Not the outline Button: that one is a white card, and cn
                  cannot override its ground. Styled like the footer's
                  social buttons, the navy surface's own control. */}
              <SheetTrigger className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-sidebar-accent pr-4 pl-3 text-[0.8125rem] font-semibold text-sidebar-accent-foreground transition-colors hover:bg-sidebar-border focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none lg:hidden [&_svg]:size-4">
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
      </m.header>
    </>
  )
}

export { SiteHeader }
