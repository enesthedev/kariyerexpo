import type { Metadata, Viewport } from "next"
import { Archivo } from "next/font/google"

import "./globals.css"
import { site } from "@/lib/content"
import { MotionProvider } from "@/components/motion-provider"
import { cn } from "@/lib/utils"

// One family, two faces. The mark sets KARİYER upright and letterspaced and
// EXPO extended and leaning; Archivo's wdth axis (62-125) and its italic
// cover both, so the whole site comes out of a single design.
//
// A variable Google font takes one `style` per call, so the italic is a
// second call exposed as --font-display. Only h1, h2 and numerals
// read it (see globals.css); body text never downloads it on its own.
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

const archivoItalic = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  style: "italic",
  display: "swap",
  variable: "--font-display",
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
  themeColor: "#FDFDFF",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="tr"
      className={cn(
        "font-sans antialiased",
        archivo.variable,
        archivoItalic.variable
      )}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
