"use client"

import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  ViewTransition,
} from "react"
import {
  IconArrowUpRight,
  IconCircleCheck,
  IconLoader2,
} from "@tabler/icons-react"
import { cn } from "cn"

import { initialSubscribeState, subscribe } from "@/app/actions"
import { form, hero, roles, type RoleId } from "@/lib/content"
import { buttonVariants } from "@/components/ui/button"

/**
 * The page's only conversion point. The role is a FIELD, not a route: it
 * changes the help text and nothing else. One handler, one inbox.
 *
 * Two layouts share the logic. `stacked` (the CTA panel): pill segmented
 * control, label above the input, submit under it. `bar` (the hero): one
 * row from md up, with a select for the role.
 *
 * View Transitions (all state changes run inside a transition, React form
 * actions already do): the role pill is a shared `indicator` that slides
 * between segments, help text cross-fades per role, the error slides up,
 * and the entry form hands over to the success note.
 *
 * Contrast: labels are --foreground, field borders --input (3:1 on white),
 * focus is a 2px --ring (orange --line) outline, error is --destructive.
 */
const field =
  "h-12 w-full min-w-0 rounded-pill border border-input bg-card px-5 text-base text-foreground outline-hidden placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive"

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
  const [state, formAction, isPending] = useActionState(
    subscribe,
    initialSubscribeState
  )
  const isBar = layout === "bar"
  const [role, setRole] = useState<RoleId | "">(isBar ? "" : "ogrenci")
  const uid = useId()
  const emailId = `${uid}-email`
  const roleId = `${uid}-role`
  const helpId = `${uid}-help`
  const errorId = `${uid}-error`
  const pillName = `role-${uid.replace(/\W/g, "")}`

  const emailRef = useRef<HTMLInputElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)

  // Move focus to where the result is: the field after an error, the note
  // after success (the form it was in is gone).
  useEffect(() => {
    if (state.status === "error") emailRef.current?.focus()
    if (state.status === "success") doneRef.current?.focus()
  }, [state])

  const pick = (next: RoleId | "") => startTransition(() => setRole(next))

  // The audience cards link to #iletisim and preselect their segment. Plain
  // anchors, so without JS the link still scrolls.
  useEffect(() => {
    if (!listenForRoleTargets) return
    function onClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      const next = target
        .closest("[data-role-target]")
        ?.getAttribute("data-role-target")
      if (next) startTransition(() => setRole(next as RoleId))
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [listenForRoleTargets])

  const help = showRoles
    ? (roles.find((r) => r.id === role)?.help ?? hero.formHelp)
    : hero.formHelp
  const hasError = state.status === "error"

  const emailField = (
    <div className="flex-1">
      <label
        htmlFor={emailId}
        className="mb-2 block text-sm font-medium text-foreground"
      >
        {form.label}
      </label>
      <input
        ref={emailRef}
        id={emailId}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        defaultValue={state.email}
        required
        readOnly={isPending}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${helpId} ${errorId}` : helpId}
        placeholder={form.placeholder}
        className={field}
      />
    </div>
  )

  const submit = (
    <button
      type="submit"
      disabled={isPending}
      className={cn(
        buttonVariants({ variant: "accent", size: "xl" }),
        "w-full sm:w-auto"
      )}
    >
      {isPending ? (
        <>
          <IconLoader2 className="size-4 animate-spin" />
          {form.submitting}
        </>
      ) : (
        <>
          {form.submit}
          <IconArrowUpRight className="size-4" />
        </>
      )}
    </button>
  )

  const entry = (
    <ViewTransition key="entry" exit="fade-out" default="none">
      <div>
        {showRoles && !isBar ? (
          <fieldset className="mb-6">
            <legend className="mb-2 text-sm font-medium text-foreground">
              {form.roleLegend}
            </legend>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <label
                  key={r.id}
                  className={cn(
                    "relative cursor-pointer rounded-pill border px-5 py-2.5 text-sm font-medium transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                    role === r.id
                      ? "border-transparent text-accent-foreground"
                      : "border-input text-foreground hover:bg-surface-hover"
                  )}
                >
                  {role === r.id ? (
                    <ViewTransition
                      name={pillName}
                      share="indicator"
                      default="none"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-pill bg-accent"
                      />
                    </ViewTransition>
                  ) : null}
                  <input
                    type="radio"
                    name="role"
                    value={r.id}
                    checked={role === r.id}
                    onChange={() => pick(r.id)}
                    className="sr-only"
                  />
                  <span className="relative">{r.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <div
          className={cn(
            "flex flex-col gap-4",
            isBar && "md:flex-row md:items-end"
          )}
        >
          {showRoles && isBar ? (
            <div className="md:w-52">
              <label
                htmlFor={roleId}
                className="mb-2 block text-sm font-medium text-foreground"
              >
                {form.roleLegend}
              </label>
              <select
                id={roleId}
                name="role"
                value={role}
                onChange={(e) => pick(e.target.value as RoleId | "")}
                className={cn(field, "appearance-auto")}
              >
                <option value="">{form.roleSelectPlaceholder}</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {emailField}
          {submit}
        </div>

        {hasError ? (
          <ViewTransition enter="slide-up" exit="fade-out" default="none">
            <p
              id={errorId}
              role="alert"
              className="mt-4 text-sm font-medium text-destructive"
            >
              {state.message}
            </p>
          </ViewTransition>
        ) : null}

        <ViewTransition
          key={role || "none"}
          enter="fade-in"
          exit="fade-out"
          default="none"
        >
          <p id={helpId} className="mt-4 text-sm text-muted-foreground">
            {help}
          </p>
        </ViewTransition>
      </div>
    </ViewTransition>
  )

  const done = (
    <ViewTransition key="done" enter="slide-up" exit="fade-out" default="none">
      <div
        ref={doneRef}
        role="status"
        tabIndex={-1}
        className="flex items-center gap-3 rounded-pill border border-line px-6 py-4 outline-hidden"
      >
        <IconCircleCheck className="size-6 shrink-0 text-line" />
        <span className="text-base font-medium text-foreground">
          {form.success}
        </span>
      </div>
    </ViewTransition>
  )

  return (
    <form action={formAction} className={cn("w-full", className)}>
      {state.status === "success" ? done : entry}
    </form>
  )
}

export { SubscribeForm }
