import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"

import "./globals.css"
import { site } from "@/lib/content"
import { MotionProvider } from "@/components/motion-provider"
import { cn } from "@/lib/utils"

// One family, loaded as a CSS variable read in globals.css.
//
// Turkish needs latin-ext: İ ı Ğ ğ Ş ş live in Latin Extended-A, outside the
// `latin` subset. Without it those glyphs silently fall back mid-word.
const geist = Geist({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
})

const title = `${site.name} ${site.edition} | ${site.tagline}`

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
  themeColor: "#FDFDFD",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={cn("font-sans antialiased", geist.variable)}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
