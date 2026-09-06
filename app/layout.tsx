import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// Turkish needs latin-ext: İ ı Ğ ğ Ş ş live in Latin Extended-A, outside the
// `latin` subset. Without it those glyphs silently fall back mid-word.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
})

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
        geistMono.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
