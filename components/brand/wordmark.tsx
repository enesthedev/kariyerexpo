import { cn } from "cn"

import { site } from "@/lib/content"

/**
 * "Kariyer Expo 27" as live text rather than a raster crop, so it inherits the
 * theme's foreground and stays crisp at every size. The face is Bricolage
 * Grotesque; its wdth axis (75-100, it only condenses) is what matches the
 * original lockup's proportions without faux-stretching.
 *
 * Cased as authored -- never text-transform. Turkish i -> İ is locale
 * dependent and silently produces "KARIYER" wherever `lang` is not inherited.
 */
function Wordmark({
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children">) {
  return (
    <span
      data-slot="wordmark"
      aria-label={`${site.name} ${site.edition}`}
      className={cn(
        "font-heading leading-none font-bold tracking-tight",
        className
      )}
      style={{ fontVariationSettings: '"wdth" 96, "opsz" 40' }}
      {...props}
    >
      <span aria-hidden="true">
        {site.name} <span className="text-accent">{site.edition}</span>
      </span>
    </span>
  )
}

export { Wordmark }
