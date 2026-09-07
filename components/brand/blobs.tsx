import { cn } from "cn"

import { BLOB, MARK_VIEWBOX, type BlobName } from "./blob-paths"

export { BLOB, MARK_VIEWBOX, type BlobName }

/**
 * A single blob from the logo mark, on its own. Used as decoration and as the
 * speaker portrait placeholder, where its silhouette reads as "a person will
 * be here" rather than "an image failed to load".
 */
function Blob({
  name,
  className,
  ...props
}: React.ComponentProps<"svg"> & { name: BlobName }) {
  return (
    <svg
      data-slot="blob"
      viewBox={MARK_VIEWBOX}
      fill="currentColor"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      {...props}
    >
      <path d={BLOB[name]} />
    </svg>
  )
}

type FieldVariant = "a" | "b" | "c"

// Deliberately sparse. One field per section, never behind a text column.
const FIELDS: Record<FieldVariant, { name: BlobName; className: string }[]> = {
  a: [
    { name: "cream", className: "-top-24 -right-32 size-[38rem] rotate-12" },
    { name: "orange", className: "top-1/2 -left-40 size-[26rem] -rotate-45" },
  ],
  b: [
    {
      name: "slate",
      className: "-bottom-40 -left-24 size-[34rem] rotate-[200deg]",
    },
    { name: "navy", className: "-top-32 right-0 size-[22rem] rotate-[-15deg]" },
  ],
  c: [
    {
      name: "cream",
      className: "-bottom-56 -left-32 size-[44rem] -rotate-[30deg]",
    },
  ],
}

/**
 * Decorative background shapes built from the mark itself. Purely presentational:
 * hidden from assistive tech and never interactive.
 */
function BlobField({
  variant = "a",
  className,
}: {
  variant?: FieldVariant
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "opacity-50 dark:opacity-[0.28]",
        className
      )}
    >
      {FIELDS[variant].map((b, i) => (
        <Blob
          key={i}
          name={b.name}
          className={cn("absolute text-silver", b.className)}
        />
      ))}
    </div>
  )
}

export { Blob, BlobField }
