import Image from "next/image"
import { IconArrowRight } from "@tabler/icons-react"

import { about, hero, images, nav, site } from "@/lib/content"
import { PhotoReveal, Reveal, RevealText } from "@/components/reveal"
import { SubscribeForm } from "@/components/subscribe-form"

/**
 * The headline at the start, the tagline, lede and a programme link at the
 * end, then the full-width photograph. The info bar rides over the photo's
 * bottom edge from md up (under it on phones): date, place, the free entry,
 * and the form. No logo here (it lives in the header only).
 */

const dateText = site.date
  ? new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      timeZone: "Europe/Istanbul",
    }).format(new Date(site.date))
  : site.month

const programLink = nav.find((item) => item.href === "#program")
const free = about.facts[about.facts.length - 1]

function Hero() {
  return (
    <section id="anasayfa" className="container-page pt-8 md:pt-14">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
        <RevealText
          as="h1"
          on="load"
          text={hero.headline}
          accent={hero.headlineAccent}
          className="text-hero lg:col-span-8"
        />
        <Reveal
          on="load"
          delay={0.12}
          className="flex flex-col items-start gap-3 lg:col-span-4"
        >
          <p className="text-h3">{site.tagline}</p>
          <p className="text-lead">{hero.lede}</p>
          {programLink ? (
            <a
              href={programLink.href}
              className="group inline-flex min-h-11 items-center gap-2 rounded-sm font-medium underline decoration-foreground/30 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-line focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {programLink.label}
              <IconArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </a>
          ) : null}
        </Reveal>
      </div>

      <div className="mt-10 md:mt-14">
        <PhotoReveal
          on="load"
          delay={0.2}
          className="aspect-[4/3] md:aspect-[2.2/1]"
        >
          <Image
            src={images.hero.src}
            alt={images.hero.alt}
            fill
            preload
            sizes="(min-width: 1320px) 1240px, 100vw"
            className="object-cover"
          />
        </PhotoReveal>

        <Reveal
          on="load"
          delay={0.5}
          className="relative z-10 mt-3 rounded-card bg-muted p-5 shadow-[0_12px_40px_-12px_rgb(11_37_84/0.18)] md:mx-8 md:-mt-16 md:p-6 lg:mx-12"
        >
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
            <dl className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:col-span-5">
              <Fact
                term={hero.dateLabel}
                value={dateText}
                pending={site.date ? null : site.dateFallback}
              />
              <Fact
                term={hero.venueLabel}
                value={site.venue.city}
                pending={site.venue.name ?? site.venue.fallback}
              />
              <Fact term={free.detail} value={free.term} />
            </dl>
            <SubscribeForm layout="bar" className="lg:col-span-7" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** The known part large, the "yakında" part on a small badge. */
function Fact({
  term,
  value,
  pending,
}: {
  term: string
  value: string
  pending?: string | null
}) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <dt className="text-meta">{term}</dt>
      <dd className="flex flex-col items-start gap-1.5">
        <span className="text-h3">{value}</span>
        {pending ? (
          <span className="text-meta rounded-pill bg-background px-2.5 py-1">
            {pending}
          </span>
        ) : null}
      </dd>
    </div>
  )
}

export { Hero }
