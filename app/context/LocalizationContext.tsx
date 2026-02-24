"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LocalizationData } from "@/types/Localization";

// Interface moved to @/types/Localization

// Create Context
const LocalizationContext = createContext<LocalizationData | null>(null);

export function LocalizationProvider({ children, initialData }: { children: React.ReactNode; initialData: LocalizationData }) {
  const [localization, setLocalization] = useState<LocalizationData | null>(initialData);

  useEffect(() => {
    if (initialData) {
      setLocalization(initialData);
    } else {
      fetch("/api/localization")
        .then((res) => res.json())
        .then((data) => setLocalization(data))
        .catch(() => console.error("Failed to load localization"));
    }
  }, [initialData]);

  if (!localization) {
    return <p className="text-center text-gray-600">Loading...</p>; // Show loading state while fetching
  }

  return <LocalizationContext.Provider value={localization}>{children}</LocalizationContext.Provider>;
}

// Hook for using localization data
export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }
  return context;
}
