import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AccessibilityProvider } from "@/hooks/use-accessibility-provider"
import { MobileLayout } from "@/components/mobile-layout"
import { GlobalTTSProvider } from "@/components/global-tts-provider"
import { EmergencyModeProvider } from "@/components/emergency-mode-context"
import { EmergencyWrapper } from "@/components/emergency-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HUB - Malaysian Emergency Response Network",
  description: "Community-driven emergency response and communication platform for Malaysia",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AccessibilityProvider>
            <EmergencyModeProvider>
              <GlobalTTSProvider>
                <EmergencyWrapper>
                  <MobileLayout>{children}</MobileLayout>
                </EmergencyWrapper>
              </GlobalTTSProvider>
            </EmergencyModeProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
