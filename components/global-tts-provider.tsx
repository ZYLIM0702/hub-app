"use client"

import type React from "react"

import { useGlobalTTS } from "@/hooks/use-global-tts"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useEffect } from "react"

interface GlobalTTSProviderProps {
  children: React.ReactNode
}

export function GlobalTTSProvider({ children }: GlobalTTSProviderProps) {
  const { settings } = useAccessibility()
  const { isEnabled } = useGlobalTTS()

  // Show instructions on first load
  useEffect(() => {
    if (settings.textToSpeech && isEnabled) {
      const hasSeenInstructions = localStorage.getItem("hub-tts-instructions-seen")
      if (!hasSeenInstructions) {
        setTimeout(() => {
          if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(
              "Text-to-speech is now active. Press and hold any text for 800 milliseconds to hear it spoken. Use Control plus Space on any element for keyboard access, or Escape to stop speaking.",
            )
            utterance.rate = 0.8
            window.speechSynthesis.speak(utterance)
          }
          localStorage.setItem("hub-tts-instructions-seen", "true")
        }, 2000)
      }
    }
  }, [settings.textToSpeech, isEnabled])

  return <>{children}</>
}
