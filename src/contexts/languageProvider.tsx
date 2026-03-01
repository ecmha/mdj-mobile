import { createContext, useEffect, useState } from 'react';
import { retrieveItem, saveItem, STORAGE_KEYS } from '@/lib/storage';
import i18n, { SupportedLanguage } from '@/i18n';

interface ProviderProps {
  children: React.ReactNode;
}

export type LanguageContextProps = {
  language: SupportedLanguage;
  updateLanguage: (lang: SupportedLanguage) => void;
};

export const LanguageContext = createContext<LanguageContextProps>({
  language: 'fr',
  updateLanguage: () => {},
});

export const LanguageProvider = ({ children }: ProviderProps) => {
  const [language, setLanguage] = useState<SupportedLanguage>('fr');

  useEffect(() => {
    retrieveItem(STORAGE_KEYS.LANGUAGE).then(stored => {
      if (stored === 'fr' || stored === 'en') {
        setLanguage(stored);
        i18n.changeLanguage(stored);
      }
    });
  }, []);

  const updateLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    saveItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
