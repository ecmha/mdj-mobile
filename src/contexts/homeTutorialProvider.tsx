import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { retrieveItem, saveItem, STORAGE_KEYS } from '@/lib/storage';

interface ProviderProps {
  children: React.ReactNode;
}

export type HomeTutorialContextProps = {
  visible: boolean;
  requestShow: () => void;
  dismiss: () => void;
};

export const HomeTutorialContext = createContext<HomeTutorialContextProps>({
  visible: false,
  requestShow: () => {},
  dismiss: () => {},
});

export const HomeTutorialProvider = ({ children }: ProviderProps) => {
  const [visible, setVisible] = useState(false);
  const seenRef = useRef<boolean | null>(null);
  const requestedRef = useRef(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    retrieveItem(STORAGE_KEYS.HOME_TUTORIAL).then(value => {
      seenRef.current = value === 'done';
      if (!seenRef.current && requestedRef.current && !dismissedRef.current) {
        setVisible(true);
      }
    });
  }, []);

  const requestShow = useCallback(() => {
    if (dismissedRef.current) return;
    requestedRef.current = true;
    if (seenRef.current === false) setVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setVisible(false);
    if (seenRef.current !== true) {
      seenRef.current = true;
      saveItem(STORAGE_KEYS.HOME_TUTORIAL, 'done');
    }
  }, []);

  return (
    <HomeTutorialContext.Provider value={{ visible, requestShow, dismiss }}>
      {children}
    </HomeTutorialContext.Provider>
  );
};
