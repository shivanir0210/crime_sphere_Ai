import { createContext, useContext, useState } from 'react';
import { getCurrentLanguage, setCurrentLanguage as setPersistedLanguage } from '../services/languageService';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getCurrentLanguage);

  const setLanguage = (lang) => {
    setPersistedLanguage(lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
