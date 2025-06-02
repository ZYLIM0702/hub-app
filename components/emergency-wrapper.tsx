"use client"

import React from "react"
import { useEmergencyMode } from "@/components/emergency-mode-context"

export function EmergencyWrapper({ children }: { children: React.ReactNode }) {
  const { emergencyMode } = useEmergencyMode()

  React.useEffect(() => {
    if (emergencyMode) {
      document.body.classList.add("emergency-theme")
    } else {
      document.body.classList.remove("emergency-theme")
    }
    // Clean up on unmount
    return () => document.body.classList.remove("emergency-theme")
  }, [emergencyMode])

  return <>{children}</>
}
