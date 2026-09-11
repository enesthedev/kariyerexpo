"use client"

import { useId } from "react"
import { cn } from "cn"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"

import { markPaint, markPaths } from "@/components/brand/mark"
import {
  crescentSweep,
  markGeometry,
  markViewBox,
} from "@/components/brand/mark-geometry"
import { site } from "@/lib/content"

const EASE = [0.22, 1, 0.36, 1] as const
const POP = [0.34, 1.56, 0.64, 1] as const

const sweeps = markGeometry.arcs.map(crescentSweep)

// The stripes arrive along their own axis, from the lower left.
const SLIDE = 90
const slideFrom = {
  x: -SLIDE * Math.cos((markGeometry.stripes.angle * Math.PI) / 180),
  y: SLIDE * Math.sin((markGeometry.stripes.angle * Math.PI) / 180),
}

/**
 * The hero's mark, arriving.
 *
 * PUBLIC API -- the hero imports this, and the props are fixed:
 *   <MarkAnimated className? />
 * `className` sizes the wrapper (a width or a height); the wrapper carries
 * the mark's aspect ratio and the mark fills it.
 *
 * The same parts as <Mark>, each with its own entrance: the orbits draw on
 * from their first end, the stripes slide in along their axis, the letters
 * fade up line by line, and the dots pop in last, one after another.
 *
 * The crescents are filled shapes, so they cannot be drawn with pathLength
 * themselves. Each one is masked by a thick stroke along the circle halfway
 * between its edges (crescentSweep), and that stroke is what draws on. Mask
 * ids come from useId, so two instances never share one.
 *
 * MotionConfig's reducedMotion="user" stops transforms but not opacity or
 * pathLength, so every duration and delay drops to 0 when motion is reduced.
 * `initial` never reads the hook: the server cannot know the preference, and
 * an `initial` that differed between server and client would be a hydration
 * mismatch.
 */
function MarkAnimated({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const id = useId().replace(/[^\w-]/g, "")
  const time = (seconds: number) => (reduceMotion ? 0 : seconds)

  return (
    <div
      data-slot="mark-animated"
      className={cn("aspect-[922/876]", className)}
    >
      <svg
        data-slot="mark"
        viewBox={markViewBox}
        role="img"
        aria-label={`${site.name} ${site.edition}`}
        className="block size-full"
      >
        <defs>
          {sweeps.map((sweep, i) => (
            <mask key={i} id={`${id}-orbit-${i}`}>
              <m.path
                d={sweep.d}
                fill="none"
                stroke="white"
                strokeWidth={sweep.width}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: time(0.9),
                  delay: time(0.12 * i),
                  ease: EASE,
                }}
              />
            </mask>
          ))}
        </defs>

        <g data-part="arcs">
          {markPaths.arcs.map((a, i) => (
            <path
              key={a.id}
              d={a.d}
              fill={markPaint[a.ink]}
              mask={`url(#${id}-orbit-${i})`}
            />
          ))}
        </g>

        <g data-part="stripes">
          {markPaths.bars.map((b, i) => (
            <m.path
              key={b.ink}
              d={b.d}
              fill={markPaint[b.ink]}
              initial={{ opacity: 0, ...slideFrom }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                duration: time(0.7),
                delay: time(0.35 + 0.1 * i),
                ease: EASE,
              }}
            />
          ))}
        </g>

        <g data-part="dots">
          {markGeometry.dots.map((d, i) => (
            <m.circle
              key={d.id}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill={markPaint[d.ink]}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: time(0.4),
                delay: time(0.9 + 0.12 * i),
                ease: POP,
              }}
            />
          ))}
        </g>

        <g data-part="letters" fill={markPaint.navy}>
          {Object.values(markPaths.lines).map((d, i) => (
            <m.path
              key={i}
              d={d}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: time(0.6),
                delay: time(0.2 + 0.15 * i),
                ease: EASE,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export { MarkAnimated }
