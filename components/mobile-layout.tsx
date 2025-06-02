"use client"

import type React from "react"

import { useState } from "react"
import { Home, AlertTriangle, MapPin, Shield, Smartphone, Bot, Heart, Newspaper, User, Menu, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FloatingChatbot } from "@/components/floating-chatbot"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "SOS", href: "/emergency", icon: Shield },
  { name: "Shelters", href: "/shelters", icon: MapPin },
  { name: "Devices", href: "/devices", icon: Smartphone },
  { name: "LoRa Chat", href: "/lora-chat", icon: Radio },
  { name: "AI Assistant", href: "/assistant", icon: Bot },
  { name: "Crowdfunding", href: "/crowdfunding", icon: Heart },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Profile", href: "/profile", icon: User },
]

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const hideChatbotOnPath = ["/lora-chat","/assistant","/news","/crowdfunding"] // Path where chatbot should not be shown

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black p-1">
              <img
                src="/images/hub-logo.png"
                alt="HUB Logo"
                className="h-full w-full object-contain filter brightness-0 invert"
              />
            </div>
            <span className="font-semibold text-lg">HUB</span>
          </div>

          <div className="flex items-center space-x-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col space-y-2 mt-6">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">{children}</main>

      {/* Floating Chatbot */}
      {!hideChatbotOnPath.includes(pathname) && <FloatingChatbot />}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 text-xs font-medium transition-colors rounded-lg",
                  pathname === item.href
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
