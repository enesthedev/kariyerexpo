"use client"

import type { Variants } from "motion/react"
import * as m from "motion/react-m"

/**
 * Scroll reveals. These take `children` as a prop, so everything they wrap
 * stays a server component and only the wrapper ships to the client.
 *
 * Used on two sections only. Fading and sliding every section on the page is
 * the generic default and reads as generated.
 */

// Tuple, not number[] -- motion types the cubic-bezier as a 4-tuple.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
      className={className}
    >
      {children}
    </m.div>
  )
}

function RevealGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <m.div
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </m.div>
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
    <m.div variants={itemVariants} className={className}>
      {children}
    </m.div>
  )
}

export { Reveal, RevealGroup, RevealItem }
