"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"
import { usePressHoldSpeech } from "@/hooks/use-press-hold-speech"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useLanguage } from "@/components/theme-provider"

interface TextToSpeechContextType {
  isEnabled: boolean
  stopSpeaking: () => void
  speakText: (text: string) => void
}

const TextToSpeechContext = createContext<TextToSpeechContextType | undefined>(undefined)

export function useTextToSpeechContext() {
  const context = useContext(TextToSpeechContext)
  if (context === undefined) {
    throw new Error("useTextToSpeechContext must be used within a TextToSpeechProvider")
  }
  return context
}

interface TextToSpeechProviderProps {
  children: React.ReactNode
}

export function TextToSpeechProvider({ children }: TextToSpeechProviderProps) {
  const { settings } = useAccessibility()
  const { isEnabled, stopSpeaking } = usePressHoldSpeech({
    holdDuration: 800,
    selector:
      "[data-tts], p, h1, h2, h3, h4, h5, h6, span, div, button, label, .tts-enabled, .card-title, .card-description, .text-lg, .text-xl, .text-2xl, .text-3xl, .text-4xl, .text-sm, .font-semibold, .font-bold, .font-medium, a",
    excludeSelectors: ["input", "textarea", ".tts-disabled", "[data-tts-disabled]", "pre", "code", ".selectable-text"],
  })
  const { language } = useLanguage()

  const speakText = (text: string) => {
    if (isEnabled) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "zh" ? "zh-CN" : language === "ms" ? "ms-MY" : "en-US"
      window.speechSynthesis.speak(utterance)
    }
  }

  // Add global styles for visual feedback
  useEffect(() => {
    if (!document.getElementById("tts-styles")) {
      const style = document.createElement("style")
      style.id = "tts-styles"
      style.textContent = `
        .tts-holding {
          background-color: rgba(59, 130, 246, 0.1) !important;
          outline: 2px solid rgba(59, 130, 246, 0.3) !important;
          outline-offset: 2px !important;
          transition: all 0.2s ease !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
        
        .tts-reading {
          background-color: rgba(34, 197, 94, 0.1) !important;
          outline: 2px solid rgba(34, 197, 94, 0.5) !important;
          outline-offset: 2px !important;
          animation: tts-pulse 1.5s infinite !important;
        }
        
        @keyframes tts-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .tts-enabled {
          cursor: pointer;
        }
        
        .tts-enabled:hover {
          background-color: rgba(59, 130, 246, 0.05);
        }
        
        /* High contrast mode adjustments */
        .high-contrast .tts-holding {
          background-color: rgba(255, 255, 0, 0.3) !important;
          outline: 3px solid #000 !important;
        }
        
        .high-contrast .tts-reading {
          background-color: rgba(0, 255, 0, 0.3) !important;
          outline: 3px solid #000 !important;
        }
        
        /* Reduce motion adjustments */
        .reduce-motion .tts-reading {
          animation: none !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

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

  return <TextToSpeechContext.Provider value={{ isEnabled, stopSpeaking, speakText }}>{children}</TextToSpeechContext.Provider>
}
