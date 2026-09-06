"use client"

import { cn } from "cn"
import type { Variants } from "motion/react"
import * as m from "motion/react-m"

import { BLOB, MARK_VIEWBOX } from "./blob-paths"

/**
 * The page's one orchestrated moment: the five blobs fly in from scattered
 * positions and assemble into the mark, once, on load. Everything else on the
 * page is deliberately quiet.
 *
 * Under prefers-reduced-motion the MotionConfig in motion-provider.tsx skips
 * the transforms, so this renders already assembled rather than flashing
 * through the scattered state.
 */

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

function piece(x: number, y: number, rotate: number, scale: number): Variants {
  return {
    hidden: { x, y, rotate, scale, opacity: 0 },
    show: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.9 },
    },
  }
}

function LogoMarkAnimated({ className }: { className?: string }) {
  return (
    <m.svg
      viewBox={MARK_VIEWBOX}
      role="img"
      aria-label="Kariyer Expo"
      variants={group}
      initial="hidden"
      animate="show"
      className={cn("h-auto w-full", className)}
    >
      <defs>
        <filter
          id="kma-shadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <clipPath id="kma-cream">
          <path d={BLOB.cream} />
        </clipPath>
      </defs>

      <m.g
        variants={piece(-70, -90, -18, 0.82)}
        style={{ originX: "50%", originY: "50%" }}
      >
        <path fill="var(--blob-cream)" d={BLOB.cream} />
        <g clipPath="url(#kma-cream)">
          <path
            fill="var(--blob-shadow)"
            filter="url(#kma-shadow)"
            d={BLOB.shadow}
          />
        </g>
      </m.g>
      <m.path
        variants={piece(80, 70, 24, 0.85)}
        fill="var(--blob-slate)"
        d={BLOB.slate}
      />
      <m.path
        variants={piece(-100, 50, -14, 0.85)}
        fill="var(--blob-navy)"
        d={BLOB.navy}
      />
      <m.path
        variants={piece(50, -120, 32, 0.7)}
        fill="var(--blob-orange)"
        d={BLOB.orange}
      />
    </m.svg>
  )
}

export { LogoMarkAnimated }
