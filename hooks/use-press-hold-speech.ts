"use client"

import { useEffect, useRef, useCallback } from "react"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"

interface UsePressHoldSpeechOptions {
  holdDuration?: number
  selector?: string
  excludeSelectors?: string[]
}

export function usePressHoldSpeech(options: UsePressHoldSpeechOptions = {}) {
  const {
    holdDuration = 800, // 800ms hold duration
    selector = "[data-tts], p, h1, h2, h3, h4, h5, h6, span, div, button, label, .tts-enabled",
    excludeSelectors = ["input", "textarea", ".tts-disabled", "[data-tts-disabled]", "pre", "code"],
  } = options

  const { speakText, stopSpeaking, isEnabled } = useTextToSpeech()
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isHoldingRef = useRef(false)
  const startPositionRef = useRef<{ x: number; y: number } | null>(null)
  const currentElementRef = useRef<HTMLElement | null>(null)

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    isHoldingRef.current = false
    startPositionRef.current = null

    // Remove holding class from current element
    if (currentElementRef.current) {
      currentElementRef.current.classList.remove("tts-holding")
      currentElementRef.current = null
    }
  }, [])

  const shouldExcludeElement = useCallback(
    (element: HTMLElement): boolean => {
      // Check if element or any parent has exclusion selectors
      let current: HTMLElement | null = element
      while (current) {
        for (const excludeSelector of excludeSelectors) {
          if (current.matches(excludeSelector)) {
            return true
          }
        }
        current = current.parentElement
      }
      return false
    },
    [excludeSelectors],
  )

  const getTextContent = useCallback((element: HTMLElement): string => {
    // Check for custom text-to-speech content
    const customText = element.getAttribute("data-tts-text")
    if (customText) return customText

    // Get aria-label if available
    const ariaLabel = element.getAttribute("aria-label")
    if (ariaLabel) return ariaLabel

    // Get title attribute
    const title = element.getAttribute("title")
    if (title) return title

    // For buttons, get the text content
    if (element.tagName === "BUTTON") {
      return element.textContent?.trim() || ""
    }

    // For images, get alt text
    if (element.tagName === "IMG") {
      return (element as HTMLImageElement).alt || "Image"
    }

    // For inputs, get placeholder or label
    if (element.tagName === "INPUT") {
      const input = element as HTMLInputElement
      return input.placeholder || input.value || "Input field"
    }

    // Get text content, but limit to direct text (not nested elements)
    let text = ""
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || ""
      }
    }

    // If no direct text, get all text content but limit length
    if (!text.trim()) {
      text = element.textContent || ""
    }

    // Limit text length to prevent very long speech
    const maxLength = 500
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "..."
    }

    return text.trim()
  }, [])

  const handleStart = useCallback(
    (event: Event, clientX: number, clientY: number) => {
      if (!isEnabled) return

      const target = event.target as HTMLElement
      if (!target || shouldExcludeElement(target)) return

      // Find the closest element that matches our selector
      const element = target.closest(selector) as HTMLElement
      if (!element || shouldExcludeElement(element)) return

      // Don't start if we're already holding this element
      if (currentElementRef.current === element) return

      clearHoldTimer()
      isHoldingRef.current = true
      startPositionRef.current = { x: clientX, y: clientY }
      currentElementRef.current = element

      // Add visual feedback immediately
      element.classList.add("tts-holding")

      holdTimerRef.current = setTimeout(() => {
        if (isHoldingRef.current && currentElementRef.current === element) {
          const text = getTextContent(element)
          if (text && text.length > 0) {
            // Add haptic feedback if available
            if ("vibrate" in navigator) {
              try {
                navigator.vibrate(50)
              } catch (e) {
                // Ignore vibration errors
              }
            }

            element.classList.remove("tts-holding")
            speakText(text, element)
            clearHoldTimer()
          }
        }
      }, holdDuration)
    },
    [isEnabled, shouldExcludeElement, selector, clearHoldTimer, getTextContent, speakText, holdDuration],
  )

  const handleEnd = useCallback(() => {
    clearHoldTimer()
  }, [clearHoldTimer])

  const handleMove = useCallback(
    (event: Event, clientX: number, clientY: number) => {
      if (!isHoldingRef.current || !startPositionRef.current) return

      // Cancel if user moves too much (drag threshold)
      const deltaX = Math.abs(clientX - startPositionRef.current.x)
      const deltaY = Math.abs(clientY - startPositionRef.current.y)
      const dragThreshold = 15

      if (deltaX > dragThreshold || deltaY > dragThreshold) {
        handleEnd()
      }
    },
    [handleEnd],
  )

  // Mouse events
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      // Only handle left mouse button
      if (event.button !== 0) return
      handleStart(event, event.clientX, event.clientY)
    },
    [handleStart],
  )

  const handleMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      handleMove(event, event.clientX, event.clientY)
    },
    [handleMove],
  )

  // Touch events
  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) {
        handleStart(event, touch.clientX, touch.clientY)
      }
    },
    [handleStart],
  )

  const handleTouchEnd = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) {
        handleMove(event, touch.clientX, touch.clientY)
      }
    },
    [handleMove],
  )

  // Keyboard events for accessibility
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isEnabled) return

      // Space + Ctrl for screen reader users
      if (event.code === "Space" && event.ctrlKey) {
        event.preventDefault()
        const target = event.target as HTMLElement
        if (target) {
          const text = getTextContent(target)
          if (text) {
            speakText(text, target)
          }
        }
      }

      // Escape to stop speaking
      if (event.code === "Escape") {
        stopSpeaking()
        clearHoldTimer()
      }
    },
    [isEnabled, getTextContent, speakText, stopSpeaking, clearHoldTimer],
  )

  useEffect(() => {
    if (!isEnabled) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleEnd()
        stopSpeaking()
      }
    }

    const handleContextMenu = (event: Event) => {
      // Prevent context menu during hold
      if (isHoldingRef.current) {
        event.preventDefault()
      }
    }

    // Add event listeners with proper options
    document.addEventListener("mousedown", handleMouseDown, { passive: false })
    document.addEventListener("mouseup", handleMouseUp, { passive: true })
    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("touchstart", handleTouchStart, { passive: false })
    document.addEventListener("touchend", handleTouchEnd, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("keydown", handleKeyDown, { passive: false })
    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true })
    document.addEventListener("contextmenu", handleContextMenu, { passive: false })

    // Cleanup on unmount or when disabled
    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchend", handleTouchEnd)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("contextmenu", handleContextMenu)
      clearHoldTimer()
      stopSpeaking()
    }
  }, [
    isEnabled,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    handleKeyDown,
    clearHoldTimer,
    stopSpeaking,
    handleEnd,
  ])

  return {
    isEnabled,
    stopSpeaking,
  }
}
