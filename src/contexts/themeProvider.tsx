import { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { retrieveItem, saveItem, STORAGE_KEYS } from '@/lib/storage';
import { ThemeType } from '@/theme/types';

interface ProviderProps {
  children: React.ReactNode;
}

export type ThemeContextProps = {
  theme: ThemeType;
  updateTheme: (theme: ThemeType) => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  updateTheme: (theme: ThemeType) => {},
});

export const ThemeProvider = ({ children }: ProviderProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const [theme, setTheme] = useState<ThemeType>(colorScheme as ThemeType);

  useEffect(() => {
    retrieveItem(STORAGE_KEYS.THEME).then(theme => {
      if (theme) {
        setTheme(theme as ThemeType);
      }
    });
  }, []);

  const updateTheme = (theme: ThemeType) => {
    setTheme(theme);
    saveItem(STORAGE_KEYS.THEME, theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
