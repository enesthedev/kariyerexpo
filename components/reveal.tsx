"use client"

import type { Variants } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "@/lib/utils"

/**
 * The page's motion layer. Everything here takes `children` as a prop, so
 * the sections that use it stay server components and only these wrappers
 * ship to the client.
 *
 * Register: expo-out, short travel, transform, opacity and clip-path only.
 * Reveals fire once. `on="load"` plays on mount (the hero), `on="view"` when
 * the block scrolls in.
 *
 *   Reveal / RevealGroup + RevealItem   blocks rise, groups trail each other
 *   RevealText                          a heading rises as one block
 *   PhotoReveal                         a photo unmasks in its rounded frame
 *
 * Reduced motion: MotionConfig's reducedMotion="user" (motion-provider.tsx)
 * drops the transforms and keeps the fades; globals.css removes the clip.
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

const hidden = { opacity: 0, y: 24 }

function rise(delay = 0): Variants {
  return {
    hidden,
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE, delay },
    },
  }
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
    <m.div {...trigger(on)} variants={rise(delay)} className={className}>
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
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <m.div variants={rise()} className={className}>
      {children}
    </m.div>
  )
}

const headingTags = { h1: m.h1, h2: m.h2 }

/**
 * A heading in two tones: `text` in the foreground, `accent` muted. On a
 * dark ground pass accentClassName.
 */
function RevealText({
  text,
  accent,
  as = "h2",
  on = "view",
  delay = 0,
  className,
  accentClassName = "text-muted-foreground",
}: {
  text: string
  accent?: string
  as?: keyof typeof headingTags
  on?: On
  delay?: number
  className?: string
  accentClassName?: string
}) {
  const Tag = headingTags[as]
  return (
    <Tag {...trigger(on)} variants={rise(delay)} className={className}>
      {text}
      {accent ? (
        <>
          {" "}
          <span className={accentClassName}>{accent}</span>
        </>
      ) : null}
    </Tag>
  )
}

/**
 * A photo frame: opens from a slightly inset rounded mask while the photo
 * settles from 1.08. The child is a `fill` image; the frame sets the size.
 */
function PhotoReveal({
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
  const transition = { duration: 1.1, ease: EASE, delay }
  return (
    <m.div
      data-reveal
      {...trigger(on)}
      variants={{
        hidden: { clipPath: "inset(8% round 20px)" },
        show: { clipPath: "inset(0% round 20px)", transition },
      }}
      className={cn(
        "relative overflow-hidden rounded-media bg-muted",
        className
      )}
    >
      <m.div
        variants={{
          hidden: { scale: 1.08 },
          show: { scale: 1, transition },
        }}
        className="absolute inset-0"
      >
        {children}
      </m.div>
    </m.div>
  )
}

export { PhotoReveal, Reveal, RevealGroup, RevealItem, RevealText }
