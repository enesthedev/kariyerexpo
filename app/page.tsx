import { StructuredData } from "@/components/structured-data"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { About } from "@/components/sections/about"
import { Audiences } from "@/components/sections/audiences"
import { CtaBand } from "@/components/sections/cta-band"
import { Faq } from "@/components/sections/faq"
import { Hero } from "@/components/sections/hero"
import { Partners } from "@/components/sections/partners"
import { Program } from "@/components/sections/program"
import { Speakers } from "@/components/sections/speakers"
import { Stats } from "@/components/sections/stats"

export default function Page() {
  return (
    <>
      <StructuredData />
      <a
        href="#fuar"
        className="sr-only rounded-full bg-primary px-5 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100]"
      >
        İçeriğe geç
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Stats />
        <Audiences />
        <Program />
        <Speakers />
        <Partners />
        <Faq />
        <CtaBand />
      </main>
      <SiteFooter />
    </>
  )
}
