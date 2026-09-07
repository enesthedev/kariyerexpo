import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Inter } from "next/font/google"

import "./globals.css"
import { site } from "@/lib/content"
import { MotionProvider } from "@/components/motion-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// Turkish needs latin-ext: İ ı Ğ ğ Ş ş live in Latin Extended-A, outside the
// `latin` subset. Without it those glyphs silently fall back mid-word.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
})

// Display face. `opsz` is what makes it work at hero sizes; `wdth` (75-100,
// it only condenses) is how the re-set wordmark matches the original lockup.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
  display: "swap",
  variable: "--font-heading",
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
      className={cn(
        "font-sans antialiased",
        inter.variable,
        bricolage.variable
      )}
    >
      <body>
        <ThemeProvider>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
