"use client"

import * as React from "react"
import {
  IconArrowUpRight,
  IconChevronDown,
  IconCircleCheck,
  IconLoader2,
} from "@tabler/icons-react"
import { cn } from "cn"
import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"

import { initialSubscribeState, subscribe } from "@/app/actions"
import { form, hero, roles, type RoleId } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * The page's only conversion point.
 *
 * The role segment is a FIELD, not a route: choosing "İşveren" changes the
 * helper text and nothing else. One handler, one success state, one inbox --
 * which is how employers get served without a second funnel.
 *
 * Two layouts share this logic. `stacked` is the existing column form (used
 * inside cards and the navy CTA band). `bar` is Vize Keyfi's `.get-info`
 * shape -- a single rounded card, horizontal from md up -- for the hero.
 * `listenForRoleTargets` is separate from `showRoles`: the audience cards'
 * `[data-role-target]` links must be able to preselect a segment on a form
 * that renders elsewhere on the page, whether or not that form shows its own
 * picker.
 */
function SubscribeForm({
  layout = "stacked",
  showRoles = false,
  listenForRoleTargets = false,
  className,
}: {
  layout?: "stacked" | "bar"
  showRoles?: boolean
  listenForRoleTargets?: boolean
  className?: string
}) {
  const [state, formAction, isPending] = React.useActionState(
    subscribe,
    initialSubscribeState
  )
  const [role, setRole] = React.useState<RoleId | "">(
    layout === "bar" ? "" : "ogrenci"
  )
  const emailId = React.useId()
  const roleId = React.useId()
  const helpId = React.useId()
  const isBar = layout === "bar"

  // The audience cards link to #iletisim and preselect their segment. Plain
  // anchors, so without JS the link still scrolls and the segment just stays
  // on its default.
  React.useEffect(() => {
    if (!listenForRoleTargets) return
    function onClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      const trigger = target.closest("[data-role-target]")
      const next = trigger?.getAttribute("data-role-target")
      if (next) setRole(next as RoleId)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [listenForRoleTargets])

  const help = showRoles
    ? (roles.find((r) => r.id === role)?.help ?? hero.formHelp)
    : hero.formHelp

  const success = (
    <m.div
      key="done"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      className="flex h-14 items-center gap-3 rounded-lg border border-line px-5"
    >
      <IconCircleCheck className="size-5 shrink-0 text-line" />
      <span className="text-sm">{form.success}</span>
    </m.div>
  )

  const submitContent = isPending ? (
    <>
      <IconLoader2 className="animate-spin" />
      {form.submitting}
    </>
  ) : (
    <>
      {form.submit}
      <IconArrowUpRight data-icon="inline-end" />
    </>
  )

  if (isBar) {
    return (
      <form
        action={formAction}
        className={cn(
          "w-full rounded-[1.5rem] border border-border bg-card p-4 shadow-lg shadow-black/5 sm:p-5",
          className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {state.status === "success" ? (
            success
          ) : (
            <m.div
              key="entry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="flex flex-col gap-3 md:flex-row md:items-end"
            >
              {showRoles ? (
                <div className="md:w-48">
                  <label
                    htmlFor={roleId}
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    {form.roleLegend}
                  </label>
                  <div className="relative">
                    <select
                      id={roleId}
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as RoleId | "")}
                      className="h-14 w-full appearance-none rounded-lg border border-input bg-card px-5 pr-11 text-base text-foreground outline-none focus-visible:border-line focus-visible:ring-3 focus-visible:ring-line/20"
                    >
                      <option value="">{form.roleSelectPlaceholder}</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <IconChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                </div>
              ) : null}

              <div className="flex-1">
                <label
                  htmlFor={emailId}
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  {form.label}
                </label>
                <Input
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
                />
              </div>

              <Button type="submit" size="xl" disabled={isPending}>
                {submitContent}
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
          success
        ) : (
          <m.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="flex flex-col gap-3"
          >
            <Input
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
            />
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="self-start"
            >
              {submitContent}
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
