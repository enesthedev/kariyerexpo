"use client"

import type { VariantProps } from "class-variance-authority"
import * as m from "motion/react-m"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * The site's action link: a pill that presses into the page. Same looks as
 * the form's submit button (buttonVariants). Under reduced motion the scale
 * drops out with the rest of the transforms (MotionProvider).
 */
function PillLink({
  href,
  children,
  variant = "accent",
  size = "lg",
  className,
  onClick,
  "data-role-target": roleTarget,
}: {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  "data-role-target"?: string
} & VariantProps<typeof buttonVariants>) {
  return (
    <m.a
      href={href}
      onClick={onClick}
      data-role-target={roleTarget}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </m.a>
  )
}

export { PillLink }
