import Image from "next/image"

import { cta, images } from "@/lib/content"
import { Reveal, RevealText } from "@/components/reveal"
import { SubscribeForm } from "@/components/subscribe-form"

/**
 * The closing moment: a rounded photo band under a navy scrim, the headline
 * and lede centred, and the form on a white panel, so the one thing to do is
 * the one bright thing. Anchor id `iletisim`: the audience and hero CTAs link
 * here, and [data-role-target] links preselect the role (SubscribeForm
 * listens). The photo is decoration, so its alt stays empty.
 */
function CtaBand() {
  return (
    <section id="iletisim" className="container-page pb-section">
      <div className="relative isolate overflow-hidden rounded-media bg-primary">
        <Image
          src={images.cta.src}
          alt={images.cta.alt}
          fill
          sizes="(min-width: 1320px) 1240px, 100vw"
          className="-z-10 object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-primary/70" />

        <div className="mx-auto flex max-w-[46rem] flex-col items-center gap-6 px-5 py-section-tight text-center text-primary-foreground sm:px-6">
          <RevealText
            text={cta.headline}
            accent={cta.headlineAccent}
            className="text-display"
            accentClassName="text-primary-foreground/80"
          />
          <Reveal delay={0.1}>
            <p className="max-w-[52ch] text-primary-foreground/90">
              {cta.lede}
            </p>
          </Reveal>
          <Reveal
            delay={0.2}
            className="mt-2 w-full rounded-card bg-card p-5 text-left text-card-foreground sm:p-8"
          >
            <SubscribeForm showRoles listenForRoleTargets />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export { CtaBand }
