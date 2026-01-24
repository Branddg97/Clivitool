import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TabsProvider, TabsBar } from "@/components/tabs/tabs-manager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clivi Agent Hub",
  description: "Herramienta de navegación para agentes de atención al cliente",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TabsProvider>
            {children}
            <TabsBar />
          </TabsProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
