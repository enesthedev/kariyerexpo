"use client"

import { useState } from "react"
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react"
import { cn } from "cn"

/**
 * Wraps the marquee rows and adds the pause control (WCAG 2.2.2: moving
 * content that lasts over 5 s must be stoppable). Pausing adds
 * `.marquee-paused`, which sets animation-play-state on every track below.
 * Hidden under reduced motion, where the names do not move.
 */
function MarqueePause({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  const [paused, setPaused] = useState(false)

  return (
    <div className={cn(paused && "marquee-paused")}>
      <div className={className}>{children}</div>
      <div className="container-page mt-6 motion-reduce:hidden">
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-muted px-5 text-sm font-medium transition-colors hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&_svg]:size-4"
        >
          {paused ? (
            <IconPlayerPlay aria-hidden="true" />
          ) : (
            <IconPlayerPause aria-hidden="true" />
          )}
          {label}
        </button>
      </div>
    </div>
  )
}

export { MarqueePause }
