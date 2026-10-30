import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react"

import { footer, nav, site } from "@/lib/content"
import { Lockup } from "@/components/brand/lockup"

const SOCIAL_ICONS = {
  linkedin: IconBrandLinkedin,
  instagram: IconBrandInstagram,
  x: IconBrandX,
} as const

const heading = "text-sm font-medium"
const link =
  "flex min-h-11 w-fit items-center gap-2.5 rounded-sm text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

/** White ground under a hairline: the logos and the paths off the page. */
function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container-page grid gap-x-10 gap-y-12 pt-16 pb-8 md:grid-cols-12 lg:pt-20">
        <div className="flex flex-col items-start gap-6 md:col-span-5">
          <Lockup size="md" />
          <p className="text-lead max-w-xs">{footer.blurb}</p>
          <ul className="flex gap-2">
            {footer.social.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon]
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-11 place-items-center rounded-full bg-muted transition-colors hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <nav
          aria-label={footer.linksTitle}
          className="flex flex-col gap-3 md:col-span-2"
        >
          <p className={heading}>{footer.linksTitle}</p>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3 md:col-span-3">
          <p className={heading}>{footer.contactTitle}</p>
          <ul>
            <li>
              <a href={`mailto:${site.email}`} className={link}>
                <IconMail aria-hidden="true" className="size-4 shrink-0" />
                {site.email}
              </a>
            </li>
            <li className="flex min-h-11 items-center gap-2.5 text-muted-foreground">
              <IconMapPin aria-hidden="true" className="size-4 shrink-0" />
              {site.venue.name
                ? `${site.venue.name}, ${site.venue.city}`
                : `${site.venue.city}, ${site.venue.fallback.toLocaleLowerCase("tr")}`}
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 md:col-span-2">
          <p className={heading}>{footer.followTitle}</p>
          <ul>
            {footer.instagram.map((account) => (
              <li key={account.handle}>
                <a href={account.href} className={link}>
                  <span translate="no" className="break-all">
                    {account.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-meta flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between md:col-span-12">
          <p>{footer.copyright}</p>
          <ul className="flex gap-5">
            {footer.legal.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="rounded-sm transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
