"use client"

import * as React from "react"
import {
  IconArrowRight,
  IconCircleCheck,
  IconLoader2,
} from "@tabler/icons-react"
import { cn } from "cn"
import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"

import { initialSubscribeState, subscribe } from "@/app/actions"
import { form, hero, roles, type RoleId } from "@/lib/content"
import { Button } from "@/components/ui/button"

/**
 * The page's only conversion point.
 *
 * The role segment is a FIELD, not a route: choosing "İşveren" changes the
 * helper text and nothing else. One handler, one success state, one inbox --
 * which is how employers get served without a second funnel.
 */
function SubscribeForm({
  showRoles = false,
  className,
}: {
  showRoles?: boolean
  className?: string
}) {
  const [state, formAction, isPending] = React.useActionState(
    subscribe,
    initialSubscribeState
  )
  const [role, setRole] = React.useState<RoleId>("ogrenci")
  const emailId = React.useId()
  const helpId = React.useId()

  // The audience cards link to #iletisim and preselect their segment. Plain
  // anchors, so without JS the link still scrolls and the segment just stays
  // on its default.
  React.useEffect(() => {
    if (!showRoles) return
    function onClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      const trigger = target.closest("[data-role-target]")
      const next = trigger?.getAttribute("data-role-target")
      if (next) setRole(next as RoleId)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [showRoles])

  const help = showRoles
    ? roles.find((r) => r.id === role)?.help
    : hero.formHelp

  return (
    <form action={formAction} className={cn("w-full", className)}>
      {showRoles ? (
        <fieldset className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <legend className="sr-only">{form.roleLegend}</legend>
          <span aria-hidden="true" className="text-sm opacity-70">
            {form.roleLegend}
          </span>
          {roles.map((r) => (
            <label
              key={r.id}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50",
                role === r.id
                  ? "border-transparent bg-accent text-accent-foreground"
                  : "border-input hover:bg-surface-hover"
              )}
            >
              <input
                type="radio"
                name="role"
                value={r.id}
                checked={role === r.id}
                onChange={() => setRole(r.id)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </fieldset>
      ) : null}

      <label htmlFor={emailId} className="sr-only">
        {form.label}
      </label>

      <AnimatePresence mode="wait" initial={false}>
        {state.status === "success" ? (
          <m.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="flex h-14 items-center gap-3 rounded-full border border-line px-5"
          >
            <IconCircleCheck className="size-5 shrink-0 text-line" />
            <span className="text-sm">{form.success}</span>
          </m.div>
        ) : (
          <m.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className={cn(
              "flex h-14 items-center rounded-full border bg-card/60 pr-1.5 pl-5",
              "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
              state.status === "error" ? "border-destructive" : "border-input"
            )}
          >
            <input
              id={emailId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              readOnly={isPending}
              aria-invalid={state.status === "error"}
              aria-describedby={helpId}
              placeholder={form.placeholder}
              className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? (
                <>
                  <IconLoader2 className="animate-spin" />
                  {form.submitting}
                </>
              ) : (
                <>
                  {form.submit}
                  <IconArrowRight data-icon="inline-end" />
                </>
              )}
            </Button>
          </m.div>
        )}
      </AnimatePresence>

      <p
        id={helpId}
        aria-live="polite"
        className={cn(
          "mt-3 text-sm",
          state.status === "error" ? "text-destructive" : "opacity-70"
        )}
      >
        {state.status === "error" ? state.message : help}
      </p>
    </form>
  )
}

export { SubscribeForm }
