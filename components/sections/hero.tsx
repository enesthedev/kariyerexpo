import { hero } from "@/lib/content"
import { Arc } from "@/components/brand/arc"
import { FullMarkAnimated } from "@/components/brand/full-mark-animated"
import { DatePill } from "@/components/date-pill"
import { SubscribeForm } from "@/components/subscribe-form"

/**
 * The blob field is gone with nothing in its place: the hero is type on the
 * page ground. Giant outlined circles bled behind the sections would be the
 * obvious replacement and the obvious failure -- repeating this mark's
 * geometry is what would turn the page into a college-athletics poster.
 *
 * The energy comes from overhang instead. EXPO reaches past the badge circle
 * on both sides in the source, so here the mark breaks the content column and
 * is cropped by the viewport. It is the mark quoting itself, and per the
 * design rules it happens once on this page.
 */
function Hero() {
  return (
    <section id="anasayfa" className="relative scroll-mt-20 overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pt-6 pb-[clamp(4rem,10vw,7rem)] md:grid-cols-12 md:items-center md:gap-8">
        {/* Text first in the DOM: the mark is decoration and must not be what
            a screen reader or a 360px phone leads with. */}
        <div className="md:col-span-7">
          <h1 className="text-[clamp(2.75rem,1.4rem+6vw,6rem)] leading-[0.94] font-bold tracking-[-0.03em]">
            {hero.headline} <Arc>{hero.headlineAccent}</Arc>
          </h1>
          <p className="mt-7 max-w-[62ch] text-[clamp(1.0625rem,1rem+0.5vw,1.3125rem)] leading-[1.55] tracking-[-0.008em] text-muted-foreground">
            {hero.lede}
          </p>
          <DatePill className="mt-9" />
          <SubscribeForm className="mt-9 max-w-lg" />
        </div>
        <div className="md:col-span-5">
          <FullMarkAnimated className="mx-auto w-[min(28rem,80vw)] md:mr-[-28%] md:ml-auto md:w-[138%] md:max-w-none" />
        </div>
      </div>
    </section>
  )
}

export { Hero }
