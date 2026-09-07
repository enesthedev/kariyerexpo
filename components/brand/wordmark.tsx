import { cn } from "cn"

import { site } from "@/lib/content"

/**
 * "Kariyer Expo" set live, with the edition in a filled chip.
 *
 * The chip is not decoration, it is the accessibility fix. The brand orange
 * measures 2.80:1 on the light ground, so the edition cannot be orange text
 * there. As an orange fill carrying navy type it measures 5.38:1 -- and that
 * is the mark's own construction, where "27" sits in an orange banner rather
 * than being painted orange.
 *
 * No attempt is made to match the logo's lettering. EXPO's P has a stadium
 * counter slot and its O is a true circle; those are custom drawn and no web
 * font reaches them, so the mark ships as artwork (full-mark.tsx) and the page
 * speaks in its own voice instead of a bad impression of one.
 */
function Wordmark({
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children">) {
  return (
    <span
      aria-label={`${site.name} ${site.edition}`}
      className={cn(
        "inline-flex items-center gap-[0.4em] font-heading leading-none font-bold tracking-tight",
        className
      )}
      {...props}
    >
      <span aria-hidden="true">{site.name}</span>
      <span
        aria-hidden="true"
        className="numeral rounded-full bg-accent px-[0.45em] py-[0.2em] text-[0.7em] text-accent-foreground"
      >
        {site.edition}
      </span>
    </span>
  )
}

export { Wordmark }
