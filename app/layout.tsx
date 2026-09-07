import type { Metadata, Viewport } from "next"
import { Archivo } from "next/font/google"

import "./globals.css"
import { site } from "@/lib/content"
import { MotionProvider } from "@/components/motion-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// One family for the whole site. The mark speaks in two voices -- condensed
// heavy grotesque in the arc-set KARİYER, wide heavy geometric in EXPO -- and
// Archivo's wdth axis spans 62-125, so both come out of a single design.
// wdth 70 is the label voice, wdth ~110 the display voice; see globals.css.
// Pairing two neo-grotesques (Inter + Archivo) would have been the worst of
// both: too alike to contrast, too unalike to unify.
//
// Turkish needs latin-ext: İ ı Ğ ğ Ş ş live in Latin Extended-A, outside the
// `latin` subset. Without it those glyphs silently fall back mid-word.
//
// A variable font takes no `weight`; only the non-wght axes are listed.
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-sans",
})

const title = `${site.name} ${site.edition} — ${site.tagline}`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

// themeColor, colorScheme and viewport were deprecated inside `metadata` in
// Next 14 and must live here instead.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F7FA" },
    { media: "(prefers-color-scheme: dark)", color: "#061734" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={cn("font-sans antialiased", archivo.variable)}
    >
      <body>
        <ThemeProvider>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
