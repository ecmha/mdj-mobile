import { createContext, useState } from 'react';
import { saveItem, STORAGE_KEYS } from '@/lib/storage';

interface ProviderProps {
  children: React.ReactNode;
}

export type WelcomeContextProps = {
  showWelcome: boolean;
  updateShowWelcome: (showWelcome: boolean) => void;
};

export const WelcomeContext = createContext<WelcomeContextProps>({
  showWelcome: true,
  updateShowWelcome: () => {},
});

export const WelcomeProvider = ({ children }: ProviderProps) => {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  const updateShowWelcome = (show: boolean) => {
    setShowWelcome(show);
    saveItem(STORAGE_KEYS.SHOW_WELCOME, JSON.stringify(show));
  };

  return (
    <WelcomeContext.Provider value={{ showWelcome, updateShowWelcome }}>
      {children}
    </WelcomeContext.Provider>
  );
};
