"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { createContext, useContext } from "react"

export interface AccessibilitySettings {
  textSize: "small" | "normal" | "large" | "extra-large"
  iconSize: "small" | "normal" | "large"
  simpleView: boolean
  highContrast: boolean
  reduceMotion: boolean
  textToSpeech: boolean
}

const defaultSettings: AccessibilitySettings = {
  textSize: "normal",
  iconSize: "normal",
  simpleView: false,
  highContrast: false,
  reduceMotion: false,
  textToSpeech: true,
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("hub-accessibility-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("Error loading accessibility settings:", error)
      }
    }

    // Apply system preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSettings((prev) => ({ ...prev, reduceMotion: true }))
    }

    if (window.matchMedia("(prefers-contrast: high)").matches) {
      setSettings((prev) => ({ ...prev, highContrast: true }))
    }
  }, [])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem("hub-accessibility-settings", JSON.stringify(updated))

    // Apply CSS classes to document
    applyAccessibilityStyles(updated)
  }

  const applyAccessibilityStyles = (settings: AccessibilitySettings) => {
    const root = document.documentElement

    // Remove existing classes
    root.classList.remove(
      "text-small",
      "text-large",
      "text-extra-large",
      "high-contrast",
      "reduce-motion",
      "simple-view",
    )

    // Apply new classes
    if (settings.textSize !== "normal") {
      root.classList.add(`text-${settings.textSize}`)
    }

    if (settings.highContrast) {
      root.classList.add("high-contrast")
    }

    if (settings.reduceMotion) {
      root.classList.add("reduce-motion")
    }

    if (settings.simpleView) {
      root.classList.add("simple-view")
    }

    // Set CSS variables for icon sizes
    if (settings.iconSize === "small") {
      root.style.setProperty("--icon-size-multiplier", "0.75")
    } else if (settings.iconSize === "large") {
      root.style.setProperty("--icon-size-multiplier", "1.5")
    } else {
      root.style.setProperty("--icon-size-multiplier", "1")
    }
  }

  const speakText = (text: string) => {
    if (!settings.textToSpeech || !("speechSynthesis" in window)) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 1
    window.speechSynthesis.speak(utterance)
  }

  return {
    settings,
    updateSettings,
    speakText,
  }
}

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
