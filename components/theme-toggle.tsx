"use client"

import { IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

/**
 * The bare `d` hotkey in theme-provider.tsx stays; this is its visible
 * counterpart for people who will never find a keyboard shortcut.
 *
 * Both icons render and CSS picks one from the `dark` class, rather than a
 * mounted flag deciding. next-themes sets that class in a blocking script
 * before paint, so there is no hydration mismatch and no state at all.
 */
function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label="Temayı değiştir"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <IconMoon className="dark:hidden" />
      <IconSun className="hidden dark:block" />
    </Button>
  )
}

export { ThemeToggle }
