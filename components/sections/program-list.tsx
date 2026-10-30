"use client"

import {
  addTransitionType,
  startTransition,
  useState,
  ViewTransition,
} from "react"

import { cn } from "@/lib/utils"

type Group = {
  readonly title: string
  readonly items: readonly string[]
}

/**
 * Paneller / Atölyeler pills over numbered session rows, two columns from lg.
 * The switch runs in startTransition with a directional type, so the list
 * slides the way the toggle moves, and the orange pill glides between the two.
 */
function ProgramList({
  groups,
  note,
  label,
  listLabel,
}: {
  groups: readonly Group[]
  note: string
  label: string
  listLabel: string
}) {
  const [index, setIndex] = useState(0)
  const group = groups[index]

  function choose(next: number) {
    if (next === index) return
    startTransition(() => {
      addTransitionType(next > index ? "program-forward" : "program-back")
      setIndex(next)
    })
  }

  return (
    <>
      <div role="group" aria-label={label} className="mt-8 flex gap-2 lg:mt-10">
        {groups.map((g, i) => (
          <button
            key={g.title}
            type="button"
            aria-pressed={i === index}
            onClick={() => choose(i)}
            className={cn(
              "relative isolate h-11 rounded-pill px-5 text-sm font-medium transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              i === index
                ? "text-accent-foreground"
                : "bg-muted text-foreground hover:bg-surface-hover"
            )}
          >
            {i === index ? (
              <ViewTransition
                name="program-indicator"
                share="indicator"
                default="none"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-pill bg-accent"
                />
              </ViewTransition>
            ) : null}
            {g.title}
          </button>
        ))}
      </div>

      <div role="region" aria-label={listLabel} className="mt-8">
        <ViewTransition
          key={group.title}
          enter={{
            "program-forward": "slide-from-right",
            "program-back": "slide-from-left",
            default: "none",
          }}
          exit={{
            "program-forward": "slide-to-left",
            "program-back": "slide-to-right",
            default: "none",
          }}
          default="none"
        >
          <ol className="grid gap-x-12 lg:grid-cols-2">
            {group.items.map((item, i) => (
              <li
                key={item}
                className="flex items-baseline gap-5 border-t border-border py-5"
              >
                <span
                  aria-hidden
                  className="text-meta w-6 shrink-0 tabular-nums"
                >
                  {i + 1}
                </span>
                <p className="text-h3">{item}</p>
              </li>
            ))}
          </ol>
        </ViewTransition>
      </div>

      <p className="text-lead mt-6 max-w-[62ch]">{note}</p>
    </>
  )
}

export { ProgramList }
