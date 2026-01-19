import { createContext, useEffect, useState } from 'react';
import Storage from '@/lib/storage';

interface ProviderProps {
  children: React.ReactNode;
}

export type WelcomeContextProps = {
  showWelcome: boolean;
  updateShowWelcome: (showWelcome: boolean) => void;
};

export const WelcomeContext = createContext<WelcomeContextProps>({
  showWelcome: true,
  updateShowWelcome: (showWelcome: boolean) => {},
});

export const WelcomeProvider = ({ children }: ProviderProps) => {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  const updateShowWelcome = (showWelcome: boolean) => {
    setShowWelcome(showWelcome);
    Storage.save(Storage.SHOW_WELCOME_KEY, JSON.stringify(showWelcome));
  };

  return (
    <WelcomeContext.Provider value={{ showWelcome, updateShowWelcome }}>
      {children}
    </WelcomeContext.Provider>
  );
};
