"use client"

import { cn } from "cn"
import type { Variants } from "motion/react"
import * as m from "motion/react-m"

import { site } from "@/lib/content"

/**
 * The page's one orchestrated moment: the mark assembles in the order it was
 * built -- keyline, then body, then accent -- so it reads as stamped onto the
 * page rather than arriving.
 *
 * The three mask layers of full-mark.tsx are exactly three animatable pieces,
 * which is the whole reason that architecture pays for itself twice.
 *
 * The ring is never rotated. At any speed a rotating ring is a loading
 * spinner, and it puts a circular emblem one frame away from sports kitsch.
 *
 * Under prefers-reduced-motion the MotionConfig in motion-provider.tsx skips
 * the transforms, so this renders already assembled rather than flashing
 * through the scattered state.
 */
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const layer: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.9 },
  },
}

function FullMarkAnimated({ className }: { className?: string }) {
  return (
    <m.div
      data-slot="full-mark"
      role="img"
      aria-label={`${site.name} ${site.edition}`}
      className={cn("mark", className)}
      variants={group}
      initial="hidden"
      animate="show"
    >
      <m.span data-layer="keyline" className="mark-layer" variants={layer} />
      <m.span data-layer="body" className="mark-layer" variants={layer} />
      <m.span data-layer="accent" className="mark-layer" variants={layer} />
    </m.div>
  )
}

export { FullMarkAnimated }
