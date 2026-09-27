import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react"

import { footer, nav, site } from "@/lib/content"
import { Mark } from "@/components/brand/mark"

const SOCIAL_ICONS = {
  linkedin: IconBrandLinkedin,
  instagram: IconBrandInstagram,
  x: IconBrandX,
} as const

/**
 * Navy, continuing the CTA band above it: the band's cut is the page's last
 * edge, and the footer is only separated from it by a hairline, so the two
 * read as one ground. `data-surface="navy"` is what lets `Mark` and the
 * contact icons invert to the light remap without any per-element theme
 * logic.
 *
 * The new `Mark` already carries the KARİYER / EXPO / 27 lettering inside
 * the SVG, so it stands alone here -- no separate wordmark or tagline line
 * next to it, unlike the old badge + wordmark pairing.
 *
 * Contact icons are `text-accent` (orange fill) rather than `text-line`:
 * on this navy ground orange reads at 5.46:1, so the fill-only rule that
 * bans `text-accent` on light grounds does not apply here.
 */
function SiteFooter() {
  return (
    <footer data-surface="navy" className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-6xl border-t border-sidebar-border px-5 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Mark className="h-16 w-auto" />
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
                <IconMail
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-accent"
                />
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm opacity-70 transition-opacity hover:opacity-100"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconMapPin
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-accent"
                />
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
                      className="flex size-11 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground transition-colors hover:bg-sidebar-border focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <Icon aria-hidden="true" className="size-5" />
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
