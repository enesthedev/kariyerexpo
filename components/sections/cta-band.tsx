import { cta } from "@/lib/content"
import { Stripes } from "@/components/brand/stripes"
import { Parallax, Reveal, RevealText } from "@/components/reveal"
import { SubscribeForm } from "@/components/subscribe-form"

/**
 * The last navy band: cut on its top edge only, because the footer carries
 * the navy on below it, so band and footer read as one ground. It holds the
 * page's last sign-up form, which is the one that listens for the audience
 * cards' [data-role-target] links, so their CTAs land here with the role
 * preselected.
 *
 * data-surface="navy" repoints --ring, --border, --line and the mark
 * colours, so focus rings, the stripes and the orange phrase stay legible on
 * this ground. The stripes rise out of the lower left, the way they sit in
 * the logo, clipped by the band.
 */
function CtaBand() {
  return (
    <section
      id="iletisim"
      data-surface="navy"
      className="cut-top isolate scroll-mt-20 overflow-hidden bg-sidebar text-sidebar-foreground"
    >
      <Parallax className="absolute -bottom-8 -left-8 -z-10 hidden lg:block">
        <Stripes className="h-36" />
      </Parallax>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-[calc(var(--cut)+clamp(3.5rem,8vw,6rem))] pb-[clamp(3.5rem,8vw,6rem)] lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-6">
          <RevealText
            text={cta.headline}
            accent={cta.headlineAccent}
            className="text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-[1]"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
              {cta.lede}
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.25} className="lg:col-span-6">
          <SubscribeForm showRoles listenForRoleTargets />
        </Reveal>
      </div>
    </section>
  )
}

export { CtaBand }
