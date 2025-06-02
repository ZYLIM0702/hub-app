"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useAccessibility, AccessibilitySettings } from "./use-accessibility"

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  speakText: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const accessibility = useAccessibility()

  return <AccessibilityContext.Provider value={accessibility}>{children}</AccessibilityContext.Provider>
}

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibilityContext must be used within an AccessibilityProvider")
  }
  return context
}
