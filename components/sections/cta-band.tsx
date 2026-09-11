import { cta } from "@/lib/content"
import { SubscribeForm } from "@/components/subscribe-form"

/**
 * Navy in both themes -- the one full surface the logo's navy gets, and the
 * one place the loud orange becomes a button. data-surface="navy" repoints
 * --ring and --border to the sidebar scale so focus stays visible here.
 *
 * No two-tone sentence: accenting a single word in a headline is the tell this
 * design is avoiding.
 *
 * The top edge is the arc at its largest scale -- a segment of the badge's
 * circle at enormous radius, which is the one place the mark's geometry turns
 * into architecture rather than ornament. The corner blobs are gone with
 * nothing in their place; repeating the mark's shapes is the failure mode this
 * design is built to avoid.
 */
function CtaBand() {
  return (
    <section
      id="iletisim"
      data-surface="navy"
      className="relative scroll-mt-20 overflow-hidden bg-sidebar py-[clamp(4rem,10vw,7rem)] text-sidebar-foreground"
    >
      {/* Drawn as a filled shape rather than a stroke so the band's ground
          genuinely follows the curve instead of sitting under a line. */}
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-10 w-full fill-band"
      >
        <path d="M0 0 H1440 V40 A2000 2000 0 0 0 0 40 Z" />
      </svg>

      <div className="relative mx-auto max-w-2xl px-5 text-center">
        <h2 className="text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em]">
          {cta.headline} {cta.headlineAccent}
        </h2>
        <p className="mx-auto mt-5 max-w-[52ch] opacity-80">{cta.lede}</p>
        <SubscribeForm showRoles className="mt-10 text-left" />
      </div>
    </section>
  )
}

export { CtaBand }
