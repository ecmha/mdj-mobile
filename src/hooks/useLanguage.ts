import { useContext } from 'react';
import { LanguageContext } from '@/contexts/languageProvider';

export const useLanguage = () => useContext(LanguageContext);
