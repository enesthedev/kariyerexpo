import { hero } from "@/lib/content"
import { BlobField } from "@/components/brand/blobs"
import { LogoMarkAnimated } from "@/components/brand/logo-mark-animated"
import { Swash } from "@/components/brand/swash"
import { DatePill } from "@/components/date-pill"
import { SubscribeForm } from "@/components/subscribe-form"

function Hero() {
  return (
    <section id="anasayfa" className="relative scroll-mt-20 overflow-hidden">
      <BlobField variant="a" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pt-6 pb-[clamp(4rem,10vw,7rem)] md:grid-cols-12 md:items-center md:gap-8">
        {/* Text first in the DOM: the mark is decoration and must not be what
            a screen reader or a 360px phone leads with. */}
        <div className="md:col-span-7">
          <h1 className="text-[clamp(2.75rem,1.4rem+6vw,6rem)] leading-[0.94] font-bold tracking-[-0.03em]">
            {hero.headline} <Swash>{hero.headlineAccent}</Swash>
          </h1>
          <p className="mt-7 max-w-[62ch] text-[clamp(1.0625rem,1rem+0.5vw,1.3125rem)] leading-[1.55] tracking-[-0.008em] text-muted-foreground">
            {hero.lede}
          </p>
          <DatePill className="mt-9" />
          <SubscribeForm className="mt-9 max-w-lg" />
        </div>
        <div className="md:col-span-5">
          <LogoMarkAnimated className="mx-auto max-w-[min(28rem,80vw)]" />
        </div>
      </div>
    </section>
  )
}

export { Hero }
