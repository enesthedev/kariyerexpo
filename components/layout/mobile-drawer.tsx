import { Blob } from "@/components/brand/blobs"

/**
 * One oversized blob bled off the drawer's bottom-left corner -- the direct
 * descendant of the reference site's decorative drawer shape, in our own
 * vocabulary. The drawer is navy in both themes, so this needs no theme logic.
 */
function MobileDrawerBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Blob
        name="slate"
        className="absolute -bottom-32 -left-24 size-[30rem] rotate-[200deg] text-sidebar-accent-foreground opacity-[0.18]"
      />
    </div>
  )
}

export { MobileDrawerBackdrop }
