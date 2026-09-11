"use client"

import { cn } from "cn"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"

import { Mark } from "@/components/brand/mark"

/**
 * The hero's mark, arriving.
 *
 * PUBLIC API -- the hero imports this, and the props are fixed:
 *   <MarkAnimated className? />
 * `className` sizes the wrapper (a width or a height); the wrapper carries
 * the mark's aspect ratio and the mark fills it.
 *
 * PROVISIONAL: one fade-and-settle for the whole mark. The logo task replaces
 * it with per-part animation (arcs drawn on, dots in sequence, stripes
 * sliding in, letters fading) once the parts are measured geometry.
 *
 * MotionConfig's reducedMotion="user" skips the scale but not the opacity, so
 * the duration drops to 0 when motion is reduced. `initial` never reads the
 * hook: the server cannot know the preference, and an `initial` that differed
 * between server and client would be a hydration mismatch.
 */
function MarkAnimated({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <m.div
      data-slot="mark-animated"
      className={cn("aspect-[922/876]", className)}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: reduceMotion ? 0 : 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Mark className="block size-full" />
    </m.div>
  )
}

export { MarkAnimated }
