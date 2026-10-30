import { cn } from "cn"

import { partners } from "@/lib/content"
import { MarqueePause } from "@/components/marquee-pause"
import { Reveal, RevealText } from "@/components/reveal"

/**
 * The page's one marquee: one row of company names (placeholders until the
 * real 2027 list). The row holds two identical copies (the second aria-hidden)
 * and slides one copy's width, so the loop is seamless. Hover, focus or the
 * pause button stops it. Under reduced motion the second copy is hidden and
 * the names simply wrap.
 */
function Copy({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={cn(
        "flex shrink-0 items-center gap-x-12 pr-12 motion-reduce:flex-wrap motion-reduce:gap-y-3",
        hidden && "motion-reduce:hidden"
      )}
    >
      {partners.names.map((name) => (
        <li
          key={name}
          className="text-h2 whitespace-nowrap text-muted-foreground motion-reduce:whitespace-normal"
        >
          {name}
        </li>
      ))}
    </ul>
  )
}

function Partners() {
  return (
    <section id="firmalar" className="pb-section">
      <div className="container-page">
        <RevealText text={partners.headline} className="text-h2" />
        <p className="text-lead mt-4 max-w-[62ch]">{partners.note}</p>
      </div>

      <Reveal className="mt-10">
        <MarqueePause label={partners.pause}>
          <div className="marquee">
            <div
              className="marquee-track motion-reduce:w-auto motion-reduce:px-5"
              style={{ "--marquee-duration": "90s" } as React.CSSProperties}
            >
              <Copy />
              <Copy hidden />
            </div>
          </div>
        </MarqueePause>
      </Reveal>
    </section>
  )
}

export { Partners }
