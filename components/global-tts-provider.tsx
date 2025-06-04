"use client"

import type React from "react"

import { useGlobalTTS } from "@/hooks/use-global-tts"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useLanguage } from "@/components/theme-provider";
import { useEffect } from "react"

interface GlobalTTSProviderProps {
  children: React.ReactNode
}

export function GlobalTTSProvider({ children }: GlobalTTSProviderProps) {
  const { settings } = useAccessibility();
  const { isEnabled } = useGlobalTTS();
  const { language } = useLanguage();

  // Show instructions on first load
  useEffect(() => {
    if (settings.textToSpeech && isEnabled) {
      const hasSeenInstructions = localStorage.getItem("hub-tts-instructions-seen");
      if (!hasSeenInstructions) {
        const instructions: Record<'en' | 'zh' | 'ms', string> = {
          en: "Welcome to the app. Use the menu to navigate.",
          zh: "欢迎使用应用程序。使用菜单导航。",
          ms: "Selamat datang ke aplikasi. Gunakan menu untuk navigasi。",
        };
        const speechText = instructions[language as 'en' | 'zh' | 'ms'] || instructions.en;
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(speechText));
        localStorage.setItem("hub-tts-instructions-seen", "true");
      }
    }
  }, [settings.textToSpeech, isEnabled, language]);

  return <>{children}</>;
}
