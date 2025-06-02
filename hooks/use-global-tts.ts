"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useAccessibility } from "@/hooks/use-accessibility"

export function useGlobalTTS() {
  const { settings } = useAccessibility()
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const currentElementRef = useRef<HTMLElement | null>(null)
  const isHoldingRef = useRef(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)

  useEffect(() => {
    setIsSpeechSupported("speechSynthesis" in window)
  }, [])

  const cleanTextForSpeech = useCallback((text: string): string => {
    return text
      .replace(/#{1,6}\s/g, "") // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
      .replace(/\*(.*?)\*/g, "$1") // Remove italic markdown
      .replace(/`(.*?)`/g, "$1") // Remove code markdown
      .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links, keep text
      .replace(/[#*`_~]/g, "") // Remove remaining markdown characters
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/[^\w\s.,!?;:()-]/g, "") // Remove special characters
      .trim()
  }, [])

  const speakText = useCallback(
    (text: string, element?: HTMLElement) => {
      if (!settings.textToSpeech || !("speechSynthesis" in window)) {
        return
      }

      const cleanText = cleanTextForSpeech(text)
      if (!cleanText || cleanText.length < 1) {
        return
      }

      // Cancel any existing speech
      window.speechSynthesis.cancel()

      // Add visual feedback
      if (element) {
        element.classList.add("tts-reading")
      }

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 1.0
      utterance.lang = "en-US"

      utterance.onend = () => {
        if (element) {
          element.classList.remove("tts-reading")
        }
      }

      utterance.onerror = (event) => {
        if (element) {
          element.classList.remove("tts-reading")
        }
        if (event.error !== "canceled" && event.error !== "interrupted" && event.error !== "not-allowed") {
          console.error("Speech error:", event.error)
        }
      }

      window.speechSynthesis.speak(utterance)
    },
    [settings.textToSpeech, cleanTextForSpeech],
  )

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    // Remove visual feedback from all elements
    document.querySelectorAll(".tts-reading, .tts-holding").forEach((el) => {
      el.classList.remove("tts-reading", "tts-holding")
    })
  }, [])

  const getTextContent = useCallback((element: HTMLElement): string => {
    // Get text content, prioritizing certain attributes and content
    const ariaLabel = element.getAttribute("aria-label")
    const title = element.getAttribute("title")
    const textContent = element.textContent?.trim()

    return ariaLabel || title || textContent || ""
  }, [])

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      if (!settings.textToSpeech) return

      const target = event.target as HTMLElement
      if (!target) return

      // Skip if target is an input, textarea, or has selectable text
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("input, textarea, [contenteditable], .selectable-text")
      ) {
        return
      }

      // Find the closest text-containing element
      let textElement = target
      let attempts = 0
      while (textElement && attempts < 5) {
        const text = getTextContent(textElement)
        if (text && text.length > 0) {
          break
        }
        textElement = textElement.parentElement as HTMLElement
        attempts++
      }

      if (!textElement) return

      const text = getTextContent(textElement)
      if (!text || text.length < 1) return

      isHoldingRef.current = true
      currentElementRef.current = textElement

      // Add holding visual feedback
      textElement.classList.add("tts-holding")

      // Set timer for hold duration
      holdTimerRef.current = setTimeout(() => {
        if (isHoldingRef.current && currentElementRef.current) {
          currentElementRef.current.classList.remove("tts-holding")
          speakText(text, currentElementRef.current)
        }
      }, 800)
    },
    [settings.textToSpeech, getTextContent, speakText],
  )

  const handlePointerUp = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }

    if (currentElementRef.current) {
      currentElementRef.current.classList.remove("tts-holding")
      currentElementRef.current = null
    }

    isHoldingRef.current = false
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!settings.textToSpeech) return

      // Ctrl+Space to speak focused element
      if (event.ctrlKey && event.code === "Space") {
        event.preventDefault()
        const activeElement = document.activeElement as HTMLElement
        if (activeElement) {
          const text = getTextContent(activeElement)
          if (text) {
            speakText(text, activeElement)
          }
        }
      }

      // Escape to stop speaking
      if (event.code === "Escape") {
        stopSpeaking()
      }
    },
    [settings.textToSpeech, getTextContent, speakText, stopSpeaking],
  )

  // Set up global event listeners
  useEffect(() => {
    if (!settings.textToSpeech) return

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("pointerup", handlePointerUp)
    document.addEventListener("pointercancel", handlePointerUp)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("pointerup", handlePointerUp)
      document.removeEventListener("pointercancel", handlePointerUp)
      document.removeEventListener("keydown", handleKeyDown)

      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
      }
    }
  }, [settings.textToSpeech, handlePointerDown, handlePointerUp, handleKeyDown])

  return {
    speakText,
    stopSpeaking,
    isEnabled: settings.textToSpeech && isSpeechSupported,
  }
}
