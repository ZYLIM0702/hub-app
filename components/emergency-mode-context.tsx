"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface EmergencyModeContextType {
  emergencyMode: boolean;
  setEmergencyMode: (value: boolean) => void;
}

const EmergencyModeContext = createContext<EmergencyModeContextType | undefined>(undefined);

export function EmergencyModeProvider({ children }: { children: ReactNode }) {
  const [emergencyMode, setEmergencyMode] = useState(false);
  return (
    <EmergencyModeContext.Provider value={{ emergencyMode, setEmergencyMode }}>
      {children}
    </EmergencyModeContext.Provider>
  );
}

export function useEmergencyMode() {
  const context = useContext(EmergencyModeContext);
  if (!context) {
    throw new Error("useEmergencyMode must be used within an EmergencyModeProvider");
  }
  return context;
}
