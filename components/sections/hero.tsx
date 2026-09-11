import { hero } from "@/lib/content"
import { MarkAnimated } from "@/components/brand/mark-animated"
import { Orbit } from "@/components/brand/orbit"
import { Stripes } from "@/components/brand/stripes"
import { Swoosh } from "@/components/brand/swoosh"
import { DatePill } from "@/components/date-pill"
import { SubscribeForm } from "@/components/subscribe-form"

/**
 * The reference site's main-slider panel, without the slider: one rounded
 * band panel holding the headline and the mark, with the sign-up bar (its
 * `.get-info`) overlapping the panel's bottom edge.
 *
 * The overlap is a negative top margin on the bar, not absolute positioning,
 * so the bar stays in flow: when it stacks to three rows on a phone it pushes
 * the next section down instead of covering it. The panel's bottom padding is
 * sized to the overlap so no panel content sits under the bar.
 *
 * The orbit arcs and stripes are the logo's geometry at poster scale, clipped
 * by the panel so they can never cause horizontal scroll.
 */
function Hero() {
  return (
    <section
      id="anasayfa"
      className="relative scroll-mt-20 pt-3 pb-[clamp(3rem,8vw,6rem)]"
    >
      <div className="mx-auto max-w-[86rem] px-3 sm:px-4">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-band">
          <Orbit className="absolute top-[58%] -right-[55%] -z-10 w-[44rem] max-w-none -translate-y-1/2 sm:-right-[30%] lg:top-1/2 lg:-right-[12%] lg:w-[64rem]" />
          <Stripes className="absolute -top-4 right-[5%] -z-10 hidden h-28 lg:block" />

          {/* Text first in the DOM: the mark is the logo, not the message,
              and must not be what a screen reader or a 360px phone leads
              with. */}
          <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-12 pb-24 sm:px-8 md:pt-16 md:pb-32 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <h1 className="text-[clamp(2.5rem,1.2rem+5.5vw,5.5rem)] leading-[0.98] font-extrabold tracking-[-0.03em]">
                {hero.headline} <Swoosh>{hero.headlineAccent}</Swoosh>
              </h1>
              <p className="mt-7 max-w-[54ch] text-[clamp(1.0625rem,1rem+0.4vw,1.25rem)] leading-[1.55] text-muted-foreground">
                {hero.lede}
              </p>
              <DatePill className="mt-8" />
            </div>
            <div className="lg:col-span-5">
              <MarkAnimated className="mx-auto w-[min(17rem,68vw)] sm:w-[20rem] lg:w-full lg:max-w-[27rem]" />
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto -mt-14 max-w-5xl px-1 sm:px-6 md:-mt-20">
          <SubscribeForm layout="bar" showRoles />
        </div>
      </div>
    </section>
  )
}

export { Hero }
