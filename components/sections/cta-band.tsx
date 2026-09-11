import { cta } from "@/lib/content"
import { Orbit } from "@/components/brand/orbit"
import { Stripes } from "@/components/brand/stripes"
import { Swoosh } from "@/components/brand/swoosh"
import { SubscribeForm } from "@/components/subscribe-form"

/**
 * The reference site's visa-banner: a rounded navy banner inside the page's
 * container rather than a full-bleed band, carrying the page's last sign-up
 * form. This form is the one that listens for the audience cards'
 * [data-role-target] links, so their CTAs land here with the role preselected.
 *
 * data-surface="navy" repoints --ring, --border, --line and the mark colours,
 * so focus rings, the stripes and the swoosh stay legible on this ground.
 * The orbit is quieted to --sidebar-border: silver at full strength is 6.69:1
 * on navy and would outshout the orange. Both decorations sit in the banner's
 * own stacking context and are clipped by it.
 */
function CtaBand() {
  return (
    <section id="iletisim" className="scroll-mt-20 py-[clamp(3rem,8vw,6rem)]">
      <div className="mx-auto max-w-[86rem] px-3 sm:px-4">
        <div
          data-surface="navy"
          className="relative isolate overflow-hidden rounded-[2.5rem] bg-sidebar text-sidebar-foreground"
        >
          <Orbit className="absolute -bottom-[45%] -left-[40%] -z-10 w-[40rem] max-w-none stroke-sidebar-border sm:-left-[20%] lg:-bottom-[70%] lg:-left-[8%] lg:w-[52rem]" />
          <Stripes className="absolute -top-8 right-[4%] -z-10 hidden h-28 lg:block" />

          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-10 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-6">
              <h2 className="text-[clamp(2rem,1.2rem+3vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.02em]">
                {cta.headline} <Swoosh>{cta.headlineAccent}</Swoosh>
              </h2>
              <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-sidebar-foreground/80">
                {cta.lede}
              </p>
            </div>
            <div className="lg:col-span-6">
              <SubscribeForm showRoles listenForRoleTargets />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { CtaBand }
