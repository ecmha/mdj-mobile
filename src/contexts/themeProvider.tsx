import { createContext } from "react";
import { useColorScheme } from "react-native";

interface ProviderProps {
  children: React.ReactNode;
}

export const ThemeContext = createContext("light");

export const ThemeProvider = ({ children }: ProviderProps) => {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
