// LanguageContext.tsx
"use client"
import React, { createContext, useContext, useState } from "react";

// Create a Context for Language
const LanguageContext = createContext<{
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
} | undefined>(undefined);

// Create a provider for the language state
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to access the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
