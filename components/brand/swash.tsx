import { cn } from "cn"

/**
 * Sits under a phrase in a section heading -- one per section, never under a
 * single word, and the type itself never changes colour. What it says is
 * "this is the heading of this section", not "this word matters more".
 *
 * Always --swash, never --accent: the brand orange measures 2.57:1 on the
 * light ground and 2.07:1 on the sand band, so it cannot be a stroke there.
 */
function Swash({
  children,
  variant = "solid",
  className,
}: {
  children: React.ReactNode
  variant?: "solid" | "dashed"
  className?: string
}) {
  const dashed = variant === "dashed"
  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      <svg
        viewBox="0 0 240 22"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-[0.18em] h-[0.34em] w-full overflow-visible"
      >
        <path
          d="M4 15C46 5 92 20 134 11.5S212 3 236 9.5"
          fill="none"
          stroke="var(--line)"
          strokeWidth={dashed ? 3 : 5}
          strokeLinecap="round"
          strokeDasharray={dashed ? "10 9" : undefined}
          className={dashed ? undefined : "arc-draw"}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  )
}

export { Swash }
