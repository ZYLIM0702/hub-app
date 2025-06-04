"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useAccessibility } from "@/hooks/use-accessibility"

export function useTextToSpeech() {
  const { settings } = useAccessibility()
  const [isReading, setIsReading] = useState(false)
  const [currentElement, setCurrentElement] = useState<HTMLElement | null>(null)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const isInitializedRef = useRef(false)

  // Check speech synthesis support and load voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true)

      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
        console.log("Available voices:", availableVoices.length)

        if (availableVoices.length > 0 && !isInitializedRef.current) {
          isInitializedRef.current = true
          console.log("Speech synthesis initialized with voices")
        }
      }

      // Load voices immediately if available
      loadVoices()

      // Also listen for voices changed event (some browsers load voices asynchronously)
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }

      // For some browsers, we need to trigger speech synthesis to load voices
      if (window.speechSynthesis.getVoices().length === 0) {
        const testUtterance = new SpeechSynthesisUtterance("")
        window.speechSynthesis.speak(testUtterance)
        window.speechSynthesis.cancel()
      }
    } else {
      setSpeechSupported(false)
      console.warn("Speech synthesis not supported in this browser")
    }
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
      .replace(/[^\w\s.,!?;:()-]/g, "") // Remove special characters that might cause issues
      .trim()
  }, [])

  const stopSpeaking = useCallback(() => {
    try {
      if ("speechSynthesis" in window) {
        // Don't cancel if we're not actually speaking
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel()
          console.log("Speech stopped")
        }
      }
    } catch (error) {
      console.error("Error stopping speech:", error)
    }

    setIsReading(false)
    if (currentElement) {
      currentElement.classList.remove("tts-reading")
      setCurrentElement(null)
    }
    currentUtteranceRef.current = null
  }, [currentElement])

  const speakText = useCallback(
    (text: string, element?: HTMLElement) => {
      if (!settings.textToSpeech || !speechSupported) {
        console.warn("Text-to-speech not enabled or not supported")
        return
      }

      const cleanText = cleanTextForSpeech(text)
      if (!cleanText || cleanText.length < 1) {
        console.warn("No valid text to speak:", text)
        return
      }

      console.log("Speaking text:", cleanText)

      // Only cancel if we're currently speaking something different
      if (currentUtteranceRef.current && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
        try {
          window.speechSynthesis.cancel()
          // Wait a bit for cancellation to complete
          setTimeout(() => startSpeaking(cleanText, element), 100)
          return
        } catch (error) {
          console.error("Error canceling previous speech:", error)
        }
      }

      startSpeaking(cleanText, element)
    },
    [settings.textToSpeech, speechSupported, cleanTextForSpeech],
  )

  const startSpeaking = useCallback(
    (cleanText: string, element?: HTMLElement) => {
      setIsReading(true)
      setCurrentElement(element || null)

      // Add visual feedback
      if (element) {
        element.classList.add("tts-reading")
      }

      try {
        const utterance = new SpeechSynthesisUtterance(cleanText)
        currentUtteranceRef.current = utterance

        // Configure speech parameters
        utterance.rate = 0.9
        utterance.pitch = 1.0
        utterance.volume = 1.0
        utterance.lang = "en-US"

        // Try to use a good English voice if available
        const englishVoices = voices.filter(
          (voice) => voice.lang.startsWith("en") && !voice.name.includes("Google") && !voice.name.includes("eSpeak"),
        )

        if (englishVoices.length > 0) {
          utterance.voice = englishVoices[0]
          console.log("Using voice:", englishVoices[0].name)
        } else if (voices.length > 0) {
          // Find any English voice
          const anyEnglishVoice = voices.find((voice) => voice.lang.startsWith("en"))
          if (anyEnglishVoice) {
            utterance.voice = anyEnglishVoice
            console.log("Using fallback English voice:", anyEnglishVoice.name)
          } else {
            utterance.voice = voices[0]
            console.log("Using first available voice:", voices[0].name)
          }
        }

        utterance.onstart = () => {
          console.log("Speech started successfully")
          setIsReading(true)
        }

        utterance.onend = () => {
          console.log("Speech ended naturally")
          setIsReading(false)
          setCurrentElement(null)
          if (element) {
            element.classList.remove("tts-reading")
          }
          currentUtteranceRef.current = null
        }

        utterance.onerror = (event) => {
          // Don't show error for cancellation, interruption, or permission issues - they're expected behavior
          if (event.error === "canceled" || event.error === "interrupted" || event.error === "not-allowed") {
            console.log(`Speech was ${event.error} (this is normal)`)
          } else {
            console.error("Speech error:", event.error, event)
            // Show user-friendly error message for other errors
            if (element) {
              const errorMsg = document.createElement("div")
              errorMsg.textContent = `Speech error: ${event.error}`
              errorMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 9999;
        font-size: 14px;
      `
              document.body.appendChild(errorMsg)
              setTimeout(() => errorMsg.remove(), 3000)
            }
          }

          setIsReading(false)
          setCurrentElement(null)
          if (element) {
            element.classList.remove("tts-reading")
          }
          currentUtteranceRef.current = null
        }

        // Speak the text
        window.speechSynthesis.speak(utterance)

        // Fallback: if speech doesn't start within 2 seconds, try again
        setTimeout(() => {
          if (currentUtteranceRef.current === utterance && !window.speechSynthesis.speaking && !isReading) {
            console.log("Speech didn't start, retrying...")
            try {
              window.speechSynthesis.speak(utterance)
            } catch (retryError) {
              console.error("Retry failed:", retryError)
            }
          }
        }, 2000)
      } catch (error) {
        console.error("Error creating speech:", error)
        setIsReading(false)
        setCurrentElement(null)
        if (element) {
          element.classList.remove("tts-reading")
        }
        currentUtteranceRef.current = null
      }
    },
    [voices, isReading],
  )

  // Test function for debugging
  const testSpeech = useCallback(() => {
    if (!speechSupported) {
      alert("Speech synthesis not supported in this browser")
      return
    }

    const testText = "This is a test of the text to speech system."
    console.log("Testing speech with:", testText)

    // Don't cancel existing speech for test
    try {
      const utterance = new SpeechSynthesisUtterance(testText)
      utterance.rate = 0.9
      utterance.volume = 1.0
      utterance.lang = "en-US"

      utterance.onstart = () => console.log("Test speech started")
      utterance.onend = () => console.log("Test speech ended")
      utterance.onerror = (e) => {
        if (e.error === "canceled" || e.error === "interrupted" || e.error === "not-allowed") {
          console.log(`Test speech was ${e.error} (this is normal)`)
        } else {
          console.error("Test speech error:", e.error)
          alert("Speech test failed: " + e.error)
        }
      }

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Test speech failed:", error)
      alert("Speech test failed: " + error.message)
    }
  }, [speechSupported])

  return {
    speakText,
    stopSpeaking,
    testSpeech,
    isReading,
    currentElement,
    isEnabled: settings.textToSpeech && speechSupported,
    speechSupported,
    voicesCount: voices.length,
  }
}