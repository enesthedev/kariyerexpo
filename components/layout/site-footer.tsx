import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react"

import { footer, nav, site } from "@/lib/content"
import { LogoMark } from "@/components/brand/logo-mark"
import { Wordmark } from "@/components/brand/wordmark"

const SOCIAL_ICONS = {
  linkedin: IconBrandLinkedin,
  instagram: IconBrandInstagram,
  x: IconBrandX,
} as const

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark size="sm" />
              <Wordmark className="text-lg" />
            </div>
            <p className="mt-3 text-xs tracking-[0.18em] text-muted-foreground">
              {site.taglineCaps}
            </p>
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">
              {footer.blurb}
            </p>
          </div>

          <nav aria-label={footer.linksTitle}>
            <h2 className="text-sm font-semibold">{footer.linksTitle}</h2>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                <IconMail className="mt-0.5 size-4 shrink-0 text-swash" />
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconMapPin className="mt-0.5 size-4 shrink-0 text-swash" />
                <span className="text-sm text-muted-foreground">
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
                      className="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground transition-colors hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2027 {site.name}. {site.organizers.join(" & ")} iş birliğiyle.
          </p>
          <ul className="flex gap-5">
            {footer.legal.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="transition-colors hover:text-foreground"
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
