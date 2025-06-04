'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { useState, createContext, useContext } from 'react'

const LanguageContext = createContext({
  language: 'en',
  setLanguage: (lang: string) => {},
})

export function useLanguage() {
  return useContext(LanguageContext)
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [language, setLanguage] = useState('en')

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </LanguageContext.Provider>
  )
}
