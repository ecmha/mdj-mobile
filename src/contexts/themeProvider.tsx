import { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import Storage from '@/lib/storage';
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
    Storage.retrieve(Storage.THEME_KEY).then(theme => {
      if (theme) {
        setTheme(theme as ThemeType);
      }
    });
  }, []);

  const updateTheme = (theme: ThemeType) => {
    setTheme(theme);
    Storage.save(Storage.THEME_KEY, theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
