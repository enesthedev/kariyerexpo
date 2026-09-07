import { program } from "@/lib/content"
import { Swash } from "@/components/brand/swash"

/**
 * A list, not a card grid and not tabs: six sibling themes with no hierarchy
 * between them genuinely are a list, and numbering them would imply a
 * sequence that does not exist.
 *
 * "Yakında" appears here in its quiet variant -- plain muted text, no dashed
 * outline -- because the themes themselves are confirmed and only the
 * timetable is not. The device stays a system by staying proportional.
 */
function Program() {
  return (
    <section
      id="program"
      className="scroll-mt-20 bg-band py-[clamp(4rem,10vw,8rem)]"
    >
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-2xl text-[clamp(2rem,1.2rem+3.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.022em]">
          {program.headline} <Swash>{program.headlineAccent}</Swash>
        </h2>
        <p className="mt-6 max-w-[62ch] text-muted-foreground">
          {program.note}
        </p>

        <div className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-2">
          {program.groups.map((g) => (
            <section key={g.title}>
              <h3 className="font-sans text-sm font-medium text-muted-foreground">
                {g.title}
              </h3>
              <ul className="mt-4">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-t border-border py-4"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.7rem] size-2 shrink-0 rounded-full bg-line"
                    />
                    <span className="font-heading text-[clamp(1.125rem,1rem+0.6vw,1.375rem)] leading-snug font-semibold">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Program }
