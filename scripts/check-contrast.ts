/**
 * WCAG 2 contrast check for the brand tokens.
 *
 *   bun scripts/check-contrast.ts
 *
 * TOKENS is a hand-kept copy of the `:root` colours in app/globals.css that
 * carry text or a boundary. Keep the two in sync: change a token there, change
 * it here, rerun, and copy the printed ratios into the contract comment at the
 * top of globals.css. Exits non-zero if any required pair fails.
 *
 * Pipeline: OKLCH -> OKLab -> linear sRGB -> sRGB (clamped, 8-bit) -> WCAG 2
 * relative luminance. The 8-bit step means the ratio is the one the browser
 * paints, not an idealised one.
 */

type Oklch = readonly [l: number, c: number, h: number]

const NAVY: Oklch = [0.2619, 0.0887, 255.8]
const ORANGE: Oklch = [0.6787, 0.2142, 37.8]
const WHITE: Oklch = [1, 0, 0]

const TOKENS = {
  background: [0.995, 0.002, 256],
  foreground: NAVY,
  card: WHITE,
  band: [0.972, 0.005, 256],
  "muted-foreground": [0.505, 0.045, 256],
  primary: NAVY,
  "primary-foreground": WHITE,
  secondary: [0.94, 0.012, 256],
  "secondary-foreground": NAVY,
  muted: [0.96, 0.007, 256],
  "surface-hover": [0.955, 0.01, 256],
  accent: ORANGE,
  "accent-foreground": NAVY,
  destructive: [0.545, 0.19, 26],
  "destructive-foreground": WHITE,
  border: [0.91, 0.01, 256],
  input: [0.64, 0.03, 256],
  line: [0.567, 0.186, 36],
  sidebar: NAVY,
  "sidebar-foreground": [0.975, 0.005, 256],
  "sidebar-primary": ORANGE,
  "sidebar-accent": [0.34, 0.08, 256],
  "sidebar-border": [0.45, 0.07, 256],
  silver: [0.7373, 0.025, 256],
} as const satisfies Record<string, Oklch>

type Token = keyof typeof TOKENS

const BODY = 4.5
const LARGE = 3

// [text/stroke, ground, threshold]. A null threshold is reported, not gated.
const PAIRS: ReadonlyArray<readonly [Token, Token, number | null]> = [
  ["foreground", "background", BODY],
  ["foreground", "band", BODY],
  ["foreground", "card", BODY],
  ["muted-foreground", "background", BODY],
  ["muted-foreground", "band", BODY],
  ["muted-foreground", "card", BODY],
  ["secondary-foreground", "secondary", BODY],
  ["foreground", "muted", BODY],
  ["foreground", "surface-hover", BODY],
  ["line", "background", BODY],
  ["line", "band", BODY],
  ["accent-foreground", "accent", BODY],
  ["primary-foreground", "primary", BODY],
  ["destructive-foreground", "destructive", BODY],
  ["sidebar-foreground", "sidebar", BODY],
  ["sidebar-foreground", "sidebar-accent", BODY],
  // Inside [data-surface="navy"], --line is this orange, so it is gated as text.
  ["accent", "sidebar", BODY],
  ["input", "background", LARGE],
  ["input", "band", LARGE],
  // Reported only: decoration, bans, and band rhythm.
  ["primary-foreground", "accent", null],
  ["accent", "background", null],
  ["silver", "background", null],
  ["silver", "band", null],
  ["border", "background", null],
  ["silver", "sidebar", null],
  ["sidebar-border", "sidebar", null],
  ["background", "band", null],
]

function toSrgb([l, c, h]: Oklch): [number, number, number] {
  const hr = (h * Math.PI) / 180
  const a = c * Math.cos(hr)
  const b = c * Math.sin(hr)

  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3

  const linear = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ]

  const [r, g, bl] = linear.map((v) => {
    const x = Math.min(1, Math.max(0, v))
    const encoded = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
    return Math.round(encoded * 255)
  })
  return [r, g, bl]
}

function hex(rgb: [number, number, number]): string {
  return "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("")
}

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const x = v / 255
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(fg: Token, bg: Token): number {
  const a = luminance(toSrgb(TOKENS[fg]))
  const b = luminance(toSrgb(TOKENS[bg]))
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

console.log("Tokens")
for (const [name, value] of Object.entries(TOKENS)) {
  console.log(`  ${name.padEnd(24)} ${hex(toSrgb(value))}`)
}

console.log("\nPairs")
let failed = 0
for (const [fg, bg, threshold] of PAIRS) {
  const ratio = contrast(fg, bg)
  let verdict = "info"
  if (threshold !== null) {
    const pass = ratio >= threshold
    if (!pass) failed++
    verdict = `${pass ? "PASS" : "FAIL"} >= ${threshold}`
  }
  const pair = `${fg} on ${bg}`
  console.log(
    `  ${pair.padEnd(44)} ${ratio.toFixed(2).padStart(5)}:1  ${verdict}`
  )
}

if (failed > 0) {
  console.error(`\n${failed} required pair(s) failed.`)
  process.exit(1)
}
console.log("\nAll required pairs pass.")
