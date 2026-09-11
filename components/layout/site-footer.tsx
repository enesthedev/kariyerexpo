import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react"

import { footer, nav, site } from "@/lib/content"
import { BadgeMark } from "@/components/brand/badge-mark"
import { Wordmark } from "@/components/brand/wordmark"

const SOCIAL_ICONS = {
  linkedin: IconBrandLinkedin,
  instagram: IconBrandInstagram,
  x: IconBrandX,
} as const

/**
 * Navy, and continuous with the CTA band above it -- the closing block is one
 * field, split only by a 2px orange keyline, so it reads as rhythm rather than
 * as a footer that started early. data-surface="navy" repoints --line and the
 * mark tokens to the sidebar scale, which is what lets the badge and the
 * contact icons invert without any per-element theme logic.
 */
function SiteFooter() {
  return (
    <footer
      data-surface="navy"
      className="border-t-2 border-accent bg-sidebar text-sidebar-foreground"
    >
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <BadgeMark size="sm" decorative />
              <Wordmark className="text-lg" />
            </div>
            <p className="eyebrow mt-3 opacity-70">{site.taglineCaps}</p>
            <p className="mt-5 max-w-xs text-sm opacity-70">{footer.blurb}</p>
          </div>

          <nav aria-label={footer.linksTitle}>
            <h2 className="text-sm font-semibold">{footer.linksTitle}</h2>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm opacity-70 transition-opacity hover:opacity-100"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold">{footer.contactTitle}</h2>
            <ul className="mt-4 space-y-3.5">
              <li className="flex items-start gap-3">
                <IconMail className="mt-0.5 size-4 shrink-0 text-line" />
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm opacity-70 transition-opacity hover:opacity-100"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconMapPin className="mt-0.5 size-4 shrink-0 text-line" />
                <span className="text-sm opacity-70">
                  {site.venue.name}, {site.venue.district}, {site.venue.city}
                </span>
              </li>
            </ul>

            <ul className="mt-6 flex gap-2">
              {footer.social.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon]
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="flex size-11 items-center justify-center rounded-2xl bg-sidebar-accent text-sidebar-accent-foreground transition-colors hover:bg-sidebar-border focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-sidebar-border pt-6 text-sm opacity-70 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <ul className="flex gap-5">
            {footer.legal.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="transition-opacity hover:opacity-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
