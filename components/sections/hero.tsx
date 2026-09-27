import { hero } from "@/lib/content"
import { MarkAnimated } from "@/components/brand/mark-animated"
import { DatePill } from "@/components/date-pill"
import { Parallax, Reveal, RevealText } from "@/components/reveal"
import { SubscribeForm } from "@/components/subscribe-form"

/**
 * The opening poster: the headline in the leaning display voice with its one
 * orange phrase, the mark beside it, on a band that ends in the page's
 * diagonal. The sign-up bar sits across that diagonal, so the first cut on
 * the page is also the first thing to do.
 *
 * The overlap is a negative top margin on the bar, not absolute positioning,
 * so the bar stays in flow: when it stacks to three rows on a phone it pushes
 * the next section down instead of covering it. The band's own negative
 * bottom margin (.cut-bottom) already lifts the bar by the cut; its bottom
 * padding is the overlap plus the cut, so no band content sits under the bar
 * or is clipped by the diagonal.
 */
function Hero() {
  return (
    <section id="anasayfa" className="relative scroll-mt-20">
      <div className="cut-bottom bg-band pt-(--header-h)">
        {/* Text first in the DOM: the mark is the logo, not the message,
            and must not be what a screen reader or a 360px phone leads
            with. */}
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-16 pb-[calc(var(--cut)+6rem)] md:pt-24 md:pb-[calc(var(--cut)+8rem)] lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-7">
            <RevealText
              as="h1"
              on="load"
              delay={0.15}
              text={hero.headline}
              accent={hero.headlineAccent}
              className="text-[clamp(2.5rem,1.1rem+5.8vw,6rem)] leading-[0.95]"
            />
            <Reveal on="load" delay={0.45}>
              <p className="mt-7 max-w-[54ch] text-[clamp(1.0625rem,1rem+0.4vw,1.25rem)] leading-[1.55] text-muted-foreground">
                {hero.lede}
              </p>
            </Reveal>
            <Reveal on="load" delay={0.6}>
              <DatePill className="mt-8" />
            </Reveal>
          </div>
          <Parallax from="top" distance={40} className="lg:col-span-5">
            <MarkAnimated className="mx-auto w-[min(17rem,68vw)] sm:w-[20rem] lg:w-full lg:max-w-[28rem]" />
          </Parallax>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-14 max-w-5xl px-4 sm:px-6 md:-mt-20">
        <Reveal on="load" delay={0.75}>
          <SubscribeForm layout="bar" showRoles />
        </Reveal>
      </div>
    </section>
  )
}

export { Hero }
