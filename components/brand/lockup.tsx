import Image from "next/image"

import { Mark } from "@/components/brand/mark"
import { cn } from "@/lib/utils"

/**
 * The event mark and Physiocoree, side by side: the event mark leads, the
 * co-brand sits smaller beside it, centred on the same line, with a hairline
 * between them. Logos only: no caption, no "x".
 *
 * The event mark's box is --lockup-box and its ink fills it (the ring has
 * whitespace inside, so it already reads lighter than the dense monogram).
 * The Physiocoree box is 0.62 of that (--partner-ratio), and the hairline is
 * sized to the partner. Pure RSC; the pieces are exported so a client
 * component can wrap each in its own motion element.
 *
 *   <Lockup size="sm" | "md" | "lg" className? priority? />
 *   <EventMark className? /> <PartnerMark className? priority? />
 * Any other size: className="[--lockup-box:7rem]".
 */
const sizes = {
  sm: "[--lockup-box:3rem]",
  md: "[--lockup-box:4.5rem]",
  lg: "[--lockup-box:7rem] md:[--lockup-box:11rem]",
} as const

const box = "relative block shrink-0"
const partnerBox = "size-[calc(var(--lockup-box)*0.62)]"

function EventMark({ className }: { className?: string }) {
  return (
    <span
      data-slot="event-mark"
      className={cn(box, "size-(--lockup-box)", className)}
    >
      <Mark className="size-full" />
    </span>
  )
}

function PartnerMark({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <span data-slot="partner-mark" className={cn(box, partnerBox, className)}>
      <Image
        src="/physiocoree.png"
        alt="Physiocoree Danışmanlık"
        fill
        preload={priority}
        sizes="(min-width: 768px) 176px, 112px"
        className="object-contain p-[7%]"
      />
    </span>
  )
}

function Lockup({
  size = "md",
  className,
  priority = false,
}: {
  size?: keyof typeof sizes
  className?: string
  priority?: boolean
}) {
  return (
    <div
      data-slot="lockup"
      translate="no"
      className={cn(
        "flex items-center gap-[calc(var(--lockup-box)*0.24)]",
        sizes[size],
        className
      )}
    >
      <EventMark />
      <span
        aria-hidden
        className="h-[calc(var(--lockup-box)*0.62)] w-px bg-silver"
      />
      <PartnerMark priority={priority} />
    </div>
  )
}

export { EventMark, Lockup, PartnerMark }
