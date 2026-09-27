"use client"

import { useRef } from "react"
import {
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react"
import * as m from "motion/react-m"
import { cn } from "cn"

/**
 * The page's motion layer. Everything here takes `children` as a prop, so
 * the sections that use it stay server components and only these wrappers
 * ship to the client.
 *
 * One register everywhere: expo-out, 0.8-1s, short travel. Nothing bounces,
 * nothing spins, nothing replays -- every reveal fires once. `on="load"`
 * plays on mount (the hero), `on="view"` when the block scrolls in.
 *
 * Reduced motion: MotionConfig's reducedMotion="user" (motion-provider.tsx)
 * makes transforms instant, so the word masks and slides land in place and
 * only opacity fades. The scroll-linked pieces read the preference directly,
 * because a scroll-driven value is not an animation MotionConfig can skip.
 */

// Tuple, not number[] -- motion types the cubic-bezier as a 4-tuple.
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

type On = "load" | "view"

// The block must be a tenth of the viewport past the fold, so a reveal is
// seen happening rather than finished before the eye arrives.
const VIEWPORT = { once: true, amount: 0.2, margin: "0px 0px -10% 0px" }

function trigger(on: On) {
  return on === "load"
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: VIEWPORT }
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

// The navy rules under the about facts draw on from the left.
const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.1, ease: EASE } },
}

function Reveal({
  children,
  className,
  delay = 0,
  on = "view",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  on?: On
}) {
  return (
    <m.div
      {...trigger(on)}
      variants={{
        hidden: fadeUp.hidden,
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.9, ease: EASE, delay },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  )
}

const groupTags = { div: m.div, ul: m.ul, dl: m.dl }

function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delay = 0,
  on = "view",
}: {
  children: React.ReactNode
  className?: string
  as?: keyof typeof groupTags
  stagger?: number
  delay?: number
  on?: On
}) {
  const Tag = groupTags[as]
  return (
    <Tag
      {...trigger(on)}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={className}
    >
      {children}
    </Tag>
  )
}

function RevealItem({
  children,
  className,
  variant = "fade",
}: {
  children: React.ReactNode
  className?: string
  variant?: "fade" | "rule"
}) {
  return (
    <m.div
      variants={variant === "rule" ? rule : fadeUp}
      className={cn(variant === "rule" && "origin-left", className)}
    >
      {children}
    </m.div>
  )
}

const word: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 1, ease: EASE } },
}

const headingTags = { h1: m.h1, h2: m.h2 }

/**
 * A heading whose words rise out of their own line, one after another.
 *
 * Each word is masked by an inline-block with overflow hidden. The mask is
 * padded and pulled back by the same amount on every side, so the italic's
 * rightward lean, the İ's dot and the descenders of ğ ş ç y are not clipped
 * and the line box does not change.
 *
 * Screen readers get the sentence once, from the sr-only copy; the split
 * words are aria-hidden. `children` goes after the words, unanimated (the
 * speakers' pending dots, which never move).
 */
function RevealText({
  text,
  accent,
  as = "h2",
  on = "view",
  delay = 0,
  className,
  children,
}: {
  text: string
  accent?: string
  as?: keyof typeof headingTags
  on?: On
  delay?: number
  className?: string
  children?: React.ReactNode
}) {
  const Tag = headingTags[as]
  const words = [
    ...text.split(/\s+/).map((w) => ({ w, accent: false })),
    ...(accent ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, accent: true })),
  ]

  return (
    <Tag
      {...trigger(on)}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.05, delayChildren: delay } },
      }}
      className={className}
    >
      <span className="sr-only">{accent ? `${text} ${accent}` : text}</span>
      <span aria-hidden>
        {words.map(({ w, accent }, i) => (
          <span key={i}>
            {i > 0 ? " " : null}
            <span className="-mx-[0.15em] -my-[0.15em] inline-block overflow-hidden px-[0.15em] py-[0.15em] align-bottom">
              <m.span
                variants={word}
                className={accent ? "inline-block text-line" : "inline-block"}
              >
                {w}
              </m.span>
            </span>
          </span>
        ))}
      </span>
      {children}
    </Tag>
  )
}

/**
 * Drifts its children against the scroll. `from="view"` maps the block's
 * whole pass through the viewport to -distance..distance (the band
 * stripes); `from="top"` starts at rest with the page at the top and drifts
 * to `distance` as the block scrolls out (the hero mark), so nothing jumps
 * on load.
 */
function Parallax({
  children,
  className,
  distance = 60,
  from = "view",
}: {
  children: React.ReactNode
  className?: string
  distance?: number
  from?: "view" | "top"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset:
      from === "top"
        ? ["start start", "end start"]
        : ["start end", "end start"],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion
      ? [0, 0]
      : from === "top"
        ? [0, distance]
        : [-distance, distance]
  )

  return (
    <m.div ref={ref} style={{ y }} className={className}>
      {children}
    </m.div>
  )
}

/** A hairline of orange (a fill) across the top of the viewport. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  })

  return (
    <m.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
    />
  )
}

export { Parallax, Reveal, RevealGroup, RevealItem, RevealText, ScrollProgress }
