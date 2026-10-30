"use server"

import { form, roles } from "@/lib/content"

export type SubscribeState = {
  status: "idle" | "error" | "success"
  message?: string
  /** Echoed back so a failed submit keeps what was typed. */
  email?: string
}

export const initialSubscribeState: SubscribeState = { status: "idle" }

// Deliberately not zod. One email field does not justify the dependency.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const ROLE_IDS = roles.map((r) => r.id) as readonly string[]

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim()
  const role = String(formData.get("role") ?? "")

  // Server Actions are reachable by direct POST, not only through our UI, so
  // this validation is the real boundary rather than a convenience.
  if (!EMAIL.test(email) || email.length > 254) {
    return { status: "error", message: form.invalid, email }
  }
  if (role && !ROLE_IDS.includes(role)) {
    return { status: "error", message: form.failed, email }
  }

  // TODO: persist the subscriber. Nothing is stored today by design -- no
  // third party, no env vars, no keys. Wire this to the real list when the
  // client picks one; the return contract below does not need to change.

  return { status: "success", message: form.success, email }
}
