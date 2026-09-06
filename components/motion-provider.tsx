"use client"

import { LazyMotion, MotionConfig, domAnimation } from "motion/react"

/**
 * The single motion boundary for the whole site.
 *
 * `domAnimation` + the `m` components is ~17 KB gzipped where the full
 * `motion` component is ~34 KB, and `strict` throws if anyone imports
 * `motion.div` instead of `m.div` -- the only reliable way to stop the bundle
 * quietly doubling later.
 *
 * `reducedMotion="user"` is one of two required layers; the other is the
 * global media query in globals.css, which also covers the CSS-only devices
 * (the swash draw-on and the partner marquee).
 */
function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )
}

export { MotionProvider }
