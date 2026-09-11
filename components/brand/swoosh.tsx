import { cn } from "cn"

/**
 * The swoosh: the logo's orange crescent, drawn behind the lower part of an
 * accent phrase.
 *
 * ONE PHRASE PER HEADING, NEVER A SINGLE WORD. It marks "this is the heading
 * of this section", which is wayfinding, not "this word matters more"; a
 * crescent under one word reads as emphasis, and two in one heading read as
 * noise. Wrap the heading's accent clause (`headlineAccent` in
 * lib/content.ts) and nothing else.
 *
 * The crescent is a background on this span, not a child element, so a
 * phrase that wraps gets one crescent per line, and the text colour never
 * changes. The draw-on is scroll-driven CSS that arrives fully drawn where
 * that is unsupported or motion is reduced. See the .swoosh block in
 * app/globals.css for the shape, the baked colour and the fallbacks.
 */
function Swoosh({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="swoosh" className={cn("swoosh", className)} {...props} />
  )
}

export { Swoosh }
