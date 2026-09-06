import { cta } from "@/lib/content"
import { Blob } from "@/components/brand/blobs"
import { SubscribeForm } from "@/components/subscribe-form"

/**
 * Navy in both themes -- the one full surface the logo's navy gets, and the
 * one place the loud orange becomes a button. data-surface="navy" repoints
 * --ring and --border to the sidebar scale so focus stays visible here.
 *
 * No two-tone sentence: accenting a single word in a headline is the tell this
 * design is avoiding.
 */
function CtaBand() {
  return (
    <section
      id="iletisim"
      data-surface="navy"
      className="relative scroll-mt-20 overflow-hidden bg-sidebar py-[clamp(4rem,10vw,7rem)] text-sidebar-foreground"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Blob
          name="cream"
          className="absolute -top-40 -right-24 size-[26rem] rotate-[18deg] text-sidebar-accent-foreground opacity-[0.14]"
        />
        <Blob
          name="slate"
          className="absolute -bottom-44 -left-20 size-[24rem] -rotate-[24deg] text-sidebar-accent-foreground opacity-[0.14]"
        />
      </div>

      <div className="relative mx-auto max-w-2xl px-5 text-center">
        <h2 className="text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em]">
          {cta.headline}
        </h2>
        <p className="mx-auto mt-5 max-w-[52ch] opacity-80">{cta.lede}</p>
        <SubscribeForm showRoles className="mt-10 text-left" />
      </div>
    </section>
  )
}

export { CtaBand }
