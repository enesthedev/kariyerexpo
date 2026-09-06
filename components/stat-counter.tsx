"use client"

import * as React from "react"
import { animate, useInView, useReducedMotion } from "motion/react"

const FORMAT = new Intl.NumberFormat("tr-TR")

/**
 * Writes straight to the DOM node instead of through state: a count-up is
 * ~90 renders otherwise, and the markup already carries the final value so it
 * is correct with JavaScript disabled.
 */
function StatCounter({
  value,
  prefix = "",
}: {
  value: number
  prefix?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduced = useReducedMotion()

  React.useEffect(() => {
    const node = ref.current
    if (!node || reduced) return
    if (!inView) {
      node.textContent = prefix + FORMAT.format(0)
      return
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = prefix + FORMAT.format(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [inView, reduced, value, prefix])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix + FORMAT.format(value)}
    </span>
  )
}

export { StatCounter }
